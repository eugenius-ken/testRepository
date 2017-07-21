import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { URLSearchParams } from '@angular/http';

import { ApiService } from './api.service';
import { ClassService } from './class.service';
import { ServiceService } from './service.service';
import { WorkerService } from './worker.service';
import { BoxService } from './box.service';
import { Order, OrderCar, OrderClient, OrderServiceModel, OrderAdd, OrderEdit, OrderStatus } from '../models/order.model';
import { Class } from '../models/class.model';
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
                this._orders.next(this._ordersStorage);
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
                    order.status == OrderStatus.Accepted ?
                        this._ordersStorage.splice(i, 1, this.mapFromApiModel(data.result, classes, services, workers, boxes)) :
                        this._ordersStorage.splice(i, 1);

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

    complete(orderId: string, status: OrderStatus) {
        return this.apiService.put(this.path + '/' + orderId, { status: status })
            .subscribe(data => {
                let i = this._ordersStorage.findIndex(c => c.id === orderId);
                if (i != -1) {
                    this._ordersStorage.splice(i, 1);
                    this._orders.next(this._ordersStorage);
                }
            });
    }

    private getAll(): Observable<Order[]> {
        let params = new URLSearchParams();
        params.append('status', OrderStatus.Accepted.toString());
        params.append('status', OrderStatus.FromApp.toString());
        params.append('t0', '1');

        return Observable.zip(
            this.classService.classes.take(1),
            this.serviceService.services.take(1),
            this.workerService.workers.take(1),
            this.boxService.boxes.take(1),
            this.apiService.get(this.path, params),
            (classes, services, workers, boxes, data) => {
                return (data.result as any[]).map(order => {
                    return this.mapFromApiModel(order, classes, services, workers, boxes);
                });
            });
    }

    private mapFromApiModel(
        order: any,
        classes: Class[],
        services: Service[],
        workers: Worker[],
        boxes: Box[]
    ): Order {
        let orderDate = new Date(order.ts);
        return new Order(
            order._id,
            new CustomDate(
                orderDate.getFullYear(),
                orderDate.getMonth() + 1,
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
        const date = order.date && order.time ?
            new Date(
                order.date.year,
                order.date.month,
                order.date.day,
                order.time.hour,
                order.time.minute
            ) : null;


        return {
            ts: date ? date.getTime() : null,
            box_id: order.boxId ? order.boxId : null,
            price: order.price ? order.price : null,
            duration: order.duration ? order.duration : null,
            status: order.status ? order.status : null,
            client: order.client ? {
                class_id: order.car.classId,
                name: order.client.name,
                phone: order.client.phone ? order.client.phone : null,
                number: order.car.number,
                brand: order.car.brand,
                model: order.car.model
            } : null,
            services: order.services ?
                order.services.map(s => {
                    return {
                        _id: s.id,
                        workers: s.workers
                    };
                }) : null
        };
    }
}