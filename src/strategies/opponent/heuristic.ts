import {TourInProgress} from "../../tourInProgress";

export type OpponentHeuristic = {
    nom: string;
    heuristic: number;
}

export type OpponentStrategy = (opponentHeuristics: OpponentHeuristic[], playerThatPlayedLeast: string, tourInProgress: TourInProgress) => OpponentHeuristic[]

// todo: move
export type PlayerStrategy = (tourInProgress: TourInProgress) => string