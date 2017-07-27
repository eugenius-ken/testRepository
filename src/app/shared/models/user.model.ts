export class User {
    constructor(
        public name: string,
        public email: string,
        public phone: string,
        public address: string,
        public lat: number,
        public lng: number
    ) { }
}