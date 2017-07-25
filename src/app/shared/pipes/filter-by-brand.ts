import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CarBase } from '../models/car.model';

@Pipe({
    name: 'filterByBrand',
    pure: false
})
export class FilterByClassBrand implements PipeTransform {
    transform(cars: CarBase[], brand: string, currentModel?: string, control?: FormControl) {
        if(cars == undefined) return;
        const result = cars.filter(c => c.brand === brand);
        //for filtering services in dropdown (when create/update order)
        if (currentModel && control) {
            result.some(c => c.model === currentModel) ?
                control.setValue(currentModel) :
                control.setValue('');
        }

        return result;
    }
}
