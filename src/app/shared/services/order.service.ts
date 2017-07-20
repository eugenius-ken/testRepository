import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { ApiService } from './api.service';
import { ClassService } from './class.service';
// import { ClientService } from './client.service';
import { ServiceService } from './service.service';
import { WorkerService } from './worker.service';
import { BoxService } from './box.service';
import { Order, OrderCar, OrderClient, OrderServiceModel, OrderAdd, OrderEdit } from '../models/order.model';
import { Class } from '../models/class.model';
// import { Client } from '../models/client.model';
import { Service } from '../models/service.model';
import { Worker } from '../models/worker.model';
import { Box } from '../models/box.model';
import { CustomDate } from '../models/custom-date.model';
import { Time } from '../models/time.model';

@Injectable()
export class OrderService {
    private readonly path: string = '/orders';

    private _ordersStorage: Order[];
    private _orders = new ReplaySubject<Order[]>(1);
    orders = this._orders.asObservable();

    currentId: string; //for passing data between components

    constructor(
        private apiService: ApiService,
        private classService: ClassService,
        // private clientService: ClientService,
        private serviceService: ServiceService,
        private workerService: WorkerService,
        private boxService: BoxService
    ) {
        this.getAll()
            .subscribe(orders => {
                this._ordersStorage = orders;
                this._orders.next(this._ordersStorage);
            });
    }

    getCurrent() {
        return this.orders
            .map(orders => orders.find(o => o.id === this.currentId));
    }

    add(order: OrderAdd) {
        Observable.zip(
            this.apiService.post(this.path, this.mapToApiModel(order)),
            this.classService.classes.take(1),
            this.serviceService.services.take(1),
            this.workerService.workers.take(1),
            this.boxService.boxes.take(1),
            (data, classes, services, workers, boxes) => {
                this._ordersStorage.push(this.mapFromApiModel(
                    data.result,
                    classes,
                    services,
                    workers,
                    boxes)
                );
            }).subscribe();
    }

    update(order: OrderEdit) {
        Observable.zip(
            this.apiService.put(this.path + '/' + order.id, this.mapToApiModel(order)),
            this.classService.classes.take(1),
            this.serviceService.services.take(1),
            this.workerService.workers.take(1),
            this.boxService.boxes.take(1),
            (data, classes, services, workers, boxes) => {
                let i = this._ordersStorage.findIndex(o => o.id === order.id);
                if (i != -1) {
                    this._ordersStorage.splice(i, 1, this.mapFromApiModel(data.result, classes, services, workers, boxes));
                    this._orders.next(this._ordersStorage);
                }
            }).subscribe();
    }

    remove(id: string) {
        return this.apiService.delete(this.path + '/' + id)
            .subscribe(data => {
                let i = this._ordersStorage.findIndex(c => c.id === id);
                if (i != -1) {
                    this._ordersStorage.splice(i, 1);
                    this._orders.next(this._ordersStorage);
                }
            });
    }

    private getAll(): Observable<Order[]> {
        return Observable.zip(
            this.classService.classes.take(1),
            // this.clientService.clients.take(1),
            this.serviceService.services.take(1),
            this.workerService.workers.take(1),
            this.boxService.boxes.take(1),
            this.apiService.get(this.path),
            (classes, services, workers, boxes, data) => {
                return (data.result as any[]).map(order => {
                    return this.mapFromApiModel(order, classes, services, workers, boxes);
                });
            });
    }

    private mapFromApiModel(
        order: any,
        classes: Class[],
        // clients: Client[],
        services: Service[],
        workers: Worker[],
        boxes: Box[]
    ): Order {
        let orderDate = new Date(order.ts);
        return new Order(
            order._id,
            new CustomDate(
                orderDate.getFullYear(),
                orderDate.getMonth(),
                orderDate.getDate()),
            new Time(orderDate.getHours(), orderDate.getMinutes()),
            order.price,
            order.status,
            order.duration,
            boxes.find(b => b.id === order.box_id),
            new OrderClient(order.client.name, order.client.phone),
            new OrderCar(
                order.client.brand,
                order.client.model,
                order.client.number,
                classes.find(c => c.id === order.client.class_id)
            ),
            (order.services as any[]).map(service => {
                return new OrderServiceModel(
                    services.find(s => s.id === service._id),
                    workers.filter(w => (service.workers as any[]).includes(w.id))
                );
            })
        );
    }

    private mapToApiModel(order: OrderAdd) {
        const date = new Date(
            order.date.year,
            order.date.month,
            order.date.day,
            order.time.hour,
            order.time.minute
        );

        return {
            ts: date.getTime(),
            box_id: order.boxId,
            price: order.price,
            duration: order.duration,
            client: {
                class_id: order.car.classId,
                name: order.client.name,
                phone: order.client.phone,
                number: order.car.number,
                brand: order.car.brand,
                model: order.car.model
            },
            services: order.services.map(s => {
                return {
                    _id: s.id,
                    workers: s.workers
                };
            })
        };
    }
}