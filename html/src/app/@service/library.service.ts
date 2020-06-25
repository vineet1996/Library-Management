import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
    httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json'
        })
    };
    
    constructor(private http: HttpClient,) {
    }

    public createBook(data) {
        return this.http.post('/book/createBook', data, this.httpOptions);
    }

    public getAllBooks() {
        return this.http.get('/book/getBooks');
    }

    public updateBook(data) {
        return this.http.post('/book/updateBook', data, this.httpOptions);
    }

    public deleteBook(data) {
        return this.http.post('/book/deleteBook', data, this.httpOptions);
    }
}