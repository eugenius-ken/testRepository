import { Class } from './class.model';

export class CarBase {
    constructor(
        public brand: string,
        public model: string
    ) { }
}

export class Car extends CarBase {
    constructor(
        public id: string,
        brand: string,
        model: string,
        public carClass: Class
    ) { 
        super(brand, model);
    }
}

export class CarAdd extends CarBase {
    constructor(
        public id: string,
        brand: string,
        model: string,
        public classId: string
    ) { 
        super(brand, model);
    }
}

export class CarEdit extends CarBase {
    constructor(
        public id: string,
        brand: string,
        model: string,
        public classId: string
    ) { 
        super(brand, model);
    }
}