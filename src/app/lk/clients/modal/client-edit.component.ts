import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerI18n } from '../../../shared/I18n/DatepickerI18n';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../../shared/services/client.service';
import { ClassService } from '../../../shared/services/class.service';
import { Class } from '../../../shared/models/class.model';
import { ClientCar } from '../../../shared/models/client.model';

@Component({
    selector: 'modal-client-edit',
    templateUrl: './client-edit.component.html',
    styleUrls: ['../../lk.component.css'],
    providers: [{ provide: NgbDatepickerI18n, useClass: DatePickerI18n }]
})
export class ModalClientEditComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    form: FormGroup;
    classes: Class[];
    isSubmitting: boolean = false;
    startDate;

    constructor(
        private activeModal: NgbActiveModal,
        private clientService: ClientService,
        private classService: ClassService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.subscription = Observable.zip(
            this.clientService.getCurrent(),
            this.classService.classes.take(1),
            (client, classes) => {
                this.classes = classes;

                this.form = this.fb.group({
                    'id': [client.id, Validators.required],
                    'name': [client.name, Validators.required],
                    'phone': [client.phone, [Validators.pattern(/^\d{10}$/)]],
                    'birthday': [client.birthday],
                    'discount': [client.discount],
                    'cars': this.fb.array([])
                });

                client.cars.forEach(c => {
                    (this.form.controls['cars'] as FormArray).push(this.initCar(c));
                });

            }).subscribe();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private initCar(car: ClientCar = null) {
        return car == null ?
            this.fb.group({
                'brand': ['', Validators.required],
                'model': ['', Validators.required],
                'number': ['', Validators.required],
                'classId': [this.classes.length > 0 ? this.classes[0].id : '', Validators.required],
            }) :
            this.fb.group({
                'brand': [car.brand, Validators.required],
                'model': [car.model, Validators.required],
                'number': [car.number, Validators.required],
                'classId': [car.carClass.id, Validators.required],
            });
    }

    addCar() {
        (this.form.controls['cars'] as FormArray).push(this.initCar());
    }

    removeCar(i) {
        (this.form.controls['cars'] as FormArray).removeAt(i);
    }

    submit() {
        this.clientService.update(this.form.value)
        this.activeModal.close();
    }

    validateDate() {
        if (typeof (this.form.controls['birthday'].value) !== 'object') {
            this.form.controls['birthday'].setValue(null);
        }
    }
}