"use client"

import React, { createContext, useContext, useState,useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ethers, providers } from "ethers";
import ERC20ABI from "../src/assets/abi/ERC20ABI.json";
import SwapData from "../src/assets/data.js";
import BiconomyApprove from "../src/components/BiconomyApprove.js";
import BICONOMYPAYMASTER from "../src/components/BiconomyPaymaster";
import BICONOMYERC20PAY from "../src/components/BiconomyERC20Pay.js";
import SMARTACCOUNTWITHDRAW from "../src/components/SmartAccountWithdraw.js";
import BICONOMYTRANSFERUSDC from '../src/components/BiconomyTransfer.js';

// Biconomy Packages...

import { ChainId } from "@biconomy/core-types";
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules";
import { Bundler } from "@biconomy/bundler";
import { BiconomyPaymaster } from "@biconomy/paymaster";

// import AlchemyProviderAPI from "@/app/api/alchemyProviderAPI"
// import { AlchemyApprove, AlchemySponsorSwap } from "@/app/api/sponsorGasAPI";
// import { ESERC20Pay } from "@/components/ESERC20Pay";


const walletContext = createContext();

export function useGlobalContext() {
  return useContext(walletContext);
}

export default function WalletContextProvider({ children }) {

  const [address, setAddress] = useState(null);
  const [userMatic, setUserMatic] = useState(null);
  const [cFAddress, setCFAddress] = useState("connect wallet");
  const [cFSwapBal, setCFSwapBal] = useState([null, null]);
  const [cFMatic, setCFMatic] = useState(null);
  const [cFERC20, setCFERC20] = useState(null);
  const [swapToken, setSwapToken] = useState(["YING", "YANG"]);
  const [hashList, setHashList] = useState(null);
  const [signer, setSigner] = useState(null);


  // biconomy...

  const [smartAccount, setSmartAccount] = useState(null);

  // alchemy...

  const [providerInstance, setProviderInstance] = useState(null);



  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("No Wallet Detected.");
      return;
    }

    try {
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setSigner(signer);
      const add = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(add[0]);
      toast.success("Wallet Connected");

      let maticBal = await getMaticBalance(add[0]);
      maticBal = parseFloat(maticBal).toFixed(4);
      setUserMatic(maticBal);
    } catch (e) {
      toast.error("Wallet Connection Failed");
    }
  };

  const getERC20Contract = (token) => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }
    const provider = new providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(token, ERC20ABI, signer);
    return contract;
  };

  const getMaticBalance = async (add) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balanceWei = await provider.getBalance(add);
    const balanceMatic = ethers.utils.formatEther(balanceWei);
    return balanceMatic;
  };

  const checkAllowance = async (token) => {

    const erc20Contract = getERC20Contract(token);
    const allowance = await erc20Contract.allowance(
      cFAddress,
      SwapData.SwapContract
    );
    let allowanceFormatted = ethers.utils.formatEther(allowance);
    allowanceFormatted = parseInt(allowanceFormatted);

    if (allowanceFormatted < 1000) {
      return false;
    } else return true;
  };

  const approveToken = async (token) => {
    
    const toastId = toast.loading("Processing Approval...");

    try {

      const txHash = await BiconomyApprove(smartAccount, token);
      // Dismiss the loading toast
      toast.dismiss(toastId);
      let link = "https://mumbai.polygonscan.com/tx/" + txHash;
      setHashList(link);
      toast.success("Approval Successful");
    } catch (error) {
      // Dismiss the loading toast
      toast.dismiss(toastId);
      console.error("Error during Approval:", error);
      toast.error("Approval failed. Please try again.");
    }
  };

  const ProfessionalSwap = async (tokenIn, amount, flag) => {
    let amt = ethers.utils.parseEther(amount.toString());

    const toastId = toast.loading("Processing transaction...");

    try {

      const txHash = await BICONOMYPAYMASTER(smartAccount, tokenIn, amt, flag);
      // const txHash = await AlchemySponsorSwap(providerInstance, tokenIn, amt, flag);  

      // Dismiss the loading toast
      toast.dismiss(toastId);
      let link = "https://mumbai.polygonscan.com/tx/" + txHash;
      setHashList(link);
      toast.success("Transaction Successful");
    } catch (error) {
      // Dismiss the loading toast
      toast.dismiss(toastId);
      console.error("Error during transaction:", error);
      toast.error("Transaction failed. Please try again.");
    }
  };

  const ProfessionalSwapERC20 = async (tokenIn, amount, flag) => {
    let amt = ethers.utils.parseEther(amount.toString());

    const toastId = toast.loading("Processing transaction...");

    try {
      // const txHash = await ESERC20Pay(primeSdkInstance, tokenIn, amt, flag);
      const txHash = await BICONOMYERC20PAY(
        smartAccount,
        tokenIn,
        amt,
        flag
      );

      // Dismiss the loading toast
      toast.dismiss(toastId);
      let link = "https://mumbai.polygonscan.com/tx/" + txHash;
      setHashList(link);
      toast.success("Transaction Successful");
    } catch (error) {
      // Dismiss the loading toast
      toast.dismiss(toastId);
      console.error("Error during transaction20:", error);
      toast.error(error.message);
    }
  };

  const WithdrawFromCF = async () => {
    let amt = ethers.utils.parseEther("10");
    const toastId = toast.loading("Processing transaction...");

    try {
      const txHash = await SMARTACCOUNTWITHDRAW(
        smartAccount,
        address,
        SwapData.YINGAddress,
        amt
      );

      // Dismiss the loading toast
      toast.dismiss(toastId);
      let link = "https://mumbai.polygonscan.com/tx/" + txHash;
      setHashList(link);
      toast.success("Transaction Successful");
    } catch (error) {
      // Dismiss the loading toast
      toast.dismiss(toastId);
      console.error("Error during transaction:", error);
      toast.error("Transaction failed. Please try again.");
    }
  };

  const getBiconomy = async () => {
    // create instance of bundler
    const bundler = new Bundler({
      bundlerUrl: SwapData.BICONOMY_BUNDLER_URL,
      chainId: ChainId.POLYGON_MUMBAI,
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    });

    // create instance of paymaster
    const paymaster = new BiconomyPaymaster({
      paymasterUrl: SwapData.BICONOMY_PAYMASTER_URL,
    });

    // instance of ownership module
    const ownerShipModule = await ECDSAOwnershipValidationModule.create({
      signer: signer, // ethers signer object
      moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
    });

    const biconomyAccount = await BiconomySmartAccountV2.create({
      signer: signer, // ethers signer object
      chainId: ChainId.POLYGON_MUMBAI, //or any chain of your choice
      bundler: bundler, // instance of bundler
      paymaster: paymaster, // instance of paymaster
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, //entry point address for chain
      defaultValidationModule: ownerShipModule, // either ECDSA or Multi chain to start
      activeValidationModule: ownerShipModule, // either ECDSA or Multi chain to start
    });

    setSmartAccount(biconomyAccount);
    // console.log("biconomy smart account : ",biconomyAccount);

    const tempAdd = await biconomyAccount.getAccountAddress();
    setCFAddress(tempAdd);
    await SCABalanceHandler(tempAdd);
  };

  const SCABalanceHandler = async (
    tempAddress  ) => {
    let maticBal = await getMaticBalance(tempAddress);
    maticBal = parseFloat(maticBal).toFixed(4);
    setCFMatic(maticBal);

    const erc20Contract = getERC20Contract(SwapData.USDCToken);
    const erc20Bal = await erc20Contract.balanceOf(tempAddress);
    let erc20BalFormatted = ethers.utils.formatUnits(erc20Bal, 6);
    erc20BalFormatted = parseFloat(erc20BalFormatted).toFixed(4);
    setCFERC20(erc20BalFormatted);

    const ying20Contract = getERC20Contract(SwapData.YINGAddress);
    const ying20Bal = await ying20Contract.balanceOf(tempAddress);
    let ying20BalFormatted = ethers.utils.formatEther(ying20Bal);
    ying20BalFormatted = parseFloat(ying20BalFormatted).toFixed(4);

    const yang20Contract = getERC20Contract(SwapData.YANGAddress);
    const yang20Bal = await yang20Contract.balanceOf(tempAddress);
    let yang20BalFormatted = ethers.utils.formatEther(yang20Bal);
    yang20BalFormatted = parseFloat(yang20BalFormatted).toFixed(4);

    setCFSwapBal([ying20BalFormatted, yang20BalFormatted]);
  };

const BiconomyTransferToken = async(tranferTo,amount) =>{

 const toastId = toast.loading("Processing Transfer...");

 try {
   const txHash = await BICONOMYTRANSFERUSDC(smartAccount, tranferTo, amount);
   // Dismiss the loading toast
   toast.dismiss(toastId);
   let link = "https://mumbai.polygonscan.com/tx/" + txHash;
   setHashList(link);
   toast.success("Approval Successful");
 } catch (error) {
   // Dismiss the loading toast
   toast.dismiss(toastId);
   console.error("Error during Transfer:", error);
      toast.error(error.message);
 }

  }


const SignMessage = async()=>{

   try {
     const provider = new ethers.providers.Web3Provider(window.ethereum);
     const signer = provider.getSigner();
     const message = "everything is good";
     const signature = await signer.signMessage(message);
     console.log("Signed message:", signature);
     return signature;
   } catch (error) {
     console.error("error while signing message : ",error);
   }
}


  useEffect(() => {
    if (address) {
      getBiconomy();
    }
  }, [address]);
  
  useEffect(() => {
    connectWallet();
  }, []);

 useEffect(() => {
   if (cFAddress && address) {
     SCABalanceHandler(cFAddress);
     const interval = setInterval(() => {
       SCABalanceHandler(cFAddress);
     }, 1000*7); 
     return () => clearInterval(interval);
   }
 }, [cFAddress, address]);


  return (
    <walletContext.Provider
      value={{
        connectWallet,
        address,
        setAddress,
        swapToken,
        setSwapToken,
        cFAddress,
        cFMatic,
        cFERC20,
        setCFAddress,
        checkAllowance,
        approveToken,
        cFSwapBal,
        userMatic,
        hashList,
        ProfessionalSwap,
        setSmartAccount,
        ProfessionalSwapERC20,
        WithdrawFromCF,
        BiconomyTransferToken,
        SignMessage,
      }}
    >
      <Toaster />
      {children}
    </walletContext.Provider>
  );
}
