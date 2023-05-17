import {Win, StrongWin, MatchResult} from './score'
import {Ready} from "./session";

export const makePlayer = (level: number, nom: string): Player => ({level, nom});

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

export const toPlayerName = (player: { nom: string }): string => player.nom;

export const playersPairs = (players: Player[]) => players.length / 2;

export const isPlayerInMatch = (playerName: string, [player1, player2]: MatchResult<Ready>) =>
    player1.nom === playerName || player2.nom === playerName;

export const byPlayerMatchCount = (playerMatchCount1: PlayerMatchCount, playerMatchCount2: PlayerMatchCount): number =>
    playerMatchCount1.count - playerMatchCount2.count;

const initPlayerMatchCount = (matchesPerPlayer: PlayerMatchCount[], playerName: string): PlayerMatchCount[] => [
    ...matchesPerPlayer,
    {
        nom: playerName,
        count: 0
    }
];

const updatePlayerMatchCount = (matchesPerPlayer: PlayerMatchCount[], matchPerPlayerIndex: number): PlayerMatchCount[] =>
    matchesPerPlayer.map((matchPerPlayer: PlayerMatchCount, index: number) =>
        index === matchPerPlayerIndex
            ? {
                ...matchPerPlayer,
                count: matchPerPlayer.count + 1
            }
            : matchPerPlayer
    );

const initOrUpdatePlayerMatchCount = (matchPerPlayerIndex: any, matchesPerPlayer: PlayerMatchCount[], playerName: string): PlayerMatchCount[] =>
    matchPerPlayerIndex === -1
        ? initPlayerMatchCount(matchesPerPlayer, playerName)
        : updatePlayerMatchCount(matchesPerPlayer, matchPerPlayerIndex)

export const toPlayerMatchCount = (matchesPerPlayer: PlayerMatchCount[], playerName: string): PlayerMatchCount[] =>
    initOrUpdatePlayerMatchCount(
        matchesPerPlayer.findIndex((matchPerPlayer: PlayerMatchCount) => matchPerPlayer.nom === playerName),
        matchesPerPlayer,
        playerName
    );