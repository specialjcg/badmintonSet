function stryNS_9fa48() {
  var g = new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});

  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }

  function retrieveNS() {
    return ns;
  }

  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}

stryNS_9fa48();

function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });

  function cover() {
    var c = cov.static;

    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }

    var a = arguments;

    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }

  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}

function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();

  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }

      return true;
    }

    return false;
  }

  stryMutAct_9fa48 = isActive;
  return isActive(id);
}

type Player = {
  nom: string;
};
type Match = MatchDouble | MatchSimple;
type MatchSimple = {
  players: [Player, Player];
};
type MatchDouble = {
  players: [Player, Player, Player, Player];
};
type MatchWithOnlyServerPlayer = (player2: Player) => Match;
const createMatch: (player1: Player) => MatchWithOnlyServerPlayer = stryMutAct_9fa48("0") ? () => undefined : (stryCov_9fa48("0"), (() => {
  const createMatch: (player1: Player) => MatchWithOnlyServerPlayer = (player1: Player): MatchWithOnlyServerPlayer => stryMutAct_9fa48("1") ? () => undefined : (stryCov_9fa48("1"), (player2: Player): Match => stryMutAct_9fa48("2") ? {} : (stryCov_9fa48("2"), {
    players: stryMutAct_9fa48("3") ? [] : (stryCov_9fa48("3"), [player1, player2])
  }));

  return createMatch;
})());
const isEven = stryMutAct_9fa48("4") ? () => undefined : (stryCov_9fa48("4"), (() => {
  const isEven = (index: number): boolean => stryMutAct_9fa48("7") ? index % 2 !== 0 : stryMutAct_9fa48("6") ? false : stryMutAct_9fa48("5") ? true : (stryCov_9fa48("5", "6", "7"), (stryMutAct_9fa48("8") ? index * 2 : (stryCov_9fa48("8"), index % 2)) === 0);

  return isEven;
})());
const addMatch: (matches: Match[], serverPlayer: Player, receiverPlayer: Player) => Match[] = stryMutAct_9fa48("9") ? () => undefined : (stryCov_9fa48("9"), (() => {
  const addMatch: (matches: Match[], serverPlayer: Player, receiverPlayer: Player) => Match[] = (matches: Match[], serverPlayer: Player, receiverPlayer: Player): Match[] => stryMutAct_9fa48("10") ? [] : (stryCov_9fa48("10"), [...matches, createMatch(serverPlayer)(receiverPlayer)]);

  return addMatch;
})());
const createPlayerSimpleMatch = stryMutAct_9fa48("11") ? () => undefined : (stryCov_9fa48("11"), (() => {
  const createPlayerSimpleMatch = (listPlayer: Player[]): Match[] => listPlayer.reduce(stryMutAct_9fa48("12") ? () => undefined : (stryCov_9fa48("12"), (matches: Match[], serverPlayer: Player, index: number, playersToSplit: Player[]): Match[] => isEven(index) ? addMatch(matches, serverPlayer, playersToSplit[stryMutAct_9fa48("13") ? index - 1 : (stryCov_9fa48("13"), index + 1)]) : matches), stryMutAct_9fa48("14") ? ["Stryker was here"] : (stryCov_9fa48("14"), []));

  return createPlayerSimpleMatch;
})());
const createPlayerDoubleMatch = stryMutAct_9fa48("15") ? () => undefined : (stryCov_9fa48("15"), (() => {
  const createPlayerDoubleMatch = (listPlayer: Player[]): Match[] => stryMutAct_9fa48("16") ? [] : (stryCov_9fa48("16"), [stryMutAct_9fa48("17") ? {} : (stryCov_9fa48("17"), {
    players: stryMutAct_9fa48("18") ? [] : (stryCov_9fa48("18"), [listPlayer[0], listPlayer[1], listPlayer[2], listPlayer[3]])
  })]);

  return createPlayerDoubleMatch;
})());
const selectPlayersForSimpleMatches = stryMutAct_9fa48("19") ? () => undefined : (stryCov_9fa48("19"), (() => {
  const selectPlayersForSimpleMatches = (listPlayer: Player[], availableFieldsCount: number): Player[] => listPlayer.slice(0, stryMutAct_9fa48("20") ? availableFieldsCount / 2 : (stryCov_9fa48("20"), availableFieldsCount * 2));

  return selectPlayersForSimpleMatches;
})());
const createPlayerMatch = stryMutAct_9fa48("21") ? () => undefined : (stryCov_9fa48("21"), (() => {
  const createPlayerMatch = (listPlayer: Player[], availableFieldsCount: number, preferDouble: boolean = stryMutAct_9fa48("22") ? true : (stryCov_9fa48("22"), false)): Match[] => preferDouble ? createPlayerDoubleMatch(listPlayer) : createPlayerSimpleMatch(selectPlayersForSimpleMatches(listPlayer, availableFieldsCount));

  return createPlayerMatch;
})());

const pollPlayer = (listPlayer: Player[]): {
  playersInGame: Player[];
  standbyPlayers: Player[];
} => {
  if (stryMutAct_9fa48("23")) {
    {}
  } else {
    stryCov_9fa48("23");

    if (stryMutAct_9fa48("25") ? false : stryMutAct_9fa48("24") ? true : (stryCov_9fa48("24", "25"), isEven(listPlayer.length))) {
      if (stryMutAct_9fa48("26")) {
        {}
      } else {
        stryCov_9fa48("26");
        return stryMutAct_9fa48("27") ? {} : (stryCov_9fa48("27"), {
          playersInGame: listPlayer,
          standbyPlayers: stryMutAct_9fa48("28") ? ["Stryker was here"] : (stryCov_9fa48("28"), [])
        });
      }
    }

    return stryMutAct_9fa48("29") ? {} : (stryCov_9fa48("29"), {
      playersInGame: (stryMutAct_9fa48("30") ? [] : (stryCov_9fa48("30"), [...listPlayer])).splice(0, stryMutAct_9fa48("31") ? listPlayer.length + 1 : (stryCov_9fa48("31"), listPlayer.length - 1)),
      standbyPlayers: stryMutAct_9fa48("32") ? [] : (stryCov_9fa48("32"), [listPlayer[stryMutAct_9fa48("33") ? listPlayer.length + 1 : (stryCov_9fa48("33"), listPlayer.length - 1)]])
    });
  }
};

describe(stryMutAct_9fa48("34") ? "" : (stryCov_9fa48("34"), "match"), (): void => {
  if (stryMutAct_9fa48("35")) {
    {}
  } else {
    stryCov_9fa48("35");
    it(stryMutAct_9fa48("36") ? "" : (stryCov_9fa48("36"), "should create a match with 2 players"), (): void => {
      if (stryMutAct_9fa48("37")) {
        {}
      } else {
        stryCov_9fa48("37");
        const player1: Player = stryMutAct_9fa48("38") ? {} : (stryCov_9fa48("38"), {
          nom: stryMutAct_9fa48("39") ? "" : (stryCov_9fa48("39"), "jeanne")
        });
        const player2: Player = stryMutAct_9fa48("40") ? {} : (stryCov_9fa48("40"), {
          nom: stryMutAct_9fa48("41") ? "" : (stryCov_9fa48("41"), "serge")
        });
        const match: Match = createMatch(player1)(player2);
        expect(match).toStrictEqual(stryMutAct_9fa48("42") ? {} : (stryCov_9fa48("42"), {
          players: stryMutAct_9fa48("43") ? [] : (stryCov_9fa48("43"), [player1, player2])
        }));
      }
    });
    it(stryMutAct_9fa48("44") ? "" : (stryCov_9fa48("44"), "should create a List of tuple of Server/Receiver from playerList"), (): void => {
      if (stryMutAct_9fa48("45")) {
        {}
      } else {
        stryCov_9fa48("45");
        const player1: Player = stryMutAct_9fa48("46") ? {} : (stryCov_9fa48("46"), {
          nom: stryMutAct_9fa48("47") ? "" : (stryCov_9fa48("47"), "jeanne")
        });
        const player2: Player = stryMutAct_9fa48("48") ? {} : (stryCov_9fa48("48"), {
          nom: stryMutAct_9fa48("49") ? "" : (stryCov_9fa48("49"), "serge")
        });
        const match: Match = createMatch(player1)(player2);
        expect(match).toStrictEqual(stryMutAct_9fa48("50") ? {} : (stryCov_9fa48("50"), {
          players: stryMutAct_9fa48("51") ? [] : (stryCov_9fa48("51"), [player1, player2])
        }));
      }
    });
    it(stryMutAct_9fa48("52") ? "" : (stryCov_9fa48("52"), "should create a List of tuple of Server_Receiver from playerList"), (): void => {
      if (stryMutAct_9fa48("53")) {
        {}
      } else {
        stryCov_9fa48("53");
        const player1: Player = stryMutAct_9fa48("54") ? {} : (stryCov_9fa48("54"), {
          nom: stryMutAct_9fa48("55") ? "" : (stryCov_9fa48("55"), "jeanne")
        });
        const player2: Player = stryMutAct_9fa48("56") ? {} : (stryCov_9fa48("56"), {
          nom: stryMutAct_9fa48("57") ? "" : (stryCov_9fa48("57"), "serge")
        });
        const listPlayer: Player[] = stryMutAct_9fa48("58") ? [] : (stryCov_9fa48("58"), [player1, player2]);
        const matches: Match[] = createPlayerMatch(listPlayer, 1);
        expect(matches).toStrictEqual(stryMutAct_9fa48("59") ? [] : (stryCov_9fa48("59"), [stryMutAct_9fa48("60") ? {} : (stryCov_9fa48("60"), {
          players: stryMutAct_9fa48("61") ? [] : (stryCov_9fa48("61"), [player1, player2])
        })]));
      }
    });
    it(stryMutAct_9fa48("62") ? "" : (stryCov_9fa48("62"), "should create a List of tuple of Server/Receiver from playerList with 4 players"), (): void => {
      if (stryMutAct_9fa48("63")) {
        {}
      } else {
        stryCov_9fa48("63");
        const player1: Player = stryMutAct_9fa48("64") ? {} : (stryCov_9fa48("64"), {
          nom: stryMutAct_9fa48("65") ? "" : (stryCov_9fa48("65"), "jeanne")
        });
        const player2: Player = stryMutAct_9fa48("66") ? {} : (stryCov_9fa48("66"), {
          nom: stryMutAct_9fa48("67") ? "" : (stryCov_9fa48("67"), "serge")
        });
        const player3: Player = stryMutAct_9fa48("68") ? {} : (stryCov_9fa48("68"), {
          nom: stryMutAct_9fa48("69") ? "" : (stryCov_9fa48("69"), "jeannette")
        });
        const player4: Player = stryMutAct_9fa48("70") ? {} : (stryCov_9fa48("70"), {
          nom: stryMutAct_9fa48("71") ? "" : (stryCov_9fa48("71"), "sergei")
        });
        const listPlayer: Player[] = stryMutAct_9fa48("72") ? [] : (stryCov_9fa48("72"), [player1, player2, player3, player4]);
        const matches: Match[] = createPlayerMatch(listPlayer, 2);
        expect(matches).toStrictEqual(stryMutAct_9fa48("73") ? [] : (stryCov_9fa48("73"), [stryMutAct_9fa48("74") ? {} : (stryCov_9fa48("74"), {
          players: stryMutAct_9fa48("75") ? [] : (stryCov_9fa48("75"), [player1, player2])
        }), stryMutAct_9fa48("76") ? {} : (stryCov_9fa48("76"), {
          players: stryMutAct_9fa48("77") ? [] : (stryCov_9fa48("77"), [player3, player4])
        })]));
      }
    });
    it(stryMutAct_9fa48("78") ? "" : (stryCov_9fa48("78"), "should affect distinct fields to  players without fields"), (): void => {
      if (stryMutAct_9fa48("79")) {
        {}
      } else {
        stryCov_9fa48("79");
        const player1: Player = stryMutAct_9fa48("80") ? {} : (stryCov_9fa48("80"), {
          nom: stryMutAct_9fa48("81") ? "" : (stryCov_9fa48("81"), "jeanne")
        });
        const player2: Player = stryMutAct_9fa48("82") ? {} : (stryCov_9fa48("82"), {
          nom: stryMutAct_9fa48("83") ? "" : (stryCov_9fa48("83"), "serge")
        });
        const player3: Player = stryMutAct_9fa48("84") ? {} : (stryCov_9fa48("84"), {
          nom: stryMutAct_9fa48("85") ? "" : (stryCov_9fa48("85"), "jeannette")
        });
        const player4: Player = stryMutAct_9fa48("86") ? {} : (stryCov_9fa48("86"), {
          nom: stryMutAct_9fa48("87") ? "" : (stryCov_9fa48("87"), "sergei")
        });
        const listPlayer: Player[] = stryMutAct_9fa48("88") ? [] : (stryCov_9fa48("88"), [player1, player2, player3, player4]);
        const matches: Match[] = createPlayerMatch(listPlayer, 2);
        expect(matches).toStrictEqual(stryMutAct_9fa48("89") ? [] : (stryCov_9fa48("89"), [stryMutAct_9fa48("90") ? {} : (stryCov_9fa48("90"), {
          players: stryMutAct_9fa48("91") ? [] : (stryCov_9fa48("91"), [player1, player2])
        }), stryMutAct_9fa48("92") ? {} : (stryCov_9fa48("92"), {
          players: stryMutAct_9fa48("93") ? [] : (stryCov_9fa48("93"), [player3, player4])
        })]));
      }
    });
    it(stryMutAct_9fa48("94") ? "" : (stryCov_9fa48("94"), "should affect distinct fields to  players without fields when less players than fields"), (): void => {
      if (stryMutAct_9fa48("95")) {
        {}
      } else {
        stryCov_9fa48("95");
        const player1: Player = stryMutAct_9fa48("96") ? {} : (stryCov_9fa48("96"), {
          nom: stryMutAct_9fa48("97") ? "" : (stryCov_9fa48("97"), "jeanne")
        });
        const player2: Player = stryMutAct_9fa48("98") ? {} : (stryCov_9fa48("98"), {
          nom: stryMutAct_9fa48("99") ? "" : (stryCov_9fa48("99"), "serge")
        });
        const listPlayer: Player[] = stryMutAct_9fa48("100") ? [] : (stryCov_9fa48("100"), [player1, player2]);
        const matches: Match[] = createPlayerMatch(listPlayer, 1);
        expect(matches).toStrictEqual(stryMutAct_9fa48("101") ? [] : (stryCov_9fa48("101"), [stryMutAct_9fa48("102") ? {} : (stryCov_9fa48("102"), {
          players: stryMutAct_9fa48("103") ? [] : (stryCov_9fa48("103"), [player1, player2])
        })]));
      }
    });
    it(stryMutAct_9fa48("104") ? "" : (stryCov_9fa48("104"), "should affect distinct fields to players without fields when less fields than players"), (): void => {
      if (stryMutAct_9fa48("105")) {
        {}
      } else {
        stryCov_9fa48("105");
        const player1: Player = stryMutAct_9fa48("106") ? {} : (stryCov_9fa48("106"), {
          nom: stryMutAct_9fa48("107") ? "" : (stryCov_9fa48("107"), "jeanne")
        });
        const player2: Player = stryMutAct_9fa48("108") ? {} : (stryCov_9fa48("108"), {
          nom: stryMutAct_9fa48("109") ? "" : (stryCov_9fa48("109"), "serge")
        });
        const player3: Player = stryMutAct_9fa48("110") ? {} : (stryCov_9fa48("110"), {
          nom: stryMutAct_9fa48("111") ? "" : (stryCov_9fa48("111"), "jeannette")
        });
        const player4: Player = stryMutAct_9fa48("112") ? {} : (stryCov_9fa48("112"), {
          nom: stryMutAct_9fa48("113") ? "" : (stryCov_9fa48("113"), "sergei")
        });
        const listPlayer: Player[] = stryMutAct_9fa48("114") ? [] : (stryCov_9fa48("114"), [player1, player2, player3, player4]);
        const matches: Match[] = createPlayerMatch(listPlayer, 1);
        expect(matches).toStrictEqual(stryMutAct_9fa48("115") ? [] : (stryCov_9fa48("115"), [stryMutAct_9fa48("116") ? {} : (stryCov_9fa48("116"), {
          players: stryMutAct_9fa48("117") ? [] : (stryCov_9fa48("117"), [player1, player2])
        })]));
      }
    });
    it(stryMutAct_9fa48("118") ? `` : (stryCov_9fa48("118"), `should split listplayer in to playeringame and standyplayer with 3 players`), (): void => {
      if (stryMutAct_9fa48("119")) {
        {}
      } else {
        stryCov_9fa48("119");
        const player1: Player = stryMutAct_9fa48("120") ? {} : (stryCov_9fa48("120"), {
          nom: stryMutAct_9fa48("121") ? "" : (stryCov_9fa48("121"), "jeanne")
        });
        const player2: Player = stryMutAct_9fa48("122") ? {} : (stryCov_9fa48("122"), {
          nom: stryMutAct_9fa48("123") ? "" : (stryCov_9fa48("123"), "serge")
        });
        const player3: Player = stryMutAct_9fa48("124") ? {} : (stryCov_9fa48("124"), {
          nom: stryMutAct_9fa48("125") ? "" : (stryCov_9fa48("125"), "jeanpaul")
        });
        const listPlayer: Player[] = stryMutAct_9fa48("126") ? [] : (stryCov_9fa48("126"), [player1, player2, player3]);
        const {
          playersInGame,
          standbyPlayers
        }: {
          playersInGame: Player[];
          standbyPlayers: Player[];
        } = pollPlayer(listPlayer);
        expect(playersInGame).toStrictEqual(stryMutAct_9fa48("127") ? [] : (stryCov_9fa48("127"), [player1, player2]));
        expect(standbyPlayers).toStrictEqual(stryMutAct_9fa48("128") ? [] : (stryCov_9fa48("128"), [player3]));
      }
    });
    it(stryMutAct_9fa48("129") ? `` : (stryCov_9fa48("129"), `should get 1 field with 4 players without standbyplayer`), (): void => {
      if (stryMutAct_9fa48("130")) {
        {}
      } else {
        stryCov_9fa48("130");
        const player1: Player = stryMutAct_9fa48("131") ? {} : (stryCov_9fa48("131"), {
          nom: stryMutAct_9fa48("132") ? "" : (stryCov_9fa48("132"), "jeanne")
        });
        const player2: Player = stryMutAct_9fa48("133") ? {} : (stryCov_9fa48("133"), {
          nom: stryMutAct_9fa48("134") ? "" : (stryCov_9fa48("134"), "serge")
        });
        const player3: Player = stryMutAct_9fa48("135") ? {} : (stryCov_9fa48("135"), {
          nom: stryMutAct_9fa48("136") ? "" : (stryCov_9fa48("136"), "jeanpaul")
        });
        const player4: Player = stryMutAct_9fa48("137") ? {} : (stryCov_9fa48("137"), {
          nom: stryMutAct_9fa48("138") ? "" : (stryCov_9fa48("138"), "alice")
        });
        const listPlayer: Player[] = stryMutAct_9fa48("139") ? [] : (stryCov_9fa48("139"), [player1, player2, player3, player4]);
        const {
          playersInGame,
          standbyPlayers
        }: {
          playersInGame: Player[];
          standbyPlayers: Player[];
        } = pollPlayer(listPlayer);
        expect(playersInGame).toStrictEqual(stryMutAct_9fa48("140") ? [] : (stryCov_9fa48("140"), [player1, player2, player3, player4]));
        expect(standbyPlayers).toStrictEqual(stryMutAct_9fa48("141") ? ["Stryker was here"] : (stryCov_9fa48("141"), []));
      }
    });
    it(stryMutAct_9fa48("142") ? "" : (stryCov_9fa48("142"), "should affect 1 field for a double match"), (): void => {
      if (stryMutAct_9fa48("143")) {
        {}
      } else {
        stryCov_9fa48("143");
        const player1: Player = stryMutAct_9fa48("144") ? {} : (stryCov_9fa48("144"), {
          nom: stryMutAct_9fa48("145") ? "" : (stryCov_9fa48("145"), "jeanne")
        });
        const player2: Player = stryMutAct_9fa48("146") ? {} : (stryCov_9fa48("146"), {
          nom: stryMutAct_9fa48("147") ? "" : (stryCov_9fa48("147"), "serge")
        });
        const player3: Player = stryMutAct_9fa48("148") ? {} : (stryCov_9fa48("148"), {
          nom: stryMutAct_9fa48("149") ? "" : (stryCov_9fa48("149"), "jeannette")
        });
        const player4: Player = stryMutAct_9fa48("150") ? {} : (stryCov_9fa48("150"), {
          nom: stryMutAct_9fa48("151") ? "" : (stryCov_9fa48("151"), "sergei")
        });
        const player5: Player = stryMutAct_9fa48("152") ? {} : (stryCov_9fa48("152"), {
          nom: stryMutAct_9fa48("153") ? "" : (stryCov_9fa48("153"), "henri")
        });
        const player6: Player = stryMutAct_9fa48("154") ? {} : (stryCov_9fa48("154"), {
          nom: stryMutAct_9fa48("155") ? "" : (stryCov_9fa48("155"), "alfred")
        });
        const player7: Player = stryMutAct_9fa48("156") ? {} : (stryCov_9fa48("156"), {
          nom: stryMutAct_9fa48("157") ? "" : (stryCov_9fa48("157"), "jeannette gtr")
        });
        const player8: Player = stryMutAct_9fa48("158") ? {} : (stryCov_9fa48("158"), {
          nom: stryMutAct_9fa48("159") ? "" : (stryCov_9fa48("159"), "marie")
        });
        const listPlayer: Player[] = stryMutAct_9fa48("160") ? [] : (stryCov_9fa48("160"), [player1, player2, player3, player4, player5, player6, player7, player8]);
        const matches: Match[] = createPlayerMatch(listPlayer, 2, stryMutAct_9fa48("161") ? false : (stryCov_9fa48("161"), true));
        expect(matches).toStrictEqual(stryMutAct_9fa48("162") ? [] : (stryCov_9fa48("162"), [stryMutAct_9fa48("163") ? {} : (stryCov_9fa48("163"), {
          players: stryMutAct_9fa48("164") ? [] : (stryCov_9fa48("164"), [player1, player2, player3, player4])
        }), stryMutAct_9fa48("165") ? {} : (stryCov_9fa48("165"), {
          players: stryMutAct_9fa48("166") ? [] : (stryCov_9fa48("166"), [player5, player6, player7, player8])
        })]));
      }
    });
    /*
     * TODO move selectPlayersForSimpleMatches (same for doubles) in pollPlayer to get standbyPlayers, createPlayerMatch should not be called directly
     *  First I create my pool, I get the playable payers (with specific types) and the standby, now I can call a function that create matches and only accept
     * TODO 1 field 4 players 4 players  play
     * TODO 2 field 5 players soit 4 players play on field1 and 1 standby or 2 on field 1 and 2 on field 2 and 1 standby
     * TODO another player on standby
     */

    /*
     * TODO voir aux nombre limite de terrain on peut ajouter les terrains au fur et a mesure peu d'interet
     * TODO mettre le niveau
     */
  }
});