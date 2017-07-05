import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
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
    HomeModule,
    LkModule,
    rootRouting
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
