import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as Vis from 'vis';
import { VisTimelineOptions } from 'ng2-vis';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OrderService } from '../../shared/services/order.service';
import { Order, OrderServiceModel } from '../../shared/models/order.model';
import { BoxService } from '../../shared/services/box.service';
import { Box } from '../../shared/models/box.model';
import { Worker } from '../../shared/models/worker.model';
import { Time } from '../../shared/models/time.model';

import { ModalOrderAddComponent } from './modal/order-add.component';
import { ModalOrderEditComponent } from './modal/order-edit.component';
import { RemoveConfirmComponent } from '../remove-confirm/remove-confirm.component';

@Component({
    selector: 'profile-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['../lk.component.css']
})
export class OrdersComponent {
    private subscription1: Subscription;
    private subscription2: Subscription;
    private timeline: Vis.Timeline;
    @ViewChild('timeline') timelineDiv: ElementRef;
    orders: Order[] = [];

    constructor(
        private orderService: OrderService,
        private modalService: NgbModal,
        private boxService: BoxService
    ) { }

    ngOnInit() {
        this.subscription1 = this.orderService.orders.subscribe(orders => {
            this.orders = orders.slice();
        });
    }

    ngAfterViewInit() {
        this.timelineInit();
        this.boxService.boxes.take(1).subscribe(boxes => {

            const groups = boxes.map((b, i) => {
                return {
                    id: b.id,
                    content: b.name
                };
            });
            this.timeline.setGroups(groups);

            this.subscription2 = this.orderService.orders.subscribe(orders => {

                const items = orders.map(o => {
                    const startDate = new Date(o.date.year, o.date.month, o.date.day, o.time.hour, o.time.minute);
                    const endDate = new Date(startDate);
                    endDate.setMinutes(endDate.getMinutes() + o.duration);


                    return {
                        type: 'range',
                        start: startDate,
                        end: endDate,
                        content: `<div style="font-size:12px; text-align:center;">
                                    ${startDate.getHours().toString()}:${startDate.getMinutes().toString()} - ${endDate.getHours().toString()}:${endDate.getMinutes().toString()}
                                  </div>`,
                        group: o.box.id
                    };
                });
                this.timeline.setItems(items);
            });
        })




    }

    private timelineInit() {
        const now = new Date();
        const options = {} as VisTimelineOptions;
        options.locale = 'ru';
        options.start = new Date().setHours(now.getHours() - 1);
        options.end = new Date().setHours(now.getHours() + 1);
        options.zoomMin = 3600 * 1000;
        options.zoomMax = 24 * 3600 * 1000;
        options.timeAxis = {
            scale: 'hour',
            step: 1
        };
        this.timeline = new Vis.Timeline(this.timelineDiv.nativeElement, [], options);
    }

    ngOnDestroy() {
        this.subscription1.unsubscribe();
        this.subscription2.unsubscribe();
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
}