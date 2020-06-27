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

    // Creating new book by admin.
    public createBook(data) {
        return this.http.post('/book/createBook', data, this.httpOptions);
    }

    // Get all books for the library to all users.
    public getAllBooks() {
        return this.http.get('/book/getBooks');
    }

    // Update book by admin.
    public updateBook(data) {
        return this.http.post('/book/updateBook', data, this.httpOptions);
    }

    // Delete book by admin.
    public deleteBook(data) {
        return this.http.post('/book/deleteBook', data, this.httpOptions);
    }

    // Search books by string.
    public getSearchResults(string) {
        if(string) return this.http.get(`/book/searchResult/${string}`);
        return this.http.get('/book/getBooks');
    }
}