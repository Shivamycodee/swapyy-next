"use client";
import React, { useEffect } from "react";
import { useGlobalContext } from "../../context/WalletContext";
import Button from "react-bootstrap/Button";
import toast from "react-hot-toast";
import SwapData from "../assets/data.js";
import ERC20ABI from "../assets/abi/ERC20ABI.json";
import { ethers } from "ethers";

export default function CFWallet() {
  const {
    cFAddress,
    cFMatic,
    address,
    cFERC20,
    cFSwapBal,
    checkIsWhiteListed,
    whitelistUser,
    PayToMaster,
    getBiconomy,
    approveEntryPointContract,
    WithdrawFromCF,
  } = useGlobalContext();

  const buyToken = async (token) => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    let toastId = toast.loading("Transfering...");

    try {
      const provider = new ethers.providers.JsonRpcProvider(
        SwapData.MUMBAI_URL
      );
      const wallet = new ethers.Wallet(SwapData.POOL_PRV_KEY);
      const signer = wallet.connect(provider);
      const contract = new ethers.Contract(token, ERC20ABI, signer);
      let amount = ethers.utils.parseEther("1000");
      await contract.transfer(cFAddress, amount);
      toast.dismiss(toastId);
      toast.success("Token Bought");
    } catch (e) {
      console.log("buy token error : ", e);
      toast.error("Buy Token Failed");
      toast.dismiss(toastId);
    }
  };

  return (
    <div>
      <div className="container">
        <div style={{ height: "33rem" }} className="box">
          <span
            style={{ fontSize: "2rem", letterSpacing: "1px" }}
            className="title"
          >
            Contract Wallet
          </span>
          <div>
            {cFAddress !== "connect wallet" ? (
              <>
                <strong>
                  Address:{" "}
                  <span style={{ fontSize: "0.8rem" }}>{cFAddress}</span>
                </strong>
                <strong>
                  Matic: <span style={{ fontSize: "0.8rem" }}>{cFMatic}</span>
                </strong>
                <strong>
                  USDC: <span style={{ fontSize: "0.8rem" }}>{cFERC20}</span>
                </strong>
              </>
            ) : (
              <strong>Connect Wallet</strong>
            )}
          </div>
          <strong style={{ marginTop: "40px", marginBottom: "20px" }}>
            Swap Tokens
          </strong>
          <div>
            {cFAddress !== "connect wallet" ? (
              <>
                <strong>
                  YING:{" "}
                  <span style={{ fontSize: "0.8rem" }}>{cFSwapBal[0]}</span>
                </strong>
                <strong>
                  YANG:{" "}
                  <span style={{ fontSize: "0.8rem" }}>{cFSwapBal[1]}</span>
                </strong>
              </>
            ) : (
              <strong>Connect Wallet</strong>
            )}
            {/* <Button
              style={{ marginTop: "15px" }}
              onClick={checkIsWhiteListed}
              variant="outline-dark"
            >
              isWhiteListed
            </Button>
            <Button
              style={{ marginTop: "15px" }}
              onClick={whitelistUser}
              variant="outline-dark"
            >
              Whitelist User
            </Button> */}
            {/* <Button
              style={{ marginTop: "15px" }}
              onClick={PayToMaster}
              variant="outline-dark"
            >
              pay To Master
            </Button> */}
            <Button
              style={{ marginTop: "15px", marginRight: "5px" }}
              onClick={approveEntryPointContract}
              variant="outline-dark"
            >
              Approve Entry Point
            </Button>
            <Button
              style={{ marginTop: "15px" }}
              onClick={WithdrawFromCF}
              variant="outline-dark"
            >
              Withdraw
            </Button>
            <br />
            <Button
              style={{ marginTop: "15px", marginRight: "5px" }}
              onClick={() => buyToken(SwapData.YINGAddress)}
              variant="outline-dark"
            >
              Get YING
            </Button>
            <Button
              style={{ marginTop: "15px" }}
              onClick={() => buyToken(SwapData.YANGAddress)}
              variant="outline-dark"
            >
              Get YANG
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
