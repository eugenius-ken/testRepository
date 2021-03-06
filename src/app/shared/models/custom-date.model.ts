export class CustomDate {
    constructor(
        public year: number,
        public month: number,
        public day: number
    ) { }

    public static TryParse(date: string) {
        let arr = date.split('-');
        if(arr.length != 3) return null;
        return new CustomDate(parseInt(arr[0]), parseInt(arr[1]), parseInt(arr[2]));
    }
}