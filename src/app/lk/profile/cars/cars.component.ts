import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CarService } from '../../../shared/services/car.service';
import { Car } from '../../../shared/models/car.model';
import { ClassService } from '../../../shared/services/class.service';
import { Class } from '../../../shared/models/class.model';
import { ModalCarAddComponent } from './modal/car-add.component';
import { ModalCarEditComponent } from './modal/car-edit.component';
import { RemoveConfirmComponent } from '../../remove-confirm/remove-confirm.component';

@Component({
    selector: 'profile-cars',
    templateUrl: './cars.component.html',
    styleUrls: ['../../lk.component.css']
})
export class CarsComponent {
    private subscription: Subscription;
    cars: Car[];
    classes: Class[];

    constructor(
        private carService: CarService,
        private classService: ClassService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.subscription = this.carService.cars.subscribe(cars => {
            this.cars = cars;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    add() {
        let modal = this.modalService.open(ModalCarAddComponent);
    }

    edit(car: Car) {
        this.carService.currentId = car.id;
        let modal = this.modalService.open(ModalCarEditComponent);
    }

    remove(car: Car) {
        let modal = this.modalService.open(RemoveConfirmComponent);
        (modal.componentInstance as RemoveConfirmComponent).name = car.brand + ' ' + car.model;

        modal.result.then(
            (remove) => {
                if (remove) {
                    this.carService.remove(car.id);
                }
            }, reason => { });
    }
}