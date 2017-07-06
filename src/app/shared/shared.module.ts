import { NgModule } from '@angular/core';

import { ModalComponent } from './modal/modal.component';

@NgModule({
    declarations: [
        ModalComponent
    ],
    exports: [
        ModalComponent
    ]

})
export class SharedModule { }