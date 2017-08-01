import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CarService } from '../../../../shared/services/car.service';
import { ClassService } from '../../../../shared/services/class.service';
import { Class } from '../../../../shared/models/class.model';

@Component({
    selector: 'modal-car-add',
    templateUrl: './car-add.component.html',
    styleUrls: ['../../../lk.component.css']
})
export class ModalCarAddComponent implements OnInit {
    form: FormGroup;
    classes: Class[];

    constructor(
        private activeModal: NgbActiveModal,
        private carService: CarService,
        private classService: ClassService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.classService.classes.take(1).subscribe(classes => {
            this.classes = classes;

            this.form = this.fb.group({
                'brand': ['', Validators.required],
                'model': ['', Validators.required],
                'classId': [this.classes.length > 0 ? this.classes[0].id : '', Validators.required]
            });
        });
    }

    submit() {
        this.carService.add(this.form.value)
        this.activeModal.close();
    }
}