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
import { Box } from '../../../shared/models/box.model';
import { Class } from '../../../shared/models/class.model';
import { Service } from '../../../shared/models/service.model';
import { Worker } from '../../../shared/models/worker.model';
import { CustomDate } from '../../../shared/models/custom-date.model';
import { Time } from '../../../shared/models/time.model';


@Component({
    selector: 'modal-order-add',
    templateUrl: './order-add.component.html',
    styleUrls: ['../../lk.component.css'],
    providers: [{ provide: NgbDatepickerI18n, useClass: DatePickerI18n }]
})
export class ModalOrderAddComponent implements OnInit {
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
            this.workerService.workers.take(1))
            .subscribe(([boxes, classes, services, workers]) => {
                this.boxes = boxes;
                this.classes = classes;
                this.services = services;
                this.workers = workers;

                let now = new Date();
                this.form = this.fb.group({
                    'boxId': [this.boxes.length > 0 ? this.boxes[0].id : '', Validators.required],
                    'price': ['', Validators.required],
                    'duration': ['', Validators.required],
                    'date': [new CustomDate(now.getFullYear(), now.getMonth(), now.getDate()), Validators.required],
                    'time': [new Time(now.getHours(), now.getMinutes()), Validators.required],
                    'client': this.fb.group({
                        'phone': [''],
                        'name': ['']
                    }),
                    'car': this.fb.group({
                        'brand': [''],
                        'model': [''],
                        'number': [''],
                        'classId': [this.classes.length > 0 ? this.classes[0].id : '', Validators.required],
                    }),
                    // 'services': this.fb.array([this.initService()])
                });
            });


    }

    private initService(): FormGroup {
        return this.fb.group({
            'id': ['', Validators.required],
            'workers': [[]],
        });
    }

    addService() {
        (this.form.controls['services'] as FormArray).push(this.initService());
    }

    validateDate() {
        if (typeof (this.form.controls['date'].value) !== 'object') {
            this.form.controls['date'].setValue(null);
        }
    }

    submit() {
        console.log(this.form.value);
        // this.orderService.add(this.form.value)
        // this.activeModal.close();
    }
}