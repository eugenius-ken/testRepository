import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StrongPasswordModule } from './strong-password/strong-password.module';

@NgModule({
    imports: [
        ReactiveFormsModule,
        CommonModule,
        HttpModule,
        NgbModule,
        StrongPasswordModule
    ],
    exports: [
        ReactiveFormsModule,
        CommonModule,
        NgbModule,
        StrongPasswordModule
    ]
})
export class SharedModule { }