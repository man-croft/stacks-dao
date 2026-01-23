;; Treasury contract that only moves assets via DAO-approved calls.

(use-trait ft-trait .token-trait-v1.ft-trait)

(define-constant ERR_UNAUTHORIZED u101)
(define-constant DEPLOYER tx-sender)

(define-data-var governor principal tx-sender)

(define-map allowed-invokers principal bool)

(define-public (set-allowed-invoker (invoker principal) (allowed bool))
  (begin
    (asserts! (is-eq contract-caller (var-get governor)) (err ERR_UNAUTHORIZED))
    (ok (map-set allowed-invokers invoker allowed))))

(define-public (init (new-governor principal) (invoker principal) (allowed bool))
  (begin
    (asserts! (is-eq tx-sender DEPLOYER) (err ERR_UNAUTHORIZED))
    (var-set governor new-governor)
    (ok (map-set allowed-invokers invoker allowed))))

(define-private (is-allowed-caller (caller principal))
  (or (is-eq caller (var-get governor)) (default-to false (map-get? allowed-invokers caller)))
)

(define-read-only (is-authorized (caller principal))
  (ok (is-allowed-caller caller)))

(define-public (execute-stx-transfer (amount uint) (recipient principal))
  (begin
    (asserts! (is-allowed-caller contract-caller) (err ERR_UNAUTHORIZED))
    (try! (as-contract (stx-transfer? amount tx-sender recipient)))
    (print { event: "stx-transfer", amount: amount, recipient: recipient })
    (ok true)))

(define-public (execute-ft-transfer (token <ft-trait>) (amount uint) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-allowed-caller contract-caller) (err ERR_UNAUTHORIZED))
    (try! (as-contract (contract-call? token transfer amount tx-sender recipient memo)))
    (print { event: "ft-transfer", token: (contract-of token), amount: amount, recipient: recipient })
    (ok true)))
