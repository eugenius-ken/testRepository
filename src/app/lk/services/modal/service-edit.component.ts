import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from '../../../shared/services/service.service';
import { ClassService } from '../../../shared/services/class.service';
import { Service } from '../../../shared/models/service.model';
import { Class } from '../../../shared/models/class.model';

@Component({
    selector: 'modal-service-edit',
    templateUrl: './service-edit.component.html',
    styleUrls: ['../../lk.component.css']
})
export class ModalServiceEditComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    form: FormGroup;
    classes: Class[];
    errorMessage: string = '';

    constructor(
        private activeModal: NgbActiveModal,
        private serviceService: ServiceService,
        private classService: ClassService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.subscription = Observable.zip(
            this.serviceService.services.take(1),
            this.classService.classes.take(1),
            (services, classes) => {
                const currentServices = services.filter(s => s.name === this.serviceService.currentName);
                this.classes = classes;

                this.form = this.fb.group({
                    'name': [this.serviceService.currentName, Validators.required],
                    'services': this.fb.array(
                        classes.map(c => {
                            return this.initChildService(c, currentServices);
                        })
                    )
                });
            }).subscribe();
    }

    toggleService(i) {
        const currentValue = (this.form.controls['services'] as FormArray).at(i).get('enabled').value;
        if (currentValue) {
            (this.form.controls['services'] as FormArray).at(i).get('enabled').setValue(false);
            (this.form.controls['services'] as FormArray).at(i).disable();
        }
        else {
            (this.form.controls['services'] as FormArray).at(i).get('enabled').setValue(true);
            (this.form.controls['services'] as FormArray).at(i).enable();
        }
    }

    private initChildService(classObj: Class, services: Service[]) {

        const currentService = services.find(s => s.carClass.id === classObj.id);

        const result = currentService ?
            this.fb.group({
                'id': [currentService.id, Validators.required],
                'classId': [currentService.carClass.id, Validators.required],
                'className': [currentService.carClass.name, Validators.required],
                'price': [currentService.price, Validators.required],
                'workerPercent': [currentService.workerPercent, [Validators.required, Validators.min(0), Validators.max(100)]],
                'duration': [currentService.duration, [Validators.required, Validators.pattern(/^\d+$/)]],
                'enabled': [true]
            }) :
            this.fb.group({
                'classId': [classObj.id, Validators.required],
                'className': [classObj.name, Validators.required],
                'price': ['', Validators.required],
                'workerPercent': ['', [Validators.required, Validators.min(0), Validators.max(100)]],
                'duration': ['', [Validators.required, Validators.pattern(/^\d+$/)]],
                'enabled': [false]
            });

        if (!result.get('enabled').value) {
            result.disable();
        }

        return result;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    submit() {
        this.errorMessage = '';
        if (!this.form.value.services) {
            this.errorMessage = 'Оставьте услугу хотя бы для одного класса';
        }
        else {
            this.serviceService.update(this.form.value)
            this.activeModal.close();
        }
    }

    remove() {
        this.serviceService.removeCurrent();
        this.activeModal.close();
    }
}