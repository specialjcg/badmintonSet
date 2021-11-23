const createMatch = (
  field: Field,
  player1: ServerPlayer,
  player2: ReceiverPlayer
): Match => ({ field, player1, player2 });

type ServerPlayer = {};
type ReceiverPlayer = {};

type Match = {
  field: Field;
  player1: ServerPlayer;
  player2: ReceiverPlayer;
};

type Field = {};

describe("match", () => {
  it("should create a match with 2 players", () => {
    const field: Field = {};
    const player1: ServerPlayer = {};
    const player2: ReceiverPlayer = {};

    const match: Match = createMatch(field, player1, player2);

    expect(match).toStrictEqual({ field, player1, player2 });
  });
});
