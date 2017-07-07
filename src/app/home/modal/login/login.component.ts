import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'modal-login',
    templateUrl: './login.component.html'
})

export class ModalLoginComponent {
    form: FormGroup;
    isSubmitting: boolean = false;

    constructor(
        private activeModal: NgbActiveModal,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            'email': ['', Validators.required, Validators.pattern("[a-zA-Z_]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}")],
            'password': ['', Validators.required]
        });
    }

    submit() {
        // this.isSubmitting = true;
        console.log(this.form.value);
    }

}