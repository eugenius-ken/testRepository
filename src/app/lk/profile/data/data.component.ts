import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/user.model';

@Component({
    selector: 'profile-data',
    templateUrl: './data.component.html',
    styleUrls: ['../../lk.component.css']
})
export class ProfileDataComponent implements OnInit {
    private form: FormGroup;
    private isSubmitting: boolean = false;

    constructor(
        private fb: FormBuilder,
        private userService: UserService
    ) {
        this.form = this.fb.group({
            'name': ['', Validators.required],
            'full_name': ['', Validators.required],
            'email': ['', [Validators.required, Validators.email]],
            'phone': ['', [Validators.required, Validators.pattern(/^((\+7)+([0-9]){10})$/gm)]]
        });
    }

    ngOnInit() {
        this.isSubmitting = true;
        this.userService.getCurrentUser()
        .subscribe(
            user => {
                this.updateForm(user);
                this.form.controls['phone'].setValue('+7' + user.phone);
            },
            error => {
                console.log(error.errors);
            },
            () => {
                this.isSubmitting = false;
            });
    }

    submit() {
        this.isSubmitting = true;
        let userModel = new User();
        Object.assign(userModel, this.form.value);

        this.userService.updateUser(this.form.value)
            .subscribe(
            user => {
                this.updateForm(user);
            },
            error => {
                console.log(error.errors);
            },
            () => {
                this.isSubmitting = false;
            });
    }

    private updateForm(user: User) {
        this.form.controls['email'].setValue(user.email);
        this.form.controls['name'].setValue(user.name);
        this.form.controls['full_name'].setValue(user.full_name);
        // this.form.controls['phone'].setValue('+7' + user.phone); this row set form as invalid. Why???
    }
}
