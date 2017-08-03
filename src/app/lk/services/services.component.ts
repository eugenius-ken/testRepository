import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
    filterForm: FormGroup;
    services: Service[];
    classes: Class[];

    constructor(
        private serviceService: ServiceService,
        private classService: ClassService,
        private modalService: NgbModal,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.classService.classes.take(1).subscribe(classes => {
            this.classes = classes;
            this.initFilterForm();
            this.subscription = this.serviceService.services.subscribe(services => {
                this.services = services;
            });
        })
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    add() {
        let modal = this.modalService.open(ModalServiceAddComponent, {size: 'lg'});
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

    private initFilterForm() {
        this.filterForm = this.fb.group({
            'id': [this.classes.length > 0 ? this.classes[0].id : '']
        });
    }
}