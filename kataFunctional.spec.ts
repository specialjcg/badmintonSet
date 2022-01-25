type Player = { nom: string };

type Match = MatchDouble | MatchSimple

type MatchSimple = {
  players: [Player, Player];
};

type MatchDouble = {
  players: [Player, Player, Player, Player];
};

type MatchWithOnlyServerPlayer = (player2: Player) => Match;

const createMatch: (player1: Player) => MatchWithOnlyServerPlayer =
  (player1: Player): MatchWithOnlyServerPlayer =>
  (player2: Player): Match =>  ({
    players: [player1, player2]
  });

const isEven = (index: number): boolean => index % 2 === 0;

const addMatch: (
  matches: Match[],
  serverPlayer: Player,
  receiverPlayer: Player
) => Match[] = (
  matches: Match[],
  serverPlayer: Player,
  receiverPlayer: Player
): Match[] => [...matches, createMatch(serverPlayer)(receiverPlayer)];

const createPlayerSimpleMatch = ( listPlayer: Player[]): Match[] =>
  listPlayer.reduce(
    (
      matches: Match[],
      serverPlayer: Player,
      index: number,
      playersToSplit: Player[]
    ): Match[] => (isEven(index)
      ? addMatch(
        matches,
        serverPlayer,
        playersToSplit[index + 1]
      )
      : matches),
    []
  );

const createPlayerDoubleMatch = ( listPlayer: Player[]): Match[] => [
  {
    players: [
      listPlayer[0],
      listPlayer[1],
      listPlayer[2],
      listPlayer[3]
    ]
  }
];

const selectPlayersForSimpleMatches = (listPlayer: Player[], availableFieldsCount: number): Player[] =>
  listPlayer.slice(0, availableFieldsCount * 2);

const createPlayerMatch = (
  listPlayer: Player[],
  availableFieldsCount: number,
  preferDouble: boolean = false
): Match[] => (preferDouble ? createPlayerDoubleMatch(listPlayer) : createPlayerSimpleMatch(selectPlayersForSimpleMatches(listPlayer, availableFieldsCount)))

const pollPlayer = (listPlayer: Player[]): { playersInGame: Player[]; standbyPlayers: Player[] } => {
  if (isEven(listPlayer.length)) {
    return {
      playersInGame: listPlayer,
      standbyPlayers: []
    };
  }

  return {
    playersInGame: [...listPlayer].splice(0, listPlayer.length - 1),
    standbyPlayers: [listPlayer[listPlayer.length - 1]]
  };
}

describe("match", (): void => {
  it("should create a match with 2 players", (): void => {
    const player1: Player = { nom: "jeanne" };
    const player2: Player = { nom: "serge" };
    const match: Match = createMatch(player1)(player2);

    expect(match).toStrictEqual({ field, player1, player2 });
  });

  it("should create a List of tuple of Server/Receiver from playerList", (): void => {
    const player1: Player = { nom: "jeanne" };
    const player2: Player = { nom: "serge" };
    const match: Match = createMatch(player1)(player2);

    expect(match).toStrictEqual({ players: [player1, player2] });
  });

  it("should create a List of tuple of Server_Receiver from playerList", (): void => {
    const player1: Player = { nom: "jeanne" };
    const player2: Player = { nom: "serge" };
    const listPlayer: Player[] = [player1, player2];
    const matches: Match[] = createPlayerMatch(listPlayer, 1);
    expect(
      matches
    ).toStrictEqual([
      {
        field,
        player1,
        player2,
      },
    ]);
  });

  it("should create a List of tuple of Server/Receiver from playerList with 4 players", (): void => {
    const player1: Player = { nom: "jeanne" };
    const player2: Player = { nom: "serge" };
    const player3: Player = { nom: "jeannette" };
    const player4: Player = { nom: "sergei" };
    const listPlayer: Player[] = [player1, player2, player3, player4];

    const matches: Match[] = createPlayerMatch(listPlayer, 2);
    expect(
      matches)
    .toStrictEqual([
      {
        players: [
          player1,
          player2
        ]
      },
      {
        players: [
          player3,
          player4
        ]
      },
    ]);
  });

  it("should affect distinct fields to  players without fields", (): void => {
    const player1: Player = { nom: "jeanne" };
    const player2: Player = { nom: "serge" };
    const player3: Player = { nom: "jeannette" };
    const player4: Player = { nom: "sergei" };
    const listPlayer: Player[] = [player1, player2, player3, player4];

    const matches: Match[] = createPlayerMatch(listPlayer, 2);

    expect(matches).toStrictEqual([
      {
        players: [
          player1,
          player2
        ]
      },
      {
        players: [
          player3,
          player4
        ]
      },
    ]);
  });

  it("should affect distinct fields to  players without fields when less players than fields", (): void => {
    const player1: Player = { nom: "jeanne" };
    const player2: Player = { nom: "serge" };

    const listPlayer: Player[] = [player1, player2];

    const matches: Match[] = createPlayerMatch(listPlayer, 1);

    expect(matches).toStrictEqual([
      {
        players: [
          player1,
          player2
        ]
      },
    ]);
  });

  it("should affect distinct fields to players without fields when less fields than players", (): void => {
    const player1: Player = { nom: "jeanne" };
    const player2: Player = { nom: "serge" };
    const player3: Player = { nom: "jeannette" };
    const player4: Player = { nom: "sergei" };

    const listPlayer: Player[] = [player1, player2, player3, player4];
    const field1: Field = {};
    const fields: Field[] = [field1];
    const matchesWithoutField: MatchWithoutField[] = createPlayerMatch(listPlayer);

    const matches : Match[] = assignFields(fields, matchesWithoutField);

    expect(matches).toStrictEqual([
      {
        players:[
          player1,
          player2
        ]
      },
    ]);
  });

  it(`should split listplayer in to playeringame and standyplayer with 3 players`, (): void => {
    const player1: Player = { nom: "jeanne" };
    const player2: Player = { nom: "serge" };
    const player3: Player = { nom: "jeanpaul" };
    const listPlayer: Player[] = [player1, player2, player3];

    const { playersInGame, standbyPlayers }: { playersInGame: Player[]; standbyPlayers: Player[] } = pollPlayer(listPlayer);

    expect(playersInGame).toStrictEqual([player1, player2]);
    expect(standbyPlayers).toStrictEqual([player3]);
  });

  it(`should get 1 field with 4 players without standbyplayer`, (): void => {
    const player1: Player = { nom: "jeanne" };
    const player2: Player = { nom: "serge" };
    const player3: Player = { nom: "jeanpaul" };
    const player4: Player = { nom: "alice" };
    const listPlayer: Player[] = [player1, player2, player3, player4];

    const { playersInGame, standbyPlayers }: { playersInGame: Player[]; standbyPlayers: Player[] } = pollPlayer(listPlayer);

    expect(playersInGame).toStrictEqual([player1, player2, player3, player4]);
    expect(standbyPlayers).toStrictEqual([]);
  });

  /*
   * TODO move selectPlayersForSimpleMatches (same for doubles) in pollPlayer to get standbyPlayers, createPlayerMatch should not be called directly
   *  First I create my pool, I get the playable payers (with specific types) and the standby, now I can call a function that create matches and only accept
   * TODO 1 field 4 players 4 players  play
   * TODO 2 field 5 players soit 4 players play on field1 and 1 standby or 2 on field 1 and 2 on field 2 and 1 standby
   * TODO another player on standby
   */

  /*
   * TODO voir aux nombre limite de terrain on peut ajouter les terrains au fur et a mesure peu d'interet
   * TODO mettre le niveau
   */
});
