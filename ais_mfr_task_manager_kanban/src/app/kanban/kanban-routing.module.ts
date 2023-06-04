import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardKeycloak } from '../classes/keycloak-auth.guard';
import { KanbanComponent } from './kanban.component';

const routes: Routes = [{
  path:'', component: KanbanComponent, canActivate: [AuthGuardKeycloak]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KanbanRoutingModule { }
