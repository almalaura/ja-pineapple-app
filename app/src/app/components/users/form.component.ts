import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})

export class FormComponent implements OnInit {

  public title:string = "CREAR NUEVO USUARIO"

  constructor(){}

  ngOnInit() {
  }
}
