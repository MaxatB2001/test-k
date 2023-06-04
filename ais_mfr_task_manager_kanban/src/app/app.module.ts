import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KanbanRoutingModule } from './kanban/kanban-routing.module';
import { KanbanModule } from './kanban/kanban.module';
import { FormsModule } from '@angular/forms';
import { initializeKeycloak } from './keycloak/keycloak-init.factory';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    KanbanRoutingModule,
    HttpClientModule,
    KanbanModule,
    FormsModule,
    KeycloakAngularModule,
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
