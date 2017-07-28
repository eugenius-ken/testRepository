import { CustomDate } from './custom-date.model';
import { Class } from './class.model';
import { CarBase } from './car.model';

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

export class ClientCar extends CarBase {
    constructor(
        public id: string,
        brand: string,
        model: string,
        public number: string,
        carClass: Class
    ) { 
        super(brand, model);
    }
}

export class ClientCarAdd {
    constructor(
        public id: string,
        public number: string
    ) { }
}

export class ClientCarEdit {
    constructor(
        public id: string,
        public number: string
    ) { }
}
