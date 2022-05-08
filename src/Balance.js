import React, { useState } from "react";
import SHA256 from "crypto-js/sha256";
import { sign } from "@noble/secp256k1";
import { Buffer } from "buffer";

export const Balance = ({ publicAddress, privateKey }) => {
  const [balance, setBalance] = useState("");

  const handleShowBalance = async () => {
    const message = `Please show balance for ${publicAddress}`;
    const msgHash = SHA256(message);
    let signature = await sign(msgHash.toString(), privateKey);
    signature = Buffer.from(signature).toString("hex");
    const body = JSON.stringify({ publicAddress, signature, message });
    const result = await fetch("http://localhost:3042/balance", {
      method: "POST",
      mode: "cors",
      body,
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(body => body.json());

    const { balance: newBalance } = result;
    setBalance(newBalance);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", marginTop: "4rem" }}
    >
      <div style={{ display: "flex" }}>
        <span style={{ marginRight: "1rem" }}>Balance: </span>
        <input style={{ flex: "1" }} value={balance}></input>
      </div>
      <button style={{ marginTop: "2rem" }} onClick={handleShowBalance}>
        Show balance
      </button>
    </div>
  );
};
