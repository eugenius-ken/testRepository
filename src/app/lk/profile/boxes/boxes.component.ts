import { Component, OnInit } from '@angular/core';

import { BoxesService } from '../../../shared/services/boxes.service';
import { Box } from '../../../shared/models/box.model';

@Component({
    selector: 'profile-boxes',
    templateUrl: './boxes.component.html',
    styleUrls: ['../../lk.component.css']
})
export class BoxesComponent implements OnInit {

    public boxes: [Box];

    constructor(
        private boxesService: BoxesService
    ) { }

    ngOnInit() {
        this.boxesService.getAll()
            .subscribe(
            boxes => {
                this.boxes = boxes;
            },
            error => {
                console.log(error.errors);
            });
    }

    

}