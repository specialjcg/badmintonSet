type ServerPlayer = object;
type ReceiverPlayer = object;

type Match = {
  field: Field;
  player1: ServerPlayer;
  player2: ReceiverPlayer;
};
type Players = {
  player1: ServerPlayer;
  player2: ReceiverPlayer;
};
type Field = object;

const createMatch =
  (player1: ServerPlayer) =>
  (player2: ReceiverPlayer) =>
  (field: Field): Match => ({
    field,
    player1,
    player2,
  });

type Player = object;

function isEven(index: number) {
  return index % 2 === 0;
}

function addMatchWithoutField(
  matchesWithoutField: ((field: Field) => Match)[],
  serverPlayer: Player,
  receiverPlayer: Player
) {
  return [...matchesWithoutField, createMatch(serverPlayer)(receiverPlayer)];
}

function createPlayerMatch(listPlayer: Player[]): ((field: Field) => Match)[] {
  return listPlayer.reduce(
    (
      matchesWithoutField: ((field: Field) => Match)[],
      serverPlayer,
      index: number,
      playersToSplit: Player[]
    ) => {
      return isEven(index)
        ? addMatchWithoutField(
            matchesWithoutField,
            serverPlayer,
            playersToSplit[index + 1]
          )
        : matchesWithoutField;
    },
    []
  );

  // let result: ((field: Field) => Match)[] = [];
  // for (let i = 0; i < listPlayer.length; i += 2) {
  //   result = [...result, createMatch(listPlayer[i])(listPlayer[i + 1])];
  // }
  // return result;
}

describe("match", () => {
  it("should create a match with 2 players", () => {
    const player1: ServerPlayer = {};
    const player2: ReceiverPlayer = {};
    const field: Field = {};
    const match = createMatch(player1)(player2)(field);

    expect(match).toStrictEqual({ field, player1, player2 });
  });
  it("should create a List of tuple of Server/Receiver from playerList", () => {
    const listPlayer: Player[] = [{}, {}];
    const player1: ServerPlayer = {};
    const player2: ReceiverPlayer = {};
    const field: Field = {};
    const matchesWithoutField = createPlayerMatch(listPlayer);
    expect(
      matchesWithoutField.map((matchWithoutfield) => matchWithoutfield(field))
    ).toStrictEqual([
      {
        field,
        player1,
        player2,
      },
    ]);
  });
  it("should create a List of tuple of Server/Receiver from playerList with 4 players", () => {
    const listPlayer: Player[] = [{}, {}, {}, {}];
    const player1: ServerPlayer = {};
    const player2: ReceiverPlayer = {};
    const player3: ServerPlayer = {};
    const player4: ReceiverPlayer = {};
    const field: Field = {};
    const matchesWithoutField = createPlayerMatch(listPlayer);
    expect(
      matchesWithoutField.map((matchWithoutfield) => matchWithoutfield(field))
    ).toStrictEqual([
      {
        field,
        player1,
        player2,
      },
      {
        field,
        player1: player3,
        player2: player4,
      },
    ]);
  });
  //TODO mettre en place les eslint /prettier
  //TODO voir aux nombre limite de terrain
  //TODO mettre le niveau  et au besoin le nom (cosmétique)
});
