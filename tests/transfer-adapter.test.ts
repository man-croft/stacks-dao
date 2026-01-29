import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const attacker = accounts.get("wallet_2")!;

describe("transfer-adapter security", () => {
  it("allows only owner to set core", () => {
    // Attempt by attacker
    const attack = simnet.callPublicFn(
      "transfer-adapter-v1",
      "set-core",
      [Cl.principal(attacker)],
      attacker
    );
    expect(attack.result).toBeErr(Cl.uint(101)); // ERR_UNAUTHORIZED

    // Attempt by deployer (initial owner)
    const legit = simnet.callPublicFn(
      "transfer-adapter-v1",
      "set-core",
      [Cl.contractPrincipal(deployer, "dao-core-v1")],
      deployer
    );
    expect(legit.result).toBeOk(Cl.bool(true));
  });

  it("allows transferring ownership", () => {
    const transfer = simnet.callPublicFn(
      "transfer-adapter-v1",
      "set-owner",
      [Cl.principal(attacker)], // Transfer to attacker (simulating DAO)
      deployer
    );
    expect(transfer.result).toBeOk(Cl.bool(true));

    // Now attacker can set core
    const newOwnerAction = simnet.callPublicFn(
      "transfer-adapter-v1",
      "set-core",
      [Cl.contractPrincipal(deployer, "new-core")],
      attacker
    );
    expect(newOwnerAction.result).toBeOk(Cl.bool(true));
  });
});
