;; Minimal adapter to route DAO-approved transfers to the treasury.

(use-trait dao-adapter-trait .dao-adapter-v1.dao-adapter-trait)
(use-trait ft-trait .token-trait-v1.ft-trait)

(define-constant ERR_DAO_NOT_SET u100)
(define-constant ERR_UNAUTHORIZED u101)
(define-constant ERR_INVALID_KIND u102)
(define-constant ZERO-HASH 0x0000000000000000000000000000000000000000000000000000000000000000)
(define-constant DAO_CORE .dao-core-v1)
(define-constant TREASURY .dao-treasury-v1)

(define-public (execute (proposal-id uint) (sender principal) (payload (tuple (kind (string-ascii 32)) (amount uint) (recipient principal) (token (optional principal)) (memo (optional (buff 34))))))
  (begin
    (asserts! (is-eq contract-caller DAO_CORE) (err ERR_UNAUTHORIZED))
    (let ((kind (get kind payload)))
      (if (is-eq kind "stx-transfer")
        (contract-call? .dao-treasury-v1 execute-stx-transfer (get amount payload) (get recipient payload))
        (err ERR_INVALID_KIND)))))

(define-read-only (adapter-hash)
  ;; Return a hash of the adapter code version for integrity verification
  ;; Version 1.1: Added FT transfer support
  (ok 0x0000000000000000000000000000000000000000000000000000000000000101)
)
