import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KanbanAdminComponent } from './kanban-admin/kanban-admin.component';
import { AuthGuardKeycloak } from '../classes/keycloak-auth.guard';

const routes: Routes = [{path: '', component: KanbanAdminComponent, canActivate: [AuthGuardKeycloak]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KanbanAdminRoutingModule { }
