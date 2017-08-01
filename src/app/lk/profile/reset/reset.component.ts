import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { ApiService } from '../../../shared/services/api.service';

@Component({
    selector: 'reset-data',
    templateUrl: './reset.component.html',
    styleUrls: ['../../lk.component.css']
})

export class ResetComponent implements OnInit {
    form: FormGroup;
    isSuccess: boolean = false;
    isError: boolean = false;
    token: string = '';
    private path = '/company/reset';

    constructor(
        private apiService: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.form = this.fb.group({
            'token': ['', Validators.required]
        });
    }

    getToken() {
        this.apiService.post(this.path)
            .subscribe(data => {
                this.token = data.result.confirmation;
            });
    }

    submit() {
        this.isSuccess = false;
        this.isError = false;
        this.apiService.post(this.path, { confirmation: this.form.get('token').value })
            .subscribe(
            data => {
                this.isSuccess = true;

                setTimeout(() => {
                    location.reload();
                }, 3000);
            },
            error => {
                this.isError = true;
            });
    }
}