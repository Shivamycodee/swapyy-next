import { PaymasterMode } from "@biconomy/paymaster";
import { ethers } from "ethers";
import SwapData from "../assets/data";
import ERC20ABI from "../assets/abi/ERC20ABI.json";


async function BiconomyTransferUSDC(smartAccount,transferTo,amount) {

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const contract = new ethers.Contract(
    SwapData.USDCToken,
    ERC20ABI,
    provider
  );


  console.log("transferTo", transferTo);
  console.log("amount", amount);
  const transferAmt = ethers.utils.parseUnits(amount.toString(), 6);
  const minTx = await contract.populateTransaction.transfer(
    transferTo,
    transferAmt
  );


  const tx1 = {
    to: SwapData.USDCToken,
    data: minTx.data,
  };
  let userOp = await smartAccount.buildUserOp([tx1]);

  console.log("userOp", userOp);

  const biconomyPaymaster = smartAccount.paymaster;

  console.log("biconomyPaymaster", biconomyPaymaster);

  const feeQuotesResponse = await biconomyPaymaster.getPaymasterFeeQuotesOrData(
    userOp,
    {
      mode: PaymasterMode.ERC20,
      tokenList: [SwapData.USDCToken],
    }
  );

  const feeQuotes = feeQuotesResponse.feeQuotes;
  if (!feeQuotes) throw new Error("Could not fetch fee quote in USDC");

  const spender = feeQuotesResponse.tokenPaymasterAddress || "";
  const usdcFeeQuotes = feeQuotes[0];

  let finalUserOp = await smartAccount.buildTokenPaymasterUserOp(userOp, {
    feeQuote: usdcFeeQuotes,
    spender: spender,
    maxApproval: false,
  });

  console.log("finalUserOp", finalUserOp);

  // Get the calldata for the paymaster
  let paymasterServiceData = {
    mode: PaymasterMode.ERC20,
    feeTokenAddress: usdcFeeQuotes.tokenAddress,
    calculateGasLimits: true, // Always recommended and especially when using token paymaster
  };

  console.log("paymasterServiceData", paymasterServiceData);

    const paymasterAndDataWithLimits =
      await biconomyPaymaster.getPaymasterAndData(
        finalUserOp,
        paymasterServiceData
      );
    finalUserOp.paymasterAndData = paymasterAndDataWithLimits.paymasterAndData;
    // if (
    //   paymasterAndDataWithLimits.callGasLimit &&
    //   paymasterAndDataWithLimits.verificationGasLimit &&
    //   paymasterAndDataWithLimits.preVerificationGas
    // ) {
      finalUserOp.callGasLimit = paymasterAndDataWithLimits.callGasLimit;
      finalUserOp.verificationGasLimit =
        paymasterAndDataWithLimits.verificationGasLimit;
      finalUserOp.preVerificationGas =
        paymasterAndDataWithLimits.preVerificationGas;
    // }



  const userOpResponse = await smartAccount.sendUserOp(finalUserOp);
  console.log("userOpHash", userOpResponse);
  const { receipt } = await userOpResponse.wait(1);
  console.log("txHash", receipt.transactionHash);

  return receipt.transactionHash;
}

export default BiconomyTransferUSDC;
