import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../../../shared/services/user.service';

@Component({
    selector: 'modal-login',
    templateUrl: './login.component.html'
})

export class ModalLoginComponent {
    form: FormGroup;
    isSubmitting: boolean = false;
    errorMessage: string = '';

    constructor(
        private activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router
    ) {
        this.form = this.fb.group({
            'email': ['', [Validators.required, Validators.email]],
            'password': ['', Validators.required]
        });
    }

    submit() {
        this.isSubmitting = true;
        this.errorMessage = '';

        this.userService.attemptAuth(this.form.value)
            .subscribe(
            data => {
                this.isSubmitting = false;
                this.activeModal.close();
                this.router.navigateByUrl('lk/orders')
            },
            error => {
                this.isSubmitting = false;
                switch(error.code) {
                    case 1002: this.errorMessage = 'Пользователь с данным email не зарегистрирован'; break;
                    case 1003: this.errorMessage = 'Неверный пароль'; break;
                    default: this.errorMessage = 'Ошибка при попытке авторизации';
                }
            });
    }

}