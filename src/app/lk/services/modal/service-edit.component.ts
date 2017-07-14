import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
    isSubmitting: boolean = false;
    classes: Class[];

    constructor(
        private activeModal: NgbActiveModal,
        private serviceService: ServiceService,
        private classService: ClassService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.subscription = Observable.zip(
            this.serviceService.getCurrent(),
            this.classService.classes.take(1),
            (service, classes) => {
                this.classes = classes;
                this.form = this.fb.group({
                    'id': [service.id, Validators.required],
                    'name': [service.name, Validators.required],
                    'price': [service.price, Validators.required],
                    'duration': [service.duration, Validators.required],
                    'workerPercent': [service.workerPercent, [Validators.required, Validators.min(0), Validators.max(100)]],
                    'classId': [service.carClass ? service.carClass.id : '', Validators.required]
                });
            }).subscribe();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    submit() {
        this.serviceService.update(this.form.value);
        this.activeModal.close();
    }
}