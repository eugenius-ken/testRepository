import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CarService } from '../../../../shared/services/car.service';
import { ClassService } from '../../../../shared/services/class.service';
import { Car } from '../../../../shared/models/car.model';
import { Class } from '../../../../shared/models/class.model';

@Component({
    selector: 'modal-car-edit',
    templateUrl: './car-edit.component.html',
    styleUrls: ['../../../lk.component.css']
})
export class ModalCarEditComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    form: FormGroup;
    classes: Class[];

    constructor(
        private activeModal: NgbActiveModal,
        private carService: CarService,
        private classService: ClassService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.subscription = Observable.zip(
            this.carService.getCurrent(),
            this.classService.classes.take(1),
            (car, classes) => {
                this.classes = classes;
                this.form = this.fb.group({
                    'id': [car.id, Validators.required],
                    'brand': [car.brand, Validators.required],
                    'model': [car.model, Validators.required],
                    'classId': [car.carClass ? car.carClass.id : '', Validators.required]
                });
            }).subscribe();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    submit() {
        this.carService.update(this.form.value);
        this.activeModal.close();
    }
}