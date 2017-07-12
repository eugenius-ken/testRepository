import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { ModalLoginComponent } from './modal/login/login.component';
import { ModalRegisterComponent } from './modal/register/register.component';
import { ModalCallComponent } from './modal/call/call.component';

const homeRouting: ModuleWithProviders = RouterModule.forChild([
    { path: '', component: HomeComponent }
])

@NgModule({
    imports: [
        homeRouting,
        SharedModule,
    ],
    declarations: [
        HomeComponent,
        ModalLoginComponent,
        ModalRegisterComponent,
        ModalCallComponent
    ],
    entryComponents: [
        ModalLoginComponent,
        ModalRegisterComponent,
        ModalCallComponent
    ]
})
export class HomeModule { }