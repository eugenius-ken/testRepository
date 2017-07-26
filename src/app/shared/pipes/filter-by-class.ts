import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Service } from '../models/service.model';

@Pipe({
    name: 'filterByClass',
    pure: false
})
export class FilterByClassPipe implements PipeTransform {
    transform(services: Service[], classId: string, currentId?: string, control?: FormControl) {
        if(services == undefined) return;
        const result = services.filter(s => s.carClass.id === classId);
        //for filtering services in dropdown (when create/update order)
        if (currentId && control) {
            result.some(s => s.id === currentId) ?
                control.setValue(currentId) :
                (result.length > 0 ? control.setValue(result[0].id) : control.setValue(''));
        }

        return result;
    }
}
