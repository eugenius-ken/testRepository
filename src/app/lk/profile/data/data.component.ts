import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalChangePasswordComponent } from './modal/change-password.component';

import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/user.model';

@Component({
    selector: 'profile-data',
    templateUrl: './data.component.html',
    styleUrls: ['../../lk.component.css']
})
export class ProfileDataComponent implements OnInit {
    private map: any;
    form: FormGroup;
    isSubmitting: boolean = false;
    isFormInitied: boolean = false;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.isSubmitting = true;
        this.userService.getCurrentUser()
            .subscribe(
            user => {
                this.updateData(user);
                this.isFormInitied = true;
                ymaps.ready(() => {
                    this.map = new ymaps.Map('map', {
                        center: [56.838560, 60.603712],
                        zoom: 12,
                        controls: ['zoomControl']
                    });
                    this.map.geoObjects.add(
                        new ymaps.GeoObject({
                            geometry: {
                                type: 'Point',
                                coordinates: [user.lat, user.lng]
                            }
                        })
                    );
                });
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
        this.userService.updateUser(this.form.value)
            .subscribe(
            user => {
                this.updateData(user);
            },
            error => {
                console.log(error.errors);
            },
            () => {
                this.isSubmitting = false;
            });
    }

    updateData(user: User) {
        this.form = this.fb.group({
            'name': [user.name, Validators.required],
            'email': [user.email, [Validators.required, Validators.email]],
            'phone': [user.phone, [Validators.required, Validators.pattern(/^((\+7)+([0-9]){10})$/gm)]],
            'address': [user.address, Validators.required],
            'lat': [user.lat],
            'lng': [user.lng]
        });
    }

    addressChanged() {
        this.delay(() => {
            const address = this.form.controls['address'].value;
            ymaps.geocode(address).then(result => {
                const point = result.geoObjects.get(0);
                const coordinates = point.geometry.getCoordinates();
                const bounds = point.properties.get('boundedBy');

                this.map.geoObjects.removeAll();
                this.map.geoObjects.add(point);
                this.map.setBounds(bounds);

                this.form.controls['lat'].setValue(coordinates[0]);
                this.form.controls['lng'].setValue(coordinates[1]);
            });
        }, 1000);
    }

    changePassword() {
        let modal = this.modalService.open(ModalChangePasswordComponent);
    }

    private timer = 0;
    delay(callback: Function, ms) {
        clearTimeout(this.timer);
        this.timer = setTimeout(callback, ms);
    }

}
