const express = require("express");
const app = express();
const cors = require("cors");
const Buffer = require("buffer");
const fs = require("fs");
const secp = require("@noble/secp256k1");
const SHA256 = require("crypto-js/sha256");
const bodyParser = require("body-parser");
const path = require("path");
const { startMining, stopMining } = require("./mine");
const { utxos } = require("./db");

const port = 3042;

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.json());

app.post("/stop_transaction", (req, res) => {
  const { publicAddress, signature, message } = req.body;

  const msgHash = SHA256(message).toString();

  const recoveredPublicKey = secp.recoverPublicKey(msgHash, signature, 1);
  const isVerified = secp.verify(signature, msgHash, recoveredPublicKey);

  console.log(`Transaction verified?: ${isVerified}`);

  if (isVerified) {
    console.log(`Stop mining for public wallet: ${publicAddress}`);
    stopMining(publicAddress);
  } else {
    console.log("Failed to verify digital signature");
  }
});

app.post("/transaction", (req, res) => {
  const { publicAddress, signature, message } = req.body;

  const msgHash = SHA256(message).toString();
  const recoveredPublicKey = secp.recoverPublicKey(msgHash, signature, 1);
  const isVerified = secp.verify(signature, msgHash, recoveredPublicKey);

  console.log(`Transaction verified?: ${isVerified}`);

  if (isVerified) {
    console.log(`Start mining for public wallet: ${publicAddress}`);
    startMining(publicAddress);
  } else {
    console.log("Failed to verify digital signature");
  }
});

app.post("/balance", (req, res) => {
  const { publicAddress, signature, message } = req.body;

  const msgHash = SHA256(message).toString();

  const recoveredPublicKey = secp.recoverPublicKey(msgHash, signature, 1);
  const isVerified = secp.verify(signature, msgHash, recoveredPublicKey);

  console.log(`Transaction verified?: ${isVerified}`);

  if (isVerified) {
    console.log(`Showing balance for public wallet: ${publicAddress}`);

    let data = fs.readFileSync("transaction.json", "utf8");
    const { utxos } = JSON.parse(data);

    const ourUTXOs = utxos.filter((x) => {
      return x.owner === publicAddress && !x.spent;
    });
    const sum = ourUTXOs.reduce((p, c) => p + c.amount, 0);
    res.send({
      balance: sum,
      publicAddress,
      isVerified,
    });
  } else {
    console.log("Failed to verify digital signature");
    res.send({
      isVerified,
    });
  }
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
