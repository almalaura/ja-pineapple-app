import { Component, OnInit } from '@angular/core';
import { faTrashAlt, faPen, faFileExcel, faPlus} from '@fortawesome/free-solid-svg-icons';
import {DecimalPipe} from '@angular/common';
import { QueryList, ViewChildren} from '@angular/core';
import {Observable} from 'rxjs';

import {Product} from '../../models/product';
import {ProductService} from './products.service';
import {NgbdSortableHeader, SortEvent} from '../../directives/sortable.directive';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  providers: [ProductService, DecimalPipe],
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  faPen = faPen;
  faPlus = faPlus;
  faTrashAlt = faTrashAlt;
  faFileExcel = faFileExcel;
  productos: Product[] = [];
  products$: Observable<Product[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: ProductService) {
    this.products$ = service.products$;
    this.total$ = service.total$;
    this.headers = new QueryList();
  }

  ngOnInit(): void {
    /*this.service.getProducts().subscribe(
      products => this.productos = products
    );*/
  }
  delete(product: Product): void {
    console.log("eliminar");
    /*SweetAlert2Module({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al product ${product.nombre} ${product.apellido}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.productService.delete(product.id).subscribe(
          response => {
            this.products = this.products.filter(prod  => prod  !== product)
            swal(
              'Producto Eliminado!',
              `Producto ${product.nombre} eliminado con éxito.`,
              'success'
            )
          }
        )

      }
    })*/
  }

  onSort({column, direction}: SortEvent) {
      // resetting other headers
      this.headers.forEach(header => {
        if (header.sortable !== column) {
          header.direction = '';
        }
      });

      this.service.sortColumn = column;
      this.service.sortDirection = direction;
    }
}
