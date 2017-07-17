import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { ApiService } from './api.service';
import { BoxService } from './box.service';
import { Worker, WorkerAdd, WorkerEdit } from '../models/worker.model';
import { Box } from '../models/box.model';
import { Time } from '../models/time.model';

@Injectable()
export class WorkerService {
    private readonly path: string = '/staff';

    private _workersStorage: Worker[];
    private _workers = new ReplaySubject<Worker[]>(1);
    workers = this._workers.asObservable();

    currentId: string; //for passing data between components

    constructor(
        private apiService: ApiService,
        private boxService: BoxService
    ) {
        this.getAll()
            .subscribe(workers => {
                this._workersStorage = workers;
                this._workers.next(this._workersStorage);
            });
    }

    getCurrent(): Observable<Worker> {
        return this.workers
            .map(workers => workers.find(c => c.id === this.currentId));
    }

    add(worker: WorkerAdd) {
        Observable.zip(
            this.apiService.post(this.path, this.mapToApiModel(worker)),
            this.boxService.boxes.take(1),
            (data, boxes) => {
                this._workersStorage.push(this.mapFromApiModel(data.result, boxes));
                this._workers.next(this._workersStorage);
            }).subscribe();
    }

    update(worker: WorkerEdit) {
        Observable.zip(
            this.apiService.put(this.path + '/' + worker.id, this.mapToApiModel(worker)),
            this.boxService.boxes.take(1),
            (data, boxes) => {
                let i = this._workersStorage.findIndex(c => c.id === worker.id);
                if (i != -1) {
                    this._workersStorage.splice(i, 1, this.mapFromApiModel(data.result, boxes));
                    this._workers.next(this._workersStorage);
                }
            }).subscribe();
    }

    remove(id: string) {
        return this.apiService.delete(this.path + '/' + id)
            .subscribe(data => {
                let i = this._workersStorage.findIndex(c => c.id === id);
                if (i != -1) {
                    this._workersStorage.splice(i, 1);
                    this._workers.next(this._workersStorage);
                }
            });
    }

    private getAll(): Observable<Worker[]> {
        return Observable.zip(
            this.boxService.boxes.take(1),
            this.apiService.get(this.path),
            (boxes, data) => {
                return (data.result as any[]).map(worker => {
                    return this.mapFromApiModel(worker, boxes);
                });
            });
    }

    private mapToApiModel(worker: WorkerAdd | WorkerEdit): any {
        return {
            _id: worker.id,
            name: worker.name,
            job: worker.job,
            start_date: worker.startDate ? `${worker.startDate.hour}:${worker.startDate.minute}` : null,
            boxes: worker.boxes
        }
    }

    private mapFromApiModel(worker: any, boxes: Box[]): Worker {
        return new Worker(
            worker._id,
            worker.name,
            worker.job,
            Time.TryParse(worker.start_date),
            (worker.boxes as string[]).map(id => {
                return boxes.find(b => b.id === id);
            })
        );
    }
}