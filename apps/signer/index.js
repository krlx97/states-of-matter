import ecc from "eosjs-ecc";
import promptSync from "prompt-sync";

const privateKey = "5K1nSYssVLUSda9pQLQxZ7E8NLuyBL84YxufP8vDpqwhzfjPS1X";
const prompt = promptSync();
const nonce = prompt("Nonce: ");

console.log(`Signature: ${ecc.sign(nonce, privateKey)}`);
