import {OpponentStrategy, PlayerStrategy} from "./strategies/opponent/heuristic";
import {MatchResult, NotPlayed} from "./score";
import { ToProcess} from "./session";
import {TourInProgress} from "./tourInProgress";
import {makeMatchResult1} from "./distributePlayers";

describe('distribute player', function () {
    it('should select only opponent', function () {
        const Progress: TourInProgress = {
            matchesInProgress: [],
            availablePlayers: [],
            previousTours: []
        };
        const playerStrategy: PlayerStrategy = () => 'Serge';
        const opponentStrategies: OpponentStrategy[] = [
            () => [{
                nom: 'Jeanne',
                heuristic: 0
            }]
        ]

        const matchResult: MatchResult<ToProcess> = makeMatchResult1(playerStrategy, opponentStrategies, Progress);

        expect(matchResult).toStrictEqual([
            {nom: 'Serge', score: NotPlayed},
            {nom: 'Jeanne', score: NotPlayed}
        ]);
    });

    it('should select opponent with highest heuristic', function () {
        const Progress: TourInProgress = {
            matchesInProgress: [],
            availablePlayers: [],
            previousTours: []
        };
        const playerStrategy: PlayerStrategy = () => 'Serge';
        const opponentStrategies: OpponentStrategy[] = [
            () => [
                {
                    nom: 'Jeanne',
                    heuristic: 0
                },
                {
                    nom: 'Monique',
                    heuristic: 1
                }
            ]
        ]

        const matchResult: MatchResult<ToProcess> = makeMatchResult1(playerStrategy, opponentStrategies, Progress);

        expect(matchResult).toStrictEqual([
            {nom: 'Serge', score: NotPlayed},
            {nom: 'Monique', score: NotPlayed}
        ]);
    });
});