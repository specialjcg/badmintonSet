import {
    Lose,
    MatchResult, MatchScore,
    NotPlayed,
    Player,
    PlayerHeuristic,
    PlayerMatchCount,
    PlayerResult,
    Ready,
    Session,
    Status,
    ToProcess, Tour, TourInProgress, Winner
} from "./models";





const hasWinner = ([playerResult1, playerResult2]: MatchResult<Status>, winner: Winner) => playerResult1.nom === winner.nom || playerResult2.nom === winner.nom

const getPlayerScore = (player1: PlayerResult<ToProcess>, winner: Winner) => player1.nom === winner.nom ? winner.score : Lose;

const setWinner = ([player1, player2]: MatchResult<ToProcess>, winner: Winner): MatchResult<Ready> => [
    {nom: player1.nom, score: getPlayerScore(player1, winner)},
    {nom: player2.nom, score: getPlayerScore(player2, winner)}
]

const toMatchesWithScoreFor = (winner: Winner) => (matchResult: MatchResult<Status>): MatchResult<Status> => hasWinner(matchResult, winner) ? setWinner(matchResult, winner) : matchResult;

const previous = (tours: Tour<Status>[]): Tour<Ready>[] => tours.slice(0, -1);

const setMatchesScoreForLast = (tours: Tour<Status>[], winner: Winner): Tour<Status> => (tours.at(-1) ?? []).map(toMatchesWithScoreFor(winner));







