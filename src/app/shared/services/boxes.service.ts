import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';
import { Box } from '../models/box.model';

@Injectable()
export class BoxesService {
    private readonly path: string = '/boxes';

    constructor(
        private apiService: ApiService
    ) { }

    getAll(): Observable<[Box]> {
        return this.apiService.get(this.path)
            .map(data => {
                return data.result;
            });
    }

    get(id: string): Observable<Box> {
        return this.apiService.get(this.path + '/' + id)
        .map(data => {
            return data.result;
        });
    }

    add(box: Box): Observable<Box> {
        return this.apiService.post(this.path, box)
        .map(data => {
            return data.result;
        });
    }

    update(box: Box): Observable<Box> {
        return this.apiService.put(this.path, box)
        .map(data => {
            return data.result;
        });
    }

    remove(id: string): Observable<any> {
        return this.apiService.delete(this.path + '/' + id);
    }
}