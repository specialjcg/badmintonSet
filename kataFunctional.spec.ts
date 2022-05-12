type Level = number;

type Player = { nom: string; level: Level };

type Match<T extends Double | Simple = Double | Simple> = {
    players: T;
};

type Simple = [Player, Player];

type Double = [Player, Player, Player, Player];

type MatchWithOnlyServerPlayer = (player2: Player) => Match<Simple>;

type PlayerPools = {
    playersInGame: Player[];
    standbyPlayers: Player[];
}
type MatchesWithStandByPlayers = {
    matches: Match[];
    standbyPlayers: Player[];
}

type PlayerPoolsWithHistory = PlayerPools & { history: MatchesWithStandByPlayers[] };

/* describe("réflexions de Romain", (): void => {
   it("devrait représenter un historique", (): void => {
   const event: [] = [
     {
       session:
       allPlayers: [
         { nom: "jeanne"},
         { nom: "serge"},
         { nom: "jeannette" },
         { nom: "sergei" },
         { nom: "jeanneyeyeyeye" },
         { nom: "sergetititit" }
       ],
       matches: [
        {
         "jeanne": 3,
         "serge": 0
        },
        {
         "jeannette": 2,
         "sergei": 1
        }
       ]
     } as Event,
     {
       allPlayers: [
         {level: 0, nom: "jeanne"},
         {level: 0, nom: "serge"},
         { level:0, nom: "jeannette" },
         { level:0, nom: "sergei" },
         { level:0, nom: "jeanneyeyeyeye" },
         { level:0, nom: "sergetititit" }
       ],
       allMissing: [ {level: 0, nom: "jeanne"}, {level: 0, nom: "serge"},]
       match: [
         "jeannette": 2,
         "sergei": 1
       ],
     } as Event,
   ];
  });
 });*/

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

const makeSession = (players: Player[]): Session => ({players, tours: []});

const addTourToSession = (session: Session): Session => ({
    players: session.players,
    tours: [...session.tours, ...addMatches(session)]
});

type PlayerCountEncounter = {
    nom: string,
    encounterCount: number
};

const addMatches = ({players, tours}: {players: Player[], tours: MatchResult[]}): MatchResult[] => {
  let matchResults: MatchResult[] = [];

  if (tours.length === 0) {
    for (let i = 0; i < players.length; i += 2) {
      matchResults = [
        ...matchResults,
        {
          [players[i].nom]: MatchScore.NotPlayed,
          [players[i + 1].nom]: MatchScore.NotPlayed,
        }
      ];
    }

    return matchResults;
  }
//todo attention not same player in same session
//     "tours": [
//         {
//             "jeanne": 0,
//             "serge": 0
//         },
//         {
//             "jeannette": 0,
//             "sergei": 0
//         },
    //round 1
//         {
//             "jeanne": 0,
//             "jeannette": 0
//         },
//         {
//             "jeannette": 0,
//             "serge": 0
//         },
    //round2  jeannette selected twice not possible
//         {
//             "jeanne": 0,
//             "jeannette": 0
//         },
//         {
//             "jeanne": 0,
//             "sergei": 0
//         }



  for (let player of players) {
    const toursForPlayer: MatchResult[] = tours.filter((tour: MatchResult) => {
        return tour[player.nom] == null;
    });

const addMatches = ({players, tours}: { players: Player[], tours: MatchResult[] }): MatchResult[] => {
    return groupSuccessivePlayersByTwo(players);
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

    it("should create a session with 1 tour for 2 players", (): void => {
        const player1 = makePlayer(0, "jeanne");
        const player2 = makePlayer(0, "serge");

        const emptySession: Session = makeSession([player1, player2]);

        const session: Session = addTourToSession(emptySession);

        expect(session).toEqual(
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
                ],
            })
    });

    it("should create a session with 1 tour for 4 players with 2 fields", (): void => {
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
    });

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


/*
 * TODO ExpectMatchesToEqual
 *  const expected = ['Alice', 'Bob'];
 *   it('matches even if received contains additional elements', () => {
 *     expect(['Alice', 'Bob', 'Eve']).toEqual(expect.arrayContaining(expected));
 *   });
 */
