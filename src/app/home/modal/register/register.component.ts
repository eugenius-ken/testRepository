import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../../../shared/services/user.service';

@Component({
    selector: 'modal-register',
    templateUrl: './register.component.html'
})
export class ModalRegisterComponent {
    form: FormGroup;
    isSubmitting: boolean = false;
    isSuccess: boolean = false;
    errorMessage: string = '';

    constructor(
        private activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private userService: UserService
    ) {
        this.form = this.fb.group({
            'name': ['', Validators.required],
            'email': ['', [Validators.required, Validators.email]]
        });
    }

    submit() {
        this.isSuccess = false;
        this.isSubmitting = true;
        this.errorMessage = '';

        this.userService.register(this.form.value)
        .subscribe(data => {
            this.isSubmitting = false;
            this.isSuccess = true;
            setTimeout(() => {
                this.activeModal.close();
            }, 2000);
        },
        error => {
            console.error(error.message);
            this.isSubmitting = false;
            switch(error.code) {
                case 1000: this.errorMessage = 'Данный email занят другим пользователем'; break;
                default: this.errorMessage = 'Ошибка при выполнении запроса. Попробуйте позже';
            }
        });
    }
}