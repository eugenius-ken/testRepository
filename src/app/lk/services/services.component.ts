import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ServiceService } from '../../shared/services/service.service';
import { Service } from '../../shared/models/service.model';
import { ClassService } from '../../shared/services/class.service';
import { Class } from '../../shared/models/class.model';
import { ModalServiceAddComponent } from './modal/service-add.component';
import { ModalServiceEditComponent } from './modal/service-edit.component';
import { RemoveConfirmComponent } from '../remove-confirm/remove-confirm.component';

@Component({
    selector: 'profile-services',
    templateUrl: './services.component.html',
    styleUrls: ['../lk.component.css']
})
export class ServicesComponent {
    private subscription: Subscription;
    services: Service[];
    classes: Class[];

    constructor(
        private serviceService: ServiceService,
        private classService: ClassService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.subscription = this.serviceService.services.subscribe(services => {
            this.services = services;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    add() {
        let modal = this.modalService.open(ModalServiceAddComponent);
    }

    edit(service: Service) {
        this.serviceService.currentId = service.id;
        let modal = this.modalService.open(ModalServiceEditComponent);
    }

    remove(service: Service) {
        let modal = this.modalService.open(RemoveConfirmComponent);
        (modal.componentInstance as RemoveConfirmComponent).name = service.name;

        modal.result.then(
            (remove) => {
                if (remove) {
                    this.serviceService.remove(service.id);
                }
            }, reason => { });
    }
}