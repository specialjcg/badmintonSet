type Level = number;
type Player = { nom: string; level: Level };

type Ready = 'Ready';

type ToProcess = 'ToProcess';

type Status = Ready | ToProcess;

const NotPlayed = 'NotPlayed' as const;

const Lose = 'Lose' as const;

const Win = 'Win' as const;

const StrongWin = 'StrongWin' as const;

type NotPlayedScore = typeof NotPlayed;
type MatchScore = typeof Lose  | typeof Win | typeof StrongWin;

const makePlayer = (level: number, nom: string): Player => ({level, nom});

type PlayerResult<T extends Status> = {
    nom: string;
    score: T extends Ready ? MatchScore : NotPlayedScore;
};
type Winner = {
    nom: string;
    score: typeof Win | typeof StrongWin;
}
type MatchResult<T extends Status> = [PlayerResult<T>, PlayerResult<T>];

type Tour<T extends Status> = MatchResult<T>[];

type Session<T extends Status> = {
    players: Player[];
    tours: T extends Ready ? Tour<Ready>[] : [...Tour<Ready>[], Tour<ToProcess>];
};

type PlayerMatchCount = {
    nom: string;
    count: number;
};


type TourInProgress = {
    matchesInProgress: Tour<ToProcess>;
    availablePlayers: Player[];
    previousTours: Tour<Ready>[];
};

const areAllToursReady = (tours: Tour<Status>[]): tours is Tour<Ready>[] => {
    return !tours.flat(2).some((playerResult: PlayerResult<Status>) => playerResult.score === NotPlayed);
}

const makeSession = (players: Player[]): Session<Ready> => ({players, tours: []});

const addTourToSession = (session: Session<Ready>, fieldCount: number): Session<ToProcess> => {
   // const plop: Tour<Status>[] =  [...session.tours, addMatches(session, fieldCount)];
   // if(!areAllToursReady(plop))
   return  {
       players: session.players,
       tours: [...session.tours, addMatches(session, fieldCount)] // as Tour<ToProcess>[]
   };
}

const byPlayerMatchCount = (playerMatchCount1: PlayerMatchCount, playerMatchCount2: PlayerMatchCount) =>
    playerMatchCount1.count - playerMatchCount2.count;

const toPlayerName = (player: { nom: string }) => player.nom;

const withToursPlayersNames = (matchResults: MatchResult<Ready>[]): string[] =>
    matchResults.flatMap((matchResult) => [matchResult[0].nom, matchResult[1].nom]);

const initPlayerMatchCount = (matchesPerPlayer: PlayerMatchCount[], playerName: string) => [
    ...matchesPerPlayer,
    {
        nom: playerName,
        count: 0
    }
];

const updatePlayerMatchCount = (matchesPerPlayer: PlayerMatchCount[], matchPerPlayerIndex: any) =>
    matchesPerPlayer.map((matchPerPlayer: PlayerMatchCount, index: number) =>
        index === matchPerPlayerIndex
            ? {
                ...matchPerPlayer,
                count: matchPerPlayer.count + 1
            }
            : matchPerPlayer
    );

const initOrUpdatePlayerMatchCount = (matchPerPlayerIndex: any, matchesPerPlayer: PlayerMatchCount[], playerName: string) =>
    matchPerPlayerIndex === -1
        ? initPlayerMatchCount(matchesPerPlayer, playerName)
        : updatePlayerMatchCount(matchesPerPlayer, matchPerPlayerIndex);

const toPlayerMatchCount = (matchesPerPlayer: PlayerMatchCount[], playerName: string): PlayerMatchCount[] =>
    initOrUpdatePlayerMatchCount(
        matchesPerPlayer.findIndex((matchPerPlayer: PlayerMatchCount) => matchPerPlayer.nom === playerName),
        matchesPerPlayer,
        playerName
    );

const playerThatLeastPlayedInPreviousTours = (tourInProgress: TourInProgress): string =>
    tourInProgress.availablePlayers
        .map(toPlayerName)
        .concat(tourInProgress.previousTours.flatMap((tour: Tour<Ready>) => withToursPlayersNames(tour)))
        .filter(extractOpponentsFromParallelMatches(tourInProgress.matchesInProgress))
        .reduce(toPlayerMatchCount, [])
        .sort(byPlayerMatchCount)[0].nom;

const extractPlayerSoHeCannotPlayAgainstHimself = (playerThatPlayedLeast: string) => (nom: string) =>
    playerThatPlayedLeast !== nom;

const extractOpponentsFromParallelMatches =
    (matchResults: MatchResult<ToProcess>[]) =>
        (opponentName: string): boolean =>
            !matchResults
                .flatMap(([playerResult1, playerResult2]: [PlayerResult<ToProcess>, PlayerResult<ToProcess>]) => [playerResult1.nom, playerResult2.nom])
                .includes(opponentName);

const withAllPlayersFromAllPreviousTours = (tours: Tour<Ready>[]) =>
    tours.flatMap((matchResults: MatchResult<Ready>[]) =>
        matchResults.flatMap(([playerResult1, playerResult2]: [PlayerResult<Ready>, PlayerResult<Ready>]) => [
            playerResult1.nom,
            playerResult2.nom
        ])
    );

const allMatchesFromPreviousToursForPlayer =
    (playerThatPlayedLeast: string) =>
        ([playerResult1, playerResult2]: MatchResult<Ready>): boolean =>
            playerResult1.nom !== playerThatPlayedLeast && playerResult2.nom !== playerThatPlayedLeast;

const toOpponentsNames =
    (playerThatPlayedLeast: string) =>
        ([playerResult1, playerResult2]: MatchResult<Ready>): string =>
            playerResult1.nom === playerThatPlayedLeast ? playerResult2.nom : playerResult1.nom;

const playersNotInList =
    (opponentsWithPlayerThatPlayedLeast: string[]) =>
        (playerNameOponnent: string): boolean =>
            !opponentsWithPlayerThatPlayedLeast.includes(playerNameOponnent);

const opponentThatPlayedMoreThanOthers = (minimalPlayedCount: number) => (playerMatchCount: PlayerMatchCount) =>
    playerMatchCount.count !== minimalPlayedCount;

const listOfPlayersThatPlayedLeast = (opponentPlaysCount: PlayerMatchCount[], playerThatPlayedLeast: string) => [
    ...opponentPlaysCount.filter(opponentThatPlayedMoreThanOthers(opponentPlaysCount[0].count)).map(toPlayerName),
    playerThatPlayedLeast
];

const opponentThatPlayedLeastAgainstPlayerInPreviousTour = (
    opponentPlaysCount: PlayerMatchCount[],
    playerThatPlayedLeast: string,
    tours: Tour<Ready>[]
) =>
    tours
        .flatMap((matchResults: MatchResult<Ready>[]) => matchResults)
        .filter(allMatchesFromPreviousToursForPlayer(playerThatPlayedLeast))
        .map(toOpponentsNames(playerThatPlayedLeast))
        .filter(playersNotInList(listOfPlayersThatPlayedLeast(opponentPlaysCount, playerThatPlayedLeast)))
        .reduce(toPlayerMatchCount, [])
        .sort(byPlayerMatchCount)[0].nom;

const opponentIsFirstInList = (tours: Tour<Ready>[], opponentPlaysCount: PlayerMatchCount[]) =>
    tours.length === 0 || opponentPlaysCount.length === 1 || opponentPlaysCount[0].count < opponentPlaysCount[1].count;

const opponentWhenEveryonePlayedOnce = (tours: Tour<Ready>[], opponentPlaysCount: PlayerMatchCount[], playerThatPlayedLeast: string) =>
    opponentIsFirstInList(tours, opponentPlaysCount)
        ? opponentPlaysCount[0].nom
        : opponentThatPlayedLeastAgainstPlayerInPreviousTour(opponentPlaysCount, playerThatPlayedLeast, tours);

const findOpponentThatLeastPlayedAgainstPlayer = (
    opponentPlaysCount: PlayerMatchCount[],
    playerThatPlayedLeast: string,
    tourInProgress: TourInProgress
) =>
    opponentPlaysCount.length === 0
        ? tourInProgress.availablePlayers
            .map(toPlayerName)
            .filter(extractPlayerSoHeCannotPlayAgainstHimself(playerThatPlayedLeast))[0]
        : opponentWhenEveryonePlayedOnce(tourInProgress.previousTours, opponentPlaysCount, playerThatPlayedLeast);

const opponentThatLeastPlayedAgainstPlayer = (playerThatPlayedLeast: string, tourInProgress: TourInProgress): string =>
    findOpponentThatLeastPlayedAgainstPlayer(
        tourInProgress.availablePlayers
            .map(toPlayerName)
            .concat(withAllPlayersFromAllPreviousTours(tourInProgress.previousTours))
            .filter(extractOpponentsFromParallelMatches(tourInProgress.matchesInProgress))
            .filter(extractPlayerSoHeCannotPlayAgainstHimself(playerThatPlayedLeast))
            .reduce(toPlayerMatchCount, [])
            .sort(byPlayerMatchCount),
        playerThatPlayedLeast,
        tourInProgress
    );

const makePlayerResult = (nom: string): PlayerResult<ToProcess> => ({
    nom: nom,
    score: NotPlayed
});

const makeMatchResult = (playerName: string, tourInProgress: TourInProgress): MatchResult<ToProcess> => [
    makePlayerResult(playerName),
    makePlayerResult(opponentThatLeastPlayedAgainstPlayer(playerName, tourInProgress))
];

const isNotInPreviousMatch =
    (match: [PlayerResult<ToProcess>, PlayerResult<ToProcess>]) =>
        (player: Player): boolean =>
            !match.map(toPlayerName).includes(player.nom);

const playersPairs = (players: Player[]) => players.length / 2;

const possibleMatchesCountInTour = (players: Player[], fieldCount: number) => Math.min(playersPairs(players), fieldCount);

const updateTourInProgress = (tourInProgress: TourInProgress, match: [PlayerResult<ToProcess>, PlayerResult<ToProcess>]): TourInProgress => ({
    matchesInProgress: [...tourInProgress.matchesInProgress, match],
    availablePlayers: tourInProgress.availablePlayers.filter(isNotInPreviousMatch(match)),
    previousTours: tourInProgress.previousTours
});

const BySimpleWhomPlayedLeast = (players: Player[], tours: Tour<Ready>[], fieldCount: number): Tour<ToProcess> =>
    new Array(possibleMatchesCountInTour(players, fieldCount))
        .fill(0)
        .reduce(
            (tourInProgress: TourInProgress): TourInProgress =>
                updateTourInProgress(
                    tourInProgress,
                    makeMatchResult(playerThatLeastPlayedInPreviousTours(tourInProgress), tourInProgress)
                ),
            {matchesInProgress: [], availablePlayers: players, previousTours: tours}
        ).matchesInProgress;

const addMatches = ({
    players,
    tours
}: Session<Ready>, fieldCount: number): Tour<ToProcess> => BySimpleWhomPlayedLeast(players, tours, fieldCount);

const hasWinner = ([playerResult1, playerResult2]: MatchResult<Status>, winner: Winner) => playerResult1.nom === winner.nom || playerResult2.nom === winner.nom

const getPlayerScore = (player1: PlayerResult<ToProcess>, winner: Winner) => player1.nom === winner.nom ? winner.score : Lose;

const setWinner = ([player1, player2]: MatchResult<ToProcess>, winner: Winner): MatchResult<Ready> => [
    {nom: player1.nom, score: getPlayerScore(player1, winner)},
    {nom: player2.nom, score: getPlayerScore(player2, winner)}
]

const toMatchesWithScoreFor = (winner: Winner) => (matchResult: MatchResult<Status>): MatchResult<Status> => hasWinner(matchResult, winner) ? setWinner(matchResult, winner) : matchResult;

const previous = (tours: Tour<Status>[]): Tour<Ready>[] => tours.slice(0, -1);

const setMatchesScoreForLast = (tours: Tour<Status>[], winner: Winner): Tour<Status> => (tours.at(-1) ?? []).map(toMatchesWithScoreFor(winner));

const setMatchScore = ({players, tours}: Session<Status>, winner: Winner): Session<Status> => ({
    players,
    tours: [...(previous(tours)), setMatchesScoreForLast(tours, winner)]
});

// todo set score when match finish and level
// todo set to double
// todo add player in session when session is started

const player1 = makePlayer(0, 'jeanne');
const player2 = makePlayer(0, 'serge');
const player3 = makePlayer(0, 'jeannette');
const player4 = makePlayer(0, 'paul');

const emptySession: Session<Ready> = makeSession([player1, player2, player3, player4]);

const session1: Session<ToProcess> = addTourToSession(emptySession, 2);
const session2: Session<ToProcess> = addTourToSession(session1, 2);
//if(areAllToursReady(session1.tours)) {
//    const session2: Session<ToProcess> = addTourToSession(session1, 2);
//}
// const session1inProgress: Session<Ready | ToProcess> = setMatchScore(session1, {nom: "jeanne", score: MatchScore.Win})
// const session1WithScoreForMatch2 = setMatchScore(session1WithScoreForMatch1, {nom: "paul", score: MatchScore.StrongWin})
//const readySession: Session<Ready> = isSessionReady(session1inProgress);





describe('add score after every tour', () => {
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

        const session1:Session<ToProcess> = addTourToSession(emptySession, 2);

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

       const session1withMatch1Scores: Session<ToProcess> = setMatchScore(session1, { nom: 'paul', score: StrongWin});
       const session1withMatch2Scores: Session<ToProcess> = setMatchScore(session1withMatch1Scores, { nom: 'jeanne', score: Win});

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
});
