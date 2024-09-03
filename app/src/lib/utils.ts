import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

type SeatType = "leader" | "drum" | "flag" | "fan";

// 席、役割、報酬の配列
// {
//   "seatNumber": 1,
//   "type": "leader",
//   "reward": 29601.3
// }

interface Seat {
  seatNumber: number;
  role: SeatType;
  reward: number;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: string | undefined): string {
  const numberValue = typeof amount === 'bigint' ? Number(amount) : amount;
  return new Intl.NumberFormat('en-US', {
  }).format(numberValue as any);
}


// TODO: 将来的な貢献報酬のプラン
// - 選手への貢献報酬
//   - 来場したサポーター
//   - 芝生を管理しているスタッフ
// - サポータへの貢献
//   - ゲートスタッフ
//   - スタグル
//   - ハーフタイムイベントみたいなの

// `poolBalance`: The total amount (e.g., 1 poolBalance) is taken as an argument.
// The rewards are self-claimed as follows: 30% to the leader, 10% to the drum, 10% divided equally among the flag bearers, and 50% to the fans.
// For the fans, those seated closer to the leader's seat receive higher rewards, which are self-claimed based on the seat weighting.
const calculateSeatNumberRoleRewards = async (poolBalance: number): Promise<Seat[]> => {
  try {
    const leaderReward = poolBalance * 0.3;
    const drumReward = poolBalance * 0.1;
    const flagReward = (poolBalance * 0.1) / 8; // Equally divided among flag bearers
    const fanTotalReward = poolBalance * 0.5;
    const fansStart = 11;
    const seatsPerRow = 10;
    const fanSeats: Seat[] = [];
    const totalFanSeats = 90;
    let totalWeight = 0;

    // Calculate total weight for fans based on proximity to leader
    for (let i = 0; i < totalFanSeats; i++) {
      const weight = Math.ceil((totalFanSeats - i) / seatsPerRow);
      totalWeight += weight;
      fanSeats.push({ seatNumber: fansStart + i, role: "fan", reward: 0 });
    }

    // Assign rewards to fans based on calculated weight
    for (let i = 0; i < fanSeats.length; i++) {
      const weight = Math.ceil((totalFanSeats - i) / seatsPerRow);
      fanSeats[i].reward = (weight / totalWeight) * fanTotalReward;
    }

    // Set rewards for leader, drum, and flags
    // 座席番号１は応援リーダー
    // 座席番号２はドラム
    // 座席番号３から１０は旗振り
    // 座席番号１１から１００は声援をおくるファン（座席がリーダー席から遠ざかる＝１００に近づくにつれて報酬額が少なくなる）
    const allSeatInfo: Seat[] = [
      { seatNumber: 1, role: "leader" as SeatType, reward: leaderReward },
      { seatNumber: 2, role: "drum" as SeatType, reward: drumReward },
      ...Array.from({ length: 8 }, (_, i) => ({
        seatNumber: 3 + i,
        role: "flag" as SeatType,
        reward: flagReward,
      })),
      ...fanSeats,
    ];

    return allSeatInfo;
  } catch (error) {
    console.error("Error self-claiming rewards:", error);
    throw error;
  }
};

// ユーザの報酬金額を計算する関数
export async function getSelfClaimAmount(
  seatNumbers: string[],
  walletAddresses: string[],
  poolBalance: number,
  claimer: string
) {
  try {
    // 試合チケットにデポジットされたファントークン総額が各座席にどれだけ分配されるかを計算する
    const allSeatInfo = await calculateSeatNumberRoleRewards(poolBalance);

    // 既にチケットNFTが購入された席番号に絞って上記の配列をソートする
    const addressAndRewardPairs = seatNumbers.map((seatNumber, index) => {
      const seat = allSeatInfo.find((s) => s.seatNumber === parseInt(seatNumber));
      const reward = seat ? seat.reward : 0;
      return [walletAddresses[index], reward];
    });

    // 今回セルフクレームする対象の席番号一つに絞って配列をソートし
    // 対象の配列から報酬額のみを取得する
    // 貢献報酬として試合コントラクトからファントークンを引き出す際に、この報酬額を指定する
    const amount = addressAndRewardPairs.find(([address]) => address === claimer)?.[1];
    return amount;
  } catch (error) {
    console.error("Error generating reward pairs:", error);
    throw error;
  }
}


