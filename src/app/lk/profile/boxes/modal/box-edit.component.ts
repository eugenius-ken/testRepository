import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BoxService } from '../../../../shared/services/box.service';
import { Box } from '../../../../shared/models/box.model';

@Component({
    selector: 'modal-box-edit',
    templateUrl: './box-edit.component.html',
    styleUrls: ['../../../lk.component.css']
})
export class ModalBoxEditComponent implements OnInit {
    form: FormGroup;
    isSubmitting: boolean = false;
    currentBox: Box = new Box();

    constructor(
        private activeModal: NgbActiveModal,
        private boxService: BoxService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            'name': [this.currentBox.name, Validators.required]
        });
    }

    ngOnInit() {
        this.form.setValue({ 'name': this.boxService.boxToEdit.name });
    }

    submit() {
        this.boxService.update(this.form.value)
            .subscribe(box => {
                this.activeModal.close(box);
            });
    }
}