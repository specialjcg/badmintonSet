import {Player} from "./player";
import {Ready, ToProcess, Tour} from "./session";

export type TourInProgress = {
    matchesInProgress: Tour<ToProcess>;
    availablePlayers: Player[];
    previousTours: Tour<Ready>[];
};