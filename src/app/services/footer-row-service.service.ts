import { Injectable } from '@angular/core';
import { FooterColumns } from '../customer/footer-columns';

@Injectable({
  providedIn: 'root'
})
export class FooterRowServiceService {

  constructor() { }

  getFirstColumn(columnData: any[]): string{
    const firstColumnName = columnData.filter((col: { hasTotalColumn: boolean; }) => !col.hasTotalColumn ).sort((a: { index: number; },b: { index: number; }) => a.index! - b.index!).map((x: { name: string; }) => x.name)[0];
    return firstColumnName;
  }

  createFooterRow(columnData: any[], tableData: any[]): unknown{ 
    const footerRow: any  = {};
    const firstColumn = this.getFirstColumn(columnData);
    footerRow[firstColumn] = 'Total';
    //const footerColumns: any[] = columnData.filter((x: { hasTotalColumn: boolean; }) => x.hasTotalColumn).map((col: { name: string; }) => col.name);
    const footerColumns = this.getFooterColumns(columnData);
    footerColumns.forEach(col =>{
      footerRow[col] = this.getTotal(tableData, col);
    })

    return footerRow;
  }

  getTotal(data: unknown[], column: string): unknown {
    const total = data.reduce((acc: number , cost: any) => acc! + cost[column], 0);
    
    //footerRow[column] = total;
    
    console.log(`${column} cost in gettotal ${total}`);
    return total;
  }

  getFooterColumns(columnData: any[]): string[]{
   const footerColumns = columnData.filter((x: { hasTotalColumn: boolean; }) => x.hasTotalColumn).map((col: { name: string; }) => col.name);
   return footerColumns;
  }
}
