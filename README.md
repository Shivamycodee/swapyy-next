This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.




  const approveEntryPointContract = async () => {
    const toastId = toast.loading("Processing Approval...");

    try {
      const txHash = await BiconomyApprove(
        smartAccount,
        SwapData.USDCToken,
        // SwapData.BICONOMY_TOKEN_PAYMASTER
        // SwapData.BICONOMY_ENTRY_POINT
        SwapData.BICONOMY_THISMAYWORK
      );
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


   // const handleAlchemy = async()=>{

  //   try{
  //     const provider = await AlchemyProviderAPI();
  //     setProviderInstance(provider);
  //     let scaAdd = await provider.getAddress();
  //     setCFAddress(scaAdd);
  //     console.log("alchemy provider : ", provider);
      
  //     const walletProvider = await MetaMaskWalletProvider.connect();
  //   const primeSdk = new PrimeSdk(walletProvider, {
  //     chainId: 80001,
  //   });

  //   const address = await primeSdk.getCounterFactualAddress();
  //   setPrimeWallet(address);
  //   // setPrimeSdkInstance(primeSdk);

  //   SCABalanceHandler(scaAdd, address);

  //   }catch(e){
  //     console.error("etherspot prime || alchemy provider error: ", e);
  //   }


  // }