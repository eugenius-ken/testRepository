import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerI18n } from '../../../shared/I18n/DatepickerI18n';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkerService } from '../../../shared/services/worker.service';
import { BoxService } from '../../../shared/services/box.service';
import { Worker } from '../../../shared/models/worker.model';
import { Box } from '../../../shared/models/box.model';

@Component({
    selector: 'modal-worker-edit',
    templateUrl: './worker-edit.component.html',
    styleUrls: ['../../lk.component.css'],
    providers: [{ provide: NgbDatepickerI18n, useClass: DatePickerI18n }]
})
export class ModalWorkerEditComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    form: FormGroup;
    boxes: Box[];

    constructor(
        private activeModal: NgbActiveModal,
        private workerService: WorkerService,
        private boxService: BoxService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.subscription = Observable.zip(
            this.workerService.getCurrent(),
            this.boxService.boxes.take(1),
            (worker, boxes) => {
                this.boxes = boxes;
                this.form = this.fb.group({
                    'id': [worker.id, Validators.required],
                    'name': [worker.name, Validators.required],
                    'job': [worker.job, Validators.required],
                    'startDate': [worker.startDate],
                    'boxes': [worker.boxes.map(b => {
                        return b.id;
                    })]
                });
            }).subscribe();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    submit() {
        this.workerService.update(this.form.value);
        this.activeModal.close();
    }

    validateDate() {
        if (typeof (this.form.controls['startDate'].value) !== 'object') {
            this.form.controls['startDate'].setValue(null);
        }
    }
}