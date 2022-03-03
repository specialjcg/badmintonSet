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

const associateByLevel = (listPlayer: Player[]) => {
  const lowLevel = listPlayer.slice(0, listPlayer.length / 2);
  const topLevel = listPlayer.slice(listPlayer.length / 2, listPlayer.length).reverse();

  let newListPlayer: Player[] = [];

  for (let i = 0; i < lowLevel.length; i++) {
    newListPlayer.push(topLevel[i]);
    newListPlayer.push(lowLevel[i]);
  }

  return newListPlayer;
};

const removeLastPlayer = (listPlayerSorted: Player[]): PlayerPools =>
  (isEven(listPlayerSorted.length) ? ({
    playersInGame: associateByLevel(listPlayerSorted),
    standbyPlayers: []
  }) : ({
    playersInGame: associateByLevel([...listPlayerSorted].slice(0, listPlayerSorted.length - 1)),
    standbyPlayers: [listPlayerSorted[listPlayerSorted.length - 1]]
  }));

const removeWeakestPlayerStrategy = (listPlayer: Player[]): PlayerPools =>
  removeLastPlayer(sortByHighestLevel(listPlayer));

const removeStrongestPlayerStrategy= (listPlayer: Player[]): PlayerPools =>
  removeLastPlayer(sortByLowestLevel(listPlayer));

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

    const { playersInGame, standbyPlayers }: PlayerPools = removeWeakestPlayerStrategy(listPlayer);

    expect(playersInGame).toStrictEqual([player2, player1]);
    expect(standbyPlayers).toStrictEqual([player3]);
  });

  it(`should get 1 field with 4 players without standbyplayer`, (): void => {
    const player1: Player = { level: 0, nom: "jeanne" };
    const player2: Player = { level: 0, nom: "serge" };
    const player3: Player = { level: 0, nom: "jeanpaul" };
    const player4: Player = { level: 0, nom: "alice" };
    const listPlayer: Player[] = [player1, player2, player3, player4];

    const { playersInGame, standbyPlayers }: PlayerPools = removeWeakestPlayerStrategy(listPlayer);

    expect(playersInGame).toStrictEqual([player4, player1, player3, player2]);
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
    const matches: Match[] = createPlayerMatch(removeWeakestPlayerStrategy(listPlayer).playersInGame, 2, true);

    expect(matches).toStrictEqual([
      {
        players: [
          player6,
          player1,
          player5,
          player2
        ]
      },
      {
        players: [
          player4,
          player3
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
    const matches: Match[] = createPlayerMatch(removeWeakestPlayerStrategy(listPlayer).playersInGame, 3, false);

    expect(matches).toStrictEqual([
      {
        players: [
          player6,
          player1,
        ]
      },
      {
        players: [
          player5,
          player2
        ]
      },
      {
        players: [
          player4,
          player3
        ]
      },
    ]);
  });

  it("should affect 1 fields for 3 players with 2 players with the closest level", (): void => {
    const player1: Player = { level: 9001, nom: "jeanne" };
    const player2: Player = { level: 3, nom: "serge" };
    const player3: Player = { level: 9002, nom: "jeannette"  };


    const listPlayer: Player[] = [player1, player2, player3];
    const matches: Match[] = createPlayerMatch(removeWeakestPlayerStrategy(listPlayer).playersInGame, 1, false);

    expect(matches).toStrictEqual([
      {
        players: [
          player1,
          player3,
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
    const matches: Match[] = createPlayerMatch(removeWeakestPlayerStrategy(listPlayer).playersInGame, 1, true);

    expect(matches).toStrictEqual([
      {
        players: [
          player2,
          player3,
          player4,
          player1,
        ]
      }
    ]);
  });

  it("should affect 2 fields for 8 players with the summed level of each team as close as possible", (): void => {
    const player1: Player = { level: 9001, nom: "jeanne" };
    const player2: Player = { level: 42, nom: "serge" };
    const player3: Player = { level: 902, nom: "jeannette"  };
    const player4: Player = { level: 452, nom: "sergei" };
    const player5: Player = { level: 9001, nom: "henri" };
    const player6: Player = { level: 372, nom: "paul" };
    const player7: Player = { level: 9, nom: "margaux"  };
    const player8: Player = { level: 27, nom: "alfred" };

    const listPlayer: Player[] = [player1, player2, player3, player4, player5, player6, player7, player8];
    const matches: Match[] = createPlayerMatch(removeWeakestPlayerStrategy(listPlayer).playersInGame, 2, true);

    expect(matches).toStrictEqual([
      {
        players: [
          player7,
          player1,
          player8,
          player5,
        ]
      },
      {
        players: [
          player2,
          player3,
          player6,
          player4
        ]
      }
    ]);
  });

  it("should affect 1 fields for 5 players with the summed level of each team as close as possible with 3 weakest players", (): void => {
    const player1: Player = { level: 1, nom: "jeanne" };
    const player2: Player = { level: 9002, nom: "jeannette"  };
    const player3: Player = { level: 9000, nom: "henri"  };
    const player4: Player = { level: 6, nom: "sergei" };
    const player5: Player = { level: 7, nom: "alfred" };

    const listPlayer: Player[] = [player1, player2, player3, player4, player5];
    const matches: Match[] = createPlayerMatch(removeWeakestPlayerStrategy(listPlayer).playersInGame, 1, true);

    expect(matches).toStrictEqual([
      {
        players: [
          player4,
          player2,
          player5,
          player3,
        ]
      }
    ]);
  });
});

/*
 * TODO ExpectMatchesToEqual
 *  const expected = ['Alice', 'Bob'];
 *   it('matches even if received contains additional elements', () => {
 *     expect(['Alice', 'Bob', 'Eve']).toEqual(expect.arrayContaining(expected));
 *   });
 */
