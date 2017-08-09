import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DragulaModule } from 'ng2-dragula';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { SharedModule } from '../shared/shared.module';

import { FilterByClassPipe } from '../shared/pipes/filter-by-class';
import { FilterByClassBrand } from '../shared/pipes/filter-by-brand';
import { FilterWorkersByBox } from '../shared/pipes/filter-workers-by-box';
import { WithoutClass } from '../shared/pipes/without-class';
import { LkComponent } from './lk.component';
import { HeaderComponent } from '../shared/layout/header.component';
import { RemoveConfirmComponent } from './remove-confirm/remove-confirm.component';
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
import { ModalClientEditComponent } from './clients/modal/client-edit.component';
import { OrdersComponent } from '../lk/orders/orders.component';
import { ModalOrderAddComponent } from './orders/modal/order-add.component';
import { ModalOrderEditComponent } from './orders/modal/order-edit.component';
import { ModalOrderCompleteComponent } from './orders/modal/order-complete.component';
import { ResetComponent } from './profile/reset/reset.component';
import { RemoveComponent } from './profile/remove/remove.component';
import { ModalChangePasswordComponent } from './profile/data/modal/change-password.component';
import { ModalChangeEmailComponent } from './profile/data/modal/change-email.component';
import { SupportComponent } from './profile/support/support.component';
import { ArchiveOrdersComponent } from './archive-orders/archive-orders.component';
import { ModalArchiveOrderDetailComponent } from './archive-orders/modal/archive-order-detail.component';
import { ModalTransactionsComponent } from './archive-orders/modal/transactions.component';
import { EmailConfirmedComponent } from './profile/email-confirmed/email-confirmed.component';




const lkRouting: ModuleWithProviders = RouterModule.forChild([
    {
        path: 'lk', component: LkComponent,
        children: [
            { path: 'profile/data', component: ProfileDataComponent },
            { path: 'profile/boxes', component: BoxesComponent },
            { path: 'profile/classes', component: ClassesComponent },
            { path: 'profile/cars', component: CarsComponent },
            { path: 'profile/reset', component: ResetComponent },
            { path: 'profile/remove', component: RemoveComponent },
            { path: 'profile/support', component: SupportComponent },
            { path: 'services', component: ServicesComponent },
            { path: 'workers', component: WorkersComponent },
            { path: 'clients', component: ClientsComponent },
            { path: 'orders', component: OrdersComponent },
            { path: 'archive-orders', component: ArchiveOrdersComponent },
            { path: 'profile/email-confirmed', component: EmailConfirmedComponent }
        ]
    }
]);

@NgModule({
    imports: [
        lkRouting,
        FormsModule,
        MultiselectDropdownModule,
        SharedModule,
        DragulaModule
    ],
    declarations: [
        LkComponent,
        FilterByClassPipe,
        FilterByClassBrand,
        FilterWorkersByBox,
        WithoutClass,
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
        ModalClientAddComponent,
        ModalClientEditComponent,
        ModalOrderAddComponent,
        ModalOrderEditComponent,
        ModalOrderCompleteComponent,
        ResetComponent,
        RemoveComponent,
        ModalChangePasswordComponent,
        SupportComponent,
        ArchiveOrdersComponent,
        ModalArchiveOrderDetailComponent,
        ModalChangeEmailComponent,
        EmailConfirmedComponent,
        ModalTransactionsComponent
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
        ModalClientAddComponent,
        ModalClientEditComponent,
        ModalOrderAddComponent,
        ModalOrderEditComponent,
        ModalOrderCompleteComponent,
        ModalChangePasswordComponent,
        ModalArchiveOrderDetailComponent,
        ModalChangeEmailComponent,
        EmailConfirmedComponent,
        ModalTransactionsComponent
    ]
})
export class LkModule { }