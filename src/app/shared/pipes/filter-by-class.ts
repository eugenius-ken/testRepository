import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Service } from '../models/service.model';

@Pipe({
    name: 'filterByClass'
})
export class FilterByClassPipe implements PipeTransform {
    transform(services: Service[], currentId: string, classId: string, control: FormControl) {
        const result = services.filter(s => s.carClass.id === classId);
        result.some(s => s.id === currentId) ?
            control.setValue(currentId) :
            (result.length > 0 ? control.setValue(result[0].id)  : control.setValue(''));

        return result;
    }
}
