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
            'email': ['', [Validators.required, Validators.email]],
            'password': ['', Validators.required]
        });
    }

    submit() {
        console.log(this.form);
    }

}