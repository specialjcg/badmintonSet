type Level = number;

type Player = { nom: string; level: Level };

enum MatchScore {
    NotPlayed = 0,
    Lose = 1,
    Win = 2,
    StrongWin = 3
}

const makePlayer = (level: number, nom: string): Player => ({level, nom});

type PlayerResult = {
    nom: string,
    score: MatchScore
}

type MatchResult = [PlayerResult, PlayerResult]

type Tour = MatchResult[]

type Session = {
    players: Player[],
    tours: Tour[]
};

type PlayerMatchCount = {
    nom: string;
    count: number;
}

const makeSession = (players: Player[]): Session => ({players, tours: []});

const addTourToSession = (session: Session, fieldCount: number): Session => ({
    players: session.players,
    tours: [...session.tours, addMatches(session, fieldCount)]
});

const byPlayerMatchCount = (playerMatchCount1: PlayerMatchCount, playerMatchCount2: PlayerMatchCount) => playerMatchCount1.count - playerMatchCount2.count;

const toPlayerName = (player: { nom: string }) => player.nom;

const withToursPlayersNames = (tours: MatchResult[]) => tours.flatMap(tour => [tour[0].nom, tour[1].nom]);

const initPlayerMatchCount = (matchesPerPlayer: PlayerMatchCount[], playerName: string) => [
    ...matchesPerPlayer,
    {
        nom: playerName,
        count: 0
    }
];

const updatePlayerMatchCount = (matchesPerPlayer: PlayerMatchCount[], matchPerPlayerIndex: any) =>
    matchesPerPlayer.map((matchPerPlayer: PlayerMatchCount, index: number) =>
        index === matchPerPlayerIndex ? {
            ...matchPerPlayer,
            count: matchPerPlayer.count + 1
        } : matchPerPlayer);

const initOrUpdatePlayerMatchCount = (matchPerPlayerIndex: any, matchesPerPlayer: PlayerMatchCount[], playerName: string) =>
    matchPerPlayerIndex === -1 ?
        initPlayerMatchCount(matchesPerPlayer, playerName) : updatePlayerMatchCount(matchesPerPlayer, matchPerPlayerIndex);

const toPlayerMatchCount = (matchesPerPlayer: PlayerMatchCount[], playerName: string): PlayerMatchCount[] =>
    initOrUpdatePlayerMatchCount(matchesPerPlayer.findIndex((matchPerPlayer: PlayerMatchCount) => matchPerPlayer.nom === playerName), matchesPerPlayer, playerName);

const makePlayerResult = (nom: string): PlayerResult => ({
    nom: nom,
    score: MatchScore.NotPlayed
});

const playerThatLeastPlayedInPreviousTours = (players: Player[], tour: Tour) =>
    players
        .map(toPlayerName)
        .concat(withToursPlayersNames(tour))
        .reduce(toPlayerMatchCount, [])
        .sort(byPlayerMatchCount)[0].nom

const opponentThatLeastPlayedAgainstPlayer = (playerThatPlayedLeast: string, tour: Tour, players: Player[]): string =>
    players
        .map(toPlayerName)
        .concat(withToursPlayersNames(tour))
        .filter(nom => playerThatPlayedLeast !== nom)
        .reduce(toPlayerMatchCount, [])
        .sort(byPlayerMatchCount)[0].nom

const makeMatchResult = (playerName: string, tour: Tour, players: Player[]): MatchResult => [
    makePlayerResult(playerName),
    makePlayerResult(opponentThatLeastPlayedAgainstPlayer(playerName, tour, players)),
];

const isNotInPreviousMatch = (match1: [PlayerResult, PlayerResult]) => {
    return (player: Player) => !match1.map((result: PlayerResult) => result.nom).includes(player.nom);
}

const BySimpleWhomPlayedLeast = (players: Player[], tours: Tour[], fieldCount: number): Tour => {
    const match1: MatchResult = makeMatchResult(playerThatLeastPlayedInPreviousTours(players, tours[0] ?? [] ), tours[0] ?? [], players);
    const playersMinusPlayersInMatchOne = players.filter(isNotInPreviousMatch(match1));

    // todo: Add a for loop on player list OR fieldCount
    //  Deux conditions d'arrêt
    //  - Soit il n'y a plus de terrains
    //  - Soit il n'a pas assez de joueurs

    if (fieldCount === 1) return [match1];
    else if (fieldCount === 2) {

        const match2: MatchResult = makeMatchResult(playerThatLeastPlayedInPreviousTours(playersMinusPlayersInMatchOne, []), [], playersMinusPlayersInMatchOne);
        return [
            match1,
            match2
        ];
    }

    const match2: MatchResult = makeMatchResult(playerThatLeastPlayedInPreviousTours(playersMinusPlayersInMatchOne, []), [], playersMinusPlayersInMatchOne);
    const playersMinusPlayersInMatchOneAndTwo = playersMinusPlayersInMatchOne.filter(isNotInPreviousMatch(match2))

    const match3: MatchResult = makeMatchResult(playerThatLeastPlayedInPreviousTours(playersMinusPlayersInMatchOneAndTwo, []), [], playersMinusPlayersInMatchOneAndTwo);

    return [
        match1,
        match2,
        match3
    ];

}

const addMatches = ({players, tours}: Session, fieldCount: number): Tour => BySimpleWhomPlayedLeast(players, tours, fieldCount);

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
                    [
                        [
                            {
                                nom: "jeanne",
                                score: MatchScore.NotPlayed
                            },
                            {
                                nom: "serge",
                                score: MatchScore.NotPlayed
                            }
                        ]
                    ]
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
                tours:
                    [
                        [
                            [
                                {
                                    nom: "jeannette",
                                    score: MatchScore.NotPlayed
                                },
                                {
                                    nom: "sergei",
                                    score: MatchScore.NotPlayed
                                }
                            ]
                        ]
                    ]
            }
        ]
    ])(`should create a session with 1 tour for 2 players %s VS %s} with 1 field`, (player1: Player, player2: Player, expected): void => {
        const emptySession: Session = makeSession([player1, player2]);

        const session: Session = addTourToSession(emptySession, 1);

        expect(session).toEqual(expected)
    });

    it("should create a session with 2 tour for 2 players with 1 field", (): void => {
        const player1 = makePlayer(0, "jeanne");
        const player2 = makePlayer(0, "serge");

        const emptySession: Session = makeSession([player1, player2]);

        const session: Session = addTourToSession(addTourToSession(emptySession,1),1);

        expect(session).toEqual({
            players: [
                {level: 0, nom: "jeanne"},
                {level: 0, nom: "serge"}
            ],
            tours: [
                [
                    [
                        {
                            nom: 'jeanne',
                            score: MatchScore.NotPlayed
                        },
                        {
                            nom: 'serge',
                            score: MatchScore.NotPlayed
                        }
                    ],

                ],
                [
                    [
                        {
                            nom: 'jeanne',
                            score: MatchScore.NotPlayed
                        },
                        {
                            nom: 'serge',
                            score: MatchScore.NotPlayed
                        }
                    ]
                ]
            ]
        })
    })

    it("should create a session with 2 tour for 3 players with 1 field", (): void => {
        const player1 = makePlayer(0, "jeanne");
        const player2 = makePlayer(0, "serge");
        const player3 = makePlayer(0, "jeannette");

        const emptySession: Session = makeSession([player1, player2, player3]);

        const session: Session = addTourToSession(addTourToSession(emptySession,1),1);

        expect(session).toEqual({
            players: [
                {level: 0, nom: "jeanne"},
                {level: 0, nom: "serge"},
                {level: 0, nom: "jeannette"}
            ],
            tours: [
                [
                    [
                        {
                            nom: 'jeanne',
                            score: MatchScore.NotPlayed
                        },
                        {
                            nom: 'serge',
                            score: MatchScore.NotPlayed
                        }
                    ],
                ],
                [
                    [

                        {
                            nom: 'jeannette',
                            score: MatchScore.NotPlayed
                        },
                        {
                            nom: 'jeanne',
                            score: MatchScore.NotPlayed
                        }

                    ]
                ]


            ]
        })
    });

    it("should create a session with 2 tour for 4 players with 1 field", (): void => {
        const player1 = makePlayer(0, "jeanne");
        const player2 = makePlayer(0, "serge");
        const player3 = makePlayer(0, "jeannette");
        const player4 = makePlayer(0, "paul");

        const emptySession: Session = makeSession([player1, player2, player3, player4]);

        const session: Session = addTourToSession(addTourToSession(emptySession, 1), 1);

        expect(session).toEqual({
            players: [
                {level: 0, nom: "jeanne"},
                {level: 0, nom: "serge"},
                {level: 0, nom: "jeannette"},
                {level: 0, nom: "paul"}
            ],
            tours:
                [
                    [
                        [
                            {
                                nom: 'jeanne',
                                score: MatchScore.NotPlayed
                            },
                            {
                                nom: 'serge',
                                score: MatchScore.NotPlayed
                            }
                        ]
                    ],
                    [
                        [
                            {
                                nom: 'jeannette',
                                score: MatchScore.NotPlayed
                            },
                            {
                                nom: 'paul',
                                score: MatchScore.NotPlayed
                            }
                        ]
                    ]
                ]
        })
    });
    it("should create a session with 1tour for 4 players with 2 field", (): void => {
        const player1 = makePlayer(0, "jeanne");
        const player2 = makePlayer(0, "serge");
        const player3 = makePlayer(0, "jeannette");
        const player4 = makePlayer(0, "paul");

        const emptySession: Session = makeSession([player1, player2, player3, player4]);

        const session: Session = addTourToSession(emptySession,2);

        expect(session).toEqual({
            players: [
                {level: 0, nom: "jeanne"},
                {level: 0, nom: "serge"},
                {level: 0, nom: "jeannette"},
                {level: 0, nom: "paul"}
            ],
            tours: [
                [
                    [
                        {
                            nom: 'jeanne',
                            score: MatchScore.NotPlayed
                        },
                        {
                            nom: 'serge',
                            score: MatchScore.NotPlayed
                        }
                    ],
                    [
                        {
                            nom: 'jeannette',
                            score: MatchScore.NotPlayed
                        },
                        {
                            nom: 'paul',
                            score: MatchScore.NotPlayed
                        }
                    ]
                ]
            ]
        })
    });

    it("should create a session with 1tour for 6 players with 3 fields", (): void => {
        const player1 = makePlayer(0, "jeanne");
        const player2 = makePlayer(0, "serge");
        const player3 = makePlayer(0, "jeannette");
        const player4 = makePlayer(0, "paul");
        const player5 = makePlayer(0, "marc");
        const player6 = makePlayer(0, "romain");
        const emptySession: Session = makeSession([player1, player2, player3, player4, player5, player6]);

        const session: Session = addTourToSession(emptySession,3);

        expect(session).toEqual({
            players: [
                {level: 0, nom: "jeanne"},
                {level: 0, nom: "serge"},
                {level: 0, nom: "jeannette"},
                {level: 0, nom: "paul"},
                {level: 0, nom: "marc"},
                {level: 0, nom: "romain"}
            ],
            tours: [
                [
                    [
                        {
                            nom: 'jeanne',
                            score: MatchScore.NotPlayed
                        },
                        {
                            nom: 'serge',
                            score: MatchScore.NotPlayed
                        }
                    ],
                    [
                        {
                            nom: 'jeannette',
                            score: MatchScore.NotPlayed
                        },
                        {
                            nom: 'paul',
                            score: MatchScore.NotPlayed
                        }
                    ],
                    [
                        {
                            nom: 'marc',
                            score: MatchScore.NotPlayed
                        },
                        {
                            nom: 'romain',
                            score: MatchScore.NotPlayed
                        }
                    ]
                ]
            ]
        })
    });

});
