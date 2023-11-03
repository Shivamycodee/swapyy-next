import { PaymasterMode } from "@biconomy/paymaster";
import { ethers } from "ethers";
import SwapData from "../assets/data";
import AbstractSwap from "../assets/abi/AbstractSwap.json";


async function BiconomyERC20Pay(smartAccount,tokenIn,amount,flag){

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

  console.log("minTx",minTx);
  
  const tx1 = {
    to: SwapData.SwapContract,
    data: minTx.data,
  };
  let userOp = await smartAccount.buildUserOp([tx1]);

  console.log("userOp",userOp);

  const biconomyPaymaster = smartAccount.paymaster;
  
  const feeQuotesResponse =
        await biconomyPaymaster.getPaymasterFeeQuotesOrData(userOp, {
            mode: PaymasterMode.ERC20,
            tokenList: [SwapData.USDCToken],
        });

    const feeQuotes = feeQuotesResponse.feeQuotes;
    const spender = feeQuotesResponse.tokenPaymasterAddress;
    const usdcFeeQuotes = feeQuotes[0];

    console.log("usdcFeeQuotes",usdcFeeQuotes);

   let finalUserOp = await smartAccount.buildTokenPaymasterUserOp(userOp, {
        feeQuote: usdcFeeQuotes,
        spender: spender,
        maxApproval: false,
    });

    console.log("finalUserOp",finalUserOp);

    let paymasterServiceData = {
      mode: PaymasterMode.ERC20,
      feeTokenAddress: usdcFeeQuotes.tokenAddress,
      calculateGasLimits: true, // Always recommended and especially when using token paymaster
    };

    console.log("paymasterServiceData",paymasterServiceData);

    try {
      const paymasterAndDataWithLimits =
        await biconomyPaymaster.getPaymasterAndData(
          finalUserOp,
          paymasterServiceData
        );
      finalUserOp.paymasterAndData =
        paymasterAndDataWithLimits.paymasterAndData;
      if (
        paymasterAndDataWithLimits.callGasLimit &&
        paymasterAndDataWithLimits.verificationGasLimit &&
        paymasterAndDataWithLimits.preVerificationGas
      ) {
        finalUserOp.callGasLimit = paymasterAndDataWithLimits.callGasLimit;
        finalUserOp.verificationGasLimit =
          paymasterAndDataWithLimits.verificationGasLimit;
        finalUserOp.preVerificationGas =
          paymasterAndDataWithLimits.preVerificationGas;
      }
    } catch (e) {
      console.log("error received ", e);
    }


   console.log("Good Till Here...")
    
const userOpResponse = await smartAccount.sendUserOp(userOp);
console.log("userOpHash", userOpResponse);
const { receipt } = await userOpResponse.wait(1);
console.log("txHash", receipt.transactionHash);

return receipt.transactionHash;



}


export default BiconomyERC20Pay;