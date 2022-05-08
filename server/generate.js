const EC = require("elliptic").ec;

const secp = require("@noble/secp256k1");

const privateKey = Buffer.from(secp.utils.randomPrivateKey()).toString("hex");
let publicKey = Buffer.from(secp.getPublicKey(privateKey)).toString("hex") 
publicKey = `0x${publicKey.slice(publicKey.length - 40)}`;

console.log({
  privateKey: privateKey,
  publicKey: publicKey,
});
