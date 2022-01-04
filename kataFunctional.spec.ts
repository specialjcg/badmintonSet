type Player = { nom: string };

type ServerPlayer = Player;
type ReceiverPlayer = Player;

type Match = {
  field: Field;
  player1: ServerPlayer;
  player2: ReceiverPlayer;
};

type Field = object;

type MatchWithoutField = (field: Field) => Match;

type MatchWithOnlyServerPlayer = (player2: ReceiverPlayer) => MatchWithoutField;

const createMatch: (player1: ServerPlayer) => MatchWithOnlyServerPlayer =
  (player1: ServerPlayer): MatchWithOnlyServerPlayer =>
  (player2: ReceiverPlayer): MatchWithoutField =>
  (field: Field): Match => ({
    field,
    player1,
    player2,
  });

const isEven = (index: number): boolean => index % 2 === 0;

const addMatchWithoutField: (
  matchesWithoutField: MatchWithoutField[],
  serverPlayer: Player,
  receiverPlayer: Player
) => MatchWithoutField[] = (
  matchesWithoutField: MatchWithoutField[],
  serverPlayer: Player,
  receiverPlayer: Player
): MatchWithoutField[] => [...matchesWithoutField, createMatch(serverPlayer)(receiverPlayer)];

const createPlayerMatch = (
  listPlayer: Player[]
): ((field: Field) => Match)[] =>
   listPlayer.reduce(
    (
      matchesWithoutField: MatchWithoutField[],
      serverPlayer:Player,
      index: number,
      playersToSplit: Player[]
    ): MatchWithoutField[] => (isEven(index)
        ? addMatchWithoutField(
            matchesWithoutField,
            serverPlayer,
            playersToSplit[index + 1]
          )
        : matchesWithoutField),
    []
  );

const buildMatchesWhenLessFieldsThanPlayers = (matchesWithoutField: MatchWithoutField[], fields: Field[]): Match[] =>
  fields.map((field: Field, index: number): Match =>
    matchesWithoutField[index](field));

const buildMatchesWhenLessPlayersThanFields = (matchesWithoutField: MatchWithoutField[], fields: Field[]): Match[] =>
  matchesWithoutField.map((matchWithoutField: MatchWithoutField, index: number): Match =>
    matchWithoutField(fields[index]));

const hasLessFieldsThanPlayers = (fields: Field[], matchesWithoutField: MatchWithoutField[]): boolean =>
  fields.length <= matchesWithoutField.length;

const assignFields = (
  fields: Field[],
  matchesWithoutField: MatchWithoutField[]
): Match[] =>
  (hasLessFieldsThanPlayers(fields, matchesWithoutField) ?
    buildMatchesWhenLessFieldsThanPlayers(matchesWithoutField, fields) :
    buildMatchesWhenLessPlayersThanFields(matchesWithoutField, fields));

const pollPlayer = (listPlayer: Player[]): { playersInGame: Player[]; standbyPlayers: Player[] } => {
  if (isEven(listPlayer.length)) {
    return {
      playersInGame: listPlayer,
      standbyPlayers: []
    };
  }

  return {
    playersInGame: [...listPlayer].splice(0,listPlayer.length-1),
    standbyPlayers: [listPlayer[listPlayer.length - 1]]
  };

}

describe("match", (): void => {
  it("should create a match with 2 players", (): void => {
    const player1: ServerPlayer = { nom: "jeanne" };
    const player2: ReceiverPlayer = { nom: "serge" };
    const field: Field = {};
    const match: Match = createMatch(player1)(player2)(field);

    expect(match).toStrictEqual({ field, player1, player2 });
  });
  it("should create a List of tuple of Server/Receiver from playerList", (): void => {
    const player1: ServerPlayer = { nom: "jeanne" };
    const player2: ReceiverPlayer = { nom: "serge" };
    const field: Field = {};
    const match: Match = createMatch(player1)(player2)(field);

    expect(match).toStrictEqual({ field, player1, player2 });
  });

  it("should create a List of tuple of Server/Receiver from playerList", (): void => {
    const player1: ServerPlayer = { nom: "jeanne" };
    const player2: ReceiverPlayer = { nom: "serge" };
    const field: Field = {};
    const listPlayer: Player[] = [player1, player2];
    const matchesWithoutField: MatchWithoutField[] = createPlayerMatch(listPlayer);
    expect(
      matchesWithoutField.map((matchWithoutField: MatchWithoutField): Match => matchWithoutField(field))
    ).toStrictEqual([
      {
        field,
        player1,
        player2,
      },
    ]);
  });

  it("should create a List of tuple of Server/Receiver from playerList with 4 players", (): void => {
    const player1: ServerPlayer = { nom: "jeanne" };
    const player2: ReceiverPlayer = { nom: "serge" };
    const player3: ServerPlayer = { nom: "jeannette" };
    const player4: ReceiverPlayer = { nom: "sergei" };
    const listPlayer: Player[] = [player1, player2, player3, player4];
    const field: Field = {};
    const matchesWithoutField: MatchWithoutField[] = createPlayerMatch(listPlayer);
    expect(
      matchesWithoutField.map((matchWithoutField: MatchWithoutField): Match => matchWithoutField(field))
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
    const matchesWithoutField: MatchWithoutField[] = createPlayerMatch(listPlayer);

    const matches : Match[] = assignFields(fields, matchesWithoutField);

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
    const matchesWithoutField: MatchWithoutField[] = createPlayerMatch(listPlayer);

    const matches : Match[] = assignFields(fields, matchesWithoutField);

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
    const matchesWithoutField: MatchWithoutField[] = createPlayerMatch(listPlayer);

    const matches : Match[] = assignFields(fields, matchesWithoutField);

    expect(matches).toStrictEqual([
      {
        field: field1,
        player1,
        player2,
      },
    ]);
  });

  it(`should split listplayer in to playeringame and standyplayer with 3 players`, (): void => {
    const player1: ServerPlayer = { nom: "jeanne" };
    const player2: ReceiverPlayer = { nom: "serge" };
    const player3: ServerPlayer = { nom: "jeanpaul" };
    const listPlayer: Player[] = [player1, player2, player3];

    const { playersInGame, standbyPlayers }: { playersInGame: Player[]; standbyPlayers: Player[] } = pollPlayer(listPlayer);

    expect(playersInGame).toStrictEqual([player1, player2]);
    expect(standbyPlayers).toStrictEqual([player3]);
  });

  it(`should get 1 field with 4 players without standbyplayer`, (): void => {
    const player1: ServerPlayer = { nom: "jeanne" };
    const player2: ReceiverPlayer = { nom: "serge" };
    const player3: ServerPlayer = { nom: "jeanpaul" };
    const player4: ServerPlayer = { nom: "alice" };
    const listPlayer: Player[] = [player1, player2, player3, player4];

    const { playersInGame, standbyPlayers }: { playersInGame: Player[]; standbyPlayers: Player[] } = pollPlayer(listPlayer);

    expect(playersInGame).toStrictEqual([player1, player2, player3, player4]);
    expect(standbyPlayers).toStrictEqual([]);
  });

  // TODO 1 field 4 players 4 players  play
  // TODO 2 field 5 players soit 4 players play on field1 and 1 standby or 2 on field 1 and 2 on field 2 and 1 standby
  // TODO another player on standby

  // TODO voir aux nombre limite de terrain on peut ajouter les terrains au fur et a mesure peu d'interet
  // TODO mettre le niveau
});
