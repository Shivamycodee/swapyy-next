import {
  PaymasterMode,
} from "@biconomy/paymaster";
import { ethers } from "ethers";
import SwapData from "../assets/data.js";
import AbstractSwap from "../assets/abi/AbstractSwap.json";


async function BiconomyPaymaster(smartAccount, tokenIn, amount, flag) {

  

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const contract = new ethers.Contract(
    SwapData.SwapContract,
    AbstractSwap,
    provider
  );

  // use the ethers populateTransaction method to create a raw transaction
  const minTx = await contract.populateTransaction.SwapNovice(
    tokenIn,
    amount,
    flag
  );

  const tx1 = {
    to: SwapData.SwapContract,
    data: minTx.data,
  };

  let userOp = await smartAccount.buildUserOp([tx1]);

  console.log("userOp", userOp);

  const biconomyPaymaster = smartAccount.paymaster;
      let paymasterServiceData = {
        mode: PaymasterMode.SPONSORED,
        smartAccountInfo: {
          name: 'BICONOMY',
          version: '2.0.0'
        },
      };
      const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(
          userOp,
          paymasterServiceData
        ); 
      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;


   console.log("biconomyPaymaster", biconomyPaymaster);

      
const userOpResponse = await smartAccount.sendUserOp(userOp);
console.log("userOpHash", userOpResponse);
const { receipt } = await userOpResponse.wait(1);
console.log("txHash", receipt.transactionHash);

return receipt.transactionHash;


}

export default BiconomyPaymaster;
