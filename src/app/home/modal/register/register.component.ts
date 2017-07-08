import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'modal-register',
    templateUrl: './register.component.html'
})
export class ModalRegisterComponent {
    form: FormGroup;
    isSubmitting: boolean = false;
    
    constructor(
        private activeModal: NgbActiveModal,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            'name': ['', Validators.required],
            'email': ['', [Validators.required, Validators.email]]
        });
    }

    submit() {
        console.log(this.form.value);
    }
}