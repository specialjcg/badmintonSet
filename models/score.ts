import {MatchResult, MatchScore, PlayerResult, Ready, Session, Status, ToProcess, Tour} from "./session";
import {Winner} from "./player";

export const NotPlayed = 'NotPlayed' as const;

export const Lose = 'Lose' as const;

export const Win = 'Win' as const;

export const StrongWin = 'StrongWin' as const;

const previous = (tours: Tour<Status>[]): Tour<Ready>[] => tours.slice(0, -1);

const hasWinner = ([playerResult1, playerResult2]: MatchResult<Status>, winner: Winner) => playerResult1.nom === winner.nom || playerResult2.nom === winner.nom

const getPlayerScore = (player1: PlayerResult<ToProcess>, winner: Winner) => player1.nom === winner.nom ? winner.score : Lose;

const setWinner = ([player1, player2]: MatchResult<ToProcess>, winner: Winner): MatchResult<Ready> => [
    {nom: player1.nom, score: getPlayerScore(player1, winner)},
    {nom: player2.nom, score: getPlayerScore(player2, winner)}
]

const toMatchesWithScoreFor = (winner: Winner) => (matchResult: MatchResult<Status>): MatchResult<Status> => hasWinner(matchResult, winner) ? setWinner(matchResult, winner) : matchResult;

const setMatchesScoreForLast = (tours: Tour<Status>[], winner: Winner): Tour<Status> => (tours.at(-1) ?? []).map(toMatchesWithScoreFor(winner));

export const setMatchScore = ({players, tours}: Session<ToProcess>, winner: Winner): Session<ToProcess> => ({
    players,
    tours: [...(previous(tours)), setMatchesScoreForLast(tours, winner)]
});

const scoreRecord: Record<MatchScore, 1 | 2 | 3> = {
    Lose: 3,
    Win: 2,
    StrongWin: 1
};

export const playerScore = (playerName: string, [player1, player2]: MatchResult<Ready>) =>
    scoreRecord[player1.nom === playerName ? player2.score : player1.score];

const isPlayerInMatch = (playerName: string, [player1, player2]: MatchResult<Ready>) =>
    player1.nom === playerName || player2.nom === playerName;

const scoreFunction = (playerName: string, matchResult: MatchResult<Ready>): number =>
    isPlayerInMatch(playerName, matchResult) ? playerScore(playerName, matchResult) : 0;

