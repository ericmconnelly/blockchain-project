const EC = require("elliptic").ec;

const secp = require("@noble/secp256k1");

const privateKey = Buffer.from(secp.utils.randomPrivateKey()).toString("hex");
let publicKey = Buffer.from(secp.getPublicKey(privateKey)).toString("hex") 
publicKey = `0x${publicKey.slice(publicKey.length - 40)}`;

console.log({
  privateKey: privateKey,
  publicKey: publicKey,
});

// Key 1
/* 
{
  privateKey: 'e45ce9e54c646974a15862eca0c79d73f9307d734fcbb8e650457d1845592e63',
  publicKey: '0x273f77885e66219e92b2ef75377f4592fefb4c61'
}
*/

// Key 2
/* 
{
  privateKey: 'eb07673d082fcb4144393f3301ba697b69a2d52a22137d96d004b330113decfb',
  publicKey: '0x67b068578047428688f6d70cd0291dbe164cad79'
}
*/
