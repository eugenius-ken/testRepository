import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Worker } from '../models/worker.model';

@Pipe({
    name: 'filterWorkersByBox'
})
export class FilterWorkersByBox implements PipeTransform {
    transform(workers: Worker[], boxId: string) {
        return workers.filter(w => w.boxes.some(b => b.id === boxId));
    }
}
