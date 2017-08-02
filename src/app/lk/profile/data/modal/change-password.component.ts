import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StrongPasswordValidator } from '../../../../shared/strong-password';
import { UserService } from '../../../../shared/services/user.service';

//https://github.com/mikeybyker/angular2-zxcvbn - password's strength
@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['../../../lk.component.css']
})
export class ModalChangePasswordComponent implements OnInit {
    form: FormGroup;
    newPasswordIsStrength: boolean = false;
    isPasswordConfirmed: boolean = false;
    message: string = '';
    isSuccess: boolean = false;
    isError: boolean = false;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
        this.form = this.fb.group({
            'oldPassword': ['', Validators.required],
            'newPassword': ['', Validators.required],
            'confirmNewPassword': ['', Validators.required]
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
        this.message = '';
        this.isSuccess = false;
        this.isError = false;
        const oldPassword = this.form.get('oldPassword').value;
        const newPassword = this.form.get('newPassword').value;
        this.userService.changePassword(oldPassword, newPassword)
            .subscribe(data => {
                this.isSuccess = true;
                this.message = "Пароль успешно изменен";
                setTimeout(() => {
                    this.activeModal.close();
                }, 2000);
            },
            error => {
                this.isError = true;
                switch (error.code) {
                    case 1003: this.message = "Старый пароль введен неверно"; break;
                    default: this.message = "Ошибка при попытке сменить пароль";
                }
            });
    }

    private checkConfirmation(): boolean {
        return this.form.get('newPassword').value === this.form.get('confirmNewPassword').value;
    }
}