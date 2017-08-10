import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { URLSearchParams } from '@angular/http';

import { ApiService } from './api.service';
import { ClassService } from './class.service';
import { ServiceService } from './service.service';
import { WorkerService } from './worker.service';
import { BoxService } from './box.service';
import { ClientService } from './client.service';
import { Order, OrderCar, OrderClient, OrderServiceModel, OrderAdd, OrderEdit, OrderStatus } from '../models/order.model';
import { Class } from '../models/class.model';
import { Service } from '../models/service.model';
import { Worker } from '../models/worker.model';
import { Box } from '../models/box.model';
import { CustomDate } from '../models/custom-date.model';
import { Time } from '../models/time.model';

@Injectable()
export class ArchiveOrderService {
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
        private boxService: BoxService,
        private clientService: ClientService
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

    add(order: Order) {
        this._ordersStorage.unshift(order);
        this._orders.next(this._ordersStorage);
    }

    private getAll(): Observable<Order[]> {
        let params = new URLSearchParams();
        params.append('status', OrderStatus.Completed.toString());
        params.append('status', OrderStatus.Declined.toString());
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
            new OrderClient(order.client.name, order.client.phone ? order.client.phone : ''),
            new OrderCar(
                order.client.brand,
                order.client.model,
                order.client.number,
                classes.find(c => c.id === order.client.class_id)
            ),
            (order.services as any[]).map(service => {
                const current = services.find(s => s.id === service._id);

                return current ?
                    new OrderServiceModel(
                        current,
                        service.workers ? workers.filter(w => (service.workers as any[]).includes(w.id)) : []
                    ) : 
                    new OrderServiceModel(
                        Service.RemovedService(),
                        service.workers ? workers.filter(w => (service.workers as any[]).includes(w.id)) : []
                    )
            })
        );
    }
}