import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BoxService } from '..//../shared/services/box.service';

@Component({
    selector: 'remove-confirm',
    templateUrl: './remove-confirm.component.html',
    styleUrls: ['../lk.component.css']
})
export class RemoveConfirmComponent {
    name: string = '';

    constructor(
        private activeModal: NgbActiveModal,
        private boxService: BoxService
    ) { }

    remove() {
        this.activeModal.close(true);
    }

    cancel() {
        this.activeModal.close(false);
    }
}