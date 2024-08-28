import {FanTokenContractAddress} from "@/contracts/constant";
import FanToken from "../contracts/FanToken.sol/FanToken.json";
import { useReadContract } from 'wagmi';

const usePoolBalance = ({
  chainId,
}: {
  chainId: number | undefined;
}) => {
  const { data: usePoolBalancelance } = useReadContract({
    address: FanTokenContractAddress,
    abi: FanToken.abi,
    chainId,
    functionName: 'balanceOf',
    args: [FanTokenContractAddress],
  });

  return usePoolBalancelance as string | undefined;
};

export default usePoolBalance;
