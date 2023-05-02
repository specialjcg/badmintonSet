import {Player, PlayerMatchCount, playersPairs} from './player'
import {Lose, NotPlayed, StrongWin, Win} from './score'
import {TourInProgress} from "./tourInProgress";

export type Ready = 'Ready';

export type ToProcess = 'ToProcess';

export type Status = Ready | ToProcess;

export type MatchScore = typeof Lose | typeof Win | typeof StrongWin;

export type PlayerResult<T extends Status> = {
    nom: string;
    score: T extends Ready ? MatchScore : typeof NotPlayed;
};

export type MatchResult<T extends Status> = [PlayerResult<T>, PlayerResult<T>];

export type Tour<T extends Status> = MatchResult<T>[];

export type Session<T extends Status> = {
    players: Player[];
    tours: T extends Ready ? Tour<Ready>[] : [...Tour<Ready>[], Tour<ToProcess>];
};

export type PlayerHeuristic = {
    nom: string;
    heuristic: number;
}

export const makeSession = (players: Player[]): Session<Ready> => ({players, tours: []});

export const isSessionReady = (session: Session<Status>): session is Session<Ready> =>
    !session.tours.flat(2).some((playerResult: PlayerResult<Status>) => playerResult.score === NotPlayed)

const toPlayerName = (player: { nom: string }): string => player.nom;

const isNotInPreviousMatch =
    (match: [PlayerResult<ToProcess>, PlayerResult<ToProcess>]) =>
        (player: Player): boolean =>
            !match.map(toPlayerName).includes(player.nom);

const updateTourInProgress = (tourInProgress: TourInProgress, match: [PlayerResult<ToProcess>, PlayerResult<ToProcess>]): TourInProgress => ({
    matchesInProgress: [...tourInProgress.matchesInProgress, match],
    availablePlayers: tourInProgress.availablePlayers.filter(isNotInPreviousMatch(match)),
    previousTours: tourInProgress.previousTours
});

const isPlayerInMatch = (playerName: string, [player1, player2]: MatchResult<Ready>) =>
    player1.nom === playerName || player2.nom === playerName;

const scoreRecord: Record<MatchScore, 1 | 2 | 3> = {
    Lose: 3,
    Win: 2,
    StrongWin: 1
};
const playerScore = (playerName: string, [player1, player2]: MatchResult<Ready>) =>
    scoreRecord[player1.nom === playerName ? player2.score : player1.score];
const scoreFunction = (playerName: string, matchResult: MatchResult<Ready>): number =>
    isPlayerInMatch(playerName, matchResult) ? playerScore(playerName, matchResult) : 0;
const addMatchResultToLevelFor = (player: Player) => (level: number, matchResult: MatchResult<Ready>) =>
    level + scoreFunction(player.nom, matchResult);
export const computeLevels = (session: Session<Ready>) => session.players.map((player: Player): Player => ({
        nom: player.nom,
        level: session.tours.flat().reduce(addMatchResultToLevelFor(player), player.level)
    })
);
const makePlayerResult = (nom: string): PlayerResult<ToProcess> => ({
    nom: nom,
    score: NotPlayed
});

const selectFromHeuristic = (playerLikeArray: PlayerHeuristic[]) => playerLikeArray[0].nom
const opponentWithNearestLevel = (playerHeuristics: PlayerHeuristic[], playerName: string, tourInProgress: TourInProgress): PlayerHeuristic[] => {
    const highestPlayerHeuristic: PlayerHeuristic = playerHeuristics.sort((playerHeuristicA: PlayerHeuristic, playerHeuristicB: PlayerHeuristic) => playerHeuristicA.heuristic - playerHeuristicB.heuristic)[0];

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
const opponentIsFirstInList = (tours: Tour<Ready>[], opponentPlaysCount: PlayerMatchCount[]): boolean =>
    tours.length === 0 || opponentPlaysCount.length === 1 || opponentPlaysCount[0].count < opponentPlaysCount[1].count;


const playersWithScoreToPlayerHeuristic = (player: Player): PlayerHeuristic => ({nom: player.nom, heuristic: 1})

const playersMatchCountToPlayerHeuristic = (players: PlayerMatchCount[]): PlayerHeuristic[] =>
    players.map((playerMathchCount: PlayerMatchCount): PlayerHeuristic => ({
        nom: playerMathchCount.nom,
        heuristic: playerMathchCount.count
    }))
const updatePlayerMatchCount = (matchesPerPlayer: PlayerMatchCount[], matchPerPlayerIndex: number): PlayerMatchCount[] =>
    matchesPerPlayer.map((matchPerPlayer: PlayerMatchCount, index: number) =>
        index === matchPerPlayerIndex
            ? {
                ...matchPerPlayer,
                count: matchPerPlayer.count + 1
            }
            : matchPerPlayer
    );


const initPlayerMatchCount = (matchesPerPlayer: PlayerMatchCount[], playerName: string): PlayerMatchCount[] => [
    ...matchesPerPlayer,
    {
        nom: playerName,
        count: 0
    }
];


const initOrUpdatePlayerMatchCount = (matchPerPlayerIndex: any, matchesPerPlayer: PlayerMatchCount[], playerName: string): PlayerMatchCount[] =>
    matchPerPlayerIndex === -1
        ? initPlayerMatchCount(matchesPerPlayer, playerName)
        : updatePlayerMatchCount(matchesPerPlayer, matchPerPlayerIndex);

const extractPlayerSoHeCannotPlayAgainstHimself = (playerThatPlayedLeast: string) => (nom: string): boolean =>
    playerThatPlayedLeast !== nom;

const withAllPlayersFromAllPreviousTours = (tours: Tour<Ready>[]) =>
    tours.flatMap((matchResults: MatchResult<Ready>[]) =>
        matchResults.flatMap(([playerResult1, playerResult2]: [PlayerResult<Ready>, PlayerResult<Ready>]): string[] => [
            playerResult1.nom,
            playerResult2.nom
        ])
    );

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

const opponentThatPlayedMoreThanOthers = (minimalPlayedCount: number) => (playerMatchCount: PlayerMatchCount): boolean =>
    playerMatchCount.count !== minimalPlayedCount;


const listOfPlayersThatPlayedLeast = (opponentPlaysCount: PlayerMatchCount[], playerThatPlayedLeast: string): string[] => [
    ...opponentPlaysCount.filter(opponentThatPlayedMoreThanOthers(opponentPlaysCount[0].count)).map(toPlayerName),
    playerThatPlayedLeast
];
const opponentThatLeastPlayedAgainstPlayer = (playerThatPlayedLeast: string, tourInProgress: TourInProgress): PlayerHeuristic[] => {
    const withoutPlayer: (nom: string) => boolean = extractPlayerSoHeCannotPlayAgainstHimself(playerThatPlayedLeast);
    const opponentPlaysCount: PlayerMatchCount[] = tourInProgress.availablePlayers
        .map(toPlayerName)
        .concat(withAllPlayersFromAllPreviousTours(tourInProgress.previousTours))
        .filter(extractOpponentsFromParallelMatches(tourInProgress.matchesInProgress))
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

const makeMatchResult = (playerName: string, tourInProgress: TourInProgress): MatchResult<ToProcess> => [
    makePlayerResult(playerName),
    makePlayerResult(
        selectFromHeuristic(
            opponentWithNearestLevel(opponentThatLeastPlayedAgainstPlayer(playerName, tourInProgress), playerName, tourInProgress))
    )
];

const possibleMatchesCountInTour = (players: Player[], fieldCount: number) => Math.min(playersPairs(players), fieldCount);

const byPlayerMatchCount = (playerMatchCount1: PlayerMatchCount, playerMatchCount2: PlayerMatchCount): number =>
    playerMatchCount1.count - playerMatchCount2.count;

const toPlayerMatchCount = (matchesPerPlayer: PlayerMatchCount[], playerName: string): PlayerMatchCount[] =>
    initOrUpdatePlayerMatchCount(
        matchesPerPlayer.findIndex((matchPerPlayer: PlayerMatchCount) => matchPerPlayer.nom === playerName),
        matchesPerPlayer,
        playerName
    );

const extractOpponentsFromParallelMatches =
    (matchResults: MatchResult<ToProcess>[]) =>
        (opponentName: string): boolean =>
            !matchResults
                .flatMap(([playerResult1, playerResult2]: [PlayerResult<ToProcess>, PlayerResult<ToProcess>]) => [playerResult1.nom, playerResult2.nom])
                .includes(opponentName);
const withToursPlayersNames = (matchResults: MatchResult<Ready>[]): string[] =>
    matchResults.flatMap((matchResult) => [matchResult[0].nom, matchResult[1].nom]);
const playerThatLeastPlayedInPreviousTours = (tourInProgress: TourInProgress): string =>
    tourInProgress.availablePlayers
        .map(toPlayerName)
        .concat(tourInProgress.previousTours.flatMap((tour: Tour<Ready>) => withToursPlayersNames(tour)))
        .filter(extractOpponentsFromParallelMatches(tourInProgress.matchesInProgress))
        .reduce(toPlayerMatchCount, [])
        .sort(byPlayerMatchCount)[0].nom;

const ByMatchPlayedFrequency = (players: Player[], previousTours: Tour<Ready>[], fieldCount: number): Tour<ToProcess> => new Array(possibleMatchesCountInTour(players, fieldCount))
    .fill(0)
    .reduce(
        (tourInProgress: TourInProgress): TourInProgress =>
            updateTourInProgress(
                tourInProgress,
                makeMatchResult(playerThatLeastPlayedInPreviousTours(tourInProgress), tourInProgress)
            ),
        {matchesInProgress: [], availablePlayers: players, previousTours: previousTours}
    ).matchesInProgress;

const addMatches = ({players, tours}: Session<Ready>, fieldCount: number): Tour<ToProcess> =>
    ByMatchPlayedFrequency(players, tours, fieldCount)

export const addTourToSession = (session: Session<Ready>, fieldCount: number): Session<ToProcess> => ({
    players: session.players,
    tours: [...session.tours, addMatches(session, fieldCount)]
})