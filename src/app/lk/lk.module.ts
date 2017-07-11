import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { LkComponent } from './lk.component';
import { HeaderComponent } from '../shared/layout/header.component';
import { OrdersComponent } from '../lk/orders/orders.component';
import { ProfileDataComponent } from './profile/data/data.component';
import { BoxesComponent } from './profile/boxes/boxes.component';

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
        OrdersComponent,
        ProfileDataComponent,
        BoxesComponent
    ]
})
export class LkModule { }