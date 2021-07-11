import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { from, of, pipe, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { DcfColumn } from './dcf-column.interface';
import { first, take, takeUntil } from 'rxjs/operators';
//import {pipe} from 'fp-ts/lib/function';

export interface GridState {
  isLoaded: boolean,
  payload?: any[],
}

export interface IParams {
  key: string;
  value: string;
}

@Component({
  selector: 'app-generic-grid',
  templateUrl: './generic-grid.component.html',
  styleUrls: ['./generic-grid.component.css']
})
export class GenericGridComponent implements OnInit {

  constructor() { }
  columns: DcfColumn[] = [];
  columnNames!: DcfColumn[];
  displayedColumnsArray!: string[][];
  dataColumns: string[] = [];
  showExport!: boolean;
  dataSource!: MatTableDataSource<any>;
  numberOfRows: number = 50; // PageSize
  @Input() gridState$!: BehaviorSubject<GridState>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngUnsubscribe$: Subject<any> = new Subject();
  //totalRow: TotalRow;

  params = { "Name": "John", "Address": "Pearson cres", "phone": "7804647876" };

  /* getProperty<Type, key>(obj: Type, key: key) {
    console.log(obj[key]);
  } */


  ngOnInit(): void {
    let val = "{&quot;textColumn&quot;: [{ &quot;column&quot;: &quot;invMonth&quot;, &quot;display&quot;: &quot;Total&quot; }], &quot;sumColumn&quot;: [&quot;sale&quot;, &quot;dealSheetAmount&quot;, &quot;dealSheetGP&quot;, &quot;actualAmount&quot;, &quot;actualGP&quot;, &quot;restatedAmount&quot;, &quot;restatedGP&quot;], &quot;averageColumn&quot;: [{&quot;column&quot;: &quot;dealSheetGPPercent&quot;, &quot;weight&quot;: &quot;sale&quot;},{&quot;column&quot;: &quot;actualGPPercent&quot;, &quot;weight&quot;: &quot;sale&quot;},{&quot;column&quot;: &quot;restatedGPPercent&quot;, &quot;weight&quot;: &quot;sale&quot;}]}" as string;
    var re = /&quot;/g;
    val = val.replace(/&quot;/g, '"');
    console.log('before=' + val);
    val = JSON.parse(val);
    console.log('after =' + val);

    /* for (const key, values in this.params as object) {
      console.log(key);
      console.log(this.params[key])

    } */

    for (const [key, value] of Object.entries(this.params)) {

      console.log('the key=' + key, 'the value =' + value);

    }

    Object.keys(this.params).forEach((key) => {
      console.log('key' + key)
    })

    Object.values(this.params).forEach((value) => {
      console.log(value)
    })




    //const subject = new BehaviorSubject(0);
    /* let subject = new Subject();
    let subject2 = new Subject();

    const series$ = subject.asObservable();
    series$.pipe(takeUntil(subject2)).subscribe(val => console.log(val)); */

    from([10, 20, 30, 40, 50]).subscribe(val => console.log(val * 2));

    //from([10, 20, 30, 40, 50]).pipe(this.add(val))

    /* subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.next(4);
    subject2.next(8);
    subject.next(5);


    subject.pipe(take(2)).subscribe(
      (data) => console.log('emitted data ' + data),
      (err) => console.log('error ' + err),
      () => console.log('done')
    ) */

    this.getGrid();

    setTimeout(() => {

      //series$.subscribe(val => console.log(val));
    }, 3000)

  }

  add(val: number) {
    return val * 2;
  }

  getGrid() {
    let data: any = this.data();
    this.columns = data[4004].columns as DcfColumn[];
    console.log(this.columns);
    this.getHeaders(this.columns);
    const config = data[4004].config;
    const numberOfRows = config.find((x: { configName: string; }) => { return x.configName === 'PageSize' }); // if not set, defaults to 50
    console.log("numRows =" + numberOfRows);
    let totalRow = config.find((x: { configName: string; }) => { return x.configName === 'TotalRow' }); // if not set, no total row
    console.log("totalRow =" + totalRow);

    this.gridState$
      ?.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(gridState => {
        console.log('gridstate ' + gridState.isLoaded);
        this.gridStateChanged(gridState as GridState);
      });

  }

  getHeaders(columns: DcfColumn[]) {
    // populate children of each parent column
    columns.forEach(col => { col.colspan = 1; col.rowspan = 1; });
    columns = columns.sort((a, b) => a.displayOrder - b.displayOrder);
    columns = columns.map(col => {
      col.children = columns.filter(x => x.parentFieldId === col.fieldId);
      return col;
    });
    let columnArray: DcfColumn[][] = [];
    const displayedColumnsArray = []
    let nextRow: DcfColumn[];
    // top level of headers (no parent)
    nextRow = columns.filter(x => !x.parentFieldId);
    while (nextRow.length) {
      columnArray.push(nextRow);
      displayedColumnsArray.push(nextRow.map(x => x.fieldName));
      // next row of headers (has parent in previous row)
      nextRow = columnArray[columnArray.length - 1].map(x => x.children).reduce((acc, val) => acc?.concat(val as DcfColumn[]), []) as DcfColumn[]; // should be able to replace reduce with .flat() in es2019
    }
    for (let i = columnArray.length - 2; i >= 0; i--) { // iterate from bottom to top, as we require the calculated values in lower rows
      // if no children, make the cell go all the way to the bottom of the headers
      columnArray[i].filter(col => !col.children?.length).forEach(col => col.rowspan = columnArray.length - i);
      // if there are children, make the cell wide enough to cover all children
      columnArray[i].filter(col => col.children?.length).forEach(col => col.colspan = col.children?.reduce((acc, val) => acc + val.colspan!, 0));
    }
    this.displayedColumnsArray = displayedColumnsArray;
    console.log('displayedCloumnsArray ' + this.displayedColumnsArray);
    this.columnNames = columnArray.reduce((acc, val) => acc.concat(val), []);
    this.columnNames.forEach(val => console.log('column-name = ' + val.fieldName));
    //console.log('columnNames ' + this.columnNames[0].fieldName);
    this.dataColumns = this.columnNames.filter(col => !col.children?.length).map(col => col.fieldName);
    console.log('dataColumns ' + this.dataColumns);

  }

  gridStateChanged(gridState: GridState) {
    if (gridState.isLoaded) {
      this.updateGridData(gridState.payload!);
    }
  }

  updateGridData(data: any[]) {
    data = data || [];
    //if (this.totalRow && data.length) {
    // add a total row to the end of the recordset.
    // We should be using a footer row instead of adding this to the other data rows, but this isn't supported until material 7+
    //data = this.addTotalRow(this.totalRow, data);
    // data =[];
    // }
    this.dataSource.data = data;
    this.paginator.firstPage();
  }

  pipe(...fns: any[]) {
    return (value: any) => {
      fns.forEach(fn => value = fn(value));
      return value;
    }
  }

  data(): any {
    let data = {
      "4004": {
        "definition": {
          "componentId": 4004,
          "componentTypeId": 1,
          "name": "COTI Sales Summary",
          "description": "",
          "componentType": "Grid",
          "roleId": 2147483646
        },
        "config": [
          {
            "configName": "ShowColumnBorder",
            "configValue": "false",
            "rs_Type": "4004.config"
          },
          {
            "configName": "ShowTitle",
            "configValue": "True",
            "rs_Type": "4004.config"
          },
          {
            "configName": "GroupBy",
            "rs_Type": "4004.config"
          },
          {
            "configName": "ShowRowHover",
            "configValue": "True",
            "rs_Type": "4004.config"
          },
          {
            "configName": "ShowTotalCount",
            "rs_Type": "4004.config"
          },
          {
            "configName": "EnableExportToExcel",
            "configValue": "true",
            "rs_Type": "4004.config"
          },
          {
            "configName": "ShowGridTools",
            "configValue": "True",
            "rs_Type": "4004.config"
          },
          {
            "configName": "GroupHeaderTpl",
            "configValue": "{groupValue}",
            "rs_Type": "4004.config"
          },
          {
            "configName": "HideGroupedHeader",
            "configValue": "False",
            "rs_Type": "4004.config"
          },
          {
            "configName": "PageSize",
            "configValue": "0",
            "rs_Type": "4004.config"
          },
          {
            "configName": "ColumnsDraggable",
            "configValue": "True",
            "rs_Type": "4004.config"
          },
          {
            "configName": "TotalRow",
            "configValue": "{&quot;textColumn&quot;: [{ &quot;column&quot;: &quot;invMonth&quot;, &quot;display&quot;: &quot;Total&quot; }], &quot;sumColumn&quot;: [&quot;sale&quot;, &quot;dealSheetAmount&quot;, &quot;dealSheetGP&quot;, &quot;actualAmount&quot;, &quot;actualGP&quot;, &quot;restatedAmount&quot;, &quot;restatedGP&quot;], &quot;averageColumn&quot;: [{&quot;column&quot;: &quot;dealSheetGPPercent&quot;, &quot;weight&quot;: &quot;sale&quot;},{&quot;column&quot;: &quot;actualGPPercent&quot;, &quot;weight&quot;: &quot;sale&quot;},{&quot;column&quot;: &quot;restatedGPPercent&quot;, &quot;weight&quot;: &quot;sale&quot;}]}",
            "rs_Type": "4004.config"
          },
          {
            "configName": "ShowExport",
            "configValue": "1",
            "rs_Type": "4004.config"
          }
        ],
        "columns": [
          {
            "fieldId": 40041,
            "fieldName": "invMonth",
            "headerText": "Mth",
            "minWidth": 100,
            "width": 100,
            "sortable": true,
            "alignment": "center",
            "displayOrder": 10,
            "showInd": 2,
            "showExcelInd": 2,
            "rs_Type": "4004.columns"
          },
          {
            "fieldId": 40042,
            "fieldName": "sale",
            "headerText": "Count",
            "minWidth": 100,
            "width": 100,
            "sortable": true,
            "alignment": "center",
            "displayOrder": 20,
            "showInd": 2,
            "showExcelInd": 2,
            "fieldDataType": "link",
            "rs_Type": "4004.columns"
          },
          {
            "fieldId": 40043,
            "fieldName": "DealSheet",
            "headerText": "Deal Sheet",
            "sortable": false,
            "alignment": "center",
            "displayOrder": 30,
            "showInd": 2,
            "showExcelInd": 2,
            "rs_Type": "4004.columns"
          },
          {
            "fieldId": 40044,
            "fieldName": "dealSheetAmount",
            "headerText": "Sell",
            "parentFieldId": 40043,
            "minWidth": 100,
            "flex": 1,
            "sortable": true,
            "alignment": "right",
            "displayOrder": 10,
            "showInd": 2,
            "showExcelInd": 2,
            "fieldDataType": "currency",
            "rs_Type": "4004.columns"
          },
          {
            "fieldId": 40045,
            "fieldName": "dealSheetGPPercent",
            "headerText": "GP%",
            "parentFieldId": 40043,
            "minWidth": 100,
            "flex": 1,
            "sortable": true,
            "alignment": "center",
            "displayOrder": 20,
            "showInd": 2,
            "showExcelInd": 2,
            "fieldDataType": "percent",
            "rs_Type": "4004.columns"
          },
          {
            "fieldId": 40046,
            "fieldName": "dealSheetGP",
            "headerText": "GP",
            "parentFieldId": 40043,
            "minWidth": 100,
            "flex": 1,
            "sortable": true,
            "alignment": "right",
            "displayOrder": 30,
            "showInd": 2,
            "showExcelInd": 2,
            "fieldDataType": "currency",
            "rs_Type": "4004.columns"
          },
          {
            "fieldId": 40047,
            "fieldName": "Actual",
            "headerText": "Actual",
            "sortable": false,
            "alignment": "center",
            "displayOrder": 40,
            "showInd": 2,
            "showExcelInd": 2,
            "fieldDataType": "number",
            "rs_Type": "4004.columns"
          },
          {
            "fieldId": 40048,
            "fieldName": "actualAmount",
            "headerText": "Sell",
            "parentFieldId": 40047,
            "minWidth": 100,
            "flex": 1,
            "sortable": true,
            "alignment": "right",
            "displayOrder": 10,
            "showInd": 2,
            "showExcelInd": 2,
            "fieldDataType": "currency",
            "rs_Type": "4004.columns"
          },
          {
            "fieldId": 40049,
            "fieldName": "actualGPPercent",
            "headerText": "GP%",
            "parentFieldId": 40047,
            "minWidth": 100,
            "flex": 1,
            "sortable": true,
            "alignment": "center",
            "displayOrder": 20,
            "showInd": 2,
            "showExcelInd": 2,
            "fieldDataType": "percent",
            "rs_Type": "4004.columns"
          },
          {
            "fieldId": 400410,
            "fieldName": "actualGP",
            "headerText": "GP",
            "parentFieldId": 40047,
            "minWidth": 100,
            "flex": 1,
            "sortable": true,
            "alignment": "right",
            "displayOrder": 30,
            "showInd": 2,
            "showExcelInd": 2,
            "fieldDataType": "currency",
            "rs_Type": "4004.columns"
          },
          {
            "fieldId": 400411,
            "fieldName": "Restated",
            "headerText": "Restated",
            "sortable": false,
            "alignment": "center",
            "displayOrder": 50,
            "showInd": 2,
            "showExcelInd": 2,
            "fieldDataType": "number",
            "rs_Type": "4004.columns"
          },
          {
            "fieldId": 400412,
            "fieldName": "restatedAmount",
            "headerText": "Sell",
            "parentFieldId": 400411,
            "minWidth": 100,
            "flex": 1,
            "sortable": true,
            "alignment": "right",
            "displayOrder": 10,
            "showInd": 2,
            "showExcelInd": 2,
            "fieldDataType": "currency",
            "rs_Type": "4004.columns"
          },
          {
            "fieldId": 400413,
            "fieldName": "restatedGPPercent",
            "headerText": "GP%",
            "parentFieldId": 400411,
            "minWidth": 100,
            "flex": 1,
            "sortable": true,
            "alignment": "center",
            "displayOrder": 20,
            "showInd": 2,
            "showExcelInd": 2,
            "fieldDataType": "percent",
            "rs_Type": "4004.columns"
          },
          {
            "fieldId": 400414,
            "fieldName": "restatedGP",
            "headerText": "GP",
            "parentFieldId": 400411,
            "minWidth": 100,
            "flex": 1,
            "sortable": true,
            "alignment": "right",
            "displayOrder": 30,
            "showInd": 2,
            "showExcelInd": 2,
            "fieldDataType": "currency",
            "rs_Type": "4004.columns"
          }
        ]
      },
      "": [
        {
          "roleFlags": "16",
          "componentTypeId": 1
        }
      ],
      "execState": {
        "status": 0,
        "success": true,
        "stats": {
          "responseTime": 349,
          "parseTime": 3
        }
      }
    }

    return data;
  }

  /* firstFriendName = pipe(
    val => val.columns
  ) */

}
