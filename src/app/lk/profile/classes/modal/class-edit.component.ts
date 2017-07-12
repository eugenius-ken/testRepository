import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClassService } from '../../../../shared/services/class.service';
import { Class } from '../../../../shared/models/class.model';

@Component({
    selector: 'modal-class-edit',
    templateUrl: './class-edit.component.html',
    styleUrls: ['../../../lk.component.css']
})
export class ModalClassEditComponent implements OnInit {
    form: FormGroup;
    isSubmitting: boolean = false;

    constructor(
        private activeModal: NgbActiveModal,
        private classService: ClassService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            'name': ['', Validators.required]
        });
    }

    ngOnInit() {
        this.form.setValue({ 'name': this.classService.classToEdit.name });
    }

    submit() {
        this.classService.update(this.form.value)
            .subscribe(box => {
                this.activeModal.close(box);
            });
    }
}