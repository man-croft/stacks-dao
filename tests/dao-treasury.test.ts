import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const caller = accounts.get("wallet_1")!;
const recipient = accounts.get("wallet_2")!;

describe("dao-treasury", () => {
  it("rejects transfers when not invoked by dao-core", () => {
    const attempt = simnet.callPublicFn(
      "dao-treasury-v1",
      "execute-stx-transfer",
      [Cl.uint(10), Cl.principal(recipient)],
      caller
    );

    expect(attempt.result).toBeErr(Cl.uint(101)); // ERR_UNAUTHORIZED
  });
});
