import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkerService } from '../../../shared/services/worker.service';
import { BoxService } from '../../../shared/services/box.service';
import { Box } from '../../../shared/models/box.model';

@Component({
    selector: 'modal-worker-add',
    templateUrl: './worker-add.component.html',
    styleUrls: ['../../lk.component.css']
})
export class ModalWorkerAddComponent implements OnInit {
    form: FormGroup;
    boxes: Box[];
    isSubmitting: boolean = false;
    startDate;

    constructor(
        private activeModal: NgbActiveModal,
        private workerService: WorkerService,
        private boxService: BoxService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.boxService.boxes.take(1).subscribe(boxes => {
            this.boxes = boxes;

            this.form = this.fb.group({
                'name': ['', Validators.required],
                'job': ['', Validators.required],
                'startDate': [null],
                'boxes': [[]]
            });
        });
    }

    submit() {
        this.workerService.add(this.form.value)
        this.activeModal.close();
    }
}