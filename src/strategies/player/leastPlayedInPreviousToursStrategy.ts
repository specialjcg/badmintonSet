import {TourInProgress} from "../../tourInProgress";
import {byPlayerMatchCount, toPlayerMatchCount, toPlayerName} from "../../player";
import {Ready, ToProcess, Tour} from "../../session";
import {MatchResult, PlayerResult} from "../../score";

const withToursPlayersNames = (matchResults: MatchResult<Ready>[]): string[] =>
    matchResults.flatMap((matchResult) => [matchResult[0].nom, matchResult[1].nom]);

const onlyAvailableOpponents =
    (matchResults: MatchResult<ToProcess>[]) =>
        (opponentName: string): boolean =>
            !matchResults
                .flatMap(([playerResult1, playerResult2]: [PlayerResult<ToProcess>, PlayerResult<ToProcess>]) => [playerResult1.nom, playerResult2.nom])
                .includes(opponentName);

export const playerThatLeastPlayedInPreviousToursStrategy = (tourInProgress: TourInProgress): string =>
    tourInProgress.availablePlayers
        .map(toPlayerName)
        .concat(tourInProgress.previousTours.flatMap((tour: Tour<Ready>) => withToursPlayersNames(tour)))
        .filter(onlyAvailableOpponents(tourInProgress.matchesInProgress))
        .reduce(toPlayerMatchCount, [])
        .sort(byPlayerMatchCount)[0].nom;