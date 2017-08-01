import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from '../../../shared/services/service.service';
import { ClassService } from '../../../shared/services/class.service';
import { Class } from '../../../shared/models/class.model';

@Component({
    selector: 'modal-service-add',
    templateUrl: './service-add.component.html',
    styleUrls: ['../../lk.component.css']
})
export class ModalServiceAddComponent implements OnInit {
    form: FormGroup;
    classes: Class[];

    constructor(
        private activeModal: NgbActiveModal,
        private serviceService: ServiceService,
        private classService: ClassService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.classService.classes.take(1).subscribe(classes => {
            this.classes = classes;

            this.form = this.fb.group({
                'name': ['', Validators.required],
                'price': ['', Validators.required],
                'workerPercent': ['', [Validators.required, Validators.min(0), Validators.max(100)]],
                'duration': ['', [Validators.required, Validators.pattern(/^\d+$/)]],
                'classId': [this.classes.length > 0 ? this.classes[0].id : '', Validators.required]
            });
        });
    }

    submit() {
        this.serviceService.add(this.form.value)
        this.activeModal.close();
    }
}