import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ArchiveOrderService } from '../../shared/services/archive-order.service';
import { Order, OrderServiceModel, OrderStatus } from '../../shared/models/order.model';
import { Box } from '../../shared/models/box.model';
import { Worker } from '../../shared/models/worker.model';
import { Time } from '../../shared/models/time.model';
import { CustomDate } from '../../shared/models/custom-date.model';
import { ModalArchiveOrderDetailComponent } from './modal/archive-order-detail.component';

@Component({
    selector: 'archive-orders',
    templateUrl: './archive-orders.component.html',
    styleUrls: ['../lk.component.css']
})
export class ArchiveOrdersComponent {
    private subscription: Subscription;
    orders: Order[] = [];

    constructor(
        private archiveOrderService: ArchiveOrderService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.subscription = this.archiveOrderService.orders.subscribe(orders => {
            this.orders = orders.slice();
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

    getStringForWorkers(services: OrderServiceModel[]) {
        let workers: Worker[] = [];
        services.forEach(s => {
            workers = workers.concat(s.workers);
        });
        //get uniques
        workers = workers.filter((w, i, arr) => arr.indexOf(w) === i);

        return workers.map(w => w.name).join(', ');
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

    show(order: Order) {
        this.archiveOrderService.currentId = order.id;
        let modal = this.modalService.open(ModalArchiveOrderDetailComponent);
    }
}