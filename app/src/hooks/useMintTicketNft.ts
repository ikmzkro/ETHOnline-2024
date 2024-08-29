import {FanTokenContractAddress} from "@/contracts/constant";
import FanToken from "../contracts/FanToken.sol/FanToken.json";
import { useChainId, useReadContract } from 'wagmi';

const useMintTicketNft = () => {
  const chainId = useChainId();
  const { data: useMintTicketNft } = useReadContract({
    address: FanTokenContractAddress,
    abi: FanToken.abi,
    chainId,
    functionName: 'balanceOf',
    args: [FanTokenContractAddress],
  });

  return useMintTicketNft as string | undefined;
};

export default useMintTicketNft;
