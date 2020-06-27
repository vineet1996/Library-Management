import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router,CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
    httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json'
        })
    };
    public currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;
    public forgotPassword: BehaviorSubject<any> =new BehaviorSubject<any>(false);
    constructor(private http: HttpClient,private router: Router) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentNGOUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }

    public get isAdmin() {
        return this.currentUserValue.isadmin;
    }

    login(data) {
        return this.http.post(`/authentication/login`, data, this.httpOptions)
        .pipe(map((data:any) => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            if(data.success) {
                this.currentUserSubject.next(data.user);
                localStorage.setItem('currentNGOUser', JSON.stringify(data.user));
            }
            return data;
        }));
    }

    logout() {
        localStorage.removeItem('currentNGOUser');
        this.currentUserSubject.next(null);
    }

    getUserDets() {
        return this.http.post('/authentication/getUserDetails', this.currentUserValue, this.httpOptions);
    }

    userUpdateDetails(data) {
        return this.http.post('/authentication/updateUser', data, this.httpOptions);
    }

    userpasswordReset(data) {
        return this.http.post('/authentication/passwordReset', data, this.httpOptions);
    }

    reduceMemberShipDays() {
        this.http.post('/authentication/updateMembership', this.currentUserValue, this.httpOptions).subscribe((data:any) => {
            if(data && data.user) {
                console.log(data)
                let currentVal = this.currentUserValue;
                currentVal.membership = data.user.membershipdays;
                this.currentUserSubject.next(currentVal);
                localStorage.setItem('currentNGOUser', JSON.stringify(currentVal));
            }
        })
    }
}