import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { ApiService } from './api.service';
import { Class } from '../models/class.model';

@Injectable()
export class ClassService {
    private readonly path: string = '/classes';

    private _classesStorage: Class[];
    private _classes = new ReplaySubject<Class[]>(1);
    classes = this._classes.asObservable();
    
    currentId: string;

    constructor(
        private apiService: ApiService
    ) {
        this.getAll()
            .subscribe(classes => {
                this._classesStorage = classes;
                this._classes.next(this._classesStorage);
            });
    }

    getCurrent(): Observable<Class> {
        return this.classes
            .map(classes => classes.find(c => c.id === this.currentId));
    }

    add(classObj: Class) {
        this.apiService.post(this.path, classObj)
            .subscribe(data => {
                let newClass = this.getNewClass(data.result);
                this._classesStorage.push(newClass);
                this._classes.next(this._classesStorage);
                data.result;
            });
    }

    update(classObj: Class) {
        return this.apiService.put(this.path + '/' + classObj.id, classObj)
            .subscribe(data => {
                let i = this._classesStorage.findIndex(c => c.id === classObj.id);
                if (i != -1) {
                    this._classesStorage.splice(i, 1, classObj);
                    this._classes.next(this._classesStorage);
                }
            });
    }

    remove(id: string) {
        this.apiService.delete(this.path + '/' + id)
            .subscribe(data => {
                let i = this._classesStorage.findIndex(c => c.id === id);
                if (i != -1) {

                    this._classesStorage.splice(i, 1);
                    this._classes.next(this._classesStorage);
                }
            });
    }

    private getAll(): Observable<Class[]> {
        return this.apiService.get(this.path)
            .map(data => {
                return (data.result as any[]).map(c => {
                    return this.getNewClass(c);
                });
            });
    }

    private getNewClass(classObj: any) {
        return new Class(
            classObj._id,
            classObj.name
        );
    }
}