import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ModalLoginComponent } from './modal/login/login.component';
import { ModalRegisterComponent } from './modal/register/register.component';
import { ModalCallComponent } from './modal/call/call.component';
import { ModalRestorePasswordComponent } from './modal/restore-password/restore-password.component';

@Component({
    selector: 'home-page',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    modal: NgbModalRef;

    constructor(private modalService: NgbModal) { }

    login() {
        this.modal = this.modalService.open(ModalLoginComponent);
        this.modal.result
            .then(isRestorePassword => {
                if (isRestorePassword) {
                    this.modal = this.modalService.open(ModalRestorePasswordComponent);
                }
            })
            .catch(() => {
                //need for excepting error when dismiss modal window
            });

    }

    register() {
        this.modalService.open(ModalRegisterComponent);
    }

    callMe() {
        this.modalService.open(ModalCallComponent);
    }
}