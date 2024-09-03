/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/hOZqFTzgJ6S
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import useTicketMetadata from "@/hooks/useTicketMetadata";
import QRCode from "qrcode.react";
import { Button } from "./ui/button";
import useSelfClaim from "@/hooks/useSelfClaim";
import { useEffect, useState } from "react";
import useSeatNumbers from "@/hooks/useSeatNumbers";
import useSeatReceivers from "@/hooks/useSeatReceivers";
import { getReward } from "@/lib/utils";
import usePoolBalance from "@/hooks/usePoolBalance";
import { useAccount } from "wagmi";
import useRewardBalance from "@/hooks/useRewardBalance";

interface QRCodeComponentProps {}

export function QRCodeComponent({}: QRCodeComponentProps) {
  // Error: NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted
  // const router = useRouter();
  // const { nftData, metaData } = router.query;
  const { address } = useAccount();
  const [claimAmount, setClaimAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const res: any = useTicketMetadata();
  const poolBalance = usePoolBalance();
  const rewardBalance = useRewardBalance();
  const purchasedSeats = useSeatNumbers();
  const nftOwners = useSeatReceivers();

  const resSelfClaim = useSelfClaim(claimAmount);

  // useEffect(() => {
  //   // Ensure `claimAmount` is updated before calling `resSelfClaim.writeAsync`
  //   if (claimAmount > 0) {
  //     resSelfClaim?.writeAsync();
  //   }
  // }, [claimAmount > 0]);

  if (!res.metadata) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }
  const qrValue = JSON.stringify(res.metadata);

  const renderMessage = (isProcessing: any, rewardBalance: any) => {
    if (isProcessing) {
      return "Processing...";
    }

    if (rewardBalance) {
      return `${rewardBalance.toString()} FanToken has been distributed to your address.`;
    }

    return "Self Claim";
  };

  const buttonName = renderMessage(isProcessing, rewardBalance);
  // Convert rewardBalance to boolean for the disabled prop
  const isDisabled = isProcessing || Boolean(rewardBalance);

  return (
    <>
      <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 max-w-6xl mx-auto px-36 sm:px-">
        <div className="flex flex-col items-center w-full p-4 mt-8 rounded-lg shadow-md">
          <div className="flex flex-col items-center w-full p-4 text-white rounded-t-lg">
            <h2 className="text-lg font-bold">MATCH INFO</h2>
          </div>
          <div className="w-full p-4">
            <p className="text-lg font-bold">{res.metadata?.matchDate}</p>
            <p className="text-sm text-gray-500">{res.metadata?.description}</p>
            <p className="text-lg font-semibold mt-2">{res.metadata?.name}</p>
            <div className="flex items-center justify-between w-full p-4 mt-4 bg-gray-100 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-lg font-bold">{res.nftdata[3]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Entry Gate</p>
                <p className="text-lg font-bold">{res.metadata?.entryGate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Seat</p>
                <p className="text-lg font-bold">{res.nftdata[2]}</p>
              </div>
            </div>
            <div className="flex flex-col items-center w-full mt-4">
              <QRCode value={qrValue} size={150} className="w-40 h-40" />
              <p className="mt-8 text-sm text-gray-500">
                Please scan the QR code at the authentication machine.
              </p>
            </div>
            <div className="flex flex-col w-full mt-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Venue</span>
                <span className="font-bold text-right">
                  {res.metadata?.stadiumName}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Opening Time</span>
                <span className="font-bold text-right">
                  {res.metadata?.openingTime}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Kickoff Time</span>
                <span className="font-bold text-right">
                  {res.metadata?.kickoffTime}
                </span>
              </div>
              <div className="flex flex-col items-right pt-8 text-white rounded-t-lg">
                <Button
                  onClick={() => {
                    setIsProcessing(true);
                    try {
                      const fetch = async () => {
                        // Calculate selfClaimAmount by SeatNumber, SeatRole
                        const sendRequests = await getReward(
                          purchasedSeats as any,
                          nftOwners as any,
                          poolBalance?.toString() as any,
                          address as any
                        );
                        console.log("sendRequests", sendRequests);
                        const amount = Math.floor(Number(sendRequests));
                        setClaimAmount(amount);

                        // Check if claimAmount is greater than 0 before calling writeAsync
                        // if (amount > 0) {
                        //   await resSelfClaim.writeAsync();
                        // } else {
                        //   alert("Claim amount must be greater than 0");
                        // }
                      };
                      fetch();
                    } catch (error) {
                      alert(error);
                    }
                  }}
                  disabled={isDisabled}
                >
                  {buttonName}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
