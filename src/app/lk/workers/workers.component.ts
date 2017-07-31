import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { WorkerService } from '../../shared/services/worker.service';
import { Worker } from '../../shared/models/worker.model';
import { BoxService } from '../../shared/services/box.service';
import { Box } from '../../shared/models/box.model';
import { CustomDate } from '../../shared/models/custom-date.model';
import { ModalWorkerAddComponent } from './modal/worker-add.component';
import { ModalWorkerEditComponent } from './modal/worker-edit.component';
import { RemoveConfirmComponent } from '../remove-confirm/remove-confirm.component';

@Component({
    selector: 'profile-workers',
    templateUrl: './workers.component.html',
    styleUrls: ['../lk.component.css']
})
export class WorkersComponent {
    private subscription: Subscription;
    workers: Worker[];

    constructor(
        private workerService: WorkerService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.subscription = this.workerService.workers.subscribe(workers => {
            this.workers = workers;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    add() {
        let modal = this.modalService.open(ModalWorkerAddComponent);
    }

    edit(worker: Worker) {
        this.workerService.currentId = worker.id;
        let modal = this.modalService.open(ModalWorkerEditComponent);
    }

    remove(worker: Worker) {
        let modal = this.modalService.open(RemoveConfirmComponent);
        (modal.componentInstance as RemoveConfirmComponent).name = worker.name;

        modal.result.then(
            (remove) => {
                if (remove) {
                    this.workerService.remove(worker.id);
                }
            }, reason => { });
    }

    getStringForBoxes(boxes: Box[]) {
        let arr = boxes.map(b => {
            return b.name;
        });

        return arr.join(', ');
    }

    private getStringForDate(date: CustomDate) {
        if (date) {
            const month = date.month < 10 ? '0' + String(date.month) : String(date.month);
            const day = date.day < 10 ? '0' + String(date.day) : String(date.day);
            return `${date.year}-${month}-${day}`;
        }
        else {
            return '';
        }

    }
}