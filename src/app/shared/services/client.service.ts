import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { ApiService } from './api.service';
import { ClassService } from './class.service';
import { CarService } from './car.service';
import { Client, ClientAdd, ClientEdit, ClientCar, ClientCarAdd, ClientCarEdit } from '../models/client.model';
import { Class } from '../models/class.model';
import { Car } from '../models/car.model';
import { CustomDate } from '../models/custom-date.model';

@Injectable()
export class ClientService {
    private readonly path: string = '/clients';

    private _clientsStorage: Client[];
    private _clients = new ReplaySubject<Client[]>(1);
    clients = this._clients.asObservable();

    currentId: string; //for passing data between components

    constructor(
        private apiService: ApiService,
        private classService: ClassService,
        private carService: CarService
    ) {
        this.getAll()
            .subscribe(clients => {
                this._clientsStorage = clients;
                this._clients.next(this._clientsStorage);
            });
    }

    getCurrent(): Observable<Client> {
        return this.clients
            .map(clients => clients.find(c => c.id === this.currentId));
    }

    add(client: ClientAdd) {
        Observable.zip(
            this.apiService.post(this.path, this.mapToApiModel(client)),
            this.classService.classes.take(1),
            this.carService.cars.take(1),
            (data, classes, cars) => {
                this._clientsStorage.push(this.mapFromApiModel(data.result, classes, cars));
                this._clients.next(this._clientsStorage);
            }).subscribe();
    }

    addAfterOrderComplete(client: any) {
        Observable.zip(
            this.classService.classes.take(1),
            this.carService.cars.take(1),
            (classes, cars) => {
                this._clientsStorage.push(this.mapFromApiModel(client, classes, cars));
                this._clients.next(this._clientsStorage);
            }).subscribe();
    }

    update(client: ClientEdit) {
        Observable.zip(
            this.apiService.put(this.path + '/' + client.id, this.mapToApiModel(client)),
            this.classService.classes.take(1),
            this.carService.cars.take(1),
            (data, classes, cars) => {
                let i = this._clientsStorage.findIndex(c => c.id === client.id);
                if (i != -1) {
                    this._clientsStorage.splice(i, 1, this.mapFromApiModel(data.result, classes, cars));
                    this._clients.next(this._clientsStorage);
                }
            }).subscribe();
    }

    remove(id: string) {
        return this.apiService.delete(this.path + '/' + id)
            .subscribe(data => {
                let i = this._clientsStorage.findIndex(c => c.id === id);
                if (i != -1) {
                    this._clientsStorage.splice(i, 1);
                    this._clients.next(this._clientsStorage);
                }
            });
    }

    getClientByCarNumber(number: string, carId?: string) {
        return carId ?
            this._clientsStorage.find(c => c.cars.some(car => car.number === number && car.id !== carId)) :
            this._clientsStorage.find(c => c.cars.some(car => car.number === number));
    }

    private getAll(): Observable<Client[]> {
        return Observable.zip(
            this.classService.classes.take(1),
            this.carService.cars.take(1),
            this.apiService.get(this.path),
            (classes, cars, data) => {
                return (data.result as any[]).map(client => {
                    return this.mapFromApiModel(client, classes, cars);
                });
            });
    }

    private mapToApiModel(client: ClientAdd | ClientEdit): any {
        return {
            _id: client.id,
            name: client.name,
            phone: client.phone ? client.phone : null,
            birthday: client.birthday ? `${client.birthday.year}-${client.birthday.month}-${client.birthday.day}` : null,
            discount: client.discount ? client.discount : null,
            cars: client.cars.map(c => {
                return {
                    car_id: c.id,
                    number: c.number
                }
            })
        }
    }

    private mapFromApiModel(client: any, classes: Class[], cars: Car[]): Client {
        return new Client(
            client._id,
            client.name,
            client.phone ? client.phone : '',
            client.birthday ? CustomDate.TryParse(client.birthday) : null,
            client.discount,
            (client.cars as any[]).map(car => {
                //find car's class
                const currentCar = cars.find(c => c.id === car.car_id);
                return currentCar ?
                    new ClientCar(
                        currentCar.id,
                        currentCar.brand,
                        currentCar.model,
                        car.number,
                        currentCar.carClass
                    ) :
                    new ClientCar(
                        '',
                        '',
                        '',
                        car.number,
                        undefined
                    );
            })
        );
    }
}