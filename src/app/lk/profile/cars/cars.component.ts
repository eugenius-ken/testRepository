import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CarService } from '../../../shared/services/car.service';
import { Car } from '../../../shared/models/car.model';
import { ClassService } from '../../../shared/services/class.service';
import { Class } from '../../../shared/models/class.model';
import { ModalCarAddComponent } from './modal/car-add.component';
// import { ModalCarEditComponent } from './modal/car-edit.component';
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
    ) {

    }

    ngOnInit() {
        this.subscription = Observable.zip(
            this.classService.classes,
            this.carService.cars,
            (classes, cars) => {
                this.cars.map(car => {
                    
                });
            }).subscribe();
    }

    add() {
        let modal = this.modalService.open(ModalCarAddComponent);
        modal.result.then(
            (car: Car) => {
                this.cars.push(car);
            }, reason => { });
    }

    // edit(car: Car) {
    //     this.carService.carToEdit = car;
    //     let modal = this.modalService.open(ModalCarEditComponent);

    //     modal.result.then(
    //         (car: Car) => {
    //             let i = this.cars.findIndex(b => b._id === car._id);
    //             this.cars[i] = car;
    //         }, reason => { });
    // }

    remove(car: Car) {
        let modal = this.modalService.open(RemoveConfirmComponent);
        (modal.componentInstance as RemoveConfirmComponent).name = car.brand + ' ' + car.model;

        modal.result.then(
            (remove) => {
                if (remove) {
                    this.carService.remove(car._id)
                        .subscribe(() => {
                            let i = this.cars.findIndex(b => b._id == car._id);
                            this.cars.splice(i, 1);
                        });
                }
            }, reason => { });
    }
}