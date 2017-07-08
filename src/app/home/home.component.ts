import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalLoginComponent } from './modal/login/login.component';
import { ModalRegisterComponent } from './modal/register/register.component';
import { ModalCallComponent } from './modal/call/call.component';

@Component({
    selector: 'home-page',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    constructor(private modalService: NgbModal) { }

    login() {
        this.modalService.open(ModalLoginComponent);
    }

    register() {
        this.modalService.open(ModalRegisterComponent);
    }

    callMe() {
        this.modalService.open(ModalCallComponent);
    }
}