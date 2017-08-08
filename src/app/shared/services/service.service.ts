import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { URLSearchParams } from '@angular/http';

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

    currentName: string; //for passing data between components

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

    add(service: ServiceAdd) {
        Observable.zip(
            this.apiService.post(this.path, this.mapToApiModelForAdd(service)),
            this.classService.classes.take(1),
            (data, classes) => {
                (data.result as any[]).forEach(current => {
                    this._servicesStorage.push(this.mapFromApiModel(current, classes));
                    this._services.next(this._servicesStorage);
                });

            }).subscribe();
    }

    update(service: ServiceEdit) {
        let params = new URLSearchParams();
        params.append('name', this.currentName);

        Observable.zip(
            this.apiService.post(this.path + '/name', this.mapToApiModelForEdit(service), params),
            this.classService.classes.take(1),
            (data, classes) => {
                this.removeByName(this.currentName);
                (data.result as any[]).forEach(s => {
                    this._servicesStorage.push(this.mapFromApiModel(s, classes));
                });
                this._services.next(this._servicesStorage);
            }).subscribe();
    }

    removeCurrent() {
        let params = new URLSearchParams();
        params.append('name', this.currentName);

        return this.apiService.post(this.path + '/name', { services: [] }, params)
            .subscribe(data => {
                this.removeByName(this.currentName);
                this._services.next(this._servicesStorage);
            });
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

    private removeByName(name: string) {
        let index = 0;
        while (index != -1) {
            index = this._servicesStorage.findIndex(s => s.name === name);
            if (index != -1) {
                this._servicesStorage.splice(index, 1);
            }
        }
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

    private mapToApiModelForAdd(service: ServiceAdd) {
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

    private mapToApiModelForEdit(service: ServiceEdit) {
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