import SwapData from '../../assets/data.js'
import { LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { LocalAccountSigner} from "@alchemy/aa-core";
import { polygonMumbai } from "viem/chains";

const chain = polygonMumbai;
const PRIVATE_KEY = SwapData.POOL_PRIVATE_KEY;
const eoaSigner =
  LocalAccountSigner.privateKeyToAccountSigner(`0x${PRIVATE_KEY}`);


  const factoryAddress = getDefaultLightAccountFactoryAddress(chain);


  const getProvider = async()=>{
    
    
    const provider = new AlchemyProvider({
      apiKey: SwapData.ALCHEMY_APIKEY,
      chain,
    }).connect(
      (rpcClient) =>
      new LightSmartContractAccount({
        chain,
        owner: eoaSigner,
        factoryAddress,
        rpcClient,
      })
      );

      return provider;
      
    }

export default getProvider;