import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClassService } from '../../../../shared/services/class.service';
import { Class } from '../../../../shared/models/class.model';

@Component({
    selector: 'modal-class-edit',
    templateUrl: './class-edit.component.html',
    styleUrls: ['../../../lk.component.css']
})
export class ModalClassEditComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    form: FormGroup;
    isSubmitting: boolean = false;

    constructor(
        private activeModal: NgbActiveModal,
        private classService: ClassService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.subscription = this.classService.getCurrent()
            .subscribe(classObj => {
                this.form = this.fb.group({
                    'id': [classObj.id, Validators.required],
                    'name': [classObj.name, Validators.required]
                });
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    submit() {
        this.classService.update(this.form.value)
        this.activeModal.close();
    }
}