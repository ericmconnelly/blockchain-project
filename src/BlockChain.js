import React, { useState } from "react";
import SHA256 from "crypto-js/sha256";
import { sign } from "@noble/secp256k1";
import { Buffer} from "buffer";
import { Balance } from "./Balance";

export const BlockChain = () => {
  const [publicAddress, setPublicAddress] = useState("0x273f77885e66219e92b2ef75377f4592fefb4c61");
  const [privateKey, setPrivateKey] = useState("e45ce9e54c646974a15862eca0c79d73f9307d734fcbb8e650457d1845592e63");

  const handlePAChange = (e) => {
    setPublicAddress(() => e.target.value);
  };

  const handlePKChange = (e) => {
    setPrivateKey(() => e.target.value);
  };

  const handleStartMining = async (e) => {
    const message = `Please start mining for ${publicAddress}`;
    const msgHash = SHA256(message);
    let signature = await sign(msgHash.toString(), privateKey);
    signature = Buffer.from(signature).toString("hex");

    const body = JSON.stringify({ publicAddress, signature, message });
    fetch("http://localhost:3042/transaction", {
      method: "POST",
      mode: "cors",
      body,
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handleStopMining = async (e) => {
    // stop_mine_transaction
    const message = `Please stop mining for ${publicAddress}`;
    const msgHash = SHA256(message);
    let signature = await sign(msgHash.toString(), privateKey);
    signature = Buffer.from(signature).toString("hex");
    const body = JSON.stringify({ publicAddress, signature, message });
    fetch("http://localhost:3042/stop_transaction", {
      method: "POST",
      mode: "cors",
      body,
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return (
    <div className="container" style={{ display: "flex", maxWidth: "400px", margin: "auto", alignContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex" }}>
          <label style={{ marginRight: "1rem" }}>Public address: </label>
          <input
            style={{ flex: "1" }}
            placeholder="Enter public address"
            value={publicAddress}
            onChange={handlePAChange}
          />
        </div>
        <div style={{ display: "flex" }}>
          <label style={{ marginRight: "1rem" }}>Private key: </label>
          <input
            style={{ flex: "1" }}
            placeholder="Enter private key"
            value={privateKey}
            onChange={handlePKChange}
          />
        </div>
        <button onClick={handleStartMining} style={{marginTop: "4rem"}}>Start mining</button>
        <button onClick={handleStopMining} style={{marginTop: "1rem"}}>Stop mining</button>
        <Balance publicAddress={publicAddress} privateKey={privateKey}/>
      </div>
    </div>
  );
};
