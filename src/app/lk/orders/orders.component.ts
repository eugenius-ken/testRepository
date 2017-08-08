import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OrderService } from '../../shared/services/order.service';
import { Order, OrderServiceModel, OrderStatus } from '../../shared/models/order.model';
import { BoxService } from '../../shared/services/box.service';
import { Box } from '../../shared/models/box.model';
import { Worker } from '../../shared/models/worker.model';
import { Time } from '../../shared/models/time.model';
import { CustomDate } from '../../shared/models/custom-date.model';

import { ModalOrderAddComponent } from './modal/order-add.component';
import { ModalOrderEditComponent } from './modal/order-edit.component';
import { ModalOrderCompleteComponent } from './modal/order-complete.component';
import { RemoveConfirmComponent } from '../remove-confirm/remove-confirm.component';

@Component({
    selector: 'profile-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['../lk.component.css']
})
export class OrdersComponent {
    private subscriptions: Subscription[] = [];
    private timeline: any;
    @ViewChild('timeline') timelineDiv: ElementRef;
    orders: Order[] = [];

    @ViewChild('tbody')
    tbody: any;

    constructor(
        private orderService: OrderService,
        private modalService: NgbModal,
        private boxService: BoxService
    ) { }

    ngOnInit() {
        const subscription = this.orderService.orders.subscribe(orders => {
            this.orders = orders.slice();
        });
        this.subscriptions.push(subscription);
    }

    ngAfterViewInit() {
        this.timelineInit();
        this.boxService.boxes.take(1).subscribe(boxes => {

            const subscription = this.orderService.orders.subscribe(orders => {
                const items = orders.map(o => {
                    const startDate = new Date(o.date.year, o.date.month - 1, o.date.day, o.time.hour, o.time.minute);
                    const endDate = new Date(startDate);
                    endDate.setMinutes(endDate.getMinutes() + o.duration);
                    return {
                        type: 'range',
                        start: startDate,
                        end: endDate,
                        content: `<div style="font-size:12px; text-align:center;">
                                    ${this.getStringForTime(startDate, endDate)}
                                  </div>`,
                        group: o.box ? boxes.find(b => b.id === o.box.id).name : 'Не распределено'
                    };
                });

                // insert empty items to timeline for displaying boxes without orders
                boxes.forEach(b => {
                    const date = new Date();
                    date.setHours(date.getHours() - 1);
                    
                    items.push({
                        type: 'range',
                        start: date,
                        end: date,
                        content: '',
                        group: b.name
                    });
                });
                this.timeline.setData(items);
            });
            this.subscriptions.push(subscription);
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

    private timelineInit() {
        const options = {
            locale: 'ru',
            zoomMin: 3600 * 1000,
            zoomMax: 5 * 3600 * 1000,
        };

        this.timeline = new links.Timeline(this.timelineDiv.nativeElement, options);

        const start = new Date();
        const end = new Date();
        start.setHours(new Date().getHours() - 1);
        end.setHours(new Date().getHours() + 3);
        this.timeline.setVisibleChartRange(start, end);

        links.events.addListener(this.timeline, 'select', () => {
            const selected: any[] = this.timeline.getSelection();
            const rows = (this.tbody.nativeElement as HTMLElement).children;
            for (let i = 0; i < rows.length; i++) {
                rows[i].classList.remove('order-selected');
            }
            if (selected.length > 0) {
                const index = selected[0].row;
                rows.item(index).classList.add('order-selected');
            }
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
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

    add() {
        let modal = this.modalService.open(ModalOrderAddComponent);
    }

    edit(order: Order) {
        this.orderService.currentId = order.id;
        let modal = this.modalService.open(ModalOrderEditComponent);
    }

    remove(order: Order) {
        let modal = this.modalService.open(RemoveConfirmComponent);
        (modal.componentInstance as RemoveConfirmComponent).name = 'заказ';

        modal.result.then(
            (remove) => {
                if (remove) {
                    this.orderService.remove(order.id);
                }
            }, reason => { });
    }

    complete(order: Order) {
        console.log(order.status);
        this.orderService.currentId = order.id;
        const modal = this.modalService.open(ModalOrderCompleteComponent);
    }
}