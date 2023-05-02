import { Win, StrongWin } from './score'

type Level = number;

export type Player = { nom: string; level: Level };

export type PlayerMatchCount = {
    nom: string;
    count: number;
};

export type Winner = {
    nom: string;
    score: typeof Win | typeof StrongWin;
}

export const makePlayer = (level: number, nom: string): Player => ({level, nom});

export const playersPairs = (players: Player[]) => players.length / 2;