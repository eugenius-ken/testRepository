import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { SharedModule } from '../shared/shared.module';

import { LkComponent } from './lk.component';
import { HeaderComponent } from '../shared/layout/header.component';
import { RemoveConfirmComponent } from './remove-confirm/remove-confirm.component';
import { OrdersComponent } from '../lk/orders/orders.component';
import { ProfileDataComponent } from './profile/data/data.component';
import { BoxesComponent } from './profile/boxes/boxes.component';
import { ModalBoxAddComponent } from './profile/boxes/modal/box-add.component';
import { ModalBoxEditComponent } from './profile/boxes/modal/box-edit.component';
import { ClassesComponent } from './profile/classes/classes.component';
import { ModalClassAddComponent } from './profile/classes/modal/class-add.component';
import { ModalClassEditComponent } from './profile/classes/modal/class-edit.component';
import { CarsComponent } from './profile/cars/cars.component';
import { ModalCarAddComponent } from './profile/cars/modal/car-add.component';
import { ModalCarEditComponent } from './profile/cars/modal/car-edit.component';
import { ServicesComponent } from './services/services.component';
import { ModalServiceAddComponent } from './services/modal/service-add.component';
import { ModalServiceEditComponent } from './services/modal/service-edit.component';
import { WorkersComponent } from './workers/workers.component';
import { ModalWorkerAddComponent } from './workers/modal/worker-add.component';
import { ModalWorkerEditComponent } from './workers/modal/worker-edit.component';
import { ClientsComponent } from './clients/clients.component';
import { ModalClientAddComponent } from './clients/modal/client-add.component';

const lkRouting: ModuleWithProviders = RouterModule.forChild([
    {
        path: 'lk', component: LkComponent,
        children: [
            { path: 'profile/data', component: ProfileDataComponent },
            { path: 'profile/boxes', component: BoxesComponent },
            { path: 'profile/classes', component: ClassesComponent },
            { path: 'profile/cars', component: CarsComponent },
            { path: 'services', component: ServicesComponent },
            { path: 'workers', component: WorkersComponent },
            { path: 'orders', component: OrdersComponent },
            { path: 'clients', component: ClientsComponent }
        ]
    }
]);

@NgModule({
    imports: [
        lkRouting,
        FormsModule,
        MultiselectDropdownModule,
        SharedModule,
    ],
    declarations: [
        LkComponent,
        HeaderComponent,
        RemoveConfirmComponent,
        OrdersComponent,
        ProfileDataComponent,
        BoxesComponent,
        ModalBoxAddComponent,
        ModalBoxEditComponent,
        ClassesComponent,
        ModalClassAddComponent,
        ModalClassEditComponent,
        CarsComponent,
        ModalCarAddComponent,
        ModalCarEditComponent,
        ServicesComponent,
        ModalServiceAddComponent,
        ModalServiceEditComponent,
        WorkersComponent,
        ModalWorkerAddComponent,
        ModalWorkerEditComponent,
        ClientsComponent,
        ModalClientAddComponent
    ],
    entryComponents: [
        RemoveConfirmComponent,
        ModalBoxAddComponent,
        ModalBoxEditComponent,
        ModalClassAddComponent,
        ModalClassEditComponent,
        ModalCarAddComponent,
        ModalCarEditComponent,
        ModalServiceAddComponent,
        ModalServiceEditComponent,
        ModalWorkerAddComponent,
        ModalWorkerEditComponent,
        ModalClientAddComponent
    ]
})
export class LkModule { }