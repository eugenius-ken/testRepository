import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { ApiService } from './api.service';
import { ClassService } from './class.service';
import { Car, CarAdd, CarEdit } from '../models/car.model';

@Injectable()
export class CarService {
    private readonly path: string = '/cars';

    private _carsStorage: Car[];
    private _cars = new ReplaySubject<Car[]>(1);
    cars = this._cars.asObservable();

    currentId: string; //for passing data between components

    constructor(
        private apiService: ApiService,
        private classService: ClassService
    ) {
        this.getAll()
            .subscribe(cars => {
                this._carsStorage = cars;
                this._cars.next(this._carsStorage);
            });
    }

    getCurrent(): Observable<Car> {
        return this.cars
            .map(cars => cars.find(c => c.id === this.currentId));
    }

    add(car: CarAdd) {
        Observable.zip(
            this.apiService.post(this.path, this.mapToApiModel(car)),
            this.classService.classes.take(1),
            (data, classes) => {
                this._carsStorage.push(
                    new Car(
                        data.result._id,
                        car.brand,
                        car.model,
                        classes.find(c => c.id === car.classId)
                    ));
                this._cars.next(this._carsStorage);
            }).subscribe();
    }

    update(car: CarEdit) {
        Observable.zip(
            this.apiService.put(this.path + '/' + car.id, this.mapToApiModel(car)),
            this.classService.classes.take(1),
            (data, classes) => {
                let i = this._carsStorage.findIndex(c => c.id === car.id);
                if (i != -1) {
                    this._carsStorage.splice(i, 1, new Car(
                        car.id,
                        car.brand,
                        car.model,
                        classes.find(c => c.id === car.classId)
                    ));
                    this._cars.next(this._carsStorage);
                }
            }).subscribe();
    }

    remove(id: string) {
        return this.apiService.delete(this.path + '/' + id)
            .subscribe(data => {
                let i = this._carsStorage.findIndex(b => b.id === id);
                if (i != -1) {
                    this._carsStorage.splice(i, 1);
                    this._cars.next(this._carsStorage);
                }
            });
    }

    private getAll(): Observable<Car[]> {
        return Observable.zip(
            this.classService.classes.take(1),
            this.apiService.get(this.path),
            (classes, data) => {
                return (data.result as any[]).map(car => {
                    let classObj = classes.find(c => c.id === car.class_id);
                    return new Car(
                        car._id,
                        car.brand,
                        car.model,
                        classObj
                    );
                });
            });
    }

    private mapToApiModel(car: CarAdd | CarEdit) {
        return {
            _id: car.id,
            brand: car.brand,
            model: car.model,
            class_id: car.classId
        }
    }
}