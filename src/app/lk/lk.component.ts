import { Component } from '@angular/core';

import { BoxService } from '../shared/services/box.service';
import { ClassService } from '../shared/services/class.service';

@Component({
    selector: 'lk-page',
    templateUrl: './lk.component.html',
    styleUrls: ['./lk.component.css']
})
export class LkComponent {
    constructor(
        private boxService: BoxService,
        private classService: ClassService
    ) { }
}