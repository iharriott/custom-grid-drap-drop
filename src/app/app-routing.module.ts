import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoGridComponent } from './auto-grid/auto-grid.component';
//import { CustomTableComponent } from './custom-table/custom-table.component';
import { CustomerComponent } from './customer/customer.component';
//import { GenericGridComponent } from './generic-grid/generic-grid.component';

const routes: Routes = [{ path: '', component: CustomerComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
