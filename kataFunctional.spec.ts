import {
    addTourToSession, computeLevels, isSessionReady,
    Lose, makePlayer, makeSession,
    NotPlayed,
    Player,
    Ready,
    Session, setMatchScore,
    StrongWin,
    ToProcess,
    Win
} from "./models";

// todo set to double
// todo add player in session when session is started

describe('add score after every tour', () => {
    it('should use level to associate player  to first tour ', () => {
        const player1 = makePlayer(10, 'jeanne');
        const player2 = makePlayer(1, 'serge');
        const player3 = makePlayer(2, 'jeannette');
        const player4 = makePlayer(9, 'paul');

        const emptySession: Session<Ready> = makeSession([player1, player2, player3, player4]);

        const session1: Session<ToProcess> = addTourToSession(emptySession, 2);
        const session1WithScoreForMatch1 = setMatchScore(session1, {nom: "jeanne", score: Win})
        const session1WithScoreForMatch2 = setMatchScore(session1WithScoreForMatch1, {
            nom: "jeannette",
            score: StrongWin
        })

        expect(setMatchScore(session1WithScoreForMatch2, {nom: "jeanne", score: Win})).toEqual({
            players: [
                {level: 10, nom: 'jeanne'},
                {level: 1, nom: 'serge'},
                {level: 2, nom: 'jeannette'},
                {level: 9, nom: 'paul'}
            ],
            tours: [
                [
                    [
                        {
                            nom: 'jeanne',
                            score: Win
                        },
                        {
                            nom: 'paul',
                            score: Lose
                        }
                    ],
                    [
                        {
                            nom: 'serge',
                            score: Lose
                        },
                        {
                            nom: 'jeannette',
                            score: StrongWin
                        }
                    ]
                ]
            ]
        });
    });

    it('should set score at the end to last Tour jeanne win against serge and paul strong win against jeanette', () => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');
        const player3 = makePlayer(0, 'jeannette');
        const player4 = makePlayer(0, 'paul');

        const emptySession: Session<Ready> = makeSession([player1, player2, player3, player4]);

        const session1: Session<ToProcess> = addTourToSession(emptySession, 2);
        const session1WithScoreForMatch1 = setMatchScore(session1, {nom: "jeanne", score: Win})
        const session1WithScoreForMatch2 = setMatchScore(session1WithScoreForMatch1, {
            nom: "paul",
            score: StrongWin
        })

        if (!isSessionReady(session1WithScoreForMatch2)) throw new Error('session is not ready');

        const session2 = addTourToSession(session1WithScoreForMatch2, 2);

        expect(setMatchScore(session2, {nom: "jeanne", score: Win})).toEqual({
            players: [
                {level: 0, nom: 'jeanne'},
                {level: 0, nom: 'serge'},
                {level: 0, nom: 'jeannette'},
                {level: 0, nom: 'paul'}
            ],
            tours: [
                [
                    [
                        {
                            nom: 'jeanne',
                            score: Win
                        },
                        {
                            nom: 'serge',
                            score: Lose
                        }
                    ],
                    [
                        {
                            nom: 'jeannette',
                            score: Lose
                        },
                        {
                            nom: 'paul',
                            score: StrongWin
                        }
                    ]
                ],
                [
                    [
                        {
                            nom: 'jeanne',
                            score: Win
                        },
                        {
                            nom: 'jeannette',
                            score: Lose
                        }
                    ],
                    [
                        {
                            nom: 'serge',
                            score: NotPlayed
                        },
                        {
                            nom: 'paul',
                            score: NotPlayed
                        }
                    ]
                ]
            ]
        });
    });

    it('should set score at the end to first Tour jeanne win against serge and paul strong win against jeanette', () => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');
        const player3 = makePlayer(0, 'jeannette');
        const player4 = makePlayer(0, 'paul');

        const emptySession: Session<Ready> = makeSession([player1, player2, player3, player4]);

        const session1 = addTourToSession(emptySession, 2);

        const session1WithScoreForMatch1 = setMatchScore(session1, {nom: "jeanne", score: Win});
        const session1WithScoreForMatch2 = setMatchScore(session1WithScoreForMatch1, {nom: "paul", score: StrongWin});

        expect(session1WithScoreForMatch2).toEqual({
            players: [
                {level: 0, nom: 'jeanne'},
                {level: 0, nom: 'serge'},
                {level: 0, nom: 'jeannette'},
                {level: 0, nom: 'paul'}
            ],
            tours: [
                [
                    [
                        {
                            nom: 'jeanne',
                            score: Win
                        },
                        {
                            nom: 'serge',
                            score: Lose
                        }
                    ],
                    [
                        {
                            nom: 'jeannette',
                            score: Lose
                        },
                        {
                            nom: 'paul',
                            score: StrongWin
                        }
                    ]
                ]
            ]
        });
    });

    it('should set score at the end to first Tour jeanne win against serge', () => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');
        const player3 = makePlayer(0, 'jeannette');
        const player4 = makePlayer(0, 'paul');

        const emptySession: Session<Ready> = makeSession([player1, player2, player3, player4]);

        const session1: Session<ToProcess> = addTourToSession(emptySession, 2);

        expect(setMatchScore(session1, {nom: "jeanne", score: Win})).toEqual({
            players: [
                {level: 0, nom: 'jeanne'},
                {level: 0, nom: 'serge'},
                {level: 0, nom: 'jeannette'},
                {level: 0, nom: 'paul'}
            ],
            tours: [
                [
                    [
                        {
                            nom: 'jeanne',
                            score: Win
                        },
                        {
                            nom: 'serge',
                            score: Lose
                        }
                    ],
                    [
                        {
                            nom: 'jeannette',
                            score: NotPlayed
                        },
                        {
                            nom: 'paul',
                            score: NotPlayed
                        }
                    ]
                ]
            ]
        });
    });
});

describe("construction d'une session d'entrainement", (): void => {
    it('should create a player', (): void => {
        const player = makePlayer(0, 'jeanne');

        expect(player).toEqual({level: 0, nom: 'jeanne'});
    });

    it('should create a empty session', (): void => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');
        const player3 = makePlayer(0, 'jeannette');
        const player4 = makePlayer(0, 'sergei');

        const session = makeSession([player1, player2, player3, player4]);

        expect(session).toEqual({
            players: [
                {level: 0, nom: 'jeanne'},
                {level: 0, nom: 'serge'},
                {level: 0, nom: 'jeannette'},
                {level: 0, nom: 'sergei'}
            ],
            tours: []
        });
    });

    it.each([
        [
            makePlayer(0, 'jeanne'),
            makePlayer(0, 'serge'),
            {
                players: [
                    {level: 0, nom: 'jeanne'},
                    {level: 0, nom: 'serge'}
                ],
                tours: [
                    [
                        [
                            {
                                nom: 'jeanne',
                                score: NotPlayed
                            },
                            {
                                nom: 'serge',
                                score: NotPlayed
                            }
                        ]
                    ]
                ]
            }
        ],
        [
            makePlayer(0, 'jeannette'),
            makePlayer(0, 'sergei'),
            {
                players: [
                    {level: 0, nom: 'jeannette'},
                    {level: 0, nom: 'sergei'}
                ],
                tours: [
                    [
                        [
                            {
                                nom: 'jeannette',
                                score: NotPlayed
                            },
                            {
                                nom: 'sergei',
                                score: NotPlayed
                            }
                        ]
                    ]
                ]
            }
        ]
    ])(
        `should create a session with 1 tour for 2 players %s VS %s} with 1 field`,
        (player1: Player, player2: Player, expected): void => {
            const emptySession: Session<Ready> = makeSession([player1, player2]);

            const session: Session<ToProcess> = addTourToSession(emptySession, 1);

            expect(session).toEqual(expected);
        }
    );

    it('should create a session with 2 tour for 2 players with 1 field', (): void => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');

        const emptySession: Session<Ready> = makeSession([player1, player2]);

        const session1: Session<ToProcess> = addTourToSession(emptySession, 1)

        const sessionWithScores: Session<ToProcess> = setMatchScore(session1, {nom: 'jeanne', score: Win})

        if (!isSessionReady(sessionWithScores)) throw new Error('session is not ready');

        const session: Session<ToProcess> = addTourToSession(sessionWithScores, 1);

        expect(session).toEqual({
            players: [
                {level: 0, nom: 'jeanne'},
                {level: 0, nom: 'serge'}
            ],
            tours: [
                [
                    [
                        {
                            nom: 'jeanne',
                            score: Win
                        },
                        {
                            nom: 'serge',
                            score: Lose
                        }
                    ]
                ],
                [
                    [
                        {
                            nom: 'jeanne',
                            score: NotPlayed
                        },
                        {
                            nom: 'serge',
                            score: NotPlayed
                        }
                    ]
                ]
            ]
        });
    });

    it('should create a session with 2 tour for 4 players with 1 field', (): void => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');
        const player3 = makePlayer(0, 'jeannette');
        const player4 = makePlayer(0, 'paul');

        const emptySession: Session<Ready> = makeSession([player1, player2, player3, player4]);

        const session1: Session<ToProcess> = addTourToSession(emptySession, 1)

        const sessionWithScores: Session<ToProcess> =
            setMatchScore(session1, {nom: 'jeanne', score: Win})

        if (!isSessionReady(sessionWithScores)) throw new Error('session is not ready');

        const session: Session<ToProcess> = addTourToSession(sessionWithScores, 1);

        expect(session).toEqual({
            players: [
                {level: 0, nom: 'jeanne'},
                {level: 0, nom: 'serge'},
                {level: 0, nom: 'jeannette'},
                {level: 0, nom: 'paul'}
            ],
            tours: [
                [
                    [
                        {
                            nom: 'jeanne',
                            score: Win
                        },
                        {
                            nom: 'serge',
                            score: Lose
                        }
                    ]
                ],
                [
                    [
                        {
                            nom: 'jeannette',
                            score: NotPlayed
                        },
                        {
                            nom: 'paul',
                            score: NotPlayed
                        }
                    ]
                ]
            ]
        });
    });

    it('should create a session with 1 tour for 4 players with 2 field', (): void => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');
        const player3 = makePlayer(0, 'jeannette');
        const player4 = makePlayer(0, 'paul');

        const emptySession: Session<Ready> = makeSession([player1, player2, player3, player4]);

        const session: Session<ToProcess> = addTourToSession(emptySession, 2);

        expect(session).toEqual({
            players: [
                {level: 0, nom: 'jeanne'},
                {level: 0, nom: 'serge'},
                {level: 0, nom: 'jeannette'},
                {level: 0, nom: 'paul'}
            ],
            tours: [
                [
                    [
                        {
                            nom: 'jeanne',
                            score: NotPlayed
                        },
                        {
                            nom: 'serge',
                            score: NotPlayed
                        }
                    ],
                    [
                        {
                            nom: 'jeannette',
                            score: NotPlayed
                        },
                        {
                            nom: 'paul',
                            score: NotPlayed
                        }
                    ]
                ]
            ]
        });
    });

    it('should create a session with 1 tour for 6 players with 3 fields', (): void => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');
        const player3 = makePlayer(0, 'jeannette');
        const player4 = makePlayer(0, 'paul');
        const player5 = makePlayer(0, 'marc');
        const player6 = makePlayer(0, 'romain');
        const emptySession: Session<Ready> = makeSession([player1, player2, player3, player4, player5, player6]);

        const session: Session<ToProcess> = addTourToSession(emptySession, 3);

        expect(session).toEqual({
            players: [
                {level: 0, nom: 'jeanne'},
                {level: 0, nom: 'serge'},
                {level: 0, nom: 'jeannette'},
                {level: 0, nom: 'paul'},
                {level: 0, nom: 'marc'},
                {level: 0, nom: 'romain'}
            ],
            tours: [
                [
                    [
                        {
                            nom: 'jeanne',
                            score: NotPlayed
                        },
                        {
                            nom: 'serge',
                            score: NotPlayed
                        }
                    ],
                    [
                        {
                            nom: 'jeannette',
                            score: NotPlayed
                        },
                        {
                            nom: 'paul',
                            score: NotPlayed
                        }
                    ],
                    [
                        {
                            nom: 'marc',
                            score: NotPlayed
                        },
                        {
                            nom: 'romain',
                            score: NotPlayed
                        }
                    ]
                ]
            ]
        });
    });

    it('should create a session with 1 tour for 4 players with 3 fields', (): void => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');
        const player3 = makePlayer(0, 'jeannette');
        const player4 = makePlayer(0, 'paul');

        const emptySession: Session<Ready> = makeSession([player1, player2, player3, player4]);

        const session: Session<ToProcess> = addTourToSession(emptySession, 3);

        expect(session).toEqual({
            players: [
                {level: 0, nom: 'jeanne'},
                {level: 0, nom: 'serge'},
                {level: 0, nom: 'jeannette'},
                {level: 0, nom: 'paul'}
            ],
            tours: [
                [
                    [
                        {
                            nom: 'jeanne',
                            score: NotPlayed
                        },
                        {
                            nom: 'serge',
                            score: NotPlayed
                        }
                    ],
                    [
                        {
                            nom: 'jeannette',
                            score: NotPlayed
                        },
                        {
                            nom: 'paul',
                            score: NotPlayed
                        }
                    ]
                ]
            ]
        });
    });

    it('should create a session with 2 tour for 4 players with 2 field', (): void => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');
        const player3 = makePlayer(0, 'jeannette');
        const player4 = makePlayer(0, 'paul');

        const emptySession: Session<Ready> = makeSession([player1, player2, player3, player4]);


        const session1: Session<ToProcess> = addTourToSession(emptySession, 2);

        const session1withMatch1Scores: Session<ToProcess> = setMatchScore(session1, {nom: 'paul', score: StrongWin});
        const session1withMatch2Scores: Session<ToProcess> = setMatchScore(session1withMatch1Scores, {
            nom: 'jeanne',
            score: Win
        });

        if (!isSessionReady(session1withMatch2Scores)) throw new Error('session is not ready');

        const session2: Session<ToProcess> = addTourToSession(session1withMatch2Scores, 2);

        expect(session2).toEqual({
            players: [
                {level: 0, nom: 'jeanne'},
                {level: 0, nom: 'serge'},
                {level: 0, nom: 'jeannette'},
                {level: 0, nom: 'paul'}
            ],
            tours: [
                [
                    [
                        {
                            nom: 'jeanne',
                            score: Win
                        },
                        {
                            nom: 'serge',
                            score: Lose
                        }
                    ],
                    [
                        {
                            nom: 'jeannette',
                            score: Lose
                        },
                        {
                            nom: 'paul',
                            score: StrongWin
                        }
                    ]
                ],
                [
                    [
                        {
                            nom: 'jeanne',
                            score: NotPlayed
                        },
                        {
                            nom: 'jeannette',
                            score: NotPlayed
                        }
                    ],
                    [
                        {
                            nom: 'serge',
                            score: NotPlayed
                        },
                        {
                            nom: 'paul',
                            score: NotPlayed
                        }
                    ]
                ]
            ]
        });
    });

    it('should compute level at the end of a session of a Session of two players with StrongWin', (): void => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');

        const emptySession: Session<Ready> = makeSession([player1, player2]);

        const sessionTour1: Session<ToProcess> = addTourToSession(emptySession, 2);

        const sessionFinished: Session<ToProcess> = setMatchScore(sessionTour1, {nom: 'jeanne', score: StrongWin});

        if (!isSessionReady(sessionFinished)) throw new Error('session is not ready')

        const playersWithNewLevels: Player[] = computeLevels(sessionFinished);

        expect(playersWithNewLevels).toEqual([
            {level: 3, nom: 'jeanne'},
            {level: 1, nom: 'serge'},
        ]);
    });

    it('should compute level at the end of a session of a Session of two players with Win', (): void => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');

        const emptySession: Session<Ready> = makeSession([player1, player2]);

        const sessionTour1: Session<ToProcess> = addTourToSession(emptySession, 2);

        const sessionFinished: Session<ToProcess> = setMatchScore(sessionTour1, {nom: 'jeanne', score: Win});

        if (!isSessionReady(sessionFinished)) throw new Error('session is not ready')

        const playersWithNewLevels: Player[] = computeLevels(sessionFinished);

        expect(playersWithNewLevels).toEqual([
            {level: 3, nom: 'jeanne'},
            {level: 2, nom: 'serge'},
        ]);
    });

    it('should compute level at the end of a session of a Session of two different players with Win', (): void => {
        const player1 = makePlayer(0, 'paul');
        const player2 = makePlayer(0, 'serge');

        const emptySession: Session<Ready> = makeSession([player1, player2]);

        const sessionTour1: Session<ToProcess> = addTourToSession(emptySession, 2);

        const sessionFinished: Session<ToProcess> = setMatchScore(sessionTour1, {nom: 'serge', score: Win});

        if (!isSessionReady(sessionFinished)) throw new Error('session is not ready')

        const playersWithNewLevels: Player[] = computeLevels(sessionFinished);

        expect(playersWithNewLevels).toEqual([
            {level: 2, nom: 'paul'},
            {level: 3, nom: 'serge'},
        ]);
    });

     it('should and compute level at the end of a session', (): void => {
         const player1 = makePlayer(0, 'jeanne');
         const player2 = makePlayer(0, 'serge');
         const player3 = makePlayer(0, 'jeannette');
         const player4 = makePlayer(0, 'paul');
 
         const emptySession: Session<Ready> = makeSession([player1, player2, player3, player4]);
 
         const sessionTour1: Session<ToProcess> = addTourToSession(emptySession, 2);

         const sessionTour1withMatch1Scores: Session<ToProcess> = setMatchScore(sessionTour1, { nom: 'paul', score: StrongWin});
         const sessionTour1withMatch2Scores: Session<ToProcess> = setMatchScore(sessionTour1withMatch1Scores, { nom: 'jeanne', score: Win});

         if (!isSessionReady(sessionTour1withMatch2Scores)) throw new Error('session is not ready');
 
         const sessionTour2: Session<ToProcess> = addTourToSession(sessionTour1withMatch2Scores, 2);
 
         const sessionTour2withMatch1Scores: Session<ToProcess> = setMatchScore(sessionTour2, { nom: 'serge', score: StrongWin});
         const sessionFinished: Session<ToProcess> = setMatchScore(sessionTour2withMatch1Scores, { nom: 'jeanne', score: Win});
 
         if (!isSessionReady(sessionFinished)) throw new Error('session is not ready');
 
         const playersWithNewLevels: Player[] = computeLevels(sessionFinished);
 
         expect(playersWithNewLevels).toEqual([
             {level: 6, nom: 'jeanne'},
             {level: 5, nom: 'serge'},
             {level: 3, nom: 'jeannette'},
             {level: 4, nom: 'paul'}
         ]);
     });
    // it('should create a session with initial level', (): void => {
    //     const player1 = makePlayer(6, 'jeanne');
    //     const player2 = makePlayer(15, 'serge');
    //     const player3 = makePlayer(3, 'jeannette');
    //     const player4 = makePlayer(14, 'paul');
    //
    //     const emptySession: Session<Ready> = makeSession([player1, player2, player3, player4]);
    //
    //     const sessionTour1: Session<ToProcess> = addTourToSession(emptySession, 2);
    //
    //     expect(sessionTour1).toEqual({
    //         players: [
    //             {level: 6, nom: "jeanne"},
    //             {level: 15, nom: "serge"},
    //             {level: 3, nom: "jeannette"},
    //             {level: 14, nom: "paul"}
    //         ],
    //         tours: [
    //             [
    //                 [
    //                     {nom: "serge", score: NotPlayed},
    //                     {nom: "paul", score: NotPlayed}
    //                 ],
    //                 [
    //                     {nom: "jeanne", score: NotPlayed},
    //                     {nom: "jeannette", score: NotPlayed}
    //                 ]
    //             ]
    //         ]
    //     });
    // });
});
