import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClassService } from '../../../../shared/services/class.service';

@Component({
    selector: 'modal-class-add',
    templateUrl: './class-add.component.html',
    styleUrls: ['../../../lk.component.css']
})
export class ModalClassAddComponent { 
    form: FormGroup;
    isSubmitting: boolean = false;

    constructor(
        private activeModal: NgbActiveModal,
        private classService: ClassService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            'name': ['', Validators.required]
        });
    }

    submit() {
        this.classService.add(this.form.value)
        .subscribe(box => {
            this.activeModal.close(box);
        });
    }
}