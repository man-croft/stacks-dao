;; Mock SIP-010 Fungible Token for Testing
;; This contract implements a minimal SIP-010 compliant token for use in test suites.

(impl-trait .token-trait-v1.ft-trait)

;; Define the fungible token with no maximum supply
(define-fungible-token mock-token)

;; Error constants
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_INSUFFICIENT_BALANCE (err u101))

;; Contract owner for minting
(define-constant CONTRACT_OWNER tx-sender)

;; Token metadata
(define-constant TOKEN_NAME "Mock Token")
(define-constant TOKEN_SYMBOL "MOCK")
(define-constant TOKEN_DECIMALS u6)

;; -----------------------
;; SIP-010 Implementation
;; -----------------------

;; Transfer tokens from sender to recipient
;; Implements the ft-trait interface
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    ;; Ensure the caller is the sender or authorized
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) ERR_NOT_AUTHORIZED)
    ;; Perform the transfer
    (try! (ft-transfer? mock-token amount sender recipient))
    ;; Print memo if provided (SIP-010 compliance)
    (match memo to-print (print to-print) 0x)
    (ok true)))

;; Get balance of an account
(define-read-only (balance-of (who principal))
  (ok (ft-get-balance mock-token who)))

;; Get total supply
(define-read-only (total-supply)
  (ok (ft-get-supply mock-token)))

;; -----------------------
;; Additional Functions
;; -----------------------

;; Get human-readable name
(define-read-only (get-name)
  (ok TOKEN_NAME))

;; Get token symbol
(define-read-only (get-symbol)
  (ok TOKEN_SYMBOL))

;; Get decimals
(define-read-only (get-decimals)
  (ok TOKEN_DECIMALS))

;; Get token URI (optional metadata)
(define-read-only (get-token-uri)
  (ok (some u"https://example.com/mock-token.json")))

;; -----------------------
;; Mint Function (for testing)
;; -----------------------

;; Mint new tokens - only contract owner can mint
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ft-mint? mock-token amount recipient)))

;; Faucet - anyone can mint small amounts for testing
(define-public (faucet (amount uint) (recipient principal))
  (begin
    ;; Cap at 10000 tokens per faucet call
    (asserts! (<= amount u10000000000) ERR_NOT_AUTHORIZED)
    (ft-mint? mock-token amount recipient)))
