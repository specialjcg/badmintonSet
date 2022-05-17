type Level = number;

type Player = { nom: string; level: Level };
enum MatchScore {
    NotPlayed = 0,
    Lose = 1,
    Win = 2,
    StrongWin = 3
}

const makePlayer = (level: number, nom: string): Player => ({level, nom});

type MatchResult = {
    [playerName: string]: MatchScore
}

type Session = {
    players: Player[],
    tours: MatchResult[]
};

type PlayerMatchCount = {
    nom: string;
    count: number;
}

const makeSession = (players: Player[]): Session => ({players, tours: []});

const addTourToSession = (session: Session): Session => ({
    players: session.players,
    tours: [...session.tours, ...addMatches(session)]
});

const byPlayerMatchCount = (playerMatchCount1: PlayerMatchCount, playerMatchCount2: PlayerMatchCount) => playerMatchCount1.count - playerMatchCount2.count;

const toPlayerName = (player:Player) => player.nom;

const withToursPlayersNames = (tours: MatchResult[]) => tours.flatMap(tour => Object.keys(tour));

const toPlayerMatchCount = (matchesPerPlayer: PlayerMatchCount[], playerName: string): PlayerMatchCount[] => {
    const matchPerPlayerIndex = matchesPerPlayer.findIndex((matchPerPlayer: PlayerMatchCount) => matchPerPlayer.nom === playerName);

    if (matchPerPlayerIndex !== -1) {
        matchesPerPlayer[matchPerPlayerIndex].count += 1;
    } else {
        matchesPerPlayer.push({
            nom: playerName,
            count: 0
        });
    }

    return matchesPerPlayer;
};

const groupSuccessivePlayersByTwo = (players: Player[], tours: MatchResult[]) => {
    let matchResults: MatchResult[] = [];

    const playerPriorities = players
        .map(toPlayerName)
        .concat(withToursPlayersNames(tours))
        .reduce(toPlayerMatchCount, [])
        .sort(byPlayerMatchCount);

    matchResults.push({
        [playerPriorities[0].nom]: MatchScore.NotPlayed,
        [playerPriorities[1].nom]: MatchScore.NotPlayed
    });

    return matchResults;
};

const addMatches = ({players, tours}: { players: Player[], tours: MatchResult[] }): MatchResult[] => {
    return groupSuccessivePlayersByTwo(players, tours);
};

describe("construction d'une session d'entrainement", (): void => {
    it("should create a player", (): void => {
        const player = makePlayer(0, "jeanne");

        expect(player).toEqual({level: 0, nom: "jeanne"})
    });

    it("should create a empty session", (): void => {
        const player1 = makePlayer(0, "jeanne");
        const player2 = makePlayer(0, "serge");
        const player3 = makePlayer(0, "jeannette");
        const player4 = makePlayer(0, "sergei");

        const session = makeSession([player1, player2, player3, player4]);

        expect(session).toEqual(
            {
                players: [
                    {level: 0, nom: "jeanne"},
                    {level: 0, nom: "serge"},
                    {level: 0, nom: "jeannette"},
                    {level: 0, nom: "sergei"}
                ],
                tours: []
            })
    });

    it.each([
        [
            makePlayer(0, "jeanne"),
            makePlayer(0, "serge"),
            {
                players: [
                    {level: 0, nom: "jeanne"},
                    {level: 0, nom: "serge"}
                ],
                tours: [
                    {
                        "jeanne": MatchScore.NotPlayed,
                        "serge": MatchScore.NotPlayed
                    }
                ]
            }
        ],
        [
            makePlayer(0, "jeannette"),
            makePlayer(0, "sergei"),
            {
                players: [
                    {level: 0, nom: "jeannette"},
                    {level: 0, nom: "sergei"}
                ],
                tours: [
                    {
                        "jeannette": MatchScore.NotPlayed,
                        "sergei": MatchScore.NotPlayed
                    }
                ]
            }
        ]
    ])(`should create a session with 1 tour for 2 players %s VS %s} with 1 field`, (player1: Player, player2: Player, expected): void => {
        const emptySession: Session = makeSession([player1, player2]);

        const session: Session = addTourToSession(emptySession);

        expect(session).toEqual(expected)
    });

    it("should create a session with 2 tour for 2 players with 1 field", (): void => {
        const player1 = makePlayer(0, "jeanne");
        const player2 = makePlayer(0, "serge");

        const emptySession: Session = makeSession([player1, player2]);

        const session: Session = addTourToSession(addTourToSession(emptySession));

        expect(session).toEqual({
            players: [
                {level: 0, nom: "jeanne"},
                {level: 0, nom: "serge"}
            ],
            tours: [
                {
                    "jeanne": MatchScore.NotPlayed,
                    "serge": MatchScore.NotPlayed
                },
                {
                    "jeanne": MatchScore.NotPlayed,
                    "serge": MatchScore.NotPlayed
                }
            ]
        })
    });

    it("should create a session with 2 tour for 3 players with 1 field", (): void => {
        const player1 = makePlayer(0, "jeanne");
        const player2 = makePlayer(0, "serge");
        const player3 = makePlayer(0, "jeannette");

        const emptySession: Session = makeSession([player1, player2,player3]);

        const session: Session = addTourToSession(addTourToSession(emptySession));

        expect(session).toEqual({
            players: [
                {level: 0, nom: "jeanne"},
                {level: 0, nom: "serge"},
                {level: 0, nom: "jeannette"}
            ],
            tours: [
                {
                    "jeanne": MatchScore.NotPlayed,
                    "serge": MatchScore.NotPlayed
                },
                {
                    "jeannette": MatchScore.NotPlayed,
                    "jeanne": MatchScore.NotPlayed
                }
            ]
        })
    });

    /*    it("should create a session with 1 tour for 4 players with 2 fields", (): void => {
            const player1 = makePlayer(0, "jeanne");
            const player2 = makePlayer(0, "serge");
            const player3 = makePlayer(0, "jeannette");
            const player4 = makePlayer(0, "sergei");


            const emptySession: Session = makeSession([player1, player2, player3, player4]);

            const session: Session = addTourToSession(emptySession);

            expect(session).toEqual(
                {
                    players: [
                        {level: 0, nom: "jeanne"},
                        {level: 0, nom: "serge"},
                        {level: 0, nom: "jeannette"},
                        {level: 0, nom: "sergei"}
                    ],
                    tours: [
                        {
                            "jeanne": MatchScore.NotPlayed,
                            "serge": MatchScore.NotPlayed
                        },
                        {
                            "jeannette": MatchScore.NotPlayed,
                            "sergei": MatchScore.NotPlayed
                        }
                    ],
                })
        });*/

    /*     it("should create a session with 2 tours for 4 players with 2 fields", (): void => {
             const player1 = makePlayer(0, "jeanne");
             const player2 = makePlayer(0, "serge");
             const player3 = makePlayer(0, "jeannette");
             const player4 = makePlayer(0, "sergei");

             const emptySession: Session = makeSession([player1, player2, player3, player4]);

             const session: Session = addTourToSession(addTourToSession(emptySession));

             expect(session).toEqual(
                 {
                     players: [
                         {level: 0, nom: "jeanne"},
                         {level: 0, nom: "serge"},
                         {level: 0, nom: "jeannette"},
                         {level: 0, nom: "sergei"}
                     ],
                     tours: [
                         {
                             "jeanne": MatchScore.NotPlayed,
                             "serge": MatchScore.NotPlayed
                         },
                         {
                             "jeannette": MatchScore.NotPlayed,
                             "sergei": MatchScore.NotPlayed
                             },
                         {
                             "jeanne": MatchScore.NotPlayed,
                             "jeannette": MatchScore.NotPlayed,
                         },
                         {
                             "serge": MatchScore.NotPlayed,
                             "sergei": MatchScore.NotPlayed
                         },
                     ],
                 })
         });*/
});


