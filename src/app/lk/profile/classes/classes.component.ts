import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ClassService } from '../../../shared/services/class.service';
import { Class } from '../../../shared/models/class.model';
import { ModalClassAddComponent } from './modal/class-add.component';
import { ModalClassEditComponent } from './modal/class-edit.component';
import { RemoveConfirmComponent } from '../../remove-confirm/remove-confirm.component';

@Component({
    selector: 'profile-classes',
    templateUrl: './classes.component.html',
    styleUrls: ['../../lk.component.css']
})
export class ClassesComponent {
    private subscription: Subscription;
    classes: Class[];

    constructor(
        private classService: ClassService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.subscription = this.classService.classes.subscribe(classes => {
            this.classes = classes;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    add() {
        this.modalService.open(ModalClassAddComponent);
    }

    edit(classObj: Class) {
        this.classService.currentId = classObj.id;
        this.modalService.open(ModalClassEditComponent);
    }

    remove(classObj: Class) {
        let modal = this.modalService.open(RemoveConfirmComponent);
        (modal.componentInstance as RemoveConfirmComponent).name = classObj.name;

        modal.result.then(
            (remove) => {
                if (remove) {
                    this.classService.remove(classObj.id)
                }
            }, reason => { });
    }
}