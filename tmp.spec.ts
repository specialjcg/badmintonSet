type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

type DayOfWeek2 = 'Monday' | 'Monday, Tuesday' |  'Monday, Tuesday'
const dayOfWeek3 = [
    'Monday',
    'Tuesday',
    'Monday, Tuesday',
    'Wednesday',
    'Monday, Wednesday',
    'Tuesday, Wednesday',
    'Monday, Tuesday, Wednesday',
    'Thursday',
    'Monday, Thursday',
    'Tuesday, Thursday',
    'Monday, Tuesday, Thursday',
    'Wednesday, Thursday',
    'Monday, Wednesday, Thursday',
    'Tuesday, Wednesday, Thursday',
    'Monday, Tuesday, Wednesday, Thursday',
    'Friday',
    'Monday, Friday',
    'Tuesday, Friday',
    'Monday, Tuesday, Friday',
    'Wednesday, Friday',
    'Monday, Wednesday, Friday',
    'Tuesday, Wednesday, Friday',
    'Monday, Tuesday, Wednesday, Friday',
    'Thursday, Friday',
    'Monday, Thursday, Friday',
    'Tuesday, Thursday, Friday',
    'Monday, Tuesday, Thursday, Friday',
    'Wednesday, Thursday, Friday',
    'Monday, Wednesday, Thursday, Friday',
    'Tuesday, Wednesday, Thursday, Friday',
    'Monday, Tuesday, Wednesday, Thursday, Friday',
    'Saturday',
    'Monday, Saturday',
    'Tuesday, Saturday',
    'Monday, Tuesday, Saturday',
    'Wednesday, Saturday',
    'Monday, Wednesday, Saturday',
    'Tuesday, Wednesday, Saturday',
    'Monday, Tuesday, Wednesday, Saturday',
    'Thursday, Saturday',
    'Monday, Thursday, Saturday',
    'Tuesday, Thursday, Saturday',
    'Monday, Tuesday, Thursday, Saturday',
    'Wednesday, Thursday, Saturday',
    'Monday, Wednesday, Thursday, Saturday',
    'Tuesday, Wednesday, Thursday, Saturday',
    'Monday, Tuesday, Wednesday, Thursday, Saturday',
    'Friday, Saturday',
    'Monday, Friday, Saturday',
    'Tuesday, Friday, Saturday',
    'Monday, Tuesday, Friday, Saturday',
    'Wednesday, Friday, Saturday',
    'Monday, Wednesday, Friday, Saturday',
    'Tuesday, Wednesday, Friday, Saturday',
    'Monday, Tuesday, Wednesday, Friday, Saturday',
    'Thursday, Friday, Saturday',
    'Monday, Thursday, Friday, Saturday',
    'Tuesday, Thursday, Friday, Saturday',
    'Monday, Tuesday, Thursday, Friday, Saturday',
    'Wednesday, Thursday, Friday, Saturday',
    'Monday, Wednesday, Thursday, Friday, Saturday',
    'Tuesday, Wednesday, Thursday, Friday, Saturday',
    'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday',
    'Sunday',
    'Monday, Sunday',
    'Tuesday, Sunday',
    'Monday, Tuesday, Sunday',
    'Wednesday, Sunday',
    'Monday, Wednesday, Sunday',
    'Tuesday, Wednesday, Sunday',
    'Monday, Tuesday, Wednesday, Sunday',
    'Thursday, Sunday',
    'Monday, Thursday, Sunday',
    'Tuesday, Thursday, Sunday',
    'Monday, Tuesday, Thursday, Sunday',
    'Wednesday, Thursday, Sunday',
    'Monday, Wednesday, Thursday, Sunday',
    'Tuesday, Wednesday, Thursday, Sunday',
    'Monday, Tuesday, Wednesday, Thursday, Sunday',
    'Friday, Sunday',
    'Monday, Friday, Sunday',
    'Tuesday, Friday, Sunday',
    'Monday, Tuesday, Friday, Sunday',
    'Wednesday, Friday, Sunday',
    'Monday, Wednesday, Friday, Sunday',
    'Tuesday, Wednesday, Friday, Sunday',
    'Monday, Tuesday, Wednesday, Friday, Sunday',
    'Thursday, Friday, Sunday',
    'Monday, Thursday, Friday, Sunday',
    'Tuesday, Thursday, Friday, Sunday',
    'Monday, Tuesday, Thursday, Friday, Sunday',
    'Wednesday, Thursday, Friday, Sunday',
    'Monday, Wednesday, Thursday, Friday, Sunday',
    'Tuesday, Wednesday, Thursday, Friday, Sunday',
    'Monday, Tuesday, Wednesday, Thursday, Friday, Sunday',
    'Saturday, Sunday',
    'Monday, Saturday, Sunday',
    'Tuesday, Saturday, Sunday',
    'Monday, Tuesday, Saturday, Sunday',
    'Wednesday, Saturday, Sunday',
    'Monday, Wednesday, Saturday, Sunday',
    'Tuesday, Wednesday, Saturday, Sunday',
    'Monday, Tuesday, Wednesday, Saturday, Sunday',
    'Thursday, Saturday, Sunday',
    'Monday, Thursday, Saturday, Sunday',
    'Tuesday, Thursday, Saturday, Sunday',
    'Monday, Tuesday, Thursday, Saturday, Sunday',
    'Wednesday, Thursday, Saturday, Sunday',
    'Monday, Wednesday, Thursday, Saturday, Sunday',
    'Tuesday, Wednesday, Thursday, Saturday, Sunday',
    'Monday, Tuesday, Wednesday, Thursday, Saturday, Sunday',
    'Friday, Saturday, Sunday',
    'Monday, Friday, Saturday, Sunday',
    'Tuesday, Friday, Saturday, Sunday',
    'Monday, Tuesday, Friday, Saturday, Sunday',
    'Wednesday, Friday, Saturday, Sunday',
    'Monday, Wednesday, Friday, Saturday, Sunday',
    'Tuesday, Wednesday, Friday, Saturday, Sunday',
    'Monday, Tuesday, Wednesday, Friday, Saturday, Sunday',
    'Thursday, Friday, Saturday, Sunday',
    'Monday, Thursday, Friday, Saturday, Sunday',
    'Tuesday, Thursday, Friday, Saturday, Sunday',
    'Monday, Tuesday, Thursday, Friday, Saturday, Sunday',
    'Wednesday, Thursday, Friday, Saturday, Sunday',
    'Monday, Wednesday, Thursday, Friday, Saturday, Sunday',
    'Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday'
] as const
type DayOfWeek3 = typeof dayOfWeek3[number]
const workingDays: DayOfWeek3 = 'Monday, Tuesday';




type DayOfWeekMinusMonday = Exclude<DayOfWeek, 'Monday'>;
type DayOfWeekMinusMondayTuesday = Exclude<DayOfWeekMinusMonday, 'Tuesday'>;
type DayOfWeekMinusMondayTuesdayWednesDay = Exclude<DayOfWeekMinusMondayTuesday, 'Wednesday'>;
type DayOfWeekMinusMondayTuesdayWednesDayThursday = Exclude<DayOfWeekMinusMondayTuesdayWednesDay, 'Thursday'>;

//DayOfWeek
//type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
type DayOfWeekMinusK<K = DayOfWeek> = Exclude<DayOfWeek, K>;
type DayOfWeekMinusKL<K = DayOfWeek, L = DayOfWeekMinusK<K> > = Exclude<DayOfWeekMinusK<K>, L>;
type DayOfWeekMinusKLM<K = DayOfWeek, L = DayOfWeekMinusK<K>, M = DayOfWeekMinusKL<K,L>> = Exclude<DayOfWeekMinusKL<K,L>, M>;
type DayOfWeekMinusKLMN<K = DayOfWeek, L = DayOfWeekMinusK<K>, M = DayOfWeekMinusKL<K,L>, N = DayOfWeekMinusKLM<K,L,M>> = Exclude<DayOfWeekMinusKLM<K,L,M>, N>;
type DayOfWeekMinusKLMNO<K = DayOfWeek, L = DayOfWeekMinusK<K>, M = DayOfWeekMinusKL<K,L>, N = DayOfWeekMinusKLM<K,L,M>, O = DayOfWeekMinusKLMN<K,L,M,N>> = Exclude<DayOfWeekMinusKLMN<K,L,M,N>, O>;
type DayOfWeekMinusKLMNOP<K = DayOfWeek, L = DayOfWeekMinusK<K>, M = DayOfWeekMinusKL<K,L>, N = DayOfWeekMinusKLM<K,L,M>, O = DayOfWeekMinusKLMN<K,L,M,N>, P = DayOfWeekMinusKLMNO<K,L,M,N,O>> = Exclude<DayOfWeekMinusKLMNO<K,L,M,N,O>, P>;

type WorkingDays<K = DayOfWeek> =
    | `${K}`
    | `${K}, ${Exclude<DayOfWeek, K>}`

 const ploup_1: WorkingDays = 'Monday';
 const ploup_2: WorkingDays = 'Tuesday';
const ploup_3: WorkingDays = 'Monday, Tuesday';
//const ploup_4: WorkingDays<DayOfWeek> = 'Monday, Monday';

//type DayOfWeekMinusMondayTuesdayWednesDay = Exclude<DayOfWeekMinusMondayTuesday, 'Wednesday'>;
//type DayOfWeekMinusMondayTuesdayWednesDayThursday = Exclude<DayOfWeekMinusMondayTuesdayWednesDay, 'Thursday'>;

//type V<K> = Exclude<DayOfWeek, K in DayOfWeek>
//type W<K, V> = Extract<DayOfWeek, K in DayOfWeek>

// type TwoDaysOfWeek =
//     'Monday, Tuesday' |
//     'Monday, Wednesday' |
//     'Monday, Thursday' |
    // 'Monday, Friday' |
    // 'Monday, Saturday' |
    // 'Monday, Sunday' |
    // 'Tuesday, Monday' |

// type WorkingDays = DayOfWeek
//     | `${DayOfWeek}, ${DayOfWeek}`
//     | `${DayOfWeek}, ${DayOfWeek}, ${DayOfWeek}`
//     | `${DayOfWeek}, ${DayOfWeek}, ${DayOfWeek}, ${DayOfWeek}`
//     | `${DayOfWeek}, ${DayOfWeek}, ${DayOfWeek}, ${DayOfWeek}, ${DayOfWeek}`
// type WorkingDays6<T extends string> = `${Extract<DayOfWeek, 'Monday'>}, ${T}, ${T}, ${T}, ${T}, ${T}, ${T}`
// type WorkingDays6<T extends string> = `${Pick<DayOfWeek, 'Monday'>}, ${T}, ${T}, ${T}, ${T}, ${T}, ${T}`
//type WorkingDays6<T keyof WorkingDays> = `${T}, ${T}`

//type WorkingDays<DayOfWeek> = DayOfWeek

describe('tmp', () => {
    fit('should work', () => {
       // //const workingDays: WorkingDays6<'Monday' | 'Sunday' | 'Tuesday'> = 'Monday, Sunday, Tuesday';


        const workingDaysSet: Set<DayOfWeek> = new Set(['Monday' as DayOfWeek, 'Tuesday' as DayOfWeek, 'Wednesday' as DayOfWeek]);

        expect(workingDaysSet).toStrictEqual('Monday, Tuesday, Wednesday')
    });

});

//const isWorkingDays = (str: string): str is WorkingDays => ;
