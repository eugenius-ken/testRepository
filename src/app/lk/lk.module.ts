import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LkComponent } from './lk.component';
import { OrdersComponent } from '../lk/orders/orders.component';

const lkRouting: ModuleWithProviders = RouterModule.forChild([
    {
        path: 'lk', component: LkComponent,
        children: [
            { path: 'orders', component: OrdersComponent }
        ]
    }
]);

@NgModule({
    imports: [
        lkRouting
    ],
    declarations: [
        LkComponent,
        OrdersComponent
    ]
})
export class LkModule { }