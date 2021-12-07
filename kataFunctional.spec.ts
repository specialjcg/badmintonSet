type Player = { nom: string };

type ServerPlayer = Player;
type ReceiverPlayer = Player;

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

const addMatchWithoutField = (
  matchesWithoutField: ((field: Field) => Match)[],
  serverPlayer: Player,
  receiverPlayer: Player
) => [...matchesWithoutField, createMatch(serverPlayer)(receiverPlayer)];

const createPlayerMatch = (
  listPlayer: Player[]
): ((field: Field) => Match)[] => {
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
};

const assignFields = (
  fields: Field[],
  matchesWithoutField: ((field: Field) => Match)[]
): Match[] => {
  if (fields.length <= matchesWithoutField.length) {
    return fields.map((field, index) => matchesWithoutField[index](field));
  }
  return matchesWithoutField.map((matchWithoutField, index) =>
    matchWithoutField(fields[index])
  );
};

describe("match", () => {
  it("should create a match with 2 players", () => {
    const player1: ServerPlayer = { nom: "jeanne" };
    const player2: ReceiverPlayer = { nom: "serge" };
    const field: Field = {};
    const match = createMatch(player1)(player2)(field);

    expect(match).toStrictEqual({ field, player1, player2 });
  });
  it("should create a List of tuple of Server/Receiver from playerList", () => {
    const player1: ServerPlayer = { nom: "jeanne" };
    const player2: ReceiverPlayer = { nom: "serge" };
    const field: Field = {};
    const match = createMatch(player1)(player2)(field);

    expect(match).toStrictEqual({ field, player1, player2 });
  });
  it("should create a List of tuple of Server/Receiver from playerList", () => {
    const player1: ServerPlayer = { nom: "jeanne" };
    const player2: ReceiverPlayer = { nom: "serge" };
    const field: Field = {};
    const listPlayer: Player[] = [player1, player2];
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
    const player1: ServerPlayer = { nom: "jeanne" };
    const player2: ReceiverPlayer = { nom: "serge" };
    const player3: ServerPlayer = { nom: "jeannette" };
    const player4: ReceiverPlayer = { nom: "sergei" };
    const listPlayer: Player[] = [player1, player2, player3, player4];
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
  it("should affect distinct fields to  players without fields", (): void => {
    const player1: ServerPlayer = { nom: "jeanne" };
    const player2: ReceiverPlayer = { nom: "serge" };
    const player3: ServerPlayer = { nom: "jeannette" };
    const player4: ReceiverPlayer = { nom: "sergei" };
    const listPlayer: Player[] = [player1, player2, player3, player4];
    const field1: Field = {};
    const field2: Field = {};
    const fields: Field[] = [field1, field2];
    const matchesWithoutField = createPlayerMatch(listPlayer);

    const matches = assignFields(fields, matchesWithoutField);

    expect(matches).toStrictEqual([
      {
        field: field1,
        player1,
        player2,
      },
      {
        field: field2,
        player1: player3,
        player2: player4,
      },
    ]);
  });
  it("should affect distinct fields to  players without fields when less players than fields", (): void => {
    const player1: ServerPlayer = { nom: "jeanne" };
    const player2: ReceiverPlayer = { nom: "serge" };

    const listPlayer: Player[] = [player1, player2];
    const field1: Field = {};
    const field2: Field = {};
    const fields: Field[] = [field1, field2];
    const matchesWithoutField = createPlayerMatch(listPlayer);

    const matches = assignFields(fields, matchesWithoutField);

    expect(matches).toStrictEqual([
      {
        field: field1,
        player1,
        player2,
      },
    ]);
  });
  it("should affect distinct fields to  players without fields when less fields than players", (): void => {
    const player1: ServerPlayer = { nom: "jeanne" };
    const player2: ReceiverPlayer = { nom: "serge" };
    const player3: ServerPlayer = { nom: "jeannette" };
    const player4: ReceiverPlayer = { nom: "sergei" };

    const listPlayer: Player[] = [player1, player2, player3, player4];
    const field1: Field = {};
    const fields: Field[] = [field1];
    const matchesWithoutField = createPlayerMatch(listPlayer);

    const matches = assignFields(fields, matchesWithoutField);

    expect(matches).toStrictEqual([
      {
        field: field1,
        player1,
        player2,
      },
    ]);
  });
  //TODO mettre en place les eslint /prettier à voir prochaine session
  //TODO voir aux nombre limite de terrain
  //TODO mettre le niveau  et au besoin le nom (cosmétique)
});
