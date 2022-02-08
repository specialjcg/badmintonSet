type Level = number;

type Player = { nom: string; level: Level };

type Match<T extends Double | Simple = Double | Simple> = {
  players: T;
};

type Simple = [Player, Player];

type Double = [Player, Player, Player, Player];

type MatchWithOnlyServerPlayer = (player2: Player) => Match<Simple>;

const createMatch: (player1: Player) => MatchWithOnlyServerPlayer =
  (player1: Player): MatchWithOnlyServerPlayer =>
  (player2: Player): Match<Simple> =>  ({
    players: [player1, player2]
  });

const isEven = (index: number): boolean => index % 2 === 0;

const addMatch: (
  matches: Match<Simple>[],
  serverPlayer: Player,
  receiverPlayer: Player
) => Match<Simple>[] = (
  matches: Match<Simple>[],
  serverPlayer: Player,
  receiverPlayer: Player
): Match<Simple>[] => [...matches, createMatch(serverPlayer)(receiverPlayer)];

const createPlayerSimpleMatch = (listPlayer: Player[]): Match<Simple>[] =>
  listPlayer.reduce(
    (
      matches: Match<Simple>[],
      serverPlayer: Player,
      index: number,
      playersToSplit: Player[]
    ): Match<Simple>[] => (isEven(index)
      ? addMatch(
        matches,
        serverPlayer,
        playersToSplit[index + 1]
      )
      : matches),
    []
  );

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const createDoubleMatch = (playersToSplit: Player[], index: number): Match<Double> => ({
  players: playersToSplit.slice(index, index + 4)
}) as Match<Double>;

const addDoubleMatches = (matches: Match<Double>[], playersToSplit: Player[], index: number): Match<Double>[] => [
  ...matches,
  createDoubleMatch(playersToSplit, index)
];

const isMultipleOfFour = (index: number): boolean => index % 4 === 0;

const createPlayerDoubleMatch = (listPlayer: Player[]): Match<Double>[] => listPlayer.reduce(
  (
    matches: Match<Double>[],
    player: Player,
    index: number,
    playersToSplit: Player[]
  ) => (isMultipleOfFour(index) ? addDoubleMatches(matches, playersToSplit, index) : matches), []);

const selectPlayersForSimpleMatches = (listPlayer: Player[], availableFieldsCount: number): Player[] =>
  listPlayer.slice(0, availableFieldsCount * 2);


const selectPlayersForDoubleMatches = (listPlayer: Player[], availableFieldsCount: number): Player[] =>
  listPlayer.slice(0, availableFieldsCount * 4);

const createPlayerMatch = (
  listPlayer: Player[],
  availableFieldsCount: number,
  preferDouble: boolean = false
): Match[] => (preferDouble ? createPlayerDoubleMatch(selectPlayersForDoubleMatches(listPlayer, availableFieldsCount)) : createPlayerSimpleMatch(selectPlayersForSimpleMatches(listPlayer, availableFieldsCount)))

const sortByHighestLevel = (listPlayer: Player[]): Player[] => listPlayer.sort((player1: Player, player2: Player): number => player2.level - player1.level);

const pollPlayer = (listPlayer: Player[]): { playersInGame: Player[]; standbyPlayers: Player[] } => {
  const listPlayerSorted: Player[] = sortByHighestLevel(listPlayer);

  if (isEven(listPlayerSorted.length)) {
    return {
      playersInGame: listPlayerSorted,
      standbyPlayers: []
    };
  }

  return {
    playersInGame: [...listPlayerSorted].splice(0, listPlayerSorted.length - 1),
    standbyPlayers: [listPlayerSorted[listPlayerSorted.length - 1]]
  };
}

describe("match", (): void => {
  it("should create a match with 2 players", (): void => {
    const player1: Player = { level:0, nom: "jeanne" };
    const player2: Player = { level:0, nom: "serge" };
    const match: Match = createMatch(player1)(player2);

    expect(match).toStrictEqual({ players: [player1, player2] });
  });

  it("should create a List of tuple of Server/Receiver from playerList", (): void => {
    const player1: Player = { level: 0, nom: "jeanne" };
    const player2: Player = { level: 0, nom: "serge" };
    const match: Match = createMatch(player1)(player2);

    expect(match).toStrictEqual({ players: [player1, player2] });
  });

  it("should create a List of tuple of Server_Receiver from playerList", (): void => {
    const player1: Player = { level: 0, nom: "jeanne" };
    const player2: Player = { level: 0, nom: "serge" };
    const listPlayer: Player[] = [player1, player2];
    const matches: Match[] = createPlayerMatch(listPlayer, 1);
    expect(
      matches
    ).toStrictEqual([
      {

        players: [player1, player2]
      },
    ]);
  });

  it("should create a List of tuple of Server/Receiver from playerList with 4 players", (): void => {
    const player1: Player = { level: 0, nom: "jeanne" };
    const player2: Player = { level: 0, nom: "serge" };
    const player3: Player = { level: 0, nom: "jeannette" };
    const player4: Player = { level: 0, nom: "sergei" };
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
    const player1: Player = { level: 0, nom: "jeanne" };
    const player2: Player = { level: 0, nom: "serge" };
    const player3: Player = { level: 0, nom: "jeannette" };
    const player4: Player = { level: 0, nom: "sergei" };
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
    const player1: Player = { level: 0, nom: "jeanne" };
    const player2: Player = { level: 0, nom: "serge" };

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
    const player1: Player = { level: 0, nom: "jeanne" };
    const player2: Player = { level: 0, nom: "serge" };
    const player3: Player = { level: 0, nom: "jeannette" };
    const player4: Player = { level: 0, nom: "sergei" };

    const listPlayer: Player[] = [player1, player2, player3, player4];
    const matches: Match[] = createPlayerMatch(listPlayer, 1);

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
    const player1: Player = { level: 0, nom: "jeanne" };
    const player2: Player = { level: 0, nom: "serge" };
    const player3: Player = { level: 0, nom: "jeanpaul" };
    const listPlayer: Player[] = [player1, player2, player3];

    const { playersInGame, standbyPlayers }: { playersInGame: Player[]; standbyPlayers: Player[] } = pollPlayer(listPlayer);

    expect(playersInGame).toStrictEqual([player1, player2]);
    expect(standbyPlayers).toStrictEqual([player3]);
  });

  it(`should get 1 field with 4 players without standbyplayer`, (): void => {
    const player1: Player = { level: 0, nom: "jeanne" };
    const player2: Player = { level: 0, nom: "serge" };
    const player3: Player = { level: 0, nom: "jeanpaul" };
    const player4: Player = { level: 0, nom: "alice" };
    const listPlayer: Player[] = [player1, player2, player3, player4];

    const { playersInGame, standbyPlayers }: { playersInGame: Player[]; standbyPlayers: Player[] } = pollPlayer(listPlayer);

    expect(playersInGame).toStrictEqual([player1, player2, player3, player4]);
    expect(standbyPlayers).toStrictEqual([]);
  });

  it("should affect 2 fields for 4 players", (): void => {
    const player1: Player = { level: 0, nom: "jeanne" };
    const player2: Player = { level: 0, nom: "serge" };
    const player3: Player = { level: 0, nom: "jeannette" };
    const player4: Player = { level: 0, nom: "sergei" };
    const player5: Player = { level: 0, nom: "henri" };
    const player6: Player = { level: 0, nom: "alfred" };
    const player7: Player = { level: 0, nom: "jeannette gtr" };
    const player8: Player = { level: 0, nom: "marie" };

    const listPlayer: Player[] = [player1, player2, player3, player4, player5, player6, player7, player8];
    const matches: Match[] = createPlayerMatch(listPlayer, 2, true);

    expect(matches).toStrictEqual([
      {
        players: [
          player1,
          player2,
          player3,
          player4
        ]
      },
      {
        players: [
          player5,
          player6,
          player7,
          player8
        ]
      },
    ]);
  });

  it("should affect 2 fields for 7 players", (): void => {
    const player1: Player = { level: 0, nom: "jeanne" };
    const player2: Player = { level: 0, nom: "serge" };
    const player3: Player = { level: 0, nom: "jeannette" };
    const player4: Player = { level: 0, nom: "sergei" };
    const player5: Player = { level: 0, nom: "henri" };
    const player6: Player = { level: 0, nom: "alfred" };
    const player7: Player = { level: 0, nom: "jeannette gtr" };

    const listPlayer: Player[] = [player1, player2, player3, player4, player5, player6, player7];
    const matches: Match[] = createPlayerMatch(pollPlayer(listPlayer).playersInGame, 2, true);

    expect(matches).toStrictEqual([
      {
        players: [
          player1,
          player2,
          player3,
          player4
        ]
      },
      {
        players: [
          player5,
          player6
        ]
      },
    ]);
  });

  it("should affect 3 fields for 7 players", (): void => {
    const player1: Player = { level: 0, nom: "jeanne" };
    const player2: Player = { level: 0, nom: "serge" };
    const player3: Player = { level: 0, nom: "jeannette" };
    const player4: Player = { level: 0, nom: "sergei" };
    const player5: Player = { level: 0, nom: "henri" };
    const player6: Player = { level: 0, nom: "alfred" };
    const player7: Player = { level: 0, nom: "jeannette gtr" };

    const listPlayer: Player[] = [player1, player2, player3, player4, player5, player6, player7];
    const matches: Match[] = createPlayerMatch(pollPlayer(listPlayer).playersInGame, 3, false);

    expect(matches).toStrictEqual([
      {
        players: [
          player1,
          player2,
        ]
      },
      {
        players: [
          player3,
          player4
        ]
      },
      {
        players: [
          player5,
          player6
        ]
      },
    ]);
  });

  it("should affect 1 fields for 3 players with 2 players with the closest level", (): void => {
    const player1: Player = { level: 9001, nom: "jeanne" };
    const player2: Player = { level: 3, nom: "serge" };
    const player3: Player = { level: 9002, nom: "jeannette"  };


    const listPlayer: Player[] = [player1, player2, player3];
    const matches: Match[] = createPlayerMatch(pollPlayer(listPlayer).playersInGame, 1, false);

    expect(matches).toStrictEqual([
      {
        players: [
          player3,
          player1,
        ]
      }
    ]);
  });

  it("should affect 1 fields for 4 players with the summed level of each team as close as possible", (): void => {
    const player1: Player = { level: 9001, nom: "jeanne" };
    const player2: Player = { level: 3, nom: "serge" };
    const player3: Player = { level: 9002, nom: "jeannette"  };
    const player4: Player = { level: 5, nom: "sergei" };

    const listPlayer: Player[] = [player1, player2, player3, player4];
    const matches: Match[] = createPlayerMatch(pollPlayer(listPlayer).playersInGame, 1, true);

    expect(matches).toStrictEqual([
      {
        players: [
          player1,
          player4,
          player2,
          player3
        ]
      }
    ]);
  });
  /*
   *
   * TODO mettre le niveau
   */
});
