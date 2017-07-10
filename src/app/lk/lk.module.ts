import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { LkComponent } from './lk.component';
import { HeaderComponent } from '../shared/layout/header.component';
import { OrdersComponent } from '../lk/orders/orders.component';
import { SettingsComponent } from '../lk/settings/settings.component';

const lkRouting: ModuleWithProviders = RouterModule.forChild([
    {
        path: 'lk', component: LkComponent,
        children: [
            { path: 'orders', component: OrdersComponent },
            { path: 'settings', component: SettingsComponent }
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
        SettingsComponent
    ]
})
export class LkModule { }