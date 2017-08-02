import { Time } from './time.model';

export class User {
    constructor(
        public name: string,
        public email: string,
        public phone: string,
        public address: string,
        public lat: number,
        public lng: number,
        public start: Time,
        public end: Time,
        public dayAndNight: boolean = false
    ) {
        this.dayAndNight =
            this.start.hour === 0 &&
            this.start.minute === 0 &&
            this.end.hour === 0 &&
            this.end.minute === 0;
    }
}