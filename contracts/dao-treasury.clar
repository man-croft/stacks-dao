;; Treasury contract that only moves assets via DAO-approved calls.

(define-constant ERR_UNAUTHORIZED u101)
(define-constant DAO_CORE .dao-core-v1)

(define-public (execute-stx-transfer (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq contract-caller DAO_CORE) (err ERR_UNAUTHORIZED))
    (as-contract? ((with-stx amount))
      (try! (stx-transfer? amount tx-sender recipient))))
)
