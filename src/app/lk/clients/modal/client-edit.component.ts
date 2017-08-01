import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerI18n } from '../../../shared/I18n/DatepickerI18n';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../../shared/services/client.service';
import { CarService } from '../../../shared/services/car.service';
import { CarBase } from '../../../shared/models/car.model';
import { ClientCar, ClientCarEdit } from '../../../shared/models/client.model';

@Component({
    selector: 'modal-client-edit',
    templateUrl: './client-edit.component.html',
    styleUrls: ['../../lk.component.css'],
    providers: [{ provide: NgbDatepickerI18n, useClass: DatePickerI18n }]
})
export class ModalClientEditComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    form: FormGroup;
    brands: CarBase[];
    models: CarBase[];
    numberIsExist: boolean = false;
    startDate;

    constructor(
        private activeModal: NgbActiveModal,
        private clientService: ClientService,
        private carService: CarService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.subscription = Observable.zip(
            this.clientService.getCurrent(),
            this.carService.cars.take(1),
            (client, cars) => {
                //get unique brand' names
                const brandNames = cars.map(c => c.brand).filter((b, i, arr) => {
                    return arr.indexOf(b) === i;
                });

                //get unique cars by brand' names
                this.brands = [];
                brandNames.forEach(name => {
                    this.brands.push(cars.find(c => c.brand === name));
                });
                this.models = cars.slice();

                this.form = this.fb.group({
                    'id': [client.id, Validators.required],
                    'name': [client.name, Validators.required],
                    'phone': [client.phone, [Validators.pattern(/^\d{10}$/)]],
                    'birthday': [client.birthday],
                    'discount': [client.discount],
                    'cars': this.fb.array([])
                });

                client.cars.forEach(c => {
                    (this.form.controls['cars'] as FormArray).push(this.initCar(c));
                });

            }).subscribe();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private initCar(car: ClientCar = null) {
        return car == null ?
            this.fb.group({
                'id': ['', Validators.required],
                'brand': ['', Validators.required],
                'model': ['', Validators.required],
                'number': ['', Validators.required]
            }) :
            this.fb.group({
                'id': [car.id, Validators.required],
                'brand': [car.brand, Validators.required],
                'model': [car.model, Validators.required],
                'number': [car.number, Validators.required]
            });
    }

    addCar() {
        (this.form.controls['cars'] as FormArray).push(this.initCar());
    }

    removeCar(i) {
        (this.form.controls['cars'] as FormArray).removeAt(i);
    }

    submit() {
        this.clientService.update(this.form.value)
        this.activeModal.close();
    }

    validateDate() {
        if (typeof (this.form.controls['birthday'].value) !== 'object') {
            this.form.controls['birthday'].setValue(null);
        }
    }

    carChanged(i) {
        const brand = (this.form.controls['cars'] as FormArray).at(i).get('brand').value;
        const model = (this.form.controls['cars'] as FormArray).at(i).get('model').value;
        if(brand && model) {
            const car = this.carService.getCarByBrandAndModel(brand, model);
            (this.form.controls['cars'] as FormArray).at(i).get('id').setValue(car ? car.id : '');
        }
        else {
            (this.form.controls['cars'] as FormArray).at(i).get('id').setValue('');
        }
    }

    numberChanged(i) {
        this.numberIsExist = false;
        this.delay(() => {
            //get cars array
            let cars: ClientCarEdit[] = [];
            let formCars = (this.form.controls['cars'] as FormArray);
            for (let i = 0; i < formCars.length; i++) {
                const number = formCars.at(i).get('number').value;
                const id = formCars.at(i).get('id').value;
                cars.push(new ClientCarEdit(id, number));
            }

            //find same numbers
            const sameNumbersExist = cars.some((car, i) => {
                const index = cars.findIndex(c => c.number === car.number);
                return index !== i;
            });

            if (sameNumbersExist) {
                this.numberIsExist = true;
            }
            else {
                //find between another clients' cars
                cars.forEach(c => {
                    const client = this.clientService.getClientByCarNumber(c.number, c.id);
                    if(client) {
                        this.numberIsExist = true;
                        return;
                    }
                });
            }
        }, 500);
    }

    private timer = 0;
    delay(callback: Function, ms) {
        clearTimeout(this.timer);
        this.timer = setTimeout(callback, ms);
    }
}