import {Player, playersPairs, toPlayerName} from "./player";
import {TourInProgress} from "./tourInProgress";
import {Ready, ToProcess, Tour} from "./session";
import {MatchResult, NotPlayed, PlayerResult} from "./score";
import {playerThatLeastPlayedInPreviousToursStrategy} from "./strategies/player/leastPlayedInPreviousToursStrategy";
import {opponentWithNearestLevelStrategy} from "./strategies/opponent/withNearestLevelStrategy";
import {opponentThatLeastPlayedAgainstPlayerStrategy} from "./strategies/opponent/leastPlayedAgainstPlayerStrategy";
import {OpponentHeuristic, OpponentStrategy, PlayerStrategy} from "./strategies/opponent/heuristic";

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

export const makeMatchResult = (playerStrategy: PlayerStrategy, opponentStrategies: OpponentStrategy[], tourInProgress: TourInProgress): MatchResult<ToProcess> => {
    const playerName: string = playerStrategy(tourInProgress);

    return [
        makePlayerResult(playerName),
        makePlayerResult(opponentStrategies.reduce((opponentHeuristics: OpponentHeuristic[], opponentStrategy: OpponentStrategy): OpponentHeuristic[] => {
            return opponentStrategy(opponentHeuristics, playerName, tourInProgress);
        }, [])[0].nom)
    ]
}

export const makeMatchResult1 = (playerStrategy: PlayerStrategy, opponentStrategies: OpponentStrategy[], tourInProgress: TourInProgress): MatchResult<ToProcess> => {
    const playerName: string = playerStrategy(tourInProgress);

    return [
        makePlayerResult(playerName),
        makePlayerResult(
            selectFromHeuristic(opponentStrategies
                .flatMap(toAppliedOpponentStrategies(playerName, tourInProgress))
                .reduce(toMergedOpponentHeuristics, [])
            )
        )
    ]
}

export const nextTour = (players: Player[], previousTours: Tour<Ready>[], fieldCount: number): Tour<ToProcess> => new Array(possibleMatchesCountInTour(players, fieldCount))
    .fill(0)
    .reduce(
        (tourInProgress: TourInProgress): TourInProgress =>
            updateTourInProgress(
                tourInProgress,
                makeMatchResult(playerThatLeastPlayedInPreviousToursStrategy, [opponentThatLeastPlayedAgainstPlayerStrategy, opponentWithNearestLevelStrategy], tourInProgress)
            ),
        {matchesInProgress: [], availablePlayers: players, previousTours: previousTours}
    ).matchesInProgress;