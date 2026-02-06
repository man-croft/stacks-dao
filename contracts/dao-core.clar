;; ============================================================================
;; DAO Core - Governance Contract
;; ============================================================================
;; 
;; This contract implements the core governance logic for a minimal DAO on Stacks.
;; It uses a single adapter pattern and simple tokenless voting (1 vote per wallet).
;;
;; Key Features:
;; - Proposal creation with adapter hash verification for security
;; - Three-choice voting: For, Against, Abstain
;; - Vote delegation support
;; - Timelock-based execution with quorum requirements
;; - Cancellation by proposer only
;;
;; Governance Parameters (configurable via set-parameter):
;; - quorum-percent: Minimum participation required (default: 10%)
;; - proposal-threshold-percent: Voting power needed to propose (default: 1%)
;; - voting-period: Blocks for voting (default: 2100, ~2 weeks)
;; - timelock: Blocks between queue and execution (default: 100, ~16 hours)
;;
;; Voting Model:
;; Uses 1-person-1-vote (1p1v) with ASSUMED_TOTAL_SUPPLY of 100.
;; Each wallet has base voting power of 1, plus any delegated power.
;;
;; Security:
;; - Adapter hash is stored at proposal creation and verified at execution
;; - This prevents malicious adapter upgrades between propose and execute
;; ============================================================================

(use-trait dao-adapter-trait .dao-adapter-v1.dao-adapter-trait)
(use-trait ft-trait .token-trait-v1.ft-trait)

;; ============================================================================
;; Error Codes
;; ============================================================================
(define-constant ERR_PROPOSAL_MISSING u102)
(define-constant ERR_VOTING_NOT_OVER u103)   ;; Voting period still active
(define-constant ERR_VOTING_CLOSED u104)      ;; Voting period ended or proposal cancelled
(define-constant ERR_ALREADY_VOTED u105)
(define-constant ERR_ALREADY_QUEUED u106)
(define-constant ERR_NOT_QUEUED u107)
(define-constant ERR_TOO_EARLY u108)          ;; Timelock not expired
(define-constant ERR_ALREADY_EXECUTED u109)
(define-constant ERR_ALREADY_CANCELLED u110)
(define-constant ERR_NOT_PASSED u112)         ;; Quorum or majority not met
(define-constant ERR_HASH_CHANGED u113)       ;; Adapter was modified
(define-constant ERR_INSUFFICIENT_POWER u114)
(define-constant ERR_INVALID_PAYLOAD u115)
(define-constant ERR_INVALID_PARAMETER u116)
(define-constant ERR_UNAUTHORIZED u117)

;; ============================================================================
;; Voting Choice Constants
;; ============================================================================
(define-constant CHOICE_AGAINST u0)
(define-constant CHOICE_FOR u1)
(define-constant CHOICE_ABSTAIN u2)

;; ============================================================================
;; Voting Model Constants
;; ============================================================================
;; The assumed total supply for quorum/threshold calculations.
;; With 1p1v model and 10% quorum, need 10 voters to pass.
;; 
;; IMPORTANT: proposal-threshold-percent must be <= 1% for 1p1v model.
;; Since each voter has power 1, a threshold > 1% would require power > 1,
;; making it impossible to create proposals.
(define-constant ONE_HUNDRED u100)
(define-constant ASSUMED_TOTAL_SUPPLY u100)

;; ============================================================================
;; Governance Parameters (Upgradeable via set-parameter)
;; ============================================================================
(define-data-var quorum-percent uint u10)             ;; 10% of votes needed
(define-data-var proposal-threshold-percent uint u1)  ;; 1% power to propose
(define-data-var voting-period uint u2100)            ;; ~2 weeks in blocks
(define-data-var timelock uint u100)                  ;; ~16 hours in blocks

(define-data-var next-proposal-id uint u1)

;; ============================================================================
;; Data Maps
;; ============================================================================
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

;; Delegation: maps delegator -> delegate
(define-map delegations principal principal)

;; Tracks accumulated delegated power for each delegate
(define-map delegated-power principal uint)

;; ============================================================================
;; Delegation Functions
;; ============================================================================

;; Delegate your voting power to another address
;; Revokes previous delegation if one exists
(define-public (delegate-vote (delegate principal))
  (begin
    ;; Revoke old delegation if exists
    (match (map-get? delegations tx-sender) old-delegate
      (map-set delegated-power old-delegate (- (default-to u0 (map-get? delegated-power old-delegate)) u1))
      true)
    ;; Set new delegation
    (map-set delegations tx-sender delegate)
    (map-set delegated-power delegate (+ (default-to u0 (map-get? delegated-power delegate)) u1))
    (print { event: "delegated", delegator: tx-sender, delegate: delegate })
    (ok true)))

;; Revoke your delegation
(define-public (revoke-delegation)
  (begin
    (match (map-get? delegations tx-sender) old-delegate
      (begin
        (map-set delegated-power old-delegate (- (default-to u0 (map-get? delegated-power old-delegate)) u1))
        (map-delete delegations tx-sender)
        (print { event: "delegation-revoked", delegator: tx-sender })
        (ok true))
      (err ERR_UNAUTHORIZED)))) ;; Not delegating

;; ============================================================================
;; Internal Helper Functions
;; ============================================================================

;; Calculate voting power: base power (1) + delegated power
(define-private (get-voting-power (voter principal))
  (+ u1 (default-to u0 (map-get? delegated-power voter)))
)

;; Calculate minimum voting power needed to create a proposal
;; Note: With 1p1v model (power=1), threshold must be <= 1% to allow proposals
(define-private (proposal-threshold (supply uint))
  (/ (* supply (var-get proposal-threshold-percent)) ONE_HUNDRED)
)

;; Calculate minimum total votes needed for quorum
(define-private (quorum-needed (supply uint))
  (/ (* supply (var-get quorum-percent)) ONE_HUNDRED)
)

;; ============================================================================
;; Parameter Management
;; ============================================================================

;; Update governance parameters (only callable by this contract)
(define-public (set-parameter (parameter (string-ascii 32)) (value uint))
  (begin
    (asserts! (is-eq contract-caller (as-contract tx-sender)) (err ERR_UNAUTHORIZED))
    (if (is-eq parameter "quorum-percent")
      (ok (var-set quorum-percent value))
      (if (is-eq parameter "proposal-threshold-percent")
        (ok (var-set proposal-threshold-percent value))
        (if (is-eq parameter "voting-period")
          (ok (var-set voting-period value))
          (if (is-eq parameter "timelock")
            (ok (var-set timelock value))
            (err ERR_INVALID_PARAMETER)))))))

(define-private (validate-proposal-id (proposal-id uint))
  (if (and (>= proposal-id u1) (< proposal-id (var-get next-proposal-id)))
    (ok proposal-id)
    (err ERR_PROPOSAL_MISSING)))

(define-private (get-proposal! (proposal-id uint))
  (match (map-get? proposals { id: proposal-id })
    proposal (ok proposal)
    (err ERR_PROPOSAL_MISSING)))

(define-public (propose (adapter <dao-adapter-trait>) (payload (tuple (kind (string-ascii 32)) (amount uint) (recipient principal) (token (optional principal)) (memo (optional (buff 34))))))
  (let (
    (pid (var-get next-proposal-id))
    (supply ASSUMED_TOTAL_SUPPLY)
    (adapter-hash (try! (contract-call? adapter adapter-hash)))
    (threshold (proposal-threshold ASSUMED_TOTAL_SUPPLY))
  )
    (if (< u1 threshold)
      (err ERR_INSUFFICIENT_POWER)
      (if (or (is-eq (get kind payload) "stx-transfer") (is-eq (get kind payload) "ft-transfer"))
        (begin
          (map-set proposals { id: pid }
            {
              proposer: tx-sender,
              adapter: (contract-of adapter),
              payload: payload,
              start-height: block-height,
              end-height: (+ block-height (var-get voting-period)),
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
              (weight (get-voting-power tx-sender))
              (for-delta (if (is-eq choice CHOICE_FOR) weight u0))
              (against-delta (if (is-eq choice CHOICE_AGAINST) weight u0))
              (abstain-delta (if (is-eq choice CHOICE_ABSTAIN) weight u0))
            )
              (map-set receipts { id: proposal-id, voter: tx-sender } { choice: choice, weight: weight })
              (map-set proposals { id: proposal-id }
                {
                  proposer: (get proposer proposal),
                  adapter: (get adapter proposal),
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
              (print { event: "vote-cast", proposal-id: proposal-id, voter: tx-sender, choice: choice, weight: weight, for: (+ (get for-votes proposal) for-delta), against: (+ (get against-votes proposal) against-delta), abstain: (+ (get abstain-votes proposal) abstain-delta) })
              (ok true))))))))

(define-read-only (get-parameters)
  (ok {
    quorum-percent: (var-get quorum-percent),
    proposal-threshold-percent: (var-get proposal-threshold-percent),
    voting-period: (var-get voting-period),
    timelock: (var-get timelock)
  })
)

(define-read-only (get-total-proposals)
  (var-get next-proposal-id)
)

(define-read-only (get-proposal (proposal-id uint))
  (map-get? proposals { id: proposal-id })
)

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
            (err ERR_VOTING_NOT_OVER)
            (if (try! (proposal-passes pid))
              (begin
                (map-set proposals { id: pid }
                  {
                    proposer: (get proposer proposal),
                    adapter: (get adapter proposal),
                    payload: (get payload proposal),
                    start-height: (get start-height proposal),
                    end-height: (get end-height proposal),
                    eta: (some (+ block-height (var-get timelock))),
                    for-votes: (get for-votes proposal),
                    against-votes: (get against-votes proposal),
                    abstain-votes: (get abstain-votes proposal),
                    executed: (get executed proposal),
                    cancelled: (get cancelled proposal),
                    snapshot-supply: (get snapshot-supply proposal),
                    adapter-hash: (get adapter-hash proposal)
                  })
                (print { event: "proposal-queued", proposal-id: pid, eta: (+ block-height (var-get timelock)) })
                (ok true))
              (err ERR_NOT_PASSED))))))))

(define-public (execute (proposal-id uint) (adapter <dao-adapter-trait>) (token-trait <ft-trait>))
  (let (
    (pid (try! (validate-proposal-id proposal-id)))
    (proposal (try! (get-proposal! pid)))
  )
    (asserts! (is-eq (contract-of adapter) (get adapter proposal)) (err ERR_INVALID_PAYLOAD))
    (if (get cancelled proposal)
      (err ERR_ALREADY_CANCELLED)
      (if (get executed proposal)
        (err ERR_ALREADY_EXECUTED)
        (match (get eta proposal) eta
          (if (< block-height eta)
            (err ERR_TOO_EARLY)
            (let ((current-hash (try! (contract-call? adapter adapter-hash))))
              (if (is-eq current-hash (get adapter-hash proposal))
                (match (contract-call? adapter execute pid tx-sender (get payload proposal) token-trait)
                  executed?
                    (begin
                      (map-set proposals { id: pid }
                        {
                          proposer: (get proposer proposal),
                          adapter: (contract-of adapter),
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
      (begin
        (asserts! (is-eq tx-sender (get proposer proposal)) (err ERR_UNAUTHORIZED))
        (map-set proposals { id: pid }
          {
            proposer: (get proposer proposal),
            adapter: (get adapter proposal),
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
        (ok true)))))
