import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { ModalLoginComponent } from './modal/login/login.component';
import { ModalRegisterComponent } from './modal/register/register.component';
import { ModalCallComponent } from './modal/call/call.component';
import { ModalRestorePasswordComponent } from './modal/restore-password/restore-password.component';

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
        ModalCallComponent,
        ModalRestorePasswordComponent
    ],
    entryComponents: [
        ModalLoginComponent,
        ModalRegisterComponent,
        ModalCallComponent,
        ModalRestorePasswordComponent
    ]
})
export class HomeModule { }