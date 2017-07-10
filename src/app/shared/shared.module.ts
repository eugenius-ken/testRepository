import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

@NgModule({
    imports: [
        ReactiveFormsModule,
        CommonModule,
        HttpModule
    ],
    exports: [
        ReactiveFormsModule,
        CommonModule
    ]
})
export class SharedModule { }