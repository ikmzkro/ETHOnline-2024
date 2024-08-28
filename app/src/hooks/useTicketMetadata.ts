import {TicketNftContractAddress} from "@/contracts/constant";
import TicketNftContract from "../contracts/TicketNft.sol/TicketNft.json";
import { useReadContract } from 'wagmi';

const useTicketMetadata = ({
  chainId,
  account
}: {
  chainId: number | undefined;
  account: string | undefined;
}) => {
  const { data: nftData } = useReadContract({
    address: TicketNftContractAddress,
    abi: TicketNftContract.abi,
    chainId,
    functionName: 'getTicketMetadata',
    args: [account],
  });
  // Before issuance, the NFT array has the following values: nft[0] is tokenId = 0, and nft[1~3] are empty strings ("").
  // TODO: 意味不明なバグ踏んだ
  return nftData[0] ? nftData[0] : ''
};

export default useTicketMetadata;
