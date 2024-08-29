import {useAccount, useChainId} from "wagmi";
import useHatContractWrite, { ValidFunctionName } from "./useNftContractWrite";
import { VisselKobeVSTottenhamHotspurFCTokenURI } from "@/contracts/constant";
import useSeatNumbers from "./useSeatNumbers";
import useSeatReceivers from "./useSeatReceivers";

const useSelfClaim = (nftdata?: any) => {
  const currentNetworkId = useChainId();
  console.log('nftdata', nftdata);

  const purchasedSeats = useSeatNumbers();
  const nftOwners = useSeatReceivers();

  console.log('purchasedSeats', purchasedSeats);
  console.log('nftOwners', nftOwners);

  /**
   * PoolをSelfClaimするメソッド
   */
  const {writeAsync, isLoading} = useHatContractWrite({
    functionName: "withdraw" as ValidFunctionName,
    args: ['1'],
    chainId: currentNetworkId,
    enabled: currentNetworkId === 88882,
  });

  return {writeAsync, isLoading};
};

export default useSelfClaim;
