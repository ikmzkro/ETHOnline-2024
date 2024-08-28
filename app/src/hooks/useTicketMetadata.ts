import { useState, useEffect } from "react";
import { TicketNftContractAddress } from "@/contracts/constant";
import TicketNftContract from "../contracts/TicketNft.sol/TicketNft.json";
import { useReadContract } from 'wagmi';
import axios from "axios";

const useTicketMetadata = ({
  chainId,
  account,
}: {
  chainId: number | undefined;
  account: string | undefined;
}) => {
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPurchased, setIsPurchased] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the contract using useReadContract hook
  const { data: nftData, isError, isLoading } = useReadContract({
    address: TicketNftContractAddress,
    abi: TicketNftContract.abi,
    chainId,
    functionName: "getTicketMetadata",
    args: [account],
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!nftData || !nftData[1]) return; // Handle case where nftData or URL is not present
      const isPurchased = nftData[0]?.toString() !== '0'
      setIsPurchased(isPurchased)
      try {
        setLoading(true);
        const response = await axios.get(nftData[1]); // Fetch the metadata from the URL
        setMetadata(response.data);
      } catch (err) {
        setError("Failed to fetch metadata");
        console.error('Error fetching metadata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [nftData]);

  return { isPurchased, metadata, loading: isLoading || loading, error: isError || error };
};

export default useTicketMetadata;
