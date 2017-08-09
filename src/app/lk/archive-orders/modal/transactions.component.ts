import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerI18n } from '../../../shared/I18n/DatepickerI18n';
import { CustomDate } from '../../../shared/models/custom-date.model';
import { Time } from '../../../shared/models/time.model';
import { Worker } from '../../../shared/models/worker.model';
import { WorkerService } from '../../../shared/services/worker.service';

@Component({
    selector: 'modal-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['../../lk.component.css'],
    providers: [{ provide: NgbDatepickerI18n, useClass: DatePickerI18n }]
})

export class ModalTransactionsComponent implements OnInit {

    form: FormGroup;
    worker: Worker;
    transactions: any[];

    constructor(
        private workerService: WorkerService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        Observable.zip(
            this.workerService.getCurrent(),
            this.workerService.getTransactions(this.workerService.currentId),
            (worker, transactions) => {
                this.worker = worker;
                this.transactions = transactions;
            }).subscribe();

        const now = new Date();

        this.form = this.fb.group({
            'startDate': [new CustomDate(now.getFullYear(), now.getMonth() + 1, now.getDate()), Validators.required],
            'startTime': [new Time(0, 0), Validators.required],
            'endDate': [new CustomDate(now.getFullYear(), now.getMonth() + 1, now.getDate()), Validators.required],
            'endTime': [new Time(23, 59), Validators.required]
        });
    }

    submit() {
        const startDate = this.form.get('startDate').value as CustomDate;
        const startTime = this.form.get('startTime').value as Time;
        const endDate = this.form.get('endDate').value as CustomDate;
        const endTime = this.form.get('endTime').value as Time;

        this.workerService.getTransactions(this.worker.id,
            new Date(startDate.year, startDate.month - 1, startDate.day, startTime.hour, startTime.minute),
            new Date(endDate.year, endDate.month - 1, endDate.day, endTime.hour, endTime.minute)).subscribe(transactions => {
                this.transactions = transactions;
            });
    }

    validateDate() {
        if (typeof (this.form.controls['date'].value) !== 'object') {
            this.form.controls['date'].setValue(null);
        }
    }
}