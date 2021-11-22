import { Component, OnInit } from '@angular/core';
import {Product} from '../../models/product';
import {ProductService} from './products.service';
import {Router, ActivatedRoute} from '@angular/router'
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  providers: [ProductService, DecimalPipe],
})

export class FormProductsComponent implements OnInit {
  public  product: Product = {id: 0,
  name: '',
  description: '',
  category: '',
  quantity: 0,
  unitPrice: 0,};
  public title:string = "CREAR NUEVO PRODUCTO"
  isProductCreated = false;
  constructor(private productService: ProductService,
  private router: Router,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarProduct()
  }

  cargarProduct(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.productService.getProduct(id).subscribe( (product) => this.product = product)
      }
    })
  }

  create(): void {
    this.productService.create(this.product)
      .subscribe(product => {
        this.isProductCreated = true;
        this.router.navigate(['/clientes'])
        Swal.fire('Nuevo producto', `Producto creado con éxito!`, 'success')
      }
      );
  }

  update():void{
    this.productService.update(this.product)
    .subscribe( product => {
      this.router.navigate(['/clientes'])
      Swal.fire('Producto Actualizado', `Producto actualizado con éxito!`, 'success')
    }

    )
  }

  // Resetear los datos del objeto Product
  newProduct(): void {
    this.isProductCreated = false;
    this.product = {
      id: 0,
      name: '',
      description: '',
      category: '',
      quantity: 0,
      unitPrice: 0,
    };
  }
}
