import { CustomDate } from './custom-date.model';
import { Class } from './class.model';

export class Client {
    constructor(
        public id: string,
        public name: string,
        public phone: string,
        public birthday: CustomDate,
        public discount: number,
        public cars: ClientCar[]
    ) { }
}

export class ClientAdd {
    constructor(
        public id: string,
        public name: string,
        public phone: string,
        public birthday: CustomDate,
        public discount: number,
        public cars: ClientCarAdd[]
    ) { }
}

export class ClientEdit {
    constructor(
        public id: string,
        public name: string,
        public phone: string,
        public birthday: CustomDate,
        public discount: number,
        public cars: ClientCarEdit[]
    ) { }
}

export class ClientCar {
    constructor(
        public brand: string,
        public model: string,
        public carClass: Class,
        public number: string
    ) { }
}

export class ClientCarAdd {
    constructor(
        public brand: string,
        public model: string,
        public classId: string,
        public number: string
    ) { }
}

export class ClientCarEdit {
    constructor(
        public brand: string,
        public model: string,
        public classId: string,
        public number: string
    ) { }
}
