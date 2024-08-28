import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardHeader } from "./ui/card";
import { ethers } from "ethers";
import {
  FanTokenContractAddress,
  TicketNftContractAddress,
} from "@/contracts/constant";
import TicketNftContract from "../contracts/TicketNft.sol/TicketNft.json";
import Fantoken from "../contracts/FanToken.sol/FanToken.json";
import { useRouter } from "next/router";

interface SelfClaimComponentProps {
  teams: string;
  matchDate: string;
  homeLogo: string;
  awayLogo: string;
  contributionPool: string;
  account: string;
  signer: ethers.Signer | null;
}

type SeatType = "leader" | "drum" | "flag" | "fan";

interface Seat {
  seatNumber: number;
  type: SeatType;
  reward: number;
}

export function SelfClaimComponent({
  teams,
  matchDate,
  homeLogo,
  awayLogo,
  contributionPool,
  account,
  signer,
}: SelfClaimComponentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter(); // Initialize the router

  // `totalPool`: The total amount (e.g., 1 totalPool) is taken as an argument.
  // The rewards are selfClaimd as follows: 30% to the leader, 10% to the drum, 10% divided equally among the flag bearers, and 50% to the fans.
  // For the fans, those seated closer to the leader's seat receive higher rewards, which are selfClaimd based on the seat weighting.
  const selfClaimRewards = async (totalPool: number): Promise<Seat[]> => {
    try {
      const leaderReward = totalPool * 0.3;
      const drumReward = totalPool * 0.1;
      const flagReward = (totalPool * 0.1) / 8; // 旗振りに等分
      const fanTotalReward = totalPool * 0.5;
      const fansStart = 11;
      const seatsPerRow = 10;
      const fanSeats: Seat[] = [];
      const totalFanSeats = 90;
      let totalWeight = 0;

      // Calculate total weight for fans based on proximity to leader
      for (let i = 0; i < totalFanSeats; i++) {
        const weight = Math.ceil((totalFanSeats - i) / seatsPerRow);
        totalWeight += weight;
        fanSeats.push({ seatNumber: fansStart + i, type: "fan", reward: 0 });
      }

      // Assign rewards to fans based on calculated weight
      for (let i = 0; i < fanSeats.length; i++) {
        const weight = Math.ceil((totalFanSeats - i) / seatsPerRow);
        fanSeats[i].reward = (weight / totalWeight) * fanTotalReward;
      }

      // Set rewards for leader, drum, and flags
      const seats: Seat[] = [
        { seatNumber: 1, type: "leader" as SeatType, reward: leaderReward },
        { seatNumber: 2, type: "drum" as SeatType, reward: drumReward },
        ...Array.from({ length: 8 }, (_, i) => ({
          seatNumber: 3 + i,
          type: "flag" as SeatType,
          reward: flagReward,
        })),
        ...fanSeats,
      ];

      return seats;
    } catch (error) {
      console.error("Error self claim rewards:", error);
      throw error;
    }
  };

  const getRewardPairs = async (
    seatNumbers: string[],
    walletAddresses: string[],
    totalETH: number
  ) => {
    try {
      const seats = await selfClaimRewards(totalETH);

      const rewardPairs = seatNumbers.map((seatNumber, index) => {
        const seat = seats.find((s) => s.seatNumber === parseInt(seatNumber));
        const reward = seat ? seat.reward : 0;
        return [walletAddresses[index], reward];
      });

      return rewardPairs;
    } catch (error) {
      console.error("Error generating reward pairs:", error);
      throw error;
    }
  };

  const destribute = async () => {
    try {
      if (!signer) {
        console.error("Signer is not available");
        alert("Signer is not available");
        return;
      }

      const contract = new ethers.Contract(
        FanTokenContractAddress as string,
        Fantoken.abi,
        signer
      );

      if (!contract) {
        console.error("Contract with MetaMask is not initialized");
        alert("ontract with MetaMask is not initialized");
        return;
      }

      // const depositAmount = await contract.adminWithdraw();

      // 721
      const nftContract = new ethers.Contract(
        TicketNftContractAddress as string,
        TicketNftContract.abi,
        signer
      );
      const purchasedSeats = await nftContract.getUsedSeatNumbers();
      const nftOwners = await nftContract.getUsedReceivers();

      const sendRequests = await getRewardPairs(purchasedSeats, nftOwners, 1); // depositAmount
      console.log("sendRequests", sendRequests);

      // send contract
      // const contractTx = await contract.sendChiliz(sendRequests);

      try {
        // setIsProcessing(true);
        // alert("Transaction is processing...");
        // const res = await contractTx.wait();
        // if (res.transactionHash) {
        //   console.log("Transaction successful:", res.transactionHash);
        //   alert("Transaction successful!");
        //   // Navigate to the TOP page after success
        //   router.push("/");
        // }
      } catch (error) {
        console.error("Error while waiting for the transaction:", error);
        alert("Error while waiting for the transaction: " + error);
      }
    } catch (error) {
      console.error("Error during destribute transaction:", error);
      alert("Error during destribute: " + error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Self Claim FanToken
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="mt-2">
            <h2 className="text-lg font-medium mb-2 text-center">
              Contribution Pool: {contributionPool}
              <span className="text-sm"> CHZ</span>
            </h2>
          </div>
          <CardHeader>
            <div className="flex items-center justify-center gap-8">
              <img
                src={homeLogo}
                alt={`${teams} homeLogo`}
                width={60}
                height={60}
                className="rounded-full"
                style={{ aspectRatio: "1/1", objectFit: "cover" }}
              />
              <div className="text-center">
                <h3 className="text-lg font-semibold">{teams}</h3>
                <p className="text-muted-foreground text-sm">{matchDate}</p>
              </div>
              <img
                src={awayLogo}
                alt={`${teams} awayLogo`}
                width={60}
                height={60}
                className="rounded-full"
                style={{ aspectRatio: "1/1", objectFit: "cover" }}
              />
            </div>
          </CardHeader>
          <div className="flex items-center justify-center">
            <div className="ml-4">
              <Button onClick={destribute} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Self Claim"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
