import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

type SeatType = "leader" | "drum" | "flag" | "fan";

interface Seat {
  seatNumber: number;
  type: SeatType;
  reward: number;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: string | undefined): string {
  const numberValue = typeof amount === 'bigint' ? Number(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numberValue as any);
}

// `totalPool`: The total amount (e.g., 1 totalPool) is taken as an argument.
// The rewards are self-claimed as follows: 30% to the leader, 10% to the drum, 10% divided equally among the flag bearers, and 50% to the fans.
// For the fans, those seated closer to the leader's seat receive higher rewards, which are self-claimed based on the seat weighting.
const selfClaimRewards = async (totalPool: number): Promise<Seat[]> => {
  try {
    const leaderReward = totalPool * 0.3;
    const drumReward = totalPool * 0.1;
    const flagReward = (totalPool * 0.1) / 8; // Equally divided among flag bearers
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
    console.error("Error self-claiming rewards:", error);
    throw error;
  }
};

export async function getRewardPairs(
  seatNumbers: string[],
  walletAddresses: string[],
  totalETH: number
) {
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
}
