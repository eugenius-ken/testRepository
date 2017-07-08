import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'modal-call',
    templateUrl: './call.component.html'
})

export class ModalCallComponent {
    form: FormGroup;
    isSubmitting: boolean = false;

    constructor(
        private activeModal: NgbActiveModal,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            'name': ['', Validators.required],
            'phone': ['+7', Validators.required]
        });
    }

    submit() {
        console.log(this.form);
    }
}