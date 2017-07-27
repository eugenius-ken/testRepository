import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Service } from '../models/service.model';

@Pipe({
    name: 'filterByClass',
    pure: false
})
export class FilterByClassPipe implements PipeTransform {
    transform(entities: Service[], classId: string, currentId?: string, control?: FormControl) {
        if(entities == undefined) return;
        const result = entities.filter(e => {
            return e.carClass !== undefined ? e.carClass.id === classId : false;
        });
        //for filtering services in dropdown (when create/update order)
        if (currentId && control) {
            result.some(e => e.id === currentId) ?
                control.setValue(currentId) :
                (result.length > 0 ? control.setValue(result[0].id) : control.setValue(''));
        }

        return result;
    }
}
