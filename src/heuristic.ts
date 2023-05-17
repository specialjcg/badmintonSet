import {TourInProgress} from "./tourInProgress";
import {byPlayerMatchCount, Player, PlayerMatchCount, toPlayerMatchCount, toPlayerName} from "./player";
import {MatchResult, PlayerResult} from "./score";
import {Ready, ToProcess, Tour} from "./session";

export type PlayerHeuristic = {
    nom: string;
    heuristic: number;
}

const selectFromHeuristic = (playerLikeArray: PlayerHeuristic[]) => playerLikeArray[0].nom

export const applyStrategies = (playerName: string, tourInProgress: TourInProgress) => selectFromHeuristic(
    opponentWithNearestLevel(opponentThatLeastPlayedAgainstPlayer(playerName, tourInProgress), playerName, tourInProgress));

// region  Level Related strategy
const opponentWithNearestLevel = (playerHeuristics: PlayerHeuristic[], playerName: string, tourInProgress: TourInProgress): PlayerHeuristic[] => {
    const highestPlayerHeuristic: PlayerHeuristic = playerHeuristics.sort((playerHeuristicA: PlayerHeuristic, playerHeuristicB: PlayerHeuristic) =>
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
//endregion

const extractPlayerSoHeCannotPlayAgainstHimself = (playerThatPlayedLeast: string) => (nom: string): boolean =>
    playerThatPlayedLeast !== nom;

const withAllPlayersFromAllPreviousTours = (tours: Tour<Ready>[]) =>
    tours.flatMap((matchResults: MatchResult<Ready>[]) =>
        matchResults.flatMap(([playerResult1, playerResult2]: [PlayerResult<Ready>, PlayerResult<Ready>]): string[] => [
            playerResult1.nom,
            playerResult2.nom
        ])
    );

const playersMatchCountToPlayerHeuristic = (players: PlayerMatchCount[]): PlayerHeuristic[] =>
    players.map((playerMatchCount: PlayerMatchCount): PlayerHeuristic => ({
        nom: playerMatchCount.nom,
        heuristic: playerMatchCount.count
    }))

const playersWithScoreToPlayerHeuristic = (player: Player): PlayerHeuristic => ({nom: player.nom, heuristic: 1})

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

//region Match Count related strategy
const opponentThatPlayedMoreThanOthers = (minimalPlayedCount: number) => (playerMatchCount: PlayerMatchCount): boolean =>
    playerMatchCount.count !== minimalPlayedCount;

const listOfPlayersThatPlayedLeast = (opponentPlaysCount: PlayerMatchCount[], playerThatPlayedLeast: string): string[] => [
    ...opponentPlaysCount.filter(opponentThatPlayedMoreThanOthers(opponentPlaysCount[0].count)).map(toPlayerName),
    playerThatPlayedLeast
];
//endregion

const onlyAvailableOpponents =
    (matchResults: MatchResult<ToProcess>[]) =>
        (opponentName: string): boolean =>
            !matchResults
                .flatMap(([playerResult1, playerResult2]: [PlayerResult<ToProcess>, PlayerResult<ToProcess>]) => [playerResult1.nom, playerResult2.nom])
                .includes(opponentName);

const opponentThatLeastPlayedAgainstPlayer = (playerThatPlayedLeast: string, tourInProgress: TourInProgress): PlayerHeuristic[] => {
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

    const opponentWhenEveryonePlayedOnce: PlayerHeuristic[] = opponentIsFirstInList(tourInProgress.previousTours, opponentPlaysCount)
        ? playersMatchCountToPlayerHeuristic(opponentPlaysCount)
        : playersMatchCountToPlayerHeuristic(opponentThatPlayedLeastAgainstPlayerInPreviousTourCo);

    return nobodyHasPlayedYet
        ? (tourInProgress.availablePlayers
            .filter((player: Player): boolean => playerThatPlayedLeast !== player.nom)).map(playersWithScoreToPlayerHeuristic)
        : opponentWhenEveryonePlayedOnce;
}