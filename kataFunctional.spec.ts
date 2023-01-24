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
    nom: string;
    score: MatchScore;
};
type Winner = {
    nom: string;
    score: MatchScore.Win | MatchScore.StrongWin;
}
type MatchResult = [PlayerResult, PlayerResult];

type Tour = MatchResult[];

type Session = {
    players: Player[];
    tours: Tour[];
};

type PlayerMatchCount = {
    nom: string;
    count: number;
};

type TourInProgress = {
    matchesInProgress: Tour;
    availablePlayers: Player[];
    previousTours: Tour[];
};

const makeSession = (players: Player[]): Session => ({players, tours: []});

const addTourToSession = (session: Session, fieldCount: number): Session => ({
    players: session.players,
    tours: [...session.tours, addMatches(session, fieldCount)]
});

const byPlayerMatchCount = (playerMatchCount1: PlayerMatchCount, playerMatchCount2: PlayerMatchCount) =>
    playerMatchCount1.count - playerMatchCount2.count;

const toPlayerName = (player: { nom: string }) => player.nom;

const withToursPlayersNames = (matchResults: MatchResult[]): string[] =>
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
        .concat(tourInProgress.previousTours.flatMap((tour: Tour) => withToursPlayersNames(tour)))
        .filter(extractOpponentsFromParallelMatches(tourInProgress.matchesInProgress))
        .reduce(toPlayerMatchCount, [])
        .sort(byPlayerMatchCount)[0].nom;

const extractPlayerSoHeCannotPlayAgainstHimself = (playerThatPlayedLeast: string) => (nom: string) =>
    playerThatPlayedLeast !== nom;

const extractOpponentsFromParallelMatches =
    (matchResults: MatchResult[]) =>
        (opponentName: string): boolean =>
            !matchResults
                .flatMap(([playerResult1, playerResult2]: [PlayerResult, PlayerResult]) => [playerResult1.nom, playerResult2.nom])
                .includes(opponentName);

const withAllPlayersFromAllPreviousTours = (tours: Tour[]) =>
    tours.flatMap((matchResults: MatchResult[]) =>
        matchResults.flatMap(([playerResult1, playerResult2]: [PlayerResult, PlayerResult]) => [
            playerResult1.nom,
            playerResult2.nom
        ])
    );

const allMatchesFromPreviousToursForPlayer =
    (playerThatPlayedLeast: string) =>
        ([playerResult1, playerResult2]: MatchResult): boolean =>
            playerResult1.nom !== playerThatPlayedLeast && playerResult2.nom !== playerThatPlayedLeast;

const toOpponentsNames =
    (playerThatPlayedLeast: string) =>
        ([playerResult1, playerResult2]: MatchResult): string =>
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
    tours: Tour[]
) =>
    tours
        .flatMap((matchResults: MatchResult[]) => matchResults)
        .filter(allMatchesFromPreviousToursForPlayer(playerThatPlayedLeast))
        .map(toOpponentsNames(playerThatPlayedLeast))
        .filter(playersNotInList(listOfPlayersThatPlayedLeast(opponentPlaysCount, playerThatPlayedLeast)))
        .reduce(toPlayerMatchCount, [])
        .sort(byPlayerMatchCount)[0].nom;

const opponentIsFirstInList = (tours: Tour[], opponentPlaysCount: PlayerMatchCount[]) =>
    tours.length === 0 || opponentPlaysCount.length === 1 || opponentPlaysCount[0].count < opponentPlaysCount[1].count;

const opponentWhenEveryonePlayedOnce = (tours: Tour[], opponentPlaysCount: PlayerMatchCount[], playerThatPlayedLeast: string) =>
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

const makePlayerResult = (nom: string): PlayerResult => ({
    nom: nom,
    score: MatchScore.NotPlayed
});

const makeMatchResult = (playerName: string, tourInProgress: TourInProgress): MatchResult => [
    makePlayerResult(playerName),
    makePlayerResult(opponentThatLeastPlayedAgainstPlayer(playerName, tourInProgress))
];

const isNotInPreviousMatch =
    (match: [PlayerResult, PlayerResult]) =>
        (player: Player): boolean =>
            !match.map(toPlayerName).includes(player.nom);

const playersPairs = (players: Player[]) => players.length / 2;

const possibleMatchesCountInTour = (players: Player[], fieldCount: number) => Math.min(playersPairs(players), fieldCount);

const updateTourInProgress = (tourInProgress: TourInProgress, match: [PlayerResult, PlayerResult]): TourInProgress => ({
    matchesInProgress: [...tourInProgress.matchesInProgress, match],
    availablePlayers: tourInProgress.availablePlayers.filter(isNotInPreviousMatch(match)),
    previousTours: tourInProgress.previousTours
});

const BySimpleWhomPlayedLeast = (players: Player[], tours: Tour[], fieldCount: number): Tour =>
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
}: Session, fieldCount: number): Tour => BySimpleWhomPlayedLeast(players, tours, fieldCount);

const hasWinner = ([playerResult1, playerResult2]: MatchResult, winner: Winner) => playerResult1.nom === winner.nom || playerResult2.nom === winner.nom

const getPlayerScore = (player1: PlayerResult, winner: Winner) => player1.nom === winner.nom ? winner.score : MatchScore.Lose;

const setWinner = ([player1, player2]: MatchResult, winner: Winner): MatchResult => [
    {nom: player1.nom, score: getPlayerScore(player1, winner)},
    {nom: player2.nom, score: getPlayerScore(player2, winner)}
]

const toMatchesWithScoreFor = (winner: Winner) => (matchResult: MatchResult): MatchResult => hasWinner(matchResult, winner) ? setWinner(matchResult, winner) : matchResult;

const previous = (tours: Tour[]): Tour[] => tours.slice(0, -1);

const setMatchesScoreForLast = (tours: Tour[], winner: Winner): Tour => (tours.at(-1) ?? []).map(toMatchesWithScoreFor(winner));

const setMatchScore = ({players, tours}: Session, winner: Winner): Session => ({
    players,
    tours: [...(previous(tours)), setMatchesScoreForLast(tours, winner)]
});

// TODO Contrainte sur les types
// todo refacto addtourToSession for further tours session
// todo set score when match finish and level
// todo set to double
// todo add player in session when session is started

/*

Est ce qu'on peut en typescript avoir une contrainte sur les types qui fait qu'un tableau peut posséder plusieurs object d'un type 1 mais qu'un seul d'un type 2 ?

Yes, in TypeScript, you can use a combination of interfaces and type aliases to define a constraint on an array that specifies that it must contain multiple instances of one type and only one instance of another type.

Here is an example of how you might define such a constraint:


interface Type1 {
  // properties of Type1
}
interface Type2 {
  // properties of Type2
}
type ArrayWithMultipleType1AndSingleType2 = (Type1 | Type2)[] & {
  type1Count: number;
  type2?: Type2;
};

In this example, the type "ArrayWithMultipleType1AndSingleType2" is an intersection type of an array of Type1 or Type2 and an object that contains a number "type1Count" and a optional property "type2" of Type2.
This way, you can use this type to annotate variables and function parameters, ensuring that any array assigned to them contains the correct number of Type1 and Type2 objects.
It's important to note that this type only ensures that the array conforms to the specified constraints at the time of assignment and not during runtime, and also this is only a way to express the constraint but not a way to enforce it.
 */

describe('add score after every tour', () => {
    it('should set score at the end to last Tour jeanne win against serge and paul strong win against jeanette', () => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');
        const player3 = makePlayer(0, 'jeannette');
        const player4 = makePlayer(0, 'paul');

        const emptySession: Session = makeSession([player1, player2, player3, player4]);

        const session1 = addTourToSession(emptySession, 2);
        const session1WithScoreForMatch1 = setMatchScore(session1, {nom: "jeanne", score: MatchScore.Win})
        const session1WithScoreForMatch2 = setMatchScore(session1WithScoreForMatch1, {nom: "paul", score: MatchScore.StrongWin})
        const session2 = addTourToSession(session1WithScoreForMatch2, 2);

        expect(setMatchScore(session2, {nom: "jeanne", score: MatchScore.Win})).toEqual({
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
                            score: MatchScore.Win
                        },
                        {
                            nom: 'serge',
                            score: MatchScore.Lose
                        }
                    ],
                    [
                        {
                            nom: 'jeannette',
                            score: MatchScore.Lose
                        },
                        {
                            nom: 'paul',
                            score: MatchScore.StrongWin
                        }
                    ]
                ],
                [
                    [
                        {
                            nom: 'jeanne',
                            score: MatchScore.Win
                        },
                        {
                            nom: 'jeannette',
                            score: MatchScore.Lose
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
            ]
        });
    });

    it('should set score at the end to first Tour jeanne win against serge and paul strong win against jeanette', () => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');
        const player3 = makePlayer(0, 'jeannette');
        const player4 = makePlayer(0, 'paul');

        const emptySession: Session = makeSession([player1, player2, player3, player4]);

        const session1 = addTourToSession(emptySession, 2);

        const session1WithScoreForMatch1 = setMatchScore(session1, {nom: "jeanne", score: MatchScore.Win});
        const session1WithScoreForMatch2 = setMatchScore(session1WithScoreForMatch1, {nom: "paul", score: MatchScore.StrongWin});

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
                            score: MatchScore.Win
                        },
                        {
                            nom: 'serge',
                            score: MatchScore.Lose
                        }
                    ],
                    [
                        {
                            nom: 'jeannette',
                            score: MatchScore.Lose
                        },
                        {
                            nom: 'paul',
                            score: MatchScore.StrongWin
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

        const emptySession: Session = makeSession([player1, player2, player3, player4]);

        const session1 = addTourToSession(emptySession, 2);

        expect(setMatchScore(session1, {nom: "jeanne", score: MatchScore.Win})).toEqual({
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
                            score: MatchScore.Win
                        },
                        {
                            nom: 'serge',
                            score: MatchScore.Lose
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
                                score: MatchScore.NotPlayed
                            },
                            {
                                nom: 'serge',
                                score: MatchScore.NotPlayed
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
                                score: MatchScore.NotPlayed
                            },
                            {
                                nom: 'sergei',
                                score: MatchScore.NotPlayed
                            }
                        ]
                    ]
                ]
            }
        ]
    ])(
        `should create a session with 1 tour for 2 players %s VS %s} with 1 field`,
        (player1: Player, player2: Player, expected): void => {
            const emptySession: Session = makeSession([player1, player2]);

            const session: Session = addTourToSession(emptySession, 1);

            expect(session).toEqual(expected);
        }
    );

    it('should create a session with 2 tour for 2 players with 1 field', (): void => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');

        const emptySession: Session = makeSession([player1, player2]);

        const session: Session = addTourToSession(addTourToSession(emptySession, 1), 1);

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
        });
    });

    it('should create a session with 2 tour for 3 players with 1 field', (): void => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');
        const player3 = makePlayer(0, 'jeannette');

        const emptySession: Session = makeSession([player1, player2, player3]);

        const session: Session = addTourToSession(addTourToSession(emptySession, 1), 1);

        expect(session).toEqual({
            players: [
                {level: 0, nom: 'jeanne'},
                {level: 0, nom: 'serge'},
                {level: 0, nom: 'jeannette'}
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
                    ]
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
        });
    });

    it('should create a session with 2 tour for 4 players with 1 field', (): void => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');
        const player3 = makePlayer(0, 'jeannette');
        const player4 = makePlayer(0, 'paul');

        const emptySession: Session = makeSession([player1, player2, player3, player4]);

        const session: Session = addTourToSession(addTourToSession(emptySession, 1), 1);

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
        });
    });

    it('should create a session with 1 tour for 4 players with 2 field', (): void => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');
        const player3 = makePlayer(0, 'jeannette');
        const player4 = makePlayer(0, 'paul');

        const emptySession: Session = makeSession([player1, player2, player3, player4]);

        const session: Session = addTourToSession(emptySession, 2);

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
        });
    });

    it('should create a session with 1 tour for 6 players with 3 fields', (): void => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');
        const player3 = makePlayer(0, 'jeannette');
        const player4 = makePlayer(0, 'paul');
        const player5 = makePlayer(0, 'marc');
        const player6 = makePlayer(0, 'romain');
        const emptySession: Session = makeSession([player1, player2, player3, player4, player5, player6]);

        const session: Session = addTourToSession(emptySession, 3);

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
        });
    });

    it('should create a session with 1 tour for 4 players with 3 fields', (): void => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');
        const player3 = makePlayer(0, 'jeannette');
        const player4 = makePlayer(0, 'paul');

        const emptySession: Session = makeSession([player1, player2, player3, player4]);

        const session: Session = addTourToSession(emptySession, 3);

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
        });
    });


    /*
        const strategiesPriorityFirstTour = ['LevelStrategy', 'PlayedAgainstEveryoneStrategy'];
      const strategiesPrioritySecondTour = ['PlayedAgainstEveryoneStrategy', 'LevelStrategy'];

      const tourParams = [
        {
          fieldCount: 2,
          strategyPriority: strategiesPriorityFirstTour
        },
        {
          fieldCount: 2,
          strategyPriority: strategiesPrioritySecondTour
        }
      ];
     */

    it('should create a session with 2 tour for 4 players with 2 field', (): void => {
        const player1 = makePlayer(0, 'jeanne');
        const player2 = makePlayer(0, 'serge');
        const player3 = makePlayer(0, 'jeannette');
        const player4 = makePlayer(0, 'paul');

        const emptySession: Session = makeSession([player1, player2, player3, player4]);

        const session: Session = [2, 2].reduce(addTourToSession, emptySession);

        //const session: Session = addTourToSession(addTourToSession(emptySession, 2), 2);

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
                ],
                [
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
            ]
        });
    });
});
