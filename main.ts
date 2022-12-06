import axios from 'axios';
import {
  computeBeffSteakCost,
  computeCo2Cost,
  computeRoundTripCost,
  rawDataIsSpacexLauncheType,
  SpaceXLaunch,
  toLaunchAndReusedCount
} from './rawDataIsSpacexLauncheType';

const inquirer = require('inquirer');
const SPACEXURL = 'https://api.spacexdata.com/v5/';
const fromApiSpacextoSpacexLaunches = async (): Promise<SpaceXLaunch[]> => {
  const api = axios.create({ baseURL: SPACEXURL });
  const result: SpaceXLaunch[] = await api.get('launches');
  if (!rawDataIsSpacexLauncheType(result)) return [];
  return result;
};
const questions = [];
type Unit = 'Kg Beef' | 'RoundTrip Paris/New York' | 'Kg CO2';

const validateDate = (date: string) => {
  return new Date(date).toDateString() !== 'Invalid Date';
};

questions.push({
  type: 'input',
  name: 'date_debut',
  validate: validateDate,
  message: 'Please choose interval start date'
});
questions.push({
  type: 'input',
  name: 'date_fin',
  validate: validateDate,
  message: 'Please choose interval end date'
});

questions.push({
  type: 'list',
  name: 'unit',
  message: 'Please choose emmision CO2 unit',
  choices: ['Kg Beef', 'RoundTrip Paris/New York', 'Kg CO2'],
  default: 'Kg CO2'
});
inquirer
  .prompt(questions)
  .then(async (answers: { date_debut: string; date_fin: string; unit: Unit }) => {
    const result: SpaceXLaunch[] = await fromApiSpacextoSpacexLaunches();
    const launchAndReusedCount: { launchNumber: number; reused: number } = toLaunchAndReusedCount(result, [
      new Date(answers.date_debut),
      new Date(answers.date_fin)
    ]);
    switch (answers.unit) {
      case 'Kg Beef':
        console.log(computeBeffSteakCost(launchAndReusedCount.launchNumber, launchAndReusedCount.reused));
        break;
      case 'Kg CO2':
        console.log(computeCo2Cost(launchAndReusedCount.launchNumber, launchAndReusedCount.reused));
        break;
      case 'RoundTrip Paris/New York':
        console.log(computeRoundTripCost(launchAndReusedCount.launchNumber, launchAndReusedCount.reused));
        break;
    }
  })
  .catch((error: { isTtyError: any }) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
//fromApiSpacextoSpacexLaunches();
