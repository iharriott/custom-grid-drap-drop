import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatFooterRowDef, MatTable, MatTableDataSource } from '@angular/material/table';
import { TableColumn } from './table-column';
import { CdkDragDrop, CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ThrowStmt } from '@angular/compiler';
import { FooterColumns } from '../customer/footer-columns';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css']
})
export class CustomTableComponent implements OnInit {
  public tableDataSource = new MatTableDataSource();
  public displayedColumns!: string[];
  private _isSortable!: boolean;
  @ViewChild(MatPaginator, { static: false }) matPaginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort!: MatSort;
  @ViewChild(MatFooterRowDef, { static: true }) footerDef!: MatFooterRowDef;
  @Input() isPageable = false;
  @Input() hasFooterRow = false;
  @Input() showCheckboxColumn = false;
  @Input() footerRow: any;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() tableColumns!: TableColumn[];
  @Input() detailsEvent!: string;
  @Input() updateEvent!: string;
  @Input() deleteEvent!: string;
  @Input() paginationSizes: number[] = [5, 10, 15];
  @Input() defaultPageSize = this.paginationSizes[1];

  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  @Output() rowAction: EventEmitter<any> = new EventEmitter<any>();

  previousIndex!: number;
  @ViewChild(MatTable) table!: MatTable<any>;

  // this property needs to have a setter, to dynamically get changes from parent component
  @Input() set tableData(data: any[]) {
    this.setTableDataSource(data);
  }

  isEventColAdded: boolean = false;
  columnNames: string[] = [];
  footerDisplayedColumns: string[] =[];
  selection = new SelectionModel<unknown>(true, []);

  constructor() { }

  ngOnInit(): void {
    console.log("filter = " + this.isFilterable);
    console.log("sort = " + this.isSortable);
    //this.footerDisplayedColumns = this.footerColumns.map(col => col.fieldText);
    console.log("columns = " + this.tableColumns);
    this.columnNames = this.tableColumns.map((tableColumn: TableColumn) => tableColumn.name);

    //this.displayedColumns = [...columnNames, this.detailsEvent, this.updateEvent, this.deleteEvent];
    this.displayedColumns = this.displayColumns();
    //this.removeFooter();

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.tableDataSource.data.forEach(row => this.selection.select(row));
  }

  displayColumns(): string[] {
   
    if (!this.isEventColAdded && this.detailsEvent) {
      this.isEventColAdded = true;
      this.displayedColumns = [...this.columnNames, this.detailsEvent];
    } else if (this.isEventColAdded && this.detailsEvent) {
      this.displayedColumns = [...this.displayedColumns, this.detailsEvent];
    }

    if (!this.isEventColAdded && this.updateEvent) {
      this.isEventColAdded = true;
      this.displayedColumns = [...this.columnNames, this.updateEvent];
    } else if (this.isEventColAdded && this.updateEvent) {
      this.displayedColumns = [...this.displayedColumns, this.updateEvent];
    }

    if (!this.isEventColAdded && this.deleteEvent) {
      this.isEventColAdded = true;
      this.displayedColumns = [...this.columnNames, this.deleteEvent];
    } else if (this.isEventColAdded && this.deleteEvent) {
      this.displayedColumns = [...this.displayedColumns, this.deleteEvent];
    }

    
    if (!this.deleteEvent && !this.updateEvent && !this.detailsEvent) {
      this.displayedColumns = this.columnNames;
    }

    if (this.showCheckboxColumn){
      this.displayedColumns = ['select', ...this.displayedColumns];
    }

    return this.displayedColumns;
  }

  removeFooter() {
    console.log('footer definition' + this.footerDef.columns);
    //this.table.removeFooterRowDef(this.footerDef);
  }

  addFooter() {
    this.table.addFooterRowDef(this.footerDef);
  }


  // we need this, in order to make pagination work with *ngIf
  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.matPaginator;

  }

  setTableDataSource(data: any) {
    this.tableDataSource = new MatTableDataSource<any>(data);
    this.tableDataSource.paginator = this.matPaginator;
    this.tableDataSource.sort = this.matSort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  sortTable(sortParameters: Sort) {
    // defining name of data property, to sort by, instead of column name
    sortParameters.active = this.tableColumns.find(column => column.name === sortParameters.active)?.dataKey as string;
    this.sort.emit(sortParameters);
  }


  emitRowAction(row: any) {
    //console.log(row);
    console.log(this.tableDataSource.data);
    this.rowAction.emit(row);
  }

  redirectToDetails(id: number) {
    console.log(id);
  }

  setDisplayedColumns() {
    this.tableColumns.forEach((col, index) => {
      col.index = index;
      this.displayedColumns[index] = col.name;
    });
  }

  /* dragStarted(event: CdkDragStart, index: number) {
    console.log('drag started');
    this.previousIndex = index;
  } */

  //dropListDropped(event: CdkDragDrop<any[]>, index: number)
  dropListDropped(event: CdkDragDrop<unknown[]>) {
    console.log(event);
    if (event) {
      console.log(`event current indx ${event.currentIndex} previous indx ${event.previousIndex}`)
      moveItemInArray(this.tableColumns, event.previousIndex, event.currentIndex);
      this.setDisplayedColumns();
      this.table.renderRows();
      console.log(this.tableDataSource.data)

    }
  }
}
