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
import { CarService } from '../../../shared/services/car.service';
import { ClientService } from '../../../shared/services/client.service';
import { OrderServiceModelAdd } from '../../../shared/models/order.model';
import { Box } from '../../../shared/models/box.model';
import { Class } from '../../../shared/models/class.model';
import { Service } from '../../../shared/models/service.model';
import { Worker } from '../../../shared/models/worker.model';
import { CustomDate } from '../../../shared/models/custom-date.model';
import { Time } from '../../../shared/models/time.model';
import { CarBase } from '../../../shared/models/car.model';

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
    boxIsBusy: boolean = false;
    brands: CarBase[];
    models: CarBase[];

    constructor(
        private activeModal: NgbActiveModal,
        private orderService: OrderService,
        private boxService: BoxService,
        private classService: ClassService,
        private serviceService: ServiceService,
        private workerService: WorkerService,
        private carService: CarService,
        private clientService: ClientService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        Observable
            .zip(
            this.boxService.boxes.take(1),
            this.classService.classes.take(1),
            this.serviceService.services.take(1),
            this.workerService.workers.take(1),
            this.carService.cars.take(1), )
            .subscribe(([boxes, classes, services, workers, cars]) => {
                this.boxes = boxes;
                this.classes = classes;
                this.services = services;
                this.workers = workers;

                //get unique brand' names
                const brandNames = cars.map(c => c.brand).filter((b, i, arr) => {
                    return arr.indexOf(b) === i;
                });

                //get unique cars by brand' names
                this.brands = [];
                brandNames.forEach(name => {
                    this.brands.push(cars.find(c => c.brand === name));
                });
                this.models = cars.slice();

                this.initForm();
                this.checkBoxBusy();
            });
    }

    private initForm() {
        let now = new Date();
        this.form = this.fb.group({
            'boxId': [this.boxes.length > 0 ? this.boxes[0].id : '', Validators.required],
            'price': [0, Validators.required],
            'duration': [0, Validators.required],
            'date': [new CustomDate(now.getFullYear(), now.getMonth() + 1, now.getDate()), Validators.required],
            'time': [new Time(now.getHours(), now.getMinutes()), Validators.required],
            'client': this.fb.group({
                'phone': ['', [Validators.pattern(/^\d{10}$/)]],
                'name': ['']
            }),
            'car': this.fb.group({
                'brand': [''],
                'model': [''],
                'number': [''],
                'classId': [this.classes.length > 0 ? this.classes[0].id : '', Validators.required],
            }),
            'services': this.fb.array([this.initService()])
        });

        //obsolete
        this.form.controls['services'].valueChanges.subscribe((services: OrderServiceModelAdd[]) => {
            console.count();
            this.setPriceAndDuration(services);
        });

        this.setPriceAndDuration(this.form.controls.services.value);
        this.checkBoxBusy();
    }

    private initService(): FormGroup {
        return this.fb.group({
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

    numberChanged() {
        this.delay(() => {
            const carNumber = this.form.get('car').get('number').value;
            const client = this.clientService.getClientByCarNumber(carNumber);
            if(client !== undefined) {
                const car = client.cars.find(c => c.number === carNumber);
            }
        }, 1000);
    }

    submit() {
        this.orderService.add(this.form.value)
        this.activeModal.close();
    }

    private timer = 0;
    delay(callback: Function, ms) {
        clearTimeout(this.timer);
        this.timer = setTimeout(callback, ms);
    }

    boxChanged() {
        this.checkBoxBusy();
    }

    private checkBoxBusy() {
        const startDate = this.form.controls['date'].value;
        const startTime = this.form.controls['time'].value;
        const duration = this.form.controls['duration'].value;
        const boxId = this.form.controls['boxId'].value;
        this.boxIsBusy = this.orderService.isBoxBusy(startDate, startTime, duration, boxId);
    }

    private setPriceAndDuration(services: OrderServiceModelAdd[]) {
        let sum = 0;
            let duration = 0;
            services.forEach(service => {
                const currentService = this.services.find(s => s.id === service.id);
                sum += currentService ? currentService.price : 0;
                duration += currentService ? currentService.duration : 0;
            });
            this.form.controls['price'].setValue(sum);
            this.form.controls['duration'].setValue(duration);
    }
}