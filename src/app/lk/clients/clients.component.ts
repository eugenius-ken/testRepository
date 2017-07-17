import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ClientService } from '../../shared/services/client.service';
import { Client } from '../../shared/models/client.model';
import { BoxService } from '../../shared/services/box.service';
import { Box } from '../../shared/models/box.model';
import { CustomDate } from '../../shared/models/custom-date.model';
import { ModalClientAddComponent } from './modal/client-add.component';
// import { ModalClientEditComponent } from './modal/client-edit.component';
import { RemoveConfirmComponent } from '../remove-confirm/remove-confirm.component';

@Component({
    selector: 'profile-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['../lk.component.css']
})
export class ClientsComponent {
    private subscription: Subscription;
    clients: Client[];
    boxes: Box[];

    constructor(
        private clientService: ClientService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.subscription = this.clientService.clients.subscribe(clients => {
            this.clients = clients;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    add() {
        let modal = this.modalService.open(ModalClientAddComponent);
    }

    // edit(client: Client) {
    //     this.clientService.currentId = client.id;
    //     let modal = this.modalService.open(ModalClientEditComponent);
    // }

    remove(client: Client) {
        let modal = this.modalService.open(RemoveConfirmComponent);
        (modal.componentInstance as RemoveConfirmComponent).name = client.name;

        modal.result.then(
            (remove) => {
                if (remove) {
                    this.clientService.remove(client.id);
                }
            }, reason => { });
    }

    getStringForBirthday(birthday: CustomDate) {
         if (birthday == null) {
            return '';
        }
        else {
            let month = birthday.month < 10 ? '0' + String(birthday.month) : String(birthday.month);
            let day = birthday.day < 10 ? '0' + String(birthday.day) : String(birthday.day);
            return `${birthday.year}${month}:${day}`;
        }
    } 
}