;; DAO core logic using a single adapter and simple tokenless voting (1 vote per wallet).

(use-trait dao-adapter-trait .dao-adapter-v1.dao-adapter-trait)
(use-trait ft-trait .token-trait-v1.ft-trait)

(define-constant ERR_PROPOSAL_MISSING u102)
(define-constant ERR_VOTING_CLOSED u104)
(define-constant ERR_ALREADY_VOTED u105)
(define-constant ERR_ALREADY_QUEUED u106)
(define-constant ERR_NOT_QUEUED u107)
(define-constant ERR_TOO_EARLY u108)
(define-constant ERR_ALREADY_EXECUTED u109)
(define-constant ERR_ALREADY_CANCELLED u110)
(define-constant ERR_NOT_PASSED u112)
(define-constant ERR_HASH_CHANGED u113)
(define-constant ERR_INSUFFICIENT_POWER u114)
(define-constant ERR_INVALID_PAYLOAD u115)

(define-constant CHOICE_AGAINST u0)
(define-constant CHOICE_FOR u1)
(define-constant CHOICE_ABSTAIN u2)

(define-constant ONE_HUNDRED u100)
(define-constant ASSUMED_TOTAL_SUPPLY u100)
(define-constant QUORUM_PERCENT u10)
(define-constant PROPOSAL_THRESHOLD_PERCENT u1)
(define-constant VOTING_PERIOD u2100)
(define-constant TIMELOCK u100)
(define-constant ADAPTER .transfer-adapter-v1)

(define-data-var next-proposal-id uint u1)

(define-map proposals
  { id: uint }
  {
    proposer: principal,
    adapter: principal,
    payload: (tuple (kind (string-ascii 32)) (amount uint) (recipient principal) (token (optional principal)) (memo (optional (buff 34)))),
    start-height: uint,
    end-height: uint,
    eta: (optional uint),
    for-votes: uint,
    against-votes: uint,
    abstain-votes: uint,
    executed: bool,
    cancelled: bool,
    snapshot-supply: uint,
    adapter-hash: (buff 32)
  }
)

(define-map receipts
  { id: uint, voter: principal }
  { choice: uint, weight: uint }
)

(define-private (proposal-threshold (supply uint))
  (/ (* supply PROPOSAL_THRESHOLD_PERCENT) ONE_HUNDRED)
)

(define-private (quorum-needed (supply uint))
  (/ (* supply QUORUM_PERCENT) ONE_HUNDRED)
)

(define-private (validate-proposal-id (proposal-id uint))
  (if (and (>= proposal-id u1) (< proposal-id (var-get next-proposal-id)))
    (ok proposal-id)
    (err ERR_PROPOSAL_MISSING)))

(define-private (get-proposal! (proposal-id uint))
  (match (map-get? proposals { id: proposal-id })
    proposal (ok proposal)
    (err ERR_PROPOSAL_MISSING)))

(define-public (propose (payload (tuple (kind (string-ascii 32)) (amount uint) (recipient principal) (token (optional principal)) (memo (optional (buff 34))))))
  (let (
    (pid (var-get next-proposal-id))
    (supply ASSUMED_TOTAL_SUPPLY)
    (adapter-hash 0x0000000000000000000000000000000000000000000000000000000000000000)
    (threshold (proposal-threshold ASSUMED_TOTAL_SUPPLY))
  )
    (if (< u1 threshold)
      (err ERR_INSUFFICIENT_POWER)
      (if (or (is-eq (get kind payload) "stx-transfer") (is-eq (get kind payload) "ft-transfer"))
        (begin
          (map-set proposals { id: pid }
            {
              proposer: tx-sender,
              adapter: ADAPTER,
              payload: payload,
              start-height: block-height,
              end-height: (+ block-height VOTING_PERIOD),
              eta: none,
              for-votes: u0,
              against-votes: u0,
              abstain-votes: u0,
              executed: false,
              cancelled: false,
              snapshot-supply: supply,
              adapter-hash: adapter-hash
            })
          (var-set next-proposal-id (+ pid u1))
          (print { event: "proposal-created", proposal-id: pid, proposer: tx-sender, kind: (get kind payload) })
          (ok pid))
        (err ERR_INVALID_PAYLOAD)))))

(define-public (cast-vote (proposal-id uint) (choice uint))
  (begin
    (asserts! (and (>= proposal-id u1) (< proposal-id (var-get next-proposal-id))) (err ERR_PROPOSAL_MISSING))
    (let ((proposal (try! (get-proposal! proposal-id))))
      (if (or (get executed proposal) (get cancelled proposal))
        (err ERR_VOTING_CLOSED)
        (if (or (< block-height (get start-height proposal)) (> block-height (get end-height proposal)))
          (err ERR_VOTING_CLOSED)
          (if (is-some (map-get? receipts { id: proposal-id, voter: tx-sender }))
            (err ERR_ALREADY_VOTED)
            (let (
              (for-delta (if (is-eq choice CHOICE_FOR) u1 u0))
              (against-delta (if (is-eq choice CHOICE_AGAINST) u1 u0))
              (abstain-delta (if (is-eq choice CHOICE_ABSTAIN) u1 u0))
            )
              (map-set receipts { id: proposal-id, voter: tx-sender } { choice: choice, weight: u1 })
              (map-set proposals { id: proposal-id }
                {
                  proposer: (get proposer proposal),
                  adapter: ADAPTER,
                  payload: (get payload proposal),
                  start-height: (get start-height proposal),
                  end-height: (get end-height proposal),
                  eta: (get eta proposal),
                  for-votes: (+ (get for-votes proposal) for-delta),
                  against-votes: (+ (get against-votes proposal) against-delta),
                  abstain-votes: (+ (get abstain-votes proposal) abstain-delta),
                  executed: (get executed proposal),
                  cancelled: (get cancelled proposal),
                  snapshot-supply: (get snapshot-supply proposal),
                  adapter-hash: (get adapter-hash proposal)
                })
              (print { event: "vote-cast", proposal-id: proposal-id, voter: tx-sender, choice: choice })
              (ok true))))))))

(define-read-only (proposal-passes (proposal-id uint))
  (let (
    (pid (try! (validate-proposal-id proposal-id)))
    (proposal (try! (get-proposal! pid)))
  )
    (let (
      (for (get for-votes proposal))
      (against (get against-votes proposal))
      (abstain (get abstain-votes proposal))
      (quorum (quorum-needed (get snapshot-supply proposal)))
    )
      (ok (and (>= (+ for against abstain) quorum) (> for against))))))

(define-public (queue (proposal-id uint))
  (let (
    (pid (try! (validate-proposal-id proposal-id)))
    (proposal (try! (get-proposal! pid)))
  )
    (if (get cancelled proposal)
      (err ERR_ALREADY_CANCELLED)
      (if (get executed proposal)
        (err ERR_ALREADY_EXECUTED)
        (if (is-some (get eta proposal))
          (err ERR_ALREADY_QUEUED)
          (if (< block-height (get end-height proposal))
            (err ERR_VOTING_CLOSED)
            (if (try! (proposal-passes pid))
              (begin
                (map-set proposals { id: pid }
                  {
                    proposer: (get proposer proposal),
                    adapter: ADAPTER,
                    payload: (get payload proposal),
                    start-height: (get start-height proposal),
                    end-height: (get end-height proposal),
                    eta: (some (+ block-height TIMELOCK)),
                    for-votes: (get for-votes proposal),
                    against-votes: (get against-votes proposal),
                    abstain-votes: (get abstain-votes proposal),
                    executed: (get executed proposal),
                    cancelled: (get cancelled proposal),
                    snapshot-supply: (get snapshot-supply proposal),
                    adapter-hash: (get adapter-hash proposal)
                  })
                (print { event: "proposal-queued", proposal-id: pid, eta: (+ block-height TIMELOCK) })
                (ok true))
              (err ERR_NOT_PASSED))))))))

(define-public (execute (proposal-id uint) (token-trait <ft-trait>))
  (let (
    (pid (try! (validate-proposal-id proposal-id)))
    (proposal (try! (get-proposal! pid)))
  )
    (if (get cancelled proposal)
      (err ERR_ALREADY_CANCELLED)
      (if (get executed proposal)
        (err ERR_ALREADY_EXECUTED)
        (match (get eta proposal) eta
          (if (< block-height eta)
            (err ERR_TOO_EARLY)
            (let ((current-hash 0x0000000000000000000000000000000000000000000000000000000000000000))
              (if (is-eq current-hash (get adapter-hash proposal))
                (match (contract-call? ADAPTER execute pid tx-sender (get payload proposal) token-trait)
                  executed?
                    (begin
                      (map-set proposals { id: pid }
                        {
                          proposer: (get proposer proposal),
                          adapter: ADAPTER,
                          payload: (get payload proposal),
                          start-height: (get start-height proposal),
                          end-height: (get end-height proposal),
                          eta: (get eta proposal),
                          for-votes: (get for-votes proposal),
                          against-votes: (get against-votes proposal),
                          abstain-votes: (get abstain-votes proposal),
                          executed: true,
                          cancelled: (get cancelled proposal),
                          snapshot-supply: (get snapshot-supply proposal),
                          adapter-hash: (get adapter-hash proposal)
                        })
                      (print { event: "proposal-executed", proposal-id: pid })
                      (ok executed?))
                  code (err code))
                (err ERR_HASH_CHANGED))))
          (err ERR_NOT_QUEUED))))))

(define-public (cancel (proposal-id uint))
  (let (
    (pid (try! (validate-proposal-id proposal-id)))
    (proposal (try! (get-proposal! pid)))
  )
    (if (get cancelled proposal)
      (err ERR_ALREADY_CANCELLED)
      (if (< u1 (proposal-threshold (get snapshot-supply proposal)))
        (err ERR_INSUFFICIENT_POWER)
        (begin
          (map-set proposals { id: pid }
            {
              proposer: (get proposer proposal),
              adapter: ADAPTER,
              payload: (get payload proposal),
              start-height: (get start-height proposal),
              end-height: (get end-height proposal),
              eta: (get eta proposal),
              for-votes: (get for-votes proposal),
              against-votes: (get against-votes proposal),
              abstain-votes: (get abstain-votes proposal),
              executed: (get executed proposal),
              cancelled: true,
              snapshot-supply: (get snapshot-supply proposal),
              adapter-hash: (get adapter-hash proposal)
            })
          (print { event: "proposal-cancelled", proposal-id: pid })
          (ok true))))))
