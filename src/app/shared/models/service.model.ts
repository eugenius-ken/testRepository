import { Class } from './class.model';

export class Service {
    constructor(
        public id: string,
        public name: string,
        public price: number,
        public workerPercent: number,
        public duration: number,
        public carClass: Class
    ) { }
}

export class ServiceAdd {
    constructor(
        public id: string,
        public name: string,
        public price: number,
        public workerPercent: number,
        public duration: number,
        public classId: string
    ) { }
}

export class ServiceEdit {
    constructor(
        public id: string,
        public name: string,
        public price: number,
        public workerPercent: number,
        public duration: number,
        public classId: string
    ) { }
}