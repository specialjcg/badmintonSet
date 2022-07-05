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

const toPlayerMatchCount = (matchesPerPlayer: PlayerMatchCount[], playerName: string): PlayerMatchCount[] => {
    const matchPerPlayerIndex = matchesPerPlayer.findIndex((matchPerPlayer: PlayerMatchCount) => matchPerPlayer.nom === playerName);

    return matchPerPlayerIndex === -1 ? initPlayerMatchCount(matchesPerPlayer, playerName) : updatePlayerMatchCount(matchesPerPlayer, matchPerPlayerIndex)
};

const makePlayerResult = (nom: string): PlayerResult => ({
    nom: nom,
    score: MatchScore.NotPlayed
});

const countMatchesAlreadyPlayAgainstThisPlayer = (tours: MatchResult[], nomJoueur: string, nom: string) =>
    tours.filter((tour: MatchResult) => {
        return tour[0].nom === nomJoueur && tour[1].nom === nom || tour[0].nom === nom && tour[1].nom === nomJoueur
    }).length


const findOtherPlayerThatPlayedLeastAgainst = (nomJoueur: string, tours: MatchResult[], players: Player[]): PlayerMatchCount[] =>
    players
        .map(toPlayerName)
        .filter(nom => nomJoueur !== nom)
        .map(nom => ({
            nom,
            count: countMatchesAlreadyPlayAgainstThisPlayer(tours, nomJoueur, nom)
        }))
        .sort(byPlayerMatchCount)

const playerThatLeastPlayedInPreviousTours = (players: Player[], tours: MatchResult[]) =>
    players
        .map(toPlayerName)
        .concat(withToursPlayersNames(tours))
        .reduce(toPlayerMatchCount, [])
        .sort(byPlayerMatchCount)[0].nom

const opponentThatLeastPlayedAgainstPlayer = (playerThatPlayedLeast: string, tours: MatchResult[], players: Player[]): string =>
    players
        .map(toPlayerName)
        .concat(withToursPlayersNames(tours))
        .filter(nom => playerThatPlayedLeast !== nom)
        .reduce(toPlayerMatchCount, [])
        .sort(byPlayerMatchCount)[0].nom

const BySimpleWhomPlayedLeast = (players: Player[], tours: MatchResult[]): MatchResult => {
    const playerName: string = playerThatLeastPlayedInPreviousTours(players, tours);
    const opponentName: string = opponentThatLeastPlayedAgainstPlayer(playerName, tours, players);

    return [
        makePlayerResult(playerName),
        makePlayerResult(opponentName),
    ];
};

const addMatches = ({players, tours}: { players: Player[], tours: MatchResult[] }): MatchResult[] => {
    return groupSuccessivePlayersByTwo(players, tours);
};

fdescribe("construction d'une session d'entrainement", (): void => {
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
                        nom: 'jeanne',
                        score: MatchScore.NotPlayed
                    },
                    {
                        nom: 'serge',
                        score: MatchScore.NotPlayed
                    }
                ]
            ]
        })
    });

    it("should create a session with 2 tour for 3 players with 1 field", (): void => {
        const player1 = makePlayer(0, "jeanne");
        const player2 = makePlayer(0, "serge");
        const player3 = makePlayer(0, "jeannette");

        const emptySession: Session = makeSession([player1, player2, player3]);

        const session: Session = addTourToSession(addTourToSession(emptySession));

        expect(session).toEqual({
            players: [
                {level: 0, nom: "jeanne"},
                {level: 0, nom: "serge"},
                {level: 0, nom: "jeannette"}
            ],
            tours: [
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
                    },{
                        nom: 'jeanne',
                        score: MatchScore.NotPlayed
                    }

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

        const session: Session = addTourToSession(addTourToSession(emptySession));

        expect(session).toEqual({
            players: [
                {level: 0, nom: "jeanne"},
                {level: 0, nom: "serge"},
                {level: 0, nom: "jeannette"},
                {level: 0, nom: "paul"}
            ],
            tours: [
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
        })
    });

    describe("fonction utilitaires", () => {
        it('when two player should replay the same match', () => {
            const tours: MatchResult[] =  [
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
            ];

            const opponents: Player[] = [
                {
                    nom: 'jeanne',
                    level: 0
                },
                {
                    nom: 'serge',
                    level: 0
                }
            ];

            expect(findOtherPlayerThatPlayedLeastAgainst('jeanne', tours, opponents )[0].nom).toBe('serge')
        });

        it('should find the lowest priority jeannette opponent, prefer the opponent that least played against her', () => {
            const tours: MatchResult[] =  [
                [
                    {
                        nom: 'jeannette',
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
                        nom: 'jeanne',
                        score: MatchScore.NotPlayed
                    }

                ],
                [

                    {
                        nom: 'paul',
                        score: MatchScore.NotPlayed
                    },
                    {
                        nom: 'serge',
                        score: MatchScore.NotPlayed
                    }

                ]
            ];

            const opponents: Player[] = [
                {
                    nom: 'jeanne',
                    level: 0
                },
                {
                    nom: 'serge',
                    level: 0
                },
                {
                    nom: 'paul',
                    level: 0
                }
            ];

            expect(findOtherPlayerThatPlayedLeastAgainst('jeannette', tours, opponents )[0].nom).toBe('paul')
        });
    });


    // it("should create a session with 5 tour for 4 players with 1 field", (): void => {
    //     const player1 = makePlayer(0, "jeanne");
    //     const player2 = makePlayer(0, "serge");
    //     const player3 = makePlayer(0, "jeannette");
    //     const player4 = makePlayer(0, "paul");
    //
    //     const emptySession: Session = makeSession([player1, player2, player3, player4]);
    //
    //     const session: Session = addTourToSession(addTourToSession(addTourToSession(addTourToSession(addTourToSession(emptySession)))));
    //
    //     expect(session).toEqual({
    //         players: [
    //             {level: 0, nom: "jeanne"},
    //             {level: 0, nom: "serge"},
    //             {level: 0, nom: "jeannette"},
    //             {level: 0, nom: "paul"}
    //         ],
    //         tours: [
    //             [
    //                 {
    //                     nom: 'jeanne',
    //                     score: MatchScore.NotPlayed
    //                 },
    //                 {
    //                     nom: 'serge',
    //                     score: MatchScore.NotPlayed
    //                 }
    //             ],
    //             [
    //                 {
    //                     nom: 'jeannette',
    //                     score: MatchScore.NotPlayed
    //                 },
    //                 {
    //                     nom: 'paul',
    //                     score: MatchScore.NotPlayed
    //                 }
    //             ],
    //             [
    //                 {
    //                     nom: 'jeanne',
    //                     score: MatchScore.NotPlayed
    //                 },
    //                 {
    //                     nom: 'jeannette',
    //                     score: MatchScore.NotPlayed
    //                 }
    //             ],
    //             [
    //                 {
    //                     nom: 'serge',
    //                     score: MatchScore.NotPlayed
    //                 },
    //                 {
    //                     nom: 'paul',
    //                     score: MatchScore.NotPlayed
    //                 }
    //             ],
    //
    //             [
    //                 {
    //                     nom: 'jeanne',
    //                     score: MatchScore.NotPlayed
    //                 },
    //                 {
    //                     nom: 'paul',
    //                     score: MatchScore.NotPlayed
    //                 }
    //             ]
    //         ]
    //     })
    // });
});


