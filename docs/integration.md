# Integration Tests

Run the full lifecycle verification:

```bash
npm test tests/integration.test.ts
```

This simulates:
1.  Contract Deployment & Init.
2.  Proposal Creation (STX Transfer).
3.  Voting (Pass).
4.  Time travel (Mining blocks).
5.  Execution & Fund Transfer.
