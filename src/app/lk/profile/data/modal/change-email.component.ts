import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../../shared/services/user.service';

@Component({
    selector: 'change-email',
    templateUrl: './change-email.component.html',
    styleUrls: ['../../../lk.component.css']
})
export class ModalChangeEmailComponent implements OnInit {
    form: FormGroup;
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
            'email': ['', [Validators.required, Validators.email]]
        });
    }

    submit() {
        this.message = '';
        this.isSuccess = false;
        this.isError = false;

        this.userService.changeEmail(this.form.get('email').value)
            .subscribe(data => {
                this.isSuccess = true;
                this.message = "На новую почту отправлено письмо с подтверждением.";
                setTimeout(() => {
                    this.activeModal.close();
                }, 2000);
            },
            error => {
                this.isError = true;
                switch(error.code) {
                    case 1000: this.message = "Данный e-mail уже занят. Введите другой e-mail."; break;
                    default: this.message = "Ошибка при попытке сменить почту. Попробуйте позже.";
                }
                
                
            });
    }
}