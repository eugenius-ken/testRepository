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

    public static RemovedService(): Service {
        return new Service(
            '',
            'Удален',
            0,
            0,
            0,
            new Class('', 'Нет класса')
        )
    }
}

export class ServiceAdd {
    constructor(
        public name: string,
        public services: ChildService[]
    ) { }
}

//ChildService - item of services' list when create/update service
export class ChildService {
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
        public services: ChildService[]
    ) { }
}