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
            this.apiService.post(this.path, this.mapToApiModelFromAdd(service)),
            this.classService.classes.take(1),
            (data, classes) => {
                (data.result as any[]).forEach(current => {
                    this._servicesStorage.push(this.mapFromApiModel(current, classes));
                    this._services.next(this._servicesStorage);
                });

            }).subscribe();
    }

    update(service: ServiceEdit) {
        Observable.zip(
            this.apiService.put(this.path, this.mapToApiModelFromEdit(service)),
            this.classService.classes.take(1),
            (data, classes) => {
                (data.result as any[]).forEach(current => {
                    let i = this._servicesStorage.findIndex(s => s.id === current.id);
                    if (i != -1) {
                        this._servicesStorage.splice(i, 1, this.mapFromApiModel(current, classes));
                        this._services.next(this._servicesStorage);
                    }
                })


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

    private mapToApiModelFromAdd(service: ServiceAdd) {
        return {
            services: service.services.map(s => {
                return {
                    name: service.name,
                    price: s.price,
                    worker_percent: s.workerPercent,
                    duration: s.duration,
                    class_id: s.classId
                };
            })
        };
    }

    private mapToApiModelFromEdit(service: ServiceEdit) {
        return {
            services: service.services.map(s => {
                return {
                    _id: s.id,
                    name: service.name,
                    price: s.price,
                    worker_percent: s.workerPercent,
                    duration: s.duration,
                    class_id: s.classId
                };
            })
        };
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