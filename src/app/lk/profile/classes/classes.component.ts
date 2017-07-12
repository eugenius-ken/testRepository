import { Component } from '@angular/core';

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
    classes: Class[];

    constructor(
        private classService: ClassService,
        private modalService: NgbModal
    ) { 
        this.classes = this.classService.classes;
    }

    add() {
        let modal = this.modalService.open(ModalClassAddComponent);
        modal.result.then(
            (classObj: Class) => {
                this.classes.push(classObj);
            }, reason => { });
    }

    edit(classObj: Class) {
        this.classService.classToEdit = classObj;
        let modal = this.modalService.open(ModalClassEditComponent);

        modal.result.then(
            (classObj: Class) => {
                let i = this.classes.findIndex(c => c._id === classObj._id);
                this.classes[i] = classObj;
            }, reason => { });
    }

    remove(classObj: Class) {
        let modal = this.modalService.open(RemoveConfirmComponent);
        (modal.componentInstance as RemoveConfirmComponent).name = classObj.name;

        modal.result.then(
            (remove) => {
                if (remove) {
                    this.classService.remove(classObj._id)
                        .subscribe(() => {
                            let i = this.classes.findIndex(c => c._id == classObj._id);
                            this.classes.splice(i, 1);
                        });
                }
            }, reason => { });
    }
}