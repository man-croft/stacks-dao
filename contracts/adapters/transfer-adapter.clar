;; Minimal adapter to route DAO-approved transfers to the treasury.

(use-trait dao-adapter-trait .dao-adapter-v1.dao-adapter-trait)
(use-trait ft-trait .token-trait-v1.ft-trait)

(define-constant ERR_DAO_NOT_SET u100)
(define-constant ERR_UNAUTHORIZED u101)
(define-constant ERR_INVALID_KIND u102)
(define-constant ERR_TOKEN_EXPECTED u103)
(define-constant ZERO-HASH 0x0000000000000000000000000000000000000000000000000000000000000000)
(define-constant TREASURY .dao-treasury-v1)
(define-constant DEPLOYER tx-sender)

(define-data-var core principal tx-sender)

(define-public (set-core (new-core principal))
  (begin
    (asserts! (is-eq tx-sender DEPLOYER) (err ERR_UNAUTHORIZED))
    (ok (var-set core new-core))))

(define-public (execute (proposal-id uint) (sender principal) (payload (tuple (kind (string-ascii 32)) (amount uint) (recipient principal) (token (optional principal)) (memo (optional (buff 34))))) (token-trait <ft-trait>))
  (begin
    (asserts! (is-eq contract-caller (var-get core)) (err ERR_UNAUTHORIZED))
    (let ((kind (get kind payload)))
      (if (is-eq kind "stx-transfer")
        (contract-call? .dao-treasury-v1 execute-stx-transfer (get amount payload) (get recipient payload))
        (if (is-eq kind "ft-transfer")
          (let ((token-principal (unwrap! (get token payload) (err ERR_TOKEN_EXPECTED))))
             ;; Validate that the passed trait matches the payload principal
             (asserts! (is-eq (contract-of token-trait) token-principal) (err ERR_INVALID_KIND))
             (contract-call? .dao-treasury-v1 execute-ft-transfer token-trait (get amount payload) (get recipient payload) (get memo payload)))
          (err ERR_INVALID_KIND))))))

(define-read-only (adapter-hash)
  ;; Return a hash of the adapter code version for integrity verification
  ;; Version 1.1: Added FT transfer support
  (ok 0x0000000000000000000000000000000000000000000000000000000000000101)
)
