import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { ApiService } from './api.service';
import { ClassService } from './class.service';
import { Service, ServiceAdd, ServiceEdit } from '../models/service.model';
import { Class } from '../models/class.model';

@Injectable()
export class ServiceService {
    private readonly path: string = '/services';

    private _servicesStorage: Service[];
    private _services = new ReplaySubject<Service[]>(1);
    services = this._services.asObservable();

    currentId: string; //for passing data between components

    constructor(
        private apiService: ApiService,
        private classService: ClassService
    ) {
        this.getAll()
            .subscribe(services => {
                this._servicesStorage = services;
                this._services.next(this._servicesStorage);
            });
    }

    getCurrent(): Observable<Service> {
        return this.services
            .map(services => services.find(s => s.id === this.currentId));
    }

    add(service: ServiceAdd) {
        Observable.zip(
            this.apiService.post(this.path, this.mapToApiModel(service)),
            this.classService.classes.take(1),
            (data, classes) => {
                this._servicesStorage.push(this.mapFromApiModel(data.result, classes));
                this._services.next(this._servicesStorage);
            }).subscribe();
    }

    update(service: ServiceEdit) {
        Observable.zip(
            this.apiService.put(this.path + '/' + service.id, this.mapToApiModel(service)),
            this.classService.classes.take(1),
            (data, classes) => {
                let i = this._servicesStorage.findIndex(s => s.id === service.id);
                if (i != -1) {
                    this._servicesStorage.splice(i, 1, this.mapFromApiModel(data.result, classes));
                    this._services.next(this._servicesStorage);
                }
            }).subscribe();
    }

    remove(id: string) {
        return this.apiService.delete(this.path + '/' + id)
            .subscribe(data => {
                let i = this._servicesStorage.findIndex(s => s.id === id);
                if (i != -1) {
                    this._servicesStorage.splice(i, 1);
                    this._services.next(this._servicesStorage);
                }
            });
    }

    private getAll(): Observable<Service[]> {
        return Observable.zip(
            this.classService.classes.take(1),
            this.apiService.get(this.path),
            (classes, data) => {
                return (data.result as any[]).map(service => {
                    return this.mapFromApiModel(service, classes);
                });
            });
    }

    private mapToApiModel(service: ServiceAdd | ServiceEdit) {
        return {
            _id: service.id,
            name: service.name,
            price: service.price,
            worker_percent: service.workerPercent,
            duration: service.duration,
            class_id: service.classId
        }
    }

    private mapFromApiModel(service: any, classes: Class[]): Service {
        return new Service(
            service._id,
            service.name,
            service.price,
            service.worker_percent,
            service.duration,
            classes.find(c => c.id === service.class_id)
        );
    }
}