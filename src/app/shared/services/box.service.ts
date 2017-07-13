import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ApiService } from './api.service';
import { Box } from '../models/box.model';

@Injectable()
export class BoxService {
    private readonly path: string = '/boxes';

    private _boxesStorage: Box[];
    private _boxes = new BehaviorSubject<Box[]>(null);
    boxes = this._boxes.asObservable();

    currentId: string; //for passing data between components

    constructor(
        private apiService: ApiService
    ) {
        this.getAll()
            .subscribe(boxes => {
                this._boxesStorage = boxes;
                this._boxes.next(this._boxesStorage);
            });
    }

    private getAll(): Observable<Box[]> {
        return this.apiService.get(this.path)
            .map(data => {
                return (data.result as any[]).map(b => {
                    return this.getNewBox(b);
                });
            });
    }

    getCurrent(): Observable<Box> {
        return this.boxes
            .map(boxes => boxes.find(b => b.id === this.currentId));
    }

    add(box: Box) {
        this.apiService.post(this.path, box)
            .subscribe(data => {
                let newBox = this.getNewBox(data.result);
                this._boxesStorage.push(newBox);
                this._boxes.next(this._boxesStorage);
                data.result;
            });
    }

    update(box: Box) {
        return this.apiService.put(this.path + '/' + box.id, box)
            .subscribe(data => {
                let i = this._boxesStorage.findIndex(b => b.id === box.id);
                if (i != -1) {
                    this._boxesStorage.splice(i, 1, box);
                    this._boxes.next(this._boxesStorage);
                }
            });
    }

    remove(id: string) {
        this.apiService.delete(this.path + '/' + id)
            .subscribe(data => {
                let i = this._boxesStorage.findIndex(b => b.id === id);
                if (i != -1) {

                    this._boxesStorage.splice(i, 1);
                    this._boxes.next(this._boxesStorage);
                }
            });
    }

    private getNewBox(box: any) {
        return new Box(
            box._id,
            box.name,
            box.color
        );
    }
}