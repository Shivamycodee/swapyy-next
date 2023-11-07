import { ethers } from "ethers";
import SwapData from "../assets/data";
import AbstractSwap from "../assets/abi/AbstractSwap.json";

async function ESERC20Pay(primeSdk, tokenIn, amt, flag) {
  console.log("paying erc20 initiated");
  await primeSdk.clearUserOpsFromBatch();

  const erc20Contract = new ethers.Contract(tokenIn, AbstractSwap);
  const encodedData = erc20Contract.interface.encodeFunctionData("SwapNovice", [
    tokenIn,
    amt,
    flag,
  ]);

  const userOpsBatch = await primeSdk.addUserOpsToBatch({
    to: SwapData.SwapContract,
    data: encodedData,
  });

  console.log("transactions: ", userOpsBatch);

  const op = await primeSdk.estimate({
    url: "https://arka.etherspot.io/",
    api_key: "arka_public_key",
    context: { token: "USDC", mode: "erc20" },
  });

  console.log("PayUsingERC20 op: ", op);

  const uoHash = await primeSdk.send(op);
  console.log(`UserOpHash: ${uoHash}`);

  console.log("Waiting for transaction...");
  let userOpsReceipt = null;
  const timeout = Date.now() + 60000;
  while (userOpsReceipt == null && Date.now() < timeout) {
    userOpsReceipt = await primeSdk.getUserOpReceipt(uoHash);
  }
  console.log("\x1b[33m%s\x1b[0m", `Transaction Receipt: `, userOpsReceipt);
  console.log(
    "\x1b[33m%s\x1b[0m",
    `Transaction Hash: `,
    userOpsReceipt.receipt.transactionHash
  );

  return userOpsReceipt.receipt.transactionHash;
}


export { ESERC20Pay };
