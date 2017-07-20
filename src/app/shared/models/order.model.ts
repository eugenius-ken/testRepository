import { CustomDate } from './custom-date.model';
import { Time } from './time.model';
import { Box } from './box.model';
import { Service } from './service.model';
import { Class } from './class.model';
import { Worker } from './worker.model';
import { Client, ClientCar } from './client.model';

export class Order {
    constructor(
        public id: string,
        public date: CustomDate,
        public time: Time,
        public price: number,
        public status: number,
        public duration: number,
        public box: Box,
        public client: OrderClient,
        public car: OrderCar,
        public services: OrderServiceModel[]
    ) { }
}

export class OrderAdd {
    constructor(
        public id: string,
        public date: CustomDate,
        public time: Time,
        public price: number,
        public status: number,
        public duration: number,
        public boxId: string,
        public client: OrderClientAdd,
        public car: OrderCarAdd,
        public services: OrderServiceModelAdd[]
    ) { }
}

export class OrderEdit {
    constructor(
        public id: string,
        public date: CustomDate,
        public time: Time,
        public price: number,
        public status: number,
        public duration: number,
        public boxId: string,
        public client: OrderClientAdd,
        public car: OrderCarAdd,
        public services: OrderServiceModelAdd[]
    ) { }
}

export class OrderServiceModel extends Service {
    workers: Worker[];

    constructor(
        service: Service,
        workers: Worker[]
    ) {
        super(
            service.id,
            service.name,
            service.price,
            service.workerPercent,
            service.duration,
            service.carClass
        );
        this.workers = workers;
    }
}

export class OrderServiceModelAdd {
    constructor(
        public id: string,
        public workers: string[]
    ) { }
}

export class OrderServiceModelEdit {
    constructor(
        public id: string,
        public workers: string[]
    ) { }
}

export class OrderClient {
    constructor(
        public name: string,
        public phone: string
    ) { }
}

export class OrderClientAdd {
    constructor(
        public name: string,
        public phone: string
    ) { }
}

export class OrderClientEdit {
    constructor(
        public name: string,
        public phone: string
    ) { }
}

export class OrderCar {
    constructor(
        public brand: string,
        public model: string,
        public number: string,
        public carClass: Class
    ) { }
}

export class OrderCarAdd {
    constructor(
        public brand: string,
        public model: string,
        public number: string,
        public classId: string
    ) { }
}

export class OrderCarEdit {
    constructor(
        public brand: string,
        public model: string,
        public number: string,
        public classId: string
    ) { }
}