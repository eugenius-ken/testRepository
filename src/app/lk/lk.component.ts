import { Component } from '@angular/core';

@Component({
    selector: 'lk-page',
    templateUrl: './lk.component.html',
    styles: [`
        .container-fluid { 
            background-color: #d8d8d8;
            height: 100%;
            padding-left: 0px;
            padding-right: 0px;
        }
        .container {
            padding-top: 20px;
        }
    `]
})
export class LkComponent { }