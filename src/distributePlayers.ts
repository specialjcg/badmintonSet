import {byPlayerMatchCount, Player, playersPairs, toPlayerMatchCount, toPlayerName} from "./player";
import {TourInProgress} from "./tourInProgress";
import {Ready, ToProcess, Tour} from "./session";
import {MatchResult, NotPlayed, PlayerResult} from "./score";
import {applyStrategies} from "./heuristic";

const possibleMatchesCountInTour = (players: Player[], fieldCount: number) => Math.min(playersPairs(players), fieldCount);

const isNotInPreviousMatch =
    (match: [PlayerResult<ToProcess>, PlayerResult<ToProcess>]) =>
        (player: Player): boolean =>
            !match.map(toPlayerName).includes(player.nom);

const updateTourInProgress = (tourInProgress: TourInProgress, match: [PlayerResult<ToProcess>, PlayerResult<ToProcess>]): TourInProgress => ({
    matchesInProgress: [...tourInProgress.matchesInProgress, match],
    availablePlayers: tourInProgress.availablePlayers.filter(isNotInPreviousMatch(match)),
    previousTours: tourInProgress.previousTours
});

const makePlayerResult = (nom: string): PlayerResult<ToProcess> => ({
    nom: nom,
    score: NotPlayed
});

const onlyAvailableOpponents =
    (matchResults: MatchResult<ToProcess>[]) =>
        (opponentName: string): boolean =>
            !matchResults
                .flatMap(([playerResult1, playerResult2]: [PlayerResult<ToProcess>, PlayerResult<ToProcess>]) => [playerResult1.nom, playerResult2.nom])
                .includes(opponentName);

const makeMatchResult = (playerName: string, tourInProgress: TourInProgress): MatchResult<ToProcess> => [
    makePlayerResult(playerName),
    makePlayerResult(applyStrategies(playerName, tourInProgress))
];

const withToursPlayersNames = (matchResults: MatchResult<Ready>[]): string[] =>
    matchResults.flatMap((matchResult) => [matchResult[0].nom, matchResult[1].nom]);

const playerThatLeastPlayedInPreviousTours = (tourInProgress: TourInProgress): string =>
    tourInProgress.availablePlayers
        .map(toPlayerName)
        .concat(tourInProgress.previousTours.flatMap((tour: Tour<Ready>) => withToursPlayersNames(tour)))
        .filter(onlyAvailableOpponents(tourInProgress.matchesInProgress))
        .reduce(toPlayerMatchCount, [])
        .sort(byPlayerMatchCount)[0].nom;

export const nextTour = (players: Player[], previousTours: Tour<Ready>[], fieldCount: number): Tour<ToProcess> => new Array(possibleMatchesCountInTour(players, fieldCount))
    .fill(0)
    .reduce(
        (tourInProgress: TourInProgress): TourInProgress =>
            updateTourInProgress(
                tourInProgress,
                makeMatchResult(playerThatLeastPlayedInPreviousTours(tourInProgress), tourInProgress)
            ),
        {matchesInProgress: [], availablePlayers: players, previousTours: previousTours}
    ).matchesInProgress;