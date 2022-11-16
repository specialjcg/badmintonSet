type SpaceXLaunch = {
  date_utc: string;
  cores: [{ reused: boolean }];
};

const LAUNCH_COST_CO2 = 1_115_000;

const BUILD_COST_CO2 = 300_000;

const computeCo2Cost = (launchNumber: number, reused: number): number =>
  launchNumber * LAUNCH_COST_CO2 + (launchNumber - reused) * BUILD_COST_CO2;

const BEEFSTEAK_COST_CO2 = 15.5;

const ROUND_TRIP_COST_CO2 = 909;

const computeBeffSteakCost = (launchNumber: number, reused: number): number =>
  computeCo2Cost(launchNumber, reused) / BEEFSTEAK_COST_CO2;

const computeRoundTripCost = (launchNumber: number, reused: number): number =>
  computeCo2Cost(launchNumber, reused) / ROUND_TRIP_COST_CO2;

const inDateInterval =
  ([dateStart, dateEnd]: [Date, Date]) =>
  (spacexLaunch: SpaceXLaunch) =>
    new Date(spacexLaunch.date_utc) < dateEnd && new Date(spacexLaunch.date_utc) > dateStart;

const toLaunchAndReusedCount = (spacexLaunches: SpaceXLaunch[], interval: [Date, Date]) =>
  ((filteredSpacexLaunches: SpaceXLaunch[]): { launchNumber: number; reused: number } => ({
    launchNumber: filteredSpacexLaunches.length,
    reused: filteredSpacexLaunches.filter((spacexLaunch) => spacexLaunch.cores[0].reused).length
  }))(spacexLaunches.filter(inDateInterval(interval)));

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
    expect(toLaunchAndReusedCount(spacexLaunches, [dateStart, dateEnd])).toStrictEqual({ launchNumber: 1, reused: 0 });
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
    expect(toLaunchAndReusedCount(spacexLaunches, [dateStart, dateEnd])).toStrictEqual({ launchNumber: 2, reused: 1 });
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
    expect(toLaunchAndReusedCount(spacexLaunches, [dateStart, dateEnd])).toStrictEqual({ launchNumber: 1, reused: 0 });
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
    expect(toLaunchAndReusedCount(spacexLaunches, [dateStart, dateEnd])).toStrictEqual({ launchNumber: 2, reused: 1 });
  });
});
