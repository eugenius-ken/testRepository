import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { LkComponent } from './lk.component';
import { HeaderComponent } from '../shared/layout/header.component';
import { RemoveConfirmComponent } from './remove-confirm/remove-confirm.component';
import { OrdersComponent } from '../lk/orders/orders.component';
import { ProfileDataComponent } from './profile/data/data.component';
import { BoxesComponent } from './profile/boxes/boxes.component';
import { ModalBoxAddComponent } from './profile/boxes/modal/box-add.component';
import { ModalBoxEditComponent } from './profile/boxes/modal/box-edit.component';

const lkRouting: ModuleWithProviders = RouterModule.forChild([
    {
        path: 'lk', component: LkComponent,
        children: [
            { path: 'orders', component: OrdersComponent },
            { path: 'profile/data', component: ProfileDataComponent },
            { path: 'profile/boxes', component: BoxesComponent }
        ]
    }
]);

@NgModule({
    imports: [
        lkRouting,
        SharedModule
    ],
    declarations: [
        LkComponent,
        HeaderComponent,
        RemoveConfirmComponent,
        OrdersComponent,
        ProfileDataComponent,
        BoxesComponent,
        ModalBoxAddComponent,
        ModalBoxEditComponent
    ],
    entryComponents: [
        RemoveConfirmComponent,
        ModalBoxAddComponent,
        ModalBoxEditComponent
    ]
})
export class LkModule { }