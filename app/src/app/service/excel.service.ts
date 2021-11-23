import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})

export class ExcelService {

  constructor(
    protected http: HttpClient,
  ) {}

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    //TODO: To export products create a function with this content
    /*
    onDownloadExcel(): void {
      const data = this.dataSource.data.map(reg => ({
        "Nombre": reg.name,
        "Descripción": reg.description,
        "Categoría": reg.category,
        "Cantidad": reg.quantity,
        "Precio unitario": reg.unitPrice,
      }));
      this.excelService.exportAsExcelFile(data, 'Productos')
    }
    */

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
