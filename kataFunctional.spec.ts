import {
  BUILD_COST_CO2,
  computeBeffSteakCost,
  computeCo2Cost,
  computeRoundTripCost,
  isSpaceLaunchType,
  LAUNCH_COST_CO2,
  rawDataIsSpacexLauncheType,
  SpaceXLaunch,
  toLaunchAndReusedCount
} from './rawDataIsSpacexLauncheType';
const BEEFSTEAK_COST_CO2 = 15.5;

const ROUND_TRIP_COST_CO2 = 909;

describe('spaceX', function () {
  it('should cost 1Million co2 when launch', function () {
    const launchNumber: number = 1;

    const reused: number = 1;

    const co2Cost: number = computeCo2Cost(launchNumber, reused);

    expect(co2Cost).toBe(LAUNCH_COST_CO2);
  });
  it('should cost 2Million co2 when 2 launch', function () {
    const launchNumber: number = 2;

    const reused: number = 2;

    const co2Cost: number = computeCo2Cost(launchNumber, reused);

    expect(co2Cost).toBe(2 * LAUNCH_COST_CO2);
  });
  it('should cost 2Million co2  + 600000 co2 when 2 launch no reused', function () {
    const launchNumber: number = 2;

    const reused: number = 0;

    const co2Cost: number = computeCo2Cost(launchNumber, reused);

    expect(co2Cost).toBe(2 * (LAUNCH_COST_CO2 + BUILD_COST_CO2));
  });
  it('should cost 2Million co2  + 300000 co2 when 2 launch 1 reused and one no reused', function () {
    const launchNumber: number = 2;

    const reused: number = 1;

    const co2Cost: number = computeCo2Cost(launchNumber, reused);

    expect(co2Cost).toBe(2 * LAUNCH_COST_CO2 + BUILD_COST_CO2);
  });
  it('should cost 2Million divise 15.5  Beefsteak 2 launch 1 reused ', function () {
    const launchNumber: number = 2;

    const reused: number = 1;

    const beefSteakCost: number = computeBeffSteakCost(launchNumber, reused);

    expect(beefSteakCost).toBe((2 * LAUNCH_COST_CO2 + BUILD_COST_CO2) / BEEFSTEAK_COST_CO2);
  });
  it('should cost 2Million divise 909kg  RoundTrip 2 launch 1 reused ', function () {
    const launchNumber: number = 2;

    const reused: number = 1;

    const roundTripCost: number = computeRoundTripCost(launchNumber, reused);

    expect(roundTripCost).toBe((2 * LAUNCH_COST_CO2 + BUILD_COST_CO2) / ROUND_TRIP_COST_CO2);
  });
  it('should convert api spacex launches to domain SpacexLaunch', function () {
    const spacexLaunches: SpaceXLaunch[] = [
      {
        date_utc: '2006-03-24T22:30:00.000Z',
        cores: [
          {
            reused: false
          }
        ]
      }
    ];
    const dateEnd = new Date('2008-01-01');
    const dateStart = new Date('2006-01-01');
    expect(toLaunchAndReusedCount(spacexLaunches, [dateStart, dateEnd])).toStrictEqual({
      launchNumber: 1,
      reused: 0
    });
  });
  it('should convert api spacex launches to domain SpacexLaunch with 2 launch and 1 reused', function () {
    const spacexLaunches: SpaceXLaunch[] = [
      {
        date_utc: '2006-03-24T22:30:00.000Z',
        cores: [
          {
            reused: false
          }
        ]
      },
      {
        date_utc: '2007-03-24T22:30:00.000Z',
        cores: [
          {
            reused: true
          }
        ]
      }
    ];
    const dateEnd = new Date('2008-01-01');
    const dateStart = new Date('2006-01-01');
    expect(toLaunchAndReusedCount(spacexLaunches, [dateStart, dateEnd])).toStrictEqual({
      launchNumber: 2,
      reused: 1
    });
  });
  it('should convert api spacex launches to domain SpacexLaunch with 2 launch and 1 reused before 2007', function () {
    const spacexLaunches: SpaceXLaunch[] = [
      {
        date_utc: '2006-03-24T22:30:00.000Z',
        cores: [
          {
            reused: false
          }
        ]
      },
      {
        date_utc: '2007-03-24T22:30:00.000Z',
        cores: [
          {
            reused: true
          }
        ]
      }
    ];
    const dateEnd = new Date('2007-01-01');
    const dateStart = new Date('2006-01-01');
    expect(toLaunchAndReusedCount(spacexLaunches, [dateStart, dateEnd])).toStrictEqual({
      launchNumber: 1,
      reused: 0
    });
  });
  it('should convert api spacex launches to domain SpacexLaunch with 2 launch and 1 reused between 2006 2007', function () {
    const spacexLaunches: SpaceXLaunch[] = [
      {
        date_utc: '2005-05-24T22:30:00.000Z',
        cores: [
          {
            reused: false
          }
        ]
      },
      {
        date_utc: '2006-03-24T22:30:00.000Z',
        cores: [
          {
            reused: false
          }
        ]
      },
      {
        date_utc: '2007-03-24T22:30:00.000Z',
        cores: [
          {
            reused: true
          }
        ]
      },
      {
        date_utc: '2008-03-24T22:30:00.000Z',
        cores: [
          {
            reused: true
          }
        ]
      }
    ];
    const dateEnd = new Date('2008-01-01');
    const dateStart = new Date('2006-01-01');
    expect(toLaunchAndReusedCount(spacexLaunches, [dateStart, dateEnd])).toStrictEqual({
      launchNumber: 2,
      reused: 1
    });
  });
  it('should typeGuard one entry api', () => {
    expect(isSpaceLaunchType(rawData[1])).toBe(true);
  });
  it('should typeGuard raw api return', () => {
    expect(rawDataIsSpacexLauncheType(rawData)).toBe(true);
  });
});
const rawData = [
  {
    fairings: {
      reused: false,
      recovery_attempt: false,
      recovered: false,
      ships: []
    },
    links: {
      patch: {
        small: 'https://images2.imgbox.com/94/f2/NN6Ph45r_o.png',
        large: 'https://images2.imgbox.com/5b/02/QcxHUb5V_o.png'
      },
      reddit: {
        campaign: null,
        launch: null,
        media: null,
        recovery: null
      },
      flickr: {
        small: [],
        original: []
      },
      presskit: null,
      webcast: 'https://www.youtube.com/watch?v=0a_00nJ_Y88',
      youtube_id: '0a_00nJ_Y88',
      article: 'https://www.space.com/2196-spacex-inaugural-falcon-1-rocket-lost-launch.html',
      wikipedia: 'https://en.wikipedia.org/wiki/DemoSat'
    },
    static_fire_date_utc: '2006-03-17T00:00:00.000Z',
    static_fire_date_unix: 1142553600,
    net: false,
    window: 0,
    rocket: '5e9d0d95eda69955f709d1eb',
    success: false,
    failures: [
      {
        time: 33,
        altitude: null,
        reason: 'merlin engine failure'
      }
    ],
    details: 'Engine failure at 33 seconds and loss of vehicle',
    crew: [],
    ships: [],
    capsules: [],
    payloads: ['5eb0e4b5b6c3bb0006eeb1e1'],
    launchpad: '5e9e4502f5090995de566f86',
    flight_number: 1,
    name: 'FalconSat',
    date_utc: '2006-03-24T22:30:00.000Z',
    date_unix: 1143239400,
    date_local: '2006-03-25T10:30:00+12:00',
    date_precision: 'hour',
    upcoming: false,
    cores: [
      {
        core: '5e9e289df35918033d3b2623',
        flight: 1,
        gridfins: false,
        legs: false,
        reused: false,
        landing_attempt: false,
        landing_success: null,
        landing_type: null,
        landpad: null
      }
    ],
    auto_update: true,
    tbd: false,
    launch_library_id: null,
    id: '5eb87cd9ffd86e000604b32a'
  },
  {
    fairings: {
      reused: false,
      recovery_attempt: false,
      recovered: false,
      ships: []
    },
    links: {
      patch: {
        small: 'https://images2.imgbox.com/f9/4a/ZboXReNb_o.png',
        large: 'https://images2.imgbox.com/80/a2/bkWotCIS_o.png'
      },
      reddit: {
        campaign: null,
        launch: null,
        media: null,
        recovery: null
      },
      flickr: {
        small: [],
        original: []
      },
      presskit: null,
      webcast: 'https://www.youtube.com/watch?v=Lk4zQ2wP-Nc',
      youtube_id: 'Lk4zQ2wP-Nc',
      article: 'https://www.space.com/3590-spacex-falcon-1-rocket-fails-reach-orbit.html',
      wikipedia: 'https://en.wikipedia.org/wiki/DemoSat'
    },
    static_fire_date_utc: null,
    static_fire_date_unix: null,
    net: false,
    window: 0,
    rocket: '5e9d0d95eda69955f709d1eb',
    success: false,
    failures: [
      {
        time: 301,
        altitude: 289,
        reason: 'harmonic oscillation leading to premature engine shutdown'
      }
    ],
    details:
      'Successful first stage burn and transition to second stage, maximum altitude 289 km, Premature engine shutdown at T+7 min 30 s, Failed to reach orbit, Failed to recover first stage',
    crew: [],
    ships: [],
    capsules: [],
    payloads: ['5eb0e4b6b6c3bb0006eeb1e2'],
    launchpad: '5e9e4502f5090995de566f86',
    flight_number: 2,
    name: 'DemoSat',
    date_utc: '2007-03-21T01:10:00.000Z',
    date_unix: 1174439400,
    date_local: '2007-03-21T13:10:00+12:00',
    date_precision: 'hour',
    upcoming: false,
    cores: [
      {
        core: '5e9e289ef35918416a3b2624',
        flight: 1,
        gridfins: false,
        legs: false,
        reused: false,
        landing_attempt: false,
        landing_success: null,
        landing_type: null,
        landpad: null
      }
    ],
    auto_update: true,
    tbd: false,
    launch_library_id: null,
    id: '5eb87cdaffd86e000604b32b'
  },
  {
    fairings: {
      reused: false,
      recovery_attempt: false,
      recovered: false,
      ships: []
    },
    links: {
      patch: {
        small: 'https://images2.imgbox.com/6c/cb/na1tzhHs_o.png',
        large: 'https://images2.imgbox.com/4a/80/k1oAkY0k_o.png'
      },
      reddit: {
        campaign: null,
        launch: null,
        media: null,
        recovery: null
      },
      flickr: {
        small: [],
        original: []
      },
      presskit: null,
      webcast: 'https://www.youtube.com/watch?v=v0w9p3U8860',
      youtube_id: 'v0w9p3U8860',
      article: 'http://www.spacex.com/news/2013/02/11/falcon-1-flight-3-mission-summary',
      wikipedia: 'https://en.wikipedia.org/wiki/Trailblazer_(satellite)'
    },
    static_fire_date_utc: null,
    static_fire_date_unix: null,
    net: false,
    window: 0,
    rocket: '5e9d0d95eda69955f709d1eb',
    success: false,
    failures: [
      {
        time: 140,
        altitude: 35,
        reason: 'residual stage-1 thrust led to collision between stage 1 and stage 2'
      }
    ],
    details: 'Residual stage 1 thrust led to collision between stage 1 and stage 2',
    crew: [],
    ships: [],
    capsules: [],
    payloads: ['5eb0e4b6b6c3bb0006eeb1e3', '5eb0e4b6b6c3bb0006eeb1e4'],
    launchpad: '5e9e4502f5090995de566f86',
    flight_number: 3,
    name: 'Trailblazer',
    date_utc: '2008-08-03T03:34:00.000Z',
    date_unix: 1217734440,
    date_local: '2008-08-03T15:34:00+12:00',
    date_precision: 'hour',
    upcoming: false,
    cores: [
      {
        core: '5e9e289ef3591814873b2625',
        flight: 1,
        gridfins: false,
        legs: false,
        reused: false,
        landing_attempt: false,
        landing_success: null,
        landing_type: null,
        landpad: null
      }
    ],
    auto_update: true,
    tbd: false,
    launch_library_id: null,
    id: '5eb87cdbffd86e000604b32c'
  }
];
