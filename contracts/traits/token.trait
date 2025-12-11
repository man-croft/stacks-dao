(define-trait ft-trait
  (
    ;; Transfer fungible tokens; memo optional per SIP-010 style contracts.
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))
    ;; Current balance for an owner.
    (balance-of (principal) (response uint uint))
    ;; Total supply of the token.
    (total-supply () (response uint uint))
  )
)
