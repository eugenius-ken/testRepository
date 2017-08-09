import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ArchiveOrderService } from '../../shared/services/archive-order.service';
import { WorkerService } from '../../shared/services/worker.service';
import { Order, OrderServiceModel, OrderStatus, ArchiveOrder } from '../../shared/models/order.model';
import { Box } from '../../shared/models/box.model';
import { Worker } from '../../shared/models/worker.model';
import { Time } from '../../shared/models/time.model';
import { CustomDate } from '../../shared/models/custom-date.model';
import { ModalArchiveOrderDetailComponent } from './modal/archive-order-detail.component';
import { ModalTransactionsComponent } from './modal/transactions.component';

@Component({
    selector: 'archive-orders',
    templateUrl: './archive-orders.component.html',
    styleUrls: ['../lk.component.css']
})
export class ArchiveOrdersComponent {
    private subscription: Subscription;
    orders: ArchiveOrder[] = [];

    constructor(
        private archiveOrderService: ArchiveOrderService,
        private workerService: WorkerService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.subscription = this.archiveOrderService.orders.subscribe(orders => {
            this.orders = orders.map(o => {
                return new ArchiveOrder(
                    o.id,
                    o.date,
                    o.time,
                    o.price,
                    o.status,
                    o.duration,
                    o.box,
                    o.client,
                    o.car,
                    o.services,
                    this.getUniqueWorkers(o.services)
                );
            });
        });
    }

    private getStringForTime(startDate: Date, endDate: Date) {
        const startHours = startDate.getHours() < 10 ? '0' + String(startDate.getHours()) : String(startDate.getHours());
        const startMinutes = startDate.getMinutes() < 10 ? '0' + String(startDate.getMinutes()) : String(startDate.getMinutes());

        const endHours = endDate.getHours() < 10 ? '0' + String(endDate.getHours()) : String(endDate.getHours());
        const endMinutes = endDate.getMinutes() < 10 ? '0' + String(endDate.getMinutes()) : String(endDate.getMinutes());

        return `${startHours}:${startMinutes}-${endHours}:${endMinutes}`;
    }

    private getStringForDate(date: CustomDate, time: Time) {
        const month = date.month < 10 ? '0' + String(date.month) : String(date.month);
        const day = date.day < 10 ? '0' + String(date.day) : String(date.day);
        const hours = time.hour < 10 ? '0' + String(time.hour) : String(time.hour);
        const minutes = time.minute < 10 ? '0' + String(time.minute) : String(time.minute);
        return `${date.year}-${month}-${day} ${hours}:${minutes}`;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getStringForServices(services: OrderServiceModel[]) {
        return services.map(s => s.name).join(', ');
    }

    private getUniqueWorkers(services: OrderServiceModel[]): Worker[] {
        let workers: Worker[] = [];
        services.forEach(s => {
            workers = workers.concat(s.workers);
        });
        //get uniques
        return workers.filter((w, i, arr) => arr.indexOf(w) === i);
    }

    getStringForStatus(status: OrderStatus) {
        switch (status) {
            case OrderStatus.Accepted: return 'Принят';
            case OrderStatus.Completed: return 'Завершен';
            case OrderStatus.Declined: return 'Отменен';
            case OrderStatus.FromApp: return 'Из приложения';
            default: return '';
        }
    }

    openTransaction(workerId: string) {
        this.workerService.currentId = workerId;
        this.modalService.open(ModalTransactionsComponent);
    }

    show(order: Order) {
        this.archiveOrderService.currentId = order.id;
        let modal = this.modalService.open(ModalArchiveOrderDetailComponent);
    }
}