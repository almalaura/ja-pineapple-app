import {Injectable, PipeTransform} from '@angular/core';
import {BehaviorSubject, Observable, of,throwError, Subject} from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Product } from '../../models/product';
import { environment } from '../../../environments/environment.prod';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  //variables para la url de información para conectar con la api
  private urlEndPoint: string = '/products';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService) {
      this.httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authService.createBasicAuthToken()
      })
  }
  //Obtener todas las categorias de producto
  getCategories(){
    return this.http.get(`${environment.hostUrl}/categories`)
  }
  //Obtener todos los datos de productos
  getProducts(): Observable<Product[]> {
    let res = this.http.get<Product[]>(environment.hostUrl+this.urlEndPoint)
    console.log(res)
    return res
  }
  //crear un producto nuevo
  create(product: Product) : Observable<Product> {
    return this.http.post<Product>(environment.hostUrl+this.urlEndPoint, product, {headers: this.httpHeaders}).pipe(
      catchError(this.handleError)
    );
  }
  //Obtener los datos de un solo producto según su id
  getProduct(id: string): Observable<Product>{
    return this.http.get<Product>(`${environment.hostUrl+this.urlEndPoint}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  //Actualizar los datos de un producto
  update(product: Product): Observable<Product>{
    return this.http.put<Product>(`${environment.hostUrl+this.urlEndPoint}/${product.id}`, product, {headers: this.httpHeaders}).pipe(
      catchError(this.handleError)
    );
  }
  //Eliminar un producto
  delete(id: number): Observable<Product>{
    return this.http.delete<Product>(`${environment.hostUrl+this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(this.handleError)
    );
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Un error ha ocurrido:', error.error.message);
    } else {
      console.error(
        `Backend returnó ${error.status}, ` +
        `mensaje error: ${error.error}`);
    }
    return throwError(
      'Algo ocurrió, por favor intenta más tarde.');
  };

}
