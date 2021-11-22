import {Injectable, PipeTransform} from '@angular/core';

import {BehaviorSubject, Observable, of,throwError, Subject} from 'rxjs';

import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {SortColumn, SortDirection} from '../../directives/sortable.directive';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Product } from '../../models/product';
import { PRODUCTOS } from './productos';
import { environment } from '../../../environments/environment';

interface SearchResult {
  products: Product[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(products: Product[], column: SortColumn, direction: string): Product[] {
  if (direction === '' || column === '') {
    return products;
  } else {
    return [...products].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(Product: Product, term: string, pipe: PipeTransform) {
  return Product.name.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(Product.quantity).includes(term)
    || pipe.transform(Product.unitPrice).includes(term);
}

@Injectable({providedIn: 'root'})
export class ProductService {
  //variables para la url e información para conectar con la api
  private urlEndPoint: string = '/product';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _products$ = new BehaviorSubject<Product[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private http: HttpClient,private pipe: DecimalPipe) {
    this._search$.pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      ).subscribe(result => {
        this._products$.next(result.products);
        this._total$.next(result.total);
      });

      this._search$.next();
    }
  //Obtener todos los datos de productos
  getProducts(): Observable<Product[]> {
    return this.http.get(environment.hostUrl+this.urlEndPoint).pipe(
      map(response => response as Product[]),
      catchError(this.handleError)
    );
  }

  create(product: Product) : Observable<Product> {
    return this.http.post<Product>(environment.hostUrl+this.urlEndPoint, product, {headers: this.httpHeaders}).pipe(
      catchError(this.handleError)
    );
  }

  getProduct(id: string): Observable<Product>{
    return this.http.get<Product>(`${environment.hostUrl+this.urlEndPoint}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  update(product: Product): Observable<Product>{
    return this.http.put<Product>(`${environment.hostUrl+this.urlEndPoint}/${product.id}`, product, {headers: this.httpHeaders}).pipe(
      catchError(this.handleError)
    );
  }

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

  get products$() { return this._products$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let products = sort(PRODUCTOS, sortColumn, sortDirection);

    // 2. filter
    products = products.filter(Product => matches(Product, searchTerm, this.pipe));
    const total = products.length;

    // 3. paginate
    products = products.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({products, total});
  }

}
