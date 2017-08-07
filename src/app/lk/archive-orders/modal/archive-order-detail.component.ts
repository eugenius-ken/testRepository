import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ArchiveOrderService } from '../../../shared/services/archive-order.service';
import { Order } from '../../../shared/models/order.model';
import { Time } from '../../../shared/models/time.model';
import { CustomDate } from '../../../shared/models/custom-date.model';
import { Worker } from '../../../shared/models/worker.model';


@Component({
    selector: 'modal-archive-order-detail',
    templateUrl: './archive-order-detail.component.html',
    styleUrls: ['../../lk.component.css']
})
export class ModalArchiveOrderDetailComponent implements OnInit {
    order: Order;

    constructor(
        private activeModal: NgbActiveModal,
        private archiveOrderService: ArchiveOrderService
    ) { }

    ngOnInit() {
        this.archiveOrderService.getCurrent()
            .subscribe(order => {
                this.order = order;
            });
    }

    closeModal() {
        this.activeModal.close();
    }

    getWorkerNames(workers: Worker[]) {
        const names = workers.map(w => {
            return w.name
        });

        return names.join(', ');
    }

    private getStringForDate(date: CustomDate, time: Time) {
        const month = date.month < 10 ? '0' + String(date.month) : String(date.month);
        const day = date.day < 10 ? '0' + String(date.day) : String(date.day);
        const hours = time.hour < 10 ? '0' + String(time.hour) : String(time.hour);
        const minutes = time.minute < 10 ? '0' + String(time.minute) : String(time.minute);
        return `${date.year}-${month}-${day} ${hours}:${minutes}`;
    }
}