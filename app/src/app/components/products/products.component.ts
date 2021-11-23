import { Component, OnInit, ViewChild } from '@angular/core';
import { faTrashAlt, faPen, faFileExcel, faPlus} from '@fortawesome/free-solid-svg-icons';
import {Observable} from 'rxjs';
import {Product} from '../../models/product';
import {ProductService} from './products.service';
import Swal from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FormProductsComponent } from './form.component';
import { FormGroup } from '@angular/forms';
import { ExcelService } from 'src/app/service/excel.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  faPen = faPen;
  faPlus = faPlus;
  faTrashAlt = faTrashAlt;
  faFileExcel = faFileExcel;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id','name', 'category', 'description', 'quantity', 'unitPrice', 'actions'];

  products$: Observable<Product[]> = this.service.getProducts().pipe(
    tap((data) => {
      this.dataSource = new MatTableDataSource(data);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    })
  );
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public service: ProductService,
    public excelService: ExcelService,
    public dialog: MatDialog){
  }

  ngOnInit(): void {
  }

  applyFilter(event: any): void {
    const filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filter;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

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
  createDialog() {
    const dialogRef = this.dialog.open(FormProductsComponent, {
      width: '40%',
      data: null,
    });

    dialogRef.afterClosed().subscribe( (result: FormGroup) => {
      if (result?.valid) {
        const finalProduct = {
          ...result.value,
        }
        this.service.create(finalProduct).subscribe(
          (reg) => {
            const data = this.dataSource.data;
            data.push(reg);
            this.dataSource.data = data;
          }
        )
      }
    });
  }

  editDialog(product: Product) {
    const dialogRef = this.dialog.open(FormProductsComponent, {
      width: '40%',
      data: product,
    });

    dialogRef.afterClosed().subscribe((result: FormGroup) => {
      if (result?.valid) {
        const finalProduct = {
          ...result.value,
        }
        this.service.update(finalProduct).subscribe(
          (reg) => {
            const indexTable = this.dataSource.data.indexOf(product);
            if (indexTable !== -1) {
              const list = this.dataSource.data
              list[indexTable] = reg;
              this.dataSource.data = list
            }
          }
        )
      }
    });
  }

  delete(product: Product): void {
    if(product.id) {
      Swal.fire({
        title: '¿Seguro que deseas eliminarlo?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.service.delete(product.id).subscribe(
            () => {
              this.dataSource.data = this.dataSource.data.filter( item => item.id != product.id)
              Swal.fire('El producto se eliminó!', '', 'success').then(()=>{
                window.location.reload()
              })
            }
          )
        }
      })

    }
  }

}
