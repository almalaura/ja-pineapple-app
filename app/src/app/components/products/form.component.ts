import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})

export class FormProductsComponent implements OnInit {

  public title:string = "CREAR NUEVO PRODUCTO"

  constructor(){}

  ngOnInit() {
  }
}