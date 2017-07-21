import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../../shared/services/order.service';
import { WorkerService } from '../../../shared/services/worker.service';
import { Order, OrderServiceModel, OrderStatus } from '../../../shared/models/order.model';
import { Worker } from '../../../shared/models/worker.model';

@Component({
    selector: 'order-complete',
    templateUrl: './order-complete.component.html',
    styleUrls: ['../../lk.component.css']
})
export class ModalOrderCompleteComponent implements OnInit {
    form: FormGroup;
    workers: Worker[];
    isSubmitting: boolean = false;
    hideForm = true;

    constructor(
        private activeModal: NgbActiveModal,
        private orderService: OrderService,
        private workerService: WorkerService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        Observable
            .zip(
            this.orderService.getCurrent(),
            this.workerService.workers.take(1),
            (order, workers) => {
                this.workers = workers.slice();
                this.initForm(order);

                //hideForm if workers aren't assigned for some service
                this.hideForm = !order.services.some(s => s.workers.length === 0);
            }).subscribe();
    }

    initForm(order: Order) {
        this.form = this.fb.group({
            'id': [order.id],
            'status': [OrderStatus.Completed, Validators.required],
            'services': this.fb.array(order.services.map(s => { return this.initService(s) }))
        });
    }

    private initService(service: OrderServiceModel): FormGroup {
        return this.fb.group({
            'id': [service.id, Validators.required],
            'name': [service.name],
            'workers': [service.workers.map(w => w.id), Validators.required]
        });
    }

    submit() {
        this.hideForm ?
            this.orderService.complete(this.form.controls['id'].value, OrderStatus.Completed) :
            this.orderService.update(this.form.value); //complete order with update workers

        this.activeModal.close();
    }

    cancel() {
        this.activeModal.close();
    }



}