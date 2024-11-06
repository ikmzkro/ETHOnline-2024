import {
    LightSmartContractAccount,
    getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts"
import { AlchemyProvider } from "@alchemy/aa-alchemy"
import { LocalAccountSigner, type SmartAccountSigner } from "@alchemy/aa-core"
import { sepolia } from "viem/chains"

export const getProvider = async () => {
    const chain = sepolia
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_LIGHT_ACCOUNT_OWNER_PRIVATE_KEY as `0x${string}`
    const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_SEPOLIA
    // https://docs.alchemy.com/reference/eth-supportedentrypoints
    const ENTRYPOINT_ADDRESS = "5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" as `0x${string}`

    const eoaSigner: SmartAccountSigner = LocalAccountSigner.privateKeyToAccountSigner(PRIVATE_KEY)

    // Create a provider with your EOA as the smart account owner, this provider is used to send user operations from your smart account and interact with the blockchain
    const provider = new AlchemyProvider({
        rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, // or replace with your Alchemy API key, you can get one at https://dashboard.alchemy.com/
        chain,
        // Entrypoint address, you can use a different entrypoint if needed, check out https://docs.alchemy.com/reference/eth-supportedentrypoints for all the supported entrypoints
        entryPointAddress: ENTRYPOINT_ADDRESS,
    }).connect(
        (rpcClient) =>
        new LightSmartContractAccount({
            entryPointAddress: ENTRYPOINT_ADDRESS,
            chain: rpcClient.chain,
            owner: eoaSigner,
            factoryAddress: getDefaultLightAccountFactoryAddress(rpcClient.chain), // Default address for Light Account on Sepolia, you can replace it with your own.
            rpcClient,
        })
    )

    return provider
}