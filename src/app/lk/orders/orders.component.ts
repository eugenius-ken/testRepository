import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OrderService } from '../../shared/services/order.service';
import { Order, OrderServiceModel } from '../../shared/models/order.model';
import { BoxService } from '../../shared/services/box.service';
import { Box } from '../../shared/models/box.model';
import { Worker } from '../../shared/models/worker.model';
import { Time } from '../../shared/models/time.model';

// import { ModalOrderAddComponent } from './modal/order-add.component';
// import { ModalOrderEditComponent } from './modal/order-edit.component';
import { RemoveConfirmComponent } from '../remove-confirm/remove-confirm.component';

@Component({
    selector: 'profile-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['../lk.component.css']
})
export class OrdersComponent {
    private subscription: Subscription;
    orders: Order[];

    constructor(
        private orderService: OrderService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.subscription = this.orderService.orders.subscribe(orders => {
            this.orders = orders;
        });
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
            workers =  workers.concat(s.workers);
        });

        //get uniques
        workers = workers.filter((w, i, arr) => arr.indexOf(w) === i);

        return workers.map(w => w.name).join(', ');
    }

    // add() {
    //     let modal = this.modalService.open(ModalOrderAddComponent);
    // }

    // edit(order: Order) {
    //     this.orderService.currentId = order.id;
    //     let modal = this.modalService.open(ModalOrderEditComponent);
    // }

    // remove(order: Order) {
    //     let modal = this.modalService.open(RemoveConfirmComponent);
    //     (modal.componentInstance as RemoveConfirmComponent).name = '';

    //     modal.result.then(
    //         (remove) => {
    //             if (remove) {
    //                 this.orderService.remove(order.id);
    //             }
    //         }, reason => { });
    // }
}