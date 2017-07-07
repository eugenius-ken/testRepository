import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalLoginComponent } from './modal/login/login.component';

@Component({
    selector: 'home-page',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    constructor(private modalService: NgbModal) { }

    open() {
        this.modalService.open(ModalLoginComponent);
    }
}