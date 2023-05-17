import {Player} from './player'
import {MatchResult, NotPlayed, PlayerResult} from './score'
import {nextTour} from "./distributePlayers";

export type Ready = 'Ready';

export type ToProcess = 'ToProcess';

export type Status = Ready | ToProcess;

export type Tour<T extends Status> = MatchResult<T>[];

export type Session<T extends Status> = {
    players: Player[];
    tours: T extends Ready ? Tour<Ready>[] : [...Tour<Ready>[], Tour<ToProcess>];
};

export const makeSession = (players: Player[]): Session<Ready> => ({players, tours: []});

export const addTourToSession = (session: Session<Ready>, fieldCount: number): Session<ToProcess> => ({
    players: session.players,
    tours: [...session.tours, nextTour(session.players, session.tours, fieldCount)]
})

export const isSessionReady = (session: Session<Status>): session is Session<Ready> =>
    !session.tours.flat(2).some((playerResult: PlayerResult<Status>) => playerResult.score === NotPlayed)
