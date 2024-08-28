import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ethers } from "ethers";
import {
  TicketNftContractAddress,
  VisselKobeVSTottenhamHotspurFCTokenURI,
} from "@/contracts/constant";
import TicketNftContract from "../contracts/TicketNft.sol/TicketNft.json";
import axios from "axios";
interface TicketBookingComponentProps {
  contributionPool: string;
  account: string;
  signer: ethers.Signer | null;
}

export function TicketBookingComponent({
  contributionPool,
  account,
  signer,
}: TicketBookingComponentProps) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchasedSeats, setPurchasedSeats] = useState<number[]>([]);
  const [metaData, setMetaData] = useState<any>(null);

  useEffect(() => {
    const fetchPurchasedSeats = async () => {
      if (!signer) return;

      const contract = new ethers.Contract(
        TicketNftContractAddress as string,
        TicketNftContract.abi,
        signer
      );

      try {
        const purchasedSeats = await contract.getUsedSeatNumbers();
        setPurchasedSeats(purchasedSeats);

        const metaData = await axios.get(
          VisselKobeVSTottenhamHotspurFCTokenURI as any
        );

        setMetaData(metaData.data);
      } catch (error) {
        console.error("Error fetching purchased seats:", error);
      }
    };

    fetchPurchasedSeats();
  }, [signer]);

  const handleSeatClick = (seatNumber: number) => {
    const seatNum = Number(seatNumber);
    setSelectedSeat(`Seat ${seatNum}`);
    // Role is set automatically
    if ([1, 2, 3, 4, 7, 8, 9, 10].includes(seatNum)) {
      setSelectedRole("flag");
    } else if (seatNum === 5) {
      setSelectedRole("leader");
    } else if (seatNum === 6) {
      setSelectedRole("drum");
    } else if (seatNum >= 11 && seatNum <= 100) {
      setSelectedRole("fan");
    }
  };

  const mint = async () => {
    try {
      if (!signer) {
        console.error("Signer is not available");
        alert("Signer is not available");
        return;
      }

      if (!selectedSeat) {
        alert("Please select a seat number");
        return;
      }

      const seatNumber = parseInt(selectedSeat.replace("Seat ", ""), 10);

      const contract = new ethers.Contract(
        TicketNftContractAddress as string,
        TicketNftContract.abi,
        signer
      );

      if (!contract) {
        console.error("Contract with MetaMask is not initialized");
        alert("Contract with MetaMask is not initialized");
        return;
      }

      const contractTx = await contract.safeMint(
        account,
        VisselKobeVSTottenhamHotspurFCTokenURI,
        String(seatNumber),
        selectedRole,
        {
          gasLimit: 1000000,
        }
      );

      try {
        setIsProcessing(true);
        alert("Transaction is processing...");
        const res = await contractTx.wait();
        if (res.transactionHash) {
          console.log("Transaction successful:", res.transactionHash);
          alert("Transaction successful!");
          // Navigate to the TOP page after success
          // TODO: router.push("/my-ticket");
          // () => navigateTo("/my-ticket");
        }
      } catch (error) {
        console.error("Error while waiting for the transaction:", error);
        alert("Error while waiting for the transaction: " + error);
      }
    } catch (error) {
      console.error("Error during mint transaction:", error);
      alert("Error during mint: " + error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Ticket Booking</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Stadium Seating</h2>
            <div className="bg-muted p-4 rounded-lg">
              <div className="grid grid-cols-10 gap-2">
                {Array.from({ length: 100 }, (_, i) => {
                  const seatNumber: string = (i + 1).toString();
                  const isPurchased = purchasedSeats.includes(
                    seatNumber as any
                  );

                  return (
                    <button
                      key={i}
                      className={`w-8 h-8 rounded-md transition-colors ${
                        isPurchased
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                          : "bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                      }`}
                      onClick={() => handleSeatClick(seatNumber as any)} // Set the selected seat on click
                      disabled={isPurchased} // This ensures purchased seats are not selectable
                    >
                      {seatNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Selected Seats</h2>
            <Card>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2 mt-4">
                    <Label htmlFor="team">Teams</Label>
                    <div>{metaData?.name}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stadium-name">Stadium Name</Label>
                    <div>{metaData?.stadiumName}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stadium-name">Entry Gate</Label>
                    <div>{metaData?.entryGate}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Match Date</Label>
                    <div>{metaData?.matchDate}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="opening-time">Opening Time</Label>
                    <div>{metaData?.openingTime}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="kickoff-time">Kickoff Time</Label>
                    <div>{metaData?.kickoffTime}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="seat">Seat Number</Label>
                    <div>{selectedSeat || "No seat selected"}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <div>{selectedRole || "No seat selected"}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pool">Contribution Pool</Label>
                    <div>{contributionPool} CHZ</div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="ticket-price">Contribution Rewards</Label>
                    <div>
                      Calculated based on the role coefficients and distributed
                      accordingly. It will be sent to the NFT-holding addresses
                      after the match results.
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Button onClick={mint} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Mint Ticket"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
