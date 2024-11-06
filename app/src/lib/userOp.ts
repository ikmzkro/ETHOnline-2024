import { SendUserOperationResult } from "@alchemy/aa-core"
import { parseEther } from "viem"
import { getProvider } from "./aa"

export const sendUserOperation = async () => {
  const provider = await getProvider()
  provider.getAddress().then((address: string) => console.log(address))

  const targetAddress = "56a4975de8F187667AfDd1DBde72cf6CF88BfBb4" as `0x${string}`
  const amountToSend: bigint = parseEther("0.0001")

  // https://zenn.dev/link/comments/b47ff92fda5259
  const result: SendUserOperationResult = await provider.sendUserOperation({
    target: targetAddress,
    data: "0x",
    value: amountToSend,
  })

  console.log("User operation result: ", result)
  console.log("\nWaiting for the user operation to be included in a mined transaction...")

  const txHash = await provider.waitForUserOperationTransaction(result.hash as `0x${string}`)
  console.log("\nTransaction hash: ", txHash)

  const userOpReceipt = await provider.getUserOperationReceipt(result.hash as `0x${string}`)
  console.log("\nUser operation receipt: ", userOpReceipt)

  const txReceipt = await provider.rpcClient.waitForTransactionReceipt({
    hash: txHash,
  })
  console.log("\nTransaction receipt: ", txReceipt)
}