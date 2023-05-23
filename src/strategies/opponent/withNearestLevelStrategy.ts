import {TourInProgress} from "../../tourInProgress";
import {Player} from "../../player";
import {OpponentHeuristic} from "./heuristic";

export const opponentWithNearestLevelStrategy = (opponentHeuristics: OpponentHeuristic[], playerName: string, tourInProgress: TourInProgress): OpponentHeuristic[] => {
    const highestPlayerHeuristic: OpponentHeuristic = opponentHeuristics.sort((playerHeuristicA: OpponentHeuristic, playerHeuristicB: OpponentHeuristic) =>
        playerHeuristicA.heuristic - playerHeuristicB.heuristic)[0];

    const playerLevel: number = tourInProgress.availablePlayers.find((player: Player) => player.nom === playerName)?.level ?? 0;
    const opponents: Player[] = tourInProgress.availablePlayers.filter((player: Player) => player.nom !== playerName);
    const defaultOpponent: Player = tourInProgress.availablePlayers.find((player: Player) => player.nom === highestPlayerHeuristic.nom) ?? opponents[0];

    return [{
        nom: opponents.reduce((nearestPlayer: Player, player: Player): Player => {
            const previousLevelDiff: number = Math.abs(playerLevel - nearestPlayer.level);
            const currentLevelDiff: number = Math.abs(playerLevel - player.level);

            return previousLevelDiff <= currentLevelDiff ? nearestPlayer : player;
        }, defaultOpponent).nom,
        heuristic: 1
    }];
};
