export class Time {
    constructor(
        public hour: number,
        public minute: number
    ) { }

    public static TryParse(time: string): Time {
        let arr = time.split(':');
        if(arr.length != 2) return null;

        return new Time(parseInt(arr[0]), parseInt(arr[1]));
    }
}