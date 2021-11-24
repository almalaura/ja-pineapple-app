import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/product';
import { ProductService } from './products.service';
import Swal from 'sweetalert2'

interface Categories {
  id: number,
  name: string
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormProductsComponent implements OnInit {

  formProduct: FormGroup;
  categories: Categories[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly fb: FormBuilder,
    public dialogRef: MatDialogRef<FormProductsComponent>,
    @Inject(MAT_DIALOG_DATA) public product: Product
  ) { }

  ngOnInit() {
    this.productService.getCategories().subscribe((res) =>{
      let c = JSON.stringify(res);
      this.categories = JSON.parse(c);
    })
    this.initForm();
    //Si contiene valores product plasmarlos en los input para editar
    if (this.product) {
      this.patchForm(this.product);
    }
  }
  //Inicializar los valores del formulario
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
