import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BoxService } from '../../../../shared/services/box.service';

@Component({
    selector: 'modal-box-add',
    templateUrl: './box-add.component.html',
    styleUrls: ['../../../lk.component.css']
})
export class ModalBoxAddComponent { 
    form: FormGroup;
    isSubmitting: boolean = false;

    constructor(
        private activeModal: NgbActiveModal,
        private boxService: BoxService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            'name': ['', Validators.required]
        });
    }

    submit() {
        this.boxService.add(this.form.value)
        .subscribe(box => {
            this.activeModal.close(box);
        });
    }
}