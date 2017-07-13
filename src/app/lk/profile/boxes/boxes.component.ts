import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

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
export class BoxesComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    boxes: Box[];

    constructor(
        private boxService: BoxService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.subscription = this.boxService.boxes.subscribe(boxes => {
            this.boxes = boxes;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    add() {
        this.modalService.open(ModalBoxAddComponent);
    }

    edit(box: Box) {
        this.boxService.currentId = box.id;
        this.modalService.open(ModalBoxEditComponent);
    }

    remove(box: Box) {
        let modal = this.modalService.open(RemoveConfirmComponent);
        (modal.componentInstance as RemoveConfirmComponent).name = box.name;

        modal.result.then(
            (remove) => {
                if (remove) {
                    this.boxService.remove(box.id)
                }
            }, reason => { });
    }
}