import { Class } from './class.model';

export class Car {
    constructor(
        public id: string,
        public brand: string,
        public model: string,
        public carClass: Class
    ) { }
}

export class CarAdd {
    constructor(
        public id: string,
        public brand: string,
        public model: string,
        public classId: string
    ) { }
}

export class CarEdit {
    constructor(
        public id: string,
        public brand: string,
        public model: string,
        public classId: string
    ) { }
}