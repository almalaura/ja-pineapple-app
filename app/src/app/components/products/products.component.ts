import { Component, OnInit } from '@angular/core';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  faSortUp = faSortUp;

  constructor() { }

  ngOnInit(): void {
  }

}
