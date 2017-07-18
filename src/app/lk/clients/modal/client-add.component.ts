import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerI18n } from '../../../shared/I18n/DatepickerI18n';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../../shared/services/client.service';
import { ClassService } from '../../../shared/services/class.service';
import { Class } from '../../../shared/models/class.model';

@Component({
    selector: 'modal-client-add',
    templateUrl: './client-add.component.html',
    styleUrls: ['../../lk.component.css'],
    providers: [{ provide: NgbDatepickerI18n, useClass: DatePickerI18n }]
})
export class ModalClientAddComponent implements OnInit {
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
        this.classService.classes.take(1).subscribe(classes => {
            this.classes = classes;

            this.form = this.fb.group({
                'name': ['', Validators.required],
                'phone': ['', [Validators.pattern(/^\d{10}$/)]],
                'birthday': [null],
                'discount': [''],
                'cars': this.fb.array([this.initCar()])
            });
        });
    }

    private initCar() {
        return this.fb.group({
            'brand': ['', Validators.required],
            'model': ['', Validators.required],
            'number': ['', Validators.required],
            'classId': [this.classes.length > 0 ? this.classes[0].id : '', Validators.required],
        });
    }

    addCar() {
        (this.form.controls['cars'] as FormArray).push(this.initCar());
    }

    removeCar(i) {
        (this.form.controls['cars'] as FormArray).removeAt(i);
    }

    submit() {
        this.clientService.add(this.form.value)
        this.activeModal.close();
    }

    validateDate() {
        if (typeof (this.form.controls['birthday'].value) !== 'object') {
            this.form.controls['birthday'].setValue(null);
        }
    }
}