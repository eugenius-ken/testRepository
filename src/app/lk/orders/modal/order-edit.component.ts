import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerI18n } from '../../../shared/I18n/DatepickerI18n';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../../shared/services/order.service';
import { BoxService } from '../../../shared/services/box.service';
import { ClassService } from '../../../shared/services/class.service';
import { ServiceService } from '../../../shared/services/service.service';
import { WorkerService } from '../../../shared/services/worker.service';
import { Order, OrderServiceModel, OrderServiceModelAdd } from '../../../shared/models/order.model';
import { Box } from '../../../shared/models/box.model';
import { Class } from '../../../shared/models/class.model';
import { Service } from '../../../shared/models/service.model';
import { Worker } from '../../../shared/models/worker.model';
import { CustomDate } from '../../../shared/models/custom-date.model';
import { Time } from '../../../shared/models/time.model';

@Component({
    selector: 'modal-order-edit',
    templateUrl: './order-edit.component.html',
    styleUrls: ['../../lk.component.css'],
    providers: [{ provide: NgbDatepickerI18n, useClass: DatePickerI18n }]
})
export class ModalOrderEditComponent implements OnInit {
    form: FormGroup;
    boxes: Box[];
    classes: Class[];
    services: Service[];
    workers: Worker[];
    isSubmitting: boolean = false;

    constructor(
        private activeModal: NgbActiveModal,
        private orderService: OrderService,
        private boxService: BoxService,
        private classService: ClassService,
        private serviceService: ServiceService,
        private workerService: WorkerService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        Observable
            .zip(
            this.boxService.boxes.take(1),
            this.classService.classes.take(1),
            this.serviceService.services.take(1),
            this.workerService.workers.take(1),
            this.orderService.getCurrent())
            .subscribe(([boxes, classes, services, workers, order]) => {
                this.boxes = boxes;
                this.classes = classes;
                this.services = services;
                this.workers = workers;
                this.initForm(order);
            });
    }

    private initForm(order: Order) {
        this.form = this.fb.group({
            'id': [order.id, Validators.required],
            'boxId': [order.box.id, Validators.required],
            'price': [order.price, Validators.required],
            'duration': [order.duration, Validators.required],
            'status': [order.status, Validators.required],
            'date': [order.date, Validators.required],
            'time': [order.time, Validators.required],
            'client': this.fb.group({
                'phone': [order.client.phone, [Validators.pattern(/^\d{10}$/)]],
                'name': [order.client.name]
            }),
            'car': this.fb.group({
                'brand': [order.car.brand],
                'model': [order.car.model],
                'number': [order.car.number],
                'classId': [order.car.carClass.id, Validators.required],
            }),
            'services': this.fb.array(order.services.map(s => { return this.initService(s) }))
        });

        this.form.controls['services'].valueChanges.subscribe((services: OrderServiceModelAdd[]) => {
            let sum = 0;
            let duration = 0;
            services.forEach(service => {
                sum += this.services.find(s => s.id === service.id).price;
                duration += this.services.find(s => s.id === service.id).duration;
            });
            this.form.controls['price'].setValue(sum);
            this.form.controls['duration'].setValue(duration);
        });
    }

    private initService(service?: OrderServiceModel): FormGroup {
        return service ?
            this.fb.group({
                'id': [service.id, Validators.required],
                'workers': [service.workers.map(w => w.id)]
            }) :
            this.fb.group({
                'id': [this.services.length > 0 ? this.services[0].id : '', Validators.required],
                'workers': [[]],
            });
    }

    addService() {
        (this.form.controls['services'] as FormArray).push(this.initService());
    }

    removeService(i) {
        (this.form.controls['services'] as FormArray).removeAt(i);
    }

    validateDate() {
        if (typeof (this.form.controls['date'].value) !== 'object') {
            this.form.controls['date'].setValue(null);
        }
    }

    submit() {
        this.orderService.update(this.form.value)
        this.activeModal.close();
    }
}