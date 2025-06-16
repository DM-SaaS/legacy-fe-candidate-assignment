import { expect } from "chai";
import request from "supertest";
import { app } from "../index";
import { privateKeyToAccount } from "viem/accounts";

describe("POST /verify-signature", () => {
  const message = "Hello from Mocha";
  const account = privateKeyToAccount(
    "0x0123456789012345678901234567890123456789012345678901234567890123"
  );

  it("should verify a valid signature", async () => {
    const signature = await account.signMessage({ message });

    const res = await request(app)
      .post("/verify-signature")
      .send({ message, signature });

    expect(res.status).to.equal(200);
    expect(res.body.isValid).to.be.true;
    expect(res.body.signer).to.equal(account.address);
  });

  it("should return false for invalid signature", async () => {
    const res = await request(app)
      .post("/verify-signature")
      .send({ message, signature: "0xInvalidSignature" });

    expect(res.status).to.equal(400);
    expect(res.body.isValid).to.be.false;
  });

  it("should return 400 for missing data", async () => {
    const res = await request(app).post("/verify-signature").send({});
    expect(res.status).to.equal(400);
  });
});
