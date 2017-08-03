import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from '../../../shared/services/service.service';
import { ClassService } from '../../../shared/services/class.service';
import { Class } from '../../../shared/models/class.model';

@Component({
    selector: 'modal-service-add',
    templateUrl: './service-add.component.html',
    styleUrls: ['../../lk.component.css']
})
export class ModalServiceAddComponent implements OnInit {
    form: FormGroup;
    errorMessage: string = '';
    classes: Class[];

    constructor(
        private activeModal: NgbActiveModal,
        private serviceService: ServiceService,
        private classService: ClassService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.classService.classes.take(1).subscribe(classes => {
            this.classes = classes;

            this.form = this.fb.group({
                'name': ['', Validators.required],
                'services': this.fb.array(
                    classes.map(c => {
                        return this.initChildService(c);
                    })
                )
            });
        });
    }

    private initChildService(classObj: Class) {
        return this.fb.group({
            'classId': [classObj.id, Validators.required],
            'className': [classObj.name, Validators.required],
            'price': ['', Validators.required],
            'workerPercent': ['', [Validators.required, Validators.min(0), Validators.max(100)]],
            'duration': ['', [Validators.required, Validators.pattern(/^\d+$/)]],
            'enabled': [true]
        });
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

    submit() {
        this.errorMessage = '';
        if (!this.form.value.services) {
            this.errorMessage = 'Оставьте услугу хотя бы для одного класса';
        }
        else {
            this.serviceService.add(this.form.value)
            this.activeModal.close();
        }
    }
}