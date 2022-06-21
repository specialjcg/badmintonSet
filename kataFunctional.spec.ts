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

const toPlayerName = (player: Player) => player.nom;

const withToursPlayersNames = (tours: MatchResult[]) => tours.flatMap(tour => [tour[0].nom, tour[1].nom]);

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

const isEqual = (matchToCompareTo: MatchResult, matchToAdd: MatchResult): boolean =>
    [matchToCompareTo[0].nom, matchToCompareTo[1].nom].sort().toString() === [matchToAdd[0].nom, matchToAdd[1].nom].sort().toString();

const makePlayerResult = (nom: string): PlayerResult => ({
    nom: nom,
    score: MatchScore.NotPlayed
});

function countMatchesAlreadyPlayAgainstThisPlayer(tours: MatchResult[], nomJoueur: string, nom: string) {
    return tours.filter((tour: MatchResult) => {
        return tour[0].nom === nomJoueur && tour[1].nom === nom || tour[0].nom === nom && tour[1].nom === nomJoueur
    }).length;
}

const findOtherPlayerThatPlayedLeastAgainst = (nomJoueur: string, tours: MatchResult[], players: Player[]): PlayerResult => {

   const playerThatPlayedLeastAgainstSelectedPlayer: PlayerMatchCount[] = players
       .map(toPlayerName)
       .filter(nom => nomJoueur !== nom)
       .map(nom => ({
           nom,
           count: 0
       }))
       .sort(byPlayerMatchCount);

    // tours.filter((tour: MatchResult) => {
    //     return tour[0].nom === nomJoueur && tour[1].nom === nom || tour[0].nom === nom  && tour[1].nom === nomJoueur
    // }).length

    return {
        nom: playerThatPlayedLeastAgainstSelectedPlayer[0].nom,
        score:MatchScore.NotPlayed
    };
}

const groupSuccessivePlayersByTwo = (players: Player[], tours: MatchResult[]) => {
    let matchResults: MatchResult[] = [];


    const playerPriorities: PlayerMatchCount[] = players
        .map(toPlayerName)
        .concat(withToursPlayersNames(tours))
        .reduce(toPlayerMatchCount, [])
        .sort(byPlayerMatchCount);


    const playerThatPlayedLeast = playerPriorities[0].nom;

    //On prend le joueur qui à le moins joué (joueur1) contre le joueur qui à le moins joué contre joueur1
    matchResults.push([
        makePlayerResult(playerThatPlayedLeast),
        findOtherPlayerThatPlayedLeastAgainst(playerThatPlayedLeast, tours, players),
    ]);

   /* // On a déja joué ce match
    const foundExiting = tours.find((tour) => isEqual(tour, [
        makePlayerResult(playerPriorities[0].nom),
        makePlayerResult(playerPriorities[1].nom),
    ]));*/

    /*// On a déja joué ce match et on a plus de deux joueur
    if (foundExiting != null && players.length !== 2) {
        matchResults.push([
            makePlayerResult(playerPriorities[0].nom),
            makePlayerResult(playerPriorities[2].nom),
        ]);
    } else {

        matchResults.push([
            makePlayerResult(playerPriorities[0].nom),
            makePlayerResult(playerPriorities[1].nom),
        ]);

    }*/

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

        const session: Session = addTourToSession(addTourToSession(addTourToSession(addTourToSession(emptySession))));

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
                ],
                [
                    {
                        nom: 'jeanne',
                        score: MatchScore.NotPlayed
                    },
                    {
                        nom: 'jeannette',
                        score: MatchScore.NotPlayed
                    }
                ],
                [
                    {
                        nom: 'serge',
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

    it('should test', () => {
        const tours: MatchResult[] = [
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
                    nom: 'jeannette',
                    score: MatchScore.NotPlayed
                }
            ]
        ];
        const players: Player[] = [
            {level: 0, nom: "jeanne"},
            {level: 0, nom: "serge"},
            {level: 0, nom: "jeanette"},
            {level: 0, nom: "paul"}
        ];


        const result = findOtherPlayerThatPlayedLeastAgainst1('jeanne', tours, players);

        expect(result).toStrictEqual([
            {
                "count": 0,
                "nom": "paul"
            },
            {
                "count": 1,
                "nom": "jeanette"
            },
            {
                "count": 1,
                "nom": "serge"
            },
        ]);
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


