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
        brand: string,
        model: string,
        public number: string,
        carClass: Class
    ) { 
        super(brand, model);
    }
}

export class ClientCarAdd extends CarBase {
    constructor(
        brand: string,
        model: string,
        classId: string,
        public number: string
    ) {
        super(brand, model);
     }
}

export class ClientCarEdit extends CarBase {
    constructor(
        brand: string,
        model: string,
        classId: string,
        public number: string
    ) { 
        super(brand, model);
    }
}
