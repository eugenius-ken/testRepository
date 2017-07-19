import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Service } from '../models/service.model';

@Pipe({
    name: 'filterByClass'
})
export class FilterByClassPipe implements PipeTransform {
    transform(services: Service[], classId: string, control: FormControl) {
        const result = services.filter(s => s.carClass.id === classId);
        if (result.length > 0) control.setValue(result[0].id);
        
        return result;
    }
}
