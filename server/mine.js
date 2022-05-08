const Block = require("../models/Block");
const Transaction = require("../models/Transaction");
const UTXO = require("../models/UTXO");
const db = require("./db");
const fs = require("fs");
const TARGET_DIFFICULTY = BigInt("0x0" + "F".repeat(63));
const BLOCK_REWARD = 10;

const mining_status = {};
let write_timeout;

function startMining(publicAddress) {
  console.log(mining_status[publicAddress]);

  if (mining_status[publicAddress]) {
    return;
  }

  mining_status[publicAddress] = true;
  mine(publicAddress);
}

function writeToFile() {
//   let data = fs.readFileSync("transaction.json", "utf8");
//   const { utxos } = JSON.parse(data);

  fs.writeFile(
    "transaction.json",
    JSON.stringify(
      { utxos: db.utxos },
      {
        encoding: "utf8",
        flag: "w",
      }
    ),
    (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    }
  );
}

function stopMining(publicAddress) {
  if (!mining_status[publicAddress]) {
    return;
  }

  clearTimeout(write_timeout);
  mining_status[publicAddress] = false;
}

function mine(publicAddress = "") {
  if (!mining_status[publicAddress]) {
    return;
  }

  const block = new Block();

  const coinbaseUTXO = new UTXO(publicAddress, BLOCK_REWARD);
  const coinbaseTX = new Transaction([], [coinbaseUTXO]);
  block.addTransaction(coinbaseTX);

  while (BigInt("0x" + block.hash()) >= TARGET_DIFFICULTY) {
    block.nonce++;
  }

  block.execute();

  db.blockchain.addBlock(block);

  console.log(
    `Mined block #${db.blockchain.blockHeight()} with a hash of ${block.hash()} at nonce ${
      block.nonce
    }`
  );

  setTimeout(() => mine(publicAddress), 2500);
  write_timeout = setTimeout(() => writeToFile(publicAddress), 5000);
}

module.exports = {
  startMining,
  stopMining,
};
