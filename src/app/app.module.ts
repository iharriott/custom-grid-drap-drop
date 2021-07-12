import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GenericGridComponent } from './generic-grid/generic-grid.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AutoGridComponent } from './auto-grid/auto-grid.component';
import { CustomTableComponent } from './custom-table/custom-table.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CustomerComponent } from './customer/customer.component';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { QuoteEventsComponent } from './quote-events/quote-events.component';

@NgModule({
  declarations: [
    AppComponent,
    GenericGridComponent,
    AutoGridComponent,
    CustomTableComponent,
    CustomerComponent,
    QuoteEventsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    DragDropModule,
    MatCheckboxModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
