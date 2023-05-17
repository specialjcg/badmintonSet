import {Player} from "./player";
import {matchLevelForPlayer, MatchResult} from "./score";
import { Ready, Session} from "./session";

const addMatchResultToLevelFor = (player: Player) => (level: number, matchResult: MatchResult<Ready>) =>
    level + matchLevelForPlayer(player.nom, matchResult);

export const computeLevels = (session: Session<Ready>) => session.players.map((player: Player): Player => ({
        nom: player.nom,
        level: session.tours.flat().reduce(addMatchResultToLevelFor(player), player.level)
    })
);