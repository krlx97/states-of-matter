/**
 * Base ELO Points: 20
 *
 * If the disparity between two players ratings is below 100:
 * - Adjustments are -20 and +20, respectively.
 *
 * When the rating difference surpasses 100 ELO points:
 * - The player with a lower ELO rating, who loses, experiences a deduction of the base - (5) => 15 ELO points,
 *   while the victorious player gains an equivalent amount of 15 ELO points due to their triumph over a weaker opponent.
 *
 * - In cases where the rating difference exceeds 100:
 *   - The player with a higher ELO rating, who loses, undergoes a penalty of base + 5 => 25 ELO points,
 *     and the player with a lower ELO rating receives an increment of base + 5 ELO points.
 *
 * When the discrepancy in ratings surpasses 200 ELO points:
 * - The player with a lower ELO rating, who loses, incurs a deduction of base - (10) => 10 ELO points,
 *   while the victorious player gains an equivalent amount of 10 ELO points.
 *
 * - In cases where the rating difference exceeds 200:
 *   - The player with a higher ELO rating, who loses, faces a penalty of base + (10) => 30 ELO points,
 *     and the player with a lower ELO rating receives a gain of those 30 ELO points.
 *
 * When the disparity in ratings surpasses 300 ELO points:
 * - The player with a lower ELO rating, who loses, experiences a deduction of base - (15) => 5 ELO points,
 *   and the victorious player gains an equivalent amount of 5 ELO points.
 *
 * - In cases where the rating difference exceeds 300:
 *   - The player with a higher ELO rating, who loses, faces a penalty of base + (15) => 35 ELO points,
 *     and the player with a lower ELO rating receives a gain of those 35 ELO points.
 */

const BASE_ELO_POINTS = 20;
const MINIMAL_ELO_DIFFERENCE = 100;

const eloRulesMap = new Map<number, number>([
  [200, 5],
  [300, 10],
  [400, 15],
  [500, 20],
  [600, 25],
]);

type Player = "playerA" | "playerB";

type PlayerPointsResult = {
  eloPlayerA: number;
  eloPlayerB: number;
};

const calculateDifferenceInEloRating = (
  firstPlayerElo: number,
  secondPlayerElo: number
): number => Math.abs(firstPlayerElo - secondPlayerElo);

/**
 * Calculates the adjusted Elo points for both players based on the winner and the Elo rating difference.
 * @param firstPlayerElo - Elo rating of the first player.
 * @param secondPlayerElo - Elo rating of the second player.
 * @param winner - The winner of the match (either "playerA" or "playerB").
 * @returns An object containing the adjusted Elo points for both players.
 */
const calculateEloPointsForPlayers = (
  firstPlayerElo: number,
  secondPlayerElo: number,
  winner: Player
): PlayerPointsResult => {
  const eloRatingDiff = calculateDifferenceInEloRating(
    firstPlayerElo,
    secondPlayerElo
  );

  if (eloRatingDiff > MINIMAL_ELO_DIFFERENCE) {
    const winnerIsFirstPlayer = winner === "playerA";
    const higherEloIsFirstPlayer = firstPlayerElo > secondPlayerElo;

    // Determine the adjustment based on the Elo difference
    for (const [threshold, adjustment] of eloRulesMap) {
      if (eloRatingDiff <= threshold) {
        // Adjust Elo points based on the winner and higher Elo rating

        if (
          (winnerIsFirstPlayer && higherEloIsFirstPlayer) ||
          (!winnerIsFirstPlayer && !higherEloIsFirstPlayer)
        ) {
          return {
            eloPlayerA: Math.abs(BASE_ELO_POINTS - adjustment),
            eloPlayerB: Math.abs(BASE_ELO_POINTS - adjustment),
          };
        }

        if (
          (winnerIsFirstPlayer && !higherEloIsFirstPlayer) ||
          (!winnerIsFirstPlayer && higherEloIsFirstPlayer)
        ) {
          return {
            eloPlayerA: Math.abs(BASE_ELO_POINTS + adjustment),
            eloPlayerB: Math.abs(BASE_ELO_POINTS + adjustment),
          };
        }
      }
    }
  }

  return { eloPlayerA: BASE_ELO_POINTS, eloPlayerB: BASE_ELO_POINTS };
};

export { calculateEloPointsForPlayers };
