let day = ['Monday' , 'Tuesday' , 'Wednesday' , 'Thursday' , 'Friday' , 'Saturday' , 'Sunday'];
const result: any[] = [];
const characters = ["a", "b", "c", "d"];

const combinations = (arr: string[], min = 1, max: number) => {
    const combination = (arr: any[], depth: number) => {
        if (depth === 1) {
            return arr;
        } else {
            const result:string[] = combination(arr, depth - 1).flatMap((val: string) =>

                 arr.filter(elem=>!val.includes(elem)).map((char) =>val +', '+ char)

            );


            return arr.concat(result);
        }
    };

    return combination(arr, max).filter((val: string[]) => val.length >= min);
};





describe('testcombine', () => {
    xit('should combine', () => {
        const result = combinations(day, 1, 7);
        console.log('jsonListBeauty', JSON.stringify(result, null, 2));

    });
});
