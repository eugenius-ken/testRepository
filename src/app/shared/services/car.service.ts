import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ApiService } from './api.service';
import { ClassService } from './class.service';
import { Car } from '../models/car.model';

@Injectable()
export class CarService {
    private readonly path: string = '/cars';

    private _carsStorage: Car[];
    private _cars = new BehaviorSubject<Car[]>(null);
    cars = this._cars.asObservable();
    carToEdit: Car;

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

    private getAll(): Observable<Car[]> {
        return this.apiService.get(this.path)
            .map(data => {
                let result: Car[] = [];
                return result;
            });
    }

    get(id: string): Observable<Car> {
        return this.apiService.get(this.path + '/' + id)
            .map(data => {
                return data.result;
            });
    }

    add(car: Car): Observable<Car> {
        return this.apiService.post(this.path, car)
            .map(data => {
                return data.result;
            });
    }

    update(car: Car): Observable<Car> {
        return this.apiService.put(this.path + '/' + this.carToEdit._id, car)
            .map(data => {
                return data.result;
            });
    }

    remove(id: string): Observable<any> {
        return this.apiService.delete(this.path + '/' + id);
    }
}