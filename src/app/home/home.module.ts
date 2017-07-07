import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { ModalLoginComponent } from './modal/login/login.component';
import { ModalRegisterComponent } from './modal/register/register.component';

const homeRouting: ModuleWithProviders = RouterModule.forChild([
    { path: '', component: HomeComponent }
])

@NgModule({
    imports: [
        NgbModule,
        homeRouting,
        SharedModule,
    ],
    declarations: [
        HomeComponent,
        ModalLoginComponent,
        ModalRegisterComponent
    ],
    entryComponents: [ModalLoginComponent]
})
export class HomeModule { }