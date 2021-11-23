import { Component, Inject, OnInit } from '@angular/core';
import {Product} from '../../models/product';
import {ProductService} from './products.service';
import {Router, ActivatedRoute} from '@angular/router'
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
interface Categories {
  id: number,
  name: string
}
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormProductsComponent implements OnInit {

  formProduct: FormGroup
  categories: Categories[] = []
  constructor(private productService: ProductService,
  private router: Router,
  private activatedRoute: ActivatedRoute,
  private fb: FormBuilder,
  public dialogRef: MatDialogRef<FormProductsComponent>,
  @Inject(MAT_DIALOG_DATA) public product: Product) { }

  ngOnInit() {
    const rescategories = this.productService.getCategories().subscribe((res) =>{
      let c = JSON.stringify(res)
      this.categories = JSON.parse(c)
    })
    this.initForm();
    //Si contiene valores product plasmarlos en los input para editar
    if (this.product) {
      this.patchForm(this.product)
    }
  }
  //Crear un nuevo producto
  create(): Product | null {
    if(this.formProduct.valid) {
      const finalProduct = {
        ...this.formProduct.value
      }
      this.productService.create(finalProduct).subscribe((res) =>{
        Swal.fire('Nuevo producto', `Producto creado con éxito!`, 'success')
        this.router.navigate(['/products'])
        return finalProduct
      },(error) => {
        console.log(error)
        Swal.fire('Vuelve a intentarlo', `Ocurrio un error`, 'error')

      })
      this.onNoClick()
    }
    return null
  }

  //Actualiza los datos de un producto
  update(): void {
    if (this.formProduct.valid) {
      const finalProduct = {
        ...this.formProduct.value
      }
      this.productService.update(finalProduct).subscribe((res) =>{
        Swal.fire('Producto actualizado', `Producto actualizado con éxito!`, 'success')
        this.router.navigate(['/products'])
      },(error) => {
        console.log(error)
        Swal.fire('Vuelve a intentarlo', `Ocurrio un error`, 'error')
      })
      this.onNoClick()
      }
    }

    initForm(): void {
      this.formProduct = this.fb.group({
        id: [],
        name: ['', Validators.compose([
            Validators.required,
        ])],
        category: ['', Validators.required],
        unitPrice: ['', Validators.required,],
        quantity: ['', Validators.required,],
        description: ['', Validators.compose([
            Validators.required,
        ])],
      });
    }

    patchForm(registro: Product): void {
      this.formProduct.patchValue({
        ...registro,
      });
    }

    onNoClick(): void {
      this.dialogRef.close();
    }
}
