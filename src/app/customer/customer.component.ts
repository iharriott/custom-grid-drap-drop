
import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../custom-table/table-column';
import { Customer } from './customer';
import { FooterColumns } from './footer-columns';
import { FooterRowServiceService } from '../services/footer-row-service.service';


const COLUMN_DATA: TableColumn[] = [
  { name: 'name', dataKey: 'string', position: 'left', isSortable: true, index: 0, hasTotalColumn: false },
  { name: 'address', dataKey: 'string', position: 'left', isSortable: true, index: 1,hasTotalColumn: false },
  { name: 'phone', dataKey: 'string', position: 'left', isSortable: true, index: 2,hasTotalColumn: false },
  { name: 'cost', dataKey: 'number', position: 'left', isSortable: true, index: 3 ,hasTotalColumn: true},
  { name: 'tax', dataKey: 'number', position: 'left', isSortable: true, index: 4 ,hasTotalColumn: true},
  { name: 'discount', dataKey: 'number', position: 'left', isSortable: true, index: 5 ,hasTotalColumn: true},
];

const CUSTOMER_DATA: Customer[] = [
  { name: 'John', address: '308 Pearson Crescent', phone: '780-678-3444', cost: 50,tax: 1.25, discount: 5 },
  { name: 'Mary', address: '11434 Twin Hills Ave', phone: '669-678-3222', cost: 100, tax: 2.50, discount: .05  },
  { name: 'Phillip', address: '44 River Lane', phone: '669-555-3222', cost: 300, tax: 4.25, discount: 20 },
];


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  public customersTableColumns = COLUMN_DATA;
  public customers = CUSTOMER_DATA;
  public footerColumnsInit = COLUMN_DATA.filter(x => x.hasTotalColumn).map(col => col.name);
  footerRow: any = {};
  footerColumns!: FooterColumns[]
  hasTotalColumns: boolean = true;
  constructor(private footerRowService: FooterRowServiceService) {}

  ngOnInit(): void {

    this.hasTotalColumns = this.footerRowService.getFooterColumns(this.customersTableColumns).length > 0;

    console.log('has footer row ' + this.hasTotalColumns);
    
    if (this.hasTotalColumns){
      this.footerRow = this.footerRowService.createFooterRow(this.customersTableColumns,this.customers);
      console.log('my footer row ' + this.footerRow);
    }
    
    /* const firstColumnName =this.customersTableColumns.filter(col => !col.hasTotalColumn ).sort((a,b) => a.index! - b.index!).map(x => x.name)[0];
    this.footerRow[firstColumnName] = 'Total'; */
    
    //obj[Object.keys(obj)[0]]
    /* console.log('all column' +  firstColumnName);
     //console.log('first column' +  Object.keys(CUSTOMER_DATA)[0]);
     this.footerColumnsInit.forEach(x => {
      console.log(`col = ${x} total = ${this.getTotal(CUSTOMER_DATA, x)}`)
      console.log('col =' + x );
     
      CUSTOMER_DATA.forEach((data: { [x: string]: any; })  => {
       let val = 0;
       val = val + data[x] as number;
       console.log('input ='+ data[x]);
       console.log('final value'+ val)
      })
    })  */

    //console.log('footer col ' + this.footerColumnsInit);

    //const data = CUSTOMER_DATA.filter(x => x['cost']);
   // data.forEach(x => console.log(x['cost']));
    //this.footerRow['cost'] = 50;
    //console.log('footer row ' + this.footerRow['cost']);
    //this.footerColumns = this. getFooterData();
    //this.footerColumns.push({fieldText: "total", totalAmount:0});

   /*  this.footerColumns.forEach(data =>{
      console.log( ` Footer obj= ${data.fieldText} ${data.totalAmount}` );

    }) */
    //console.log('Footer obj=' + footer)
    //console.log('Footer cos=' + this.footerColumnsInit)
    //this.getTotal();
    //this.footerRow = { name: 'Total', address: '', phone: '', cost: this.getTotal() };
    //this.footerRow['name'] = 'Total';
    //this.footerRow['address'] = '';
    //this.footerRow['phone'] = '';
    //this.footerRow['cost'] = this.getTotal();
    // this.customers = [...CUSTOMER_DATA, this.footerRow];
  }

  /* getTotal(data: unknown[], column: string): number {
    const total = data.reduce((acc: number , cost: any) => acc! + cost[column], 0);
    this.footerRow[column] = total;
    
    console.log(`${column} cost in gettotal ${total}`);
    return total!;
  } */

  /* getFooterData(): FooterColumns[]{

    return this.footerColumnsInit.map(col =>{
      return{
        fieldText: col,
        totalAmount:  this. getTotal(col)
      }
    });
  } */




}
