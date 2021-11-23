type ServerPlayer = {};
type ReceiverPlayer = {};

type Match = {
  field: Field;
  player1: ServerPlayer;
  player2: ReceiverPlayer;
};
type Players = {
  player1: ServerPlayer;
  player2: ReceiverPlayer;
};
type Field = {};

const createMatch =
  (player1: ServerPlayer) =>
  (player2: ReceiverPlayer) =>
  (field: Field): Match => ({
    field,
    player1,
    player2,
  });

describe("match", () => {
  it("should create a match with 2 players", () => {
    const player1: ServerPlayer = {};
    const player2: ReceiverPlayer = {};
    const field: Field = {};
    const match = createMatch(player1)(player2)(field);

    expect(match).toStrictEqual({ field, player1, player2 });
  });
});
