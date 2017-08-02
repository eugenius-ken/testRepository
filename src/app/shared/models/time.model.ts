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

    public static ToString(time: Time): string {
        const hours = time.hour < 10 ? '0' + String(time.hour) : String(time.hour);
        const minutes = time.minute < 10 ? '0' + String(time.minute) : String(time.minute);

        return `${hours}:${minutes}`;
    }
}