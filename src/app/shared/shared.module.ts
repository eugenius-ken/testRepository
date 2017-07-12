import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        ReactiveFormsModule,
        CommonModule,
        HttpModule,
        NgbModule
    ],
    exports: [
        ReactiveFormsModule,
        CommonModule,
        NgbModule
    ]
})
export class SharedModule { }