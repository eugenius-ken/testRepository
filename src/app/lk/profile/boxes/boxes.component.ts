import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BoxService } from '../../../shared/services/box.service';
import { Box } from '../../../shared/models/box.model';
import { ModalBoxAddComponent } from './modal/box-add.component';
import { ModalBoxEditComponent } from './modal/box-edit.component';
import { RemoveConfirmComponent } from '../../remove-confirm/remove-confirm.component';

@Component({
    selector: 'profile-boxes',
    templateUrl: './boxes.component.html',
    styleUrls: ['../../lk.component.css']
})
export class BoxesComponent implements OnInit {
    boxes: [Box];

    constructor(
        private boxService: BoxService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.boxService.getAll()
            .subscribe(
            boxes => {
                this.boxes = boxes;
            },
            error => {
                console.log(error.errors);
            });
    }

    add() {
        let modal = this.modalService.open(ModalBoxAddComponent);
        modal.result.then(
            (box: Box) => {
                this.boxes.push(box);
            }, reason => { });
    }

    edit(box: Box) {
        this.boxService.boxToEdit = box;
        let modal = this.modalService.open(ModalBoxEditComponent);

        modal.result.then(
            (box: Box) => {
                let i = this.boxes.findIndex(b => b._id === box._id);
                this.boxes[i] = box;
            }, reason => { });
    }

    remove(box: Box) {
        let modal = this.modalService.open(RemoveConfirmComponent);
        (modal.componentInstance as RemoveConfirmComponent).name = box.name;

        modal.result.then(
            (remove) => {
                if (remove) {
                    this.boxService.remove(box._id)
                        .subscribe(() => {
                            let i = this.boxes.findIndex(b => b._id == box._id);
                            this.boxes.splice(i, 1);
                        });
                }
            }, reason => { });
    }
}