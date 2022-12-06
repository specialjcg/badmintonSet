export type SpaceXLaunch = {
  date_utc: string;
  cores: [{ reused: boolean }];
};

export const isSpaceLaunchType = (raw: unknown): raw is SpaceXLaunch =>
  'date_utc' in (raw as object) && 'cores' in (raw as object);

export const LAUNCH_COST_CO2 = 1_115_000;

export const BUILD_COST_CO2 = 300_000;

export const computeCo2Cost = (launchNumber: number, reused: number): number =>
  launchNumber * LAUNCH_COST_CO2 + (launchNumber - reused) * BUILD_COST_CO2;

const BEEFSTEAK_COST_CO2 = 15.5;

const ROUND_TRIP_COST_CO2 = 909;

export const computeBeffSteakCost = (launchNumber: number, reused: number): number =>
  computeCo2Cost(launchNumber, reused) / BEEFSTEAK_COST_CO2;

export const computeRoundTripCost = (launchNumber: number, reused: number): number =>
  computeCo2Cost(launchNumber, reused) / ROUND_TRIP_COST_CO2;

const inDateInterval =
  ([dateStart, dateEnd]: [Date, Date]) =>
  (spacexLaunch: SpaceXLaunch) =>
    new Date(spacexLaunch.date_utc) < dateEnd && new Date(spacexLaunch.date_utc) > dateStart;

export const toLaunchAndReusedCount = (spacexLaunches: SpaceXLaunch[], interval: [Date, Date]) =>
  ((filteredSpacexLaunches: SpaceXLaunch[]): { launchNumber: number; reused: number } => ({
    launchNumber: filteredSpacexLaunches.length,
    reused: filteredSpacexLaunches.filter((spacexLaunch) => spacexLaunch.cores[0].reused).length
  }))(spacexLaunches.filter(inDateInterval(interval)));

export const rawDataIsSpacexLauncheType = (rawData: unknown[]): rawData is SpaceXLaunch[] => {
  if (!(rawData && rawData.length > 0)) return false;
  const isSpaceXType: boolean[] = rawData.map(isSpaceLaunchType);
  return rawData.map(isSpaceLaunchType).find((isSpaceXType) => isSpaceXType === false) === undefined;
};
