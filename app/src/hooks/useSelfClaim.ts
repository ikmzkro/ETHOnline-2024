import {useAccount, useChainId} from "wagmi";
import useFanTokenContractWrite, { ValidFunctionName } from "./useFanTokenContractWrite";

type SeatType = "leader" | "drum" | "flag" | "fan";

interface Seat {
  seatNumber: number;
  type: SeatType;
  reward: number;
}

const useSelfClaim = (claimAmount?: any) => {
  const currentNetworkId = useChainId();


  /**
   * PoolをSelfClaimするメソッド
   */
  const {writeAsync, isLoading} = useFanTokenContractWrite({
    functionName: "withdraw" as ValidFunctionName,
    args: [claimAmount],
    chainId: currentNetworkId,
    enabled: currentNetworkId === 88882,
  });

  return {writeAsync, isLoading};
};

export default useSelfClaim;
