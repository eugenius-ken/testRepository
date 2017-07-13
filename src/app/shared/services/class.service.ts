import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ApiService } from './api.service';
import { Class } from '../models/class.model';

@Injectable()
export class ClassService {
    private readonly path: string = '/classes';
    private _classes = new BehaviorSubject<Class[]>([]);
    classes = this._classes.asObservable();
    classToEdit: Class;

    constructor(
        private apiService: ApiService
    ) {
        this.getAll()
            .subscribe(classes => {
                this._classes.next(classes);
            });
    }

    getAll(): Observable<Class[]> {
        return this.apiService.get(this.path)
            .map(data => {
                return data.result;
            });
    }

    get(id: string): Observable<Class> {
        return this.apiService.get(this.path + '/' + id)
            .map(data => {
                return data.result;
            });
    }

    add(classObj: Class): Observable<Class> {
        return this.apiService.post(this.path, classObj)
            .map(data => {
                return data.result;
            });
    }

    update(classObj: Class): Observable<Class> {
        return this.apiService.put(this.path + '/' + this.classToEdit._id, classObj)
            .map(data => {
                return data.result;
            });
    }

    remove(id: string): Observable<any> {
        return this.apiService.delete(this.path + '/' + id);
    }
}