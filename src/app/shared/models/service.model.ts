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
        public name: string,
        public services: ChildServiceAdd[]
    ) { }
}

//ChildService - item of services' list when create/update service
export class ChildServiceAdd {
    constructor(
        public price: number,
        public workerPercent: number,
        public duration: number,
        public classId: string,
        public enabled: boolean
    ) { }
}

export class ServiceEdit {
    constructor(
        public name: string,
        public services: ChildServiceEdit[]
    ) { }
}

export class ChildServiceEdit extends ChildServiceAdd {
    constructor(
        public id: string,
        price: number,
        workerPercent: number,
        duration: number,
        classId: string,
        enabled: boolean
    ) {
        super(price, workerPercent, duration, classId, enabled);
    }
}