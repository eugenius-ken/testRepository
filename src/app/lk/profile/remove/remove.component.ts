import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { ApiService } from '../../../shared/services/api.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
    selector: 'remove-data',
    templateUrl: './remove.component.html',
    styleUrls: ['../../lk.component.css']
})

export class RemoveComponent implements OnInit {
    form: FormGroup;
    isSuccess: boolean = false;
    isError: boolean = false;
    token: string = '';
    private path = '/company/delete';

    constructor(
        private apiService: ApiService,
        private userService: UserService,
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
                    this.userService.logout();
                    location.href = '/';
                }, 3000);
            },
            error => {
                this.isError = true;
            });
    }
}