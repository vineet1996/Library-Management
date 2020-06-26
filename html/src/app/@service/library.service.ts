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

    // creating new book by admin.
    public createBook(data) {
        return this.http.post('/book/createBook', data, this.httpOptions);
    }

    // get all books for the library to all users.
    public getAllBooks() {
        return this.http.get('/book/getBooks');
    }

    // update book by admin.
    public updateBook(data) {
        return this.http.post('/book/updateBook', data, this.httpOptions);
    }

    // delete book by admin.
    public deleteBook(data) {
        return this.http.post('/book/deleteBook', data, this.httpOptions);
    }
}