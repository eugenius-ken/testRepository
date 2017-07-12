import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CarService } from '../../../../shared/services/car.service';

@Component({
    selector: 'modal-car-add',
    templateUrl: './car-add.component.html',
    styleUrls: ['../../../lk.component.css']
})
export class ModalCarAddComponent { 
    form: FormGroup;
    isSubmitting: boolean = false;

    constructor(
        private activeModal: NgbActiveModal,
        private carService: CarService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            'brand': ['', Validators.required],
            'model': ['', Validators.required]
        });
    }

    submit() {
        this.carService.add(this.form.value)
        .subscribe(car => {
            this.activeModal.close(car);
        });
    }
}