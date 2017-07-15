import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from './shared/services/api.service';
import { UserService } from './shared/services/user.service';
import { JwtService } from './shared/services/jwt.service';
import { BoxService } from './shared/services/box.service';
import { ClassService } from './shared/services/class.service';
import { CarService } from './shared/services/car.service';
import { ServiceService } from './shared/services/service.service';
import { WorkerService } from './shared/services/worker.service';

import { HomeModule } from './home/home.module';
import { LkModule } from './lk/lk.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { OrdersComponent } from './lk/orders/orders.component';

const rootRouting: ModuleWithProviders = RouterModule.forRoot([], { useHash: true });

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    HomeModule,
    LkModule,
    rootRouting
  ],
  providers: [
    ApiService,
    UserService,
    JwtService,
    BoxService,
    ClassService,
    CarService,
    ServiceService,
    WorkerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
