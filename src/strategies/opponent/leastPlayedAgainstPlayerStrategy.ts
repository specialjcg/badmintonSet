import {TourInProgress} from "../../tourInProgress";
import {byPlayerMatchCount, Player, PlayerMatchCount, toPlayerMatchCount, toPlayerName} from "../../player";
import {MatchResult, PlayerResult} from "../../score";
import {Ready, ToProcess, Tour} from "../../session";
import {OpponentHeuristic} from "./heuristic";

const extractPlayerSoHeCannotPlayAgainstHimself = (playerThatPlayedLeast: string) => (nom: string): boolean =>
    playerThatPlayedLeast !== nom;

const withAllPlayersFromAllPreviousTours = (tours: Tour<Ready>[]) =>
    tours.flatMap((matchResults: MatchResult<Ready>[]) =>
        matchResults.flatMap(([playerResult1, playerResult2]: [PlayerResult<Ready>, PlayerResult<Ready>]): string[] => [
            playerResult1.nom,
            playerResult2.nom
        ])
    );

const playersMatchCountToPlayerHeuristic = (players: PlayerMatchCount[]): OpponentHeuristic[] =>
    players.map((playerMatchCount: PlayerMatchCount): OpponentHeuristic => ({
        nom: playerMatchCount.nom,
        heuristic: playerMatchCount.count
    }))

const playersWithScoreToPlayerHeuristic = (player: Player): OpponentHeuristic => ({nom: player.nom, heuristic: 1})

const allMatchesFromPreviousToursForPlayer =
    (playerThatPlayedLeast: string) =>
        ([playerResult1, playerResult2]: MatchResult<Ready>): boolean =>
            playerResult1.nom !== playerThatPlayedLeast && playerResult2.nom !== playerThatPlayedLeast;

const toOpponentsNames =
    (playerThatPlayedLeast: string) =>
        ([playerResult1, playerResult2]: MatchResult<Ready>): string =>
            playerResult1.nom === playerThatPlayedLeast ? playerResult2.nom : playerResult1.nom;

const playersNotInList =
    (opponentsWithPlayerThatPlayedLeast: string[]) =>
        (playerNameOpponent: string): boolean =>
            !opponentsWithPlayerThatPlayedLeast.includes(playerNameOpponent);

const opponentIsFirstInList = (tours: Tour<Ready>[], opponentPlaysCount: PlayerMatchCount[]): boolean =>
    tours.length === 0 || opponentPlaysCount.length === 1 || opponentPlaysCount[0].count < opponentPlaysCount[1].count;

const opponentThatPlayedMoreThanOthers = (minimalPlayedCount: number) => (playerMatchCount: PlayerMatchCount): boolean =>
    playerMatchCount.count !== minimalPlayedCount;

const listOfPlayersThatPlayedLeast = (opponentPlaysCount: PlayerMatchCount[], playerThatPlayedLeast: string): string[] => [
    ...opponentPlaysCount.filter(opponentThatPlayedMoreThanOthers(opponentPlaysCount[0].count)).map(toPlayerName),
    playerThatPlayedLeast
];

const onlyAvailableOpponents =
    (matchResults: MatchResult<ToProcess>[]) =>
        (opponentName: string): boolean =>
            !matchResults
                .flatMap(([playerResult1, playerResult2]: [PlayerResult<ToProcess>, PlayerResult<ToProcess>]) => [playerResult1.nom, playerResult2.nom])
                .includes(opponentName);

export const opponentThatLeastPlayedAgainstPlayerStrategy = (opponentHeuristics: OpponentHeuristic[], playerThatPlayedLeast: string, tourInProgress: TourInProgress): OpponentHeuristic[] => {
    const withoutPlayer: (nom: string) => boolean = extractPlayerSoHeCannotPlayAgainstHimself(playerThatPlayedLeast);
    const opponentPlaysCount: PlayerMatchCount[] = tourInProgress.availablePlayers
        .map(toPlayerName)
        .concat(withAllPlayersFromAllPreviousTours(tourInProgress.previousTours))
        .filter(onlyAvailableOpponents(tourInProgress.matchesInProgress))
        .filter(withoutPlayer)
        .reduce(toPlayerMatchCount, [])
        .sort(byPlayerMatchCount);

    const nobodyHasPlayedYet: boolean = opponentPlaysCount.length === 0

    const opponentThatPlayedLeastAgainstPlayerInPreviousTourCo: PlayerMatchCount[] = tourInProgress.previousTours
        .flatMap((matchResults: MatchResult<Ready>[]) => matchResults)
        .filter(allMatchesFromPreviousToursForPlayer(playerThatPlayedLeast))
        .map(toOpponentsNames(playerThatPlayedLeast))
        .filter(playersNotInList(listOfPlayersThatPlayedLeast(opponentPlaysCount, playerThatPlayedLeast)))
        .reduce(toPlayerMatchCount, [])
        .sort(byPlayerMatchCount);

    const opponentWhenEveryonePlayedOnce: OpponentHeuristic[] = opponentIsFirstInList(tourInProgress.previousTours, opponentPlaysCount)
        ? playersMatchCountToPlayerHeuristic(opponentPlaysCount)
        : playersMatchCountToPlayerHeuristic(opponentThatPlayedLeastAgainstPlayerInPreviousTourCo);

    return nobodyHasPlayedYet
        ? (tourInProgress.availablePlayers
            .filter((player: Player): boolean => playerThatPlayedLeast !== player.nom)).map(playersWithScoreToPlayerHeuristic)
        : opponentWhenEveryonePlayedOnce;
}