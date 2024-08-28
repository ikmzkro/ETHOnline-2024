"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ethers } from "ethers";
import { matches } from "@/utils/data";
import TicketNftContract from "../contracts/TicketNft.sol/TicketNft.json";
import {
  FanTokenAddress,
  TicketNftContractAddress,
} from "@/contracts/constant";
import FanToken from "../contracts/FanToken.sol/FanToken.json";
import { useEffect, useState } from "react";

interface TicketListProps {
  account: string;
  signer: any;
  // signer: ethers.Signer | null;
}

type SeatType = "leader" | "drum" | "flag" | "fan";

interface Seat {
  seatNumber: number;
  type: SeatType;
  reward: number;
}

export function TicketListComponent({ account, signer }: TicketListProps) {
  const [poolBalance, setPoolBalance] = useState<string | null>(null);
  const [hasPurchasedTicket, setHasPurchasedTicket] = useState<boolean>(false);
  const getContributionPool = async () => {
    try {
      if (!signer) {
        console.error("Signer is not available");
        return;
      }

      const contract = new ethers.Contract(
        FanTokenAddress as string,
        FanToken.abi,
        signer
      );

      if (!contract) {
        console.error("Contract with MetaMask is not initialized");
        return;
      }

      const pool = await contract?.balanceOf(FanTokenAddress);
      setPoolBalance(ethers.utils.formatEther(pool));
    } catch (err) {
      console.log("Error fetching pool balance:", err);
      setPoolBalance(null);
    }
  };

  const fetchPurchasedSeats = async () => {
    if (!signer) return;

    const contract = new ethers.Contract(
      TicketNftContractAddress as string,
      TicketNftContract.abi,
      signer
    );

    try {
      const nft = await contract.getTicketMetadata(account);

      // Before issuance, the NFT array has the following values: nft[0] is tokenId = 0, and nft[1~3] are empty strings ("").
      if (nft[1]) {
        setHasPurchasedTicket(true);
      } else {
        setHasPurchasedTicket(false);
      }
    } catch (error) {
      console.error("Error fetching purchased seats:", error);
      setHasPurchasedTicket(false);
    }
  };

  useEffect(() => {
    getContributionPool();
    fetchPurchasedSeats();
  }, [poolBalance, signer]);

  return (
    <div className="grid grid-cols-1 gap-12 my-8">
      {matches.map((match) => (
        <Card key={match.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={match.homeLogo}
                  alt={`${match.teams} homeLogo`}
                  width={40}
                  height={40}
                  className="rounded-full"
                  style={{ aspectRatio: "40/40", objectFit: "cover" }}
                />
                <div>
                  <h3 className="text-lg font-semibold">{match.teams}</h3>
                  <p className="text-muted-foreground text-sm">
                    {match.matchDate}
                  </p>
                </div>
                <img
                  src={match.awayLogo}
                  alt={`${match.teams} awayLogo`}
                  width={40}
                  height={40}
                  className="rounded-full"
                  style={{ aspectRatio: "40/40", objectFit: "cover" }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-muted rounded-full w-8 h-8 flex items-center justify-center">
                  <TrophyIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Total ContributionPool</p>
                  <p className="text-2xl font-bold">
                    {poolBalance !== null ? poolBalance : "0"}{" "}
                    <span className="text-sm">FanToken</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  key={match.id}
                  href={{
                    pathname: hasPurchasedTicket
                      ? "/my-ticket"
                      : "/seating-map",
                    query: {
                      id: match.id,
                      teams: match.teams,
                      matchDate: match.matchDate,
                      homeLogo: match.homeLogo,
                      awayLogo: match.awayLogo,
                      contributionPool: poolBalance,
                    },
                  }}
                  passHref
                >
                  <Button size="sm">
                    {hasPurchasedTicket ? "My Tickets" : "Buy Tickets"}
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  key={match.id}
                  href={{
                    pathname: "/self-claim",
                    query: {
                      id: match.id,
                      teams: match.teams,
                      matchDate: match.matchDate,
                      homeLogo: match.homeLogo,
                      awayLogo: match.awayLogo,
                      contributionPool: poolBalance,
                    },
                  }}
                  passHref
                >
                  <Button size="sm">{"Self Claim"}</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TrophyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
