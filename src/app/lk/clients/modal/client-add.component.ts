import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerI18n } from '../../../shared/I18n/DatepickerI18n';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../../shared/services/client.service';
import { CarService } from '../../../shared/services/car.service';
import { CarBase } from '../../../shared/models/car.model';

@Component({
    selector: 'modal-client-add',
    templateUrl: './client-add.component.html',
    styleUrls: ['../../lk.component.css'],
    providers: [{ provide: NgbDatepickerI18n, useClass: DatePickerI18n }]
})
export class ModalClientAddComponent implements OnInit {
    form: FormGroup;
    isSubmitting: boolean = false;
    brands: CarBase[];
    models: CarBase[];

    constructor(
        private activeModal: NgbActiveModal,
        private clientService: ClientService,
        private carService: CarService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.carService.cars.take(1).subscribe(cars => {

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
                'name': ['', Validators.required],
                'phone': ['', [Validators.pattern(/^\d{10}$/)]],
                'birthday': [null],
                'discount': [''],
                'cars': this.fb.array([this.initCar()])
            });
        });
    }

    private initCar() {
        return this.fb.group({
            'id': ['', Validators.required],
            'brand': ['', Validators.required],
            'model': ['', Validators.required],
            'number': ['', Validators.required]
        });
    }

    addCar() {
        (this.form.controls['cars'] as FormArray).push(this.initCar());
    }

    removeCar(i) {
        (this.form.controls['cars'] as FormArray).removeAt(i);
    }

    submit() {
        this.clientService.add(this.form.value)
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
}