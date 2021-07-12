import { Component, OnInit, ViewChild } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { EventData } from './event';

@Component({
  selector: 'app-quote-events',
  templateUrl: './quote-events.component.html',
  styleUrls: ['./quote-events.component.css']
})

export class QuoteEventsComponent implements OnInit {
  todo = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  done = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];

  PACKAGE_DATA: any[] = [{package:'Construction Gold 250 / 2000'},{package:'Construction Gold 250 / 3000'},{package:'Construction Gold 250'}];
  PACKAGE_DATA2: any[] = [{package:'Construction Gold 350 / 2000'},{package:'Construction Gold 350 / 3000'},{package:'Construction Gold 350'}];
  public tableDataSource = new MatTableDataSource(this.PACKAGE_DATA);
  public displayedColumns: string[] = ['package'];
  @ViewChild(MatTable) mtablefirst!: MatTable<any>;
  @ViewChild(MatTable) mtablesecond!: MatTable<any>;
  eventColumns: string[] = ['event', 'costPerOccurence', 'occurences', 'frequency', 'price', 'actions'];
  EVENT_DATA: EventData[] = [
    { event: 'PM 1', costPerOccurence: '85.12', occurences: 0, frequency: 500, price: 0 },
    { event: 'PM 2', costPerOccurence: '143.28', occurences: 0, frequency: 1000, price: 0 },
    { event: 'PM 3', costPerOccurence: '305.76', occurences: 0, frequency: 2000, price: 0 },
    { event: 'PM 4', costPerOccurence: '629.76', occurences: 0, frequency: 4000, price: 0 },
  ];

  public tableDataSource2 = new MatTableDataSource(this.EVENT_DATA);

  constructor() { }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<any[]>) {
    console.log(event.previousContainer.data);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log(`previous data ${event.previousContainer.data.map(x => x.toString())} current data ${event.container.data} `)
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
                        //this.mtablefirst.renderRows();
                        //this.mtablesecond.renderRows();
    }
   
      console.log(this.tableDataSource.data)
      console.log(this.tableDataSource2.data)
    this.tableDataSource = new MatTableDataSource(this.PACKAGE_DATA);
    this.tableDataSource2 = new MatTableDataSource(this.EVENT_DATA);
  }
  /* drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.PACKAGE_DATA, event.previousIndex, event.currentIndex);
    console.log(event.container.data);
  } */

}
