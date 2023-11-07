import { PaymasterMode } from "@biconomy/paymaster";
import { ethers } from "ethers";
import SwapData from "../assets/data"
import ERC20ABI from "../assets/abi/ERC20ABI.json";

async function BiconomyApprove(smartAccount,tokenIn) {
  console.log("it's working");

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const contract = new ethers.Contract(tokenIn, ERC20ABI, provider);

  // use the ethers populateTransaction method to create a raw transaction
  const minTx = await contract.populateTransaction.approve(
    SwapData.SwapContract,
    ethers.constants.MaxUint256
  );

  console.log("minTx", minTx);

  const tx1 = {
    to: tokenIn,
    data: minTx.data,
  };

  let userOp = await smartAccount.buildUserOp([tx1]);

  console.log("userOp", userOp);

  const biconomyPaymaster = smartAccount.paymaster;
  let paymasterServiceData = {
    mode: PaymasterMode.SPONSORED,
    smartAccountInfo: {
      name: "BICONOMY",
      version: "2.0.0",
    },
  };

  const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(
    userOp,
    paymasterServiceData
  );

  console.log("paymasterAndDataResponse", paymasterAndDataResponse);

  userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;

  const userOpResponse = await smartAccount.sendUserOp(userOp);
  console.log("userOpHash", userOpResponse);
  const { receipt } = await userOpResponse.wait(1);
  console.log("txHash", receipt.transactionHash);

  return receipt.transactionHash;

 
}

export default BiconomyApprove;
