import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

import { StrongPasswordValidator } from '../../../shared/strong-password';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../shared/services/user.service';

@Component({
    selector: 'restore-password',
    templateUrl: './restore-password.component.html'
})
export class ModalRestorePasswordComponent implements OnInit {
    form: FormGroup;
    message: string = '';
    isError: boolean = false;
    isCodeSended: boolean = false;
    newPasswordIsStrength: boolean = false;
    isPasswordConfirmed: boolean = false;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
        this.form = this.fb.group({
            'email': ['', [Validators.required, Validators.email]],
            'tempPassword': [''],
            'newPassword': [''],
            'confirmNewPassword': ['']
        });

        this.form.get('newPassword').valueChanges.subscribe(p => {
            this.isPasswordConfirmed = this.checkConfirmation();
        });

        this.form.get('confirmNewPassword').valueChanges.subscribe(p => {
            this.isPasswordConfirmed = this.checkConfirmation();
        });
    }

    onStrength({ strength }) {
        this.newPasswordIsStrength = strength > 1;
    }

    submit() {
        // console.log(!this.isCodeSended && !this.form.valid ||  (this.isCodeSended && (!this.newPasswordIsStrength || !this.isPasswordConfirmed || !this.form.valid)));
        this.message = '';
        this.isError = false;
        this.isCodeSended = false;

        if (!this.isCodeSended) {
            this.userService.getCodeToRestorePassword(this.form.get('email').value)
                .subscribe(data => {
                    this.isCodeSended = true;
                    this.message = 'На данный e-mail отправлен код подтверждения'
                    this.form.get('tempPassword').setValidators([Validators.required]);
                    this.form.get('newPassword').setValidators([Validators.required]);
                    this.form.get('newPasswordConfirm').setValidators([Validators.required]);
                },
                error => {
                    console.log(error);
                    this.isError = true;
                    switch (error.code) {
                        default: this.message = "Ошибка. Попробуйте позже.";
                    }
                });
        }
        else {
            const email = this.form.get('email').value;
            const tempPassword = this.form.get('tempPassword').value;
            const newPassword = this.form.get('newPassword').value;

            this.userService.setNewPassword(email, tempPassword, newPassword)
                .subscribe(
                data => {
                    //isCodeSended aka IsSuccess
                    this.isCodeSended = true;
                    this.message = 'Новый пароль успешно установлен';

                    setTimeout(() => {
                        this.activeModal.close();
                    }, 2000);
                },
                error => {
                    this.isError = true;
                    this.message = 'Ошибка при попытке изменить пароль. Попробуйте позже.';
                });
        }
    }

    private checkConfirmation(): boolean {
        return this.form.get('newPassword').value === this.form.get('confirmNewPassword').value;
    }
}