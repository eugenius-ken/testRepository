import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Car } from '../models/car.model';

@Pipe({
    name: 'withoutClass',
    pure: false
})
export class WithoutClass implements PipeTransform {
    transform(cars: Car[]) {
        return cars.filter(e => e.carClass === undefined);
    }
}
