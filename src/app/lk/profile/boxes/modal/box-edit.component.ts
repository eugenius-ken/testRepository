import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BoxService } from '../../../../shared/services/box.service';
import { Box } from '../../../../shared/models/box.model';

@Component({
    selector: 'modal-box-edit',
    templateUrl: './box-edit.component.html',
    styleUrls: ['../../../lk.component.css']
})
export class ModalBoxEditComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    form: FormGroup;
    isSubmitting: boolean = false;

    constructor(
        private activeModal: NgbActiveModal,
        private boxService: BoxService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.subscription =  this.boxService.getCurrent()
            .subscribe(box => {
                console.log('from edit');
                this.form = this.fb.group({
                    'id': [box.id, Validators.required],
                    'name': [box.name, Validators.required]
                });
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    submit() {
        this.boxService.update(this.form.value);
        this.activeModal.close();
    }
}