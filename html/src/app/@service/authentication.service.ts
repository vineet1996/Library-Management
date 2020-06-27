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
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentLIBUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }

    public get isAdmin() {
        return this.currentUserValue.isadmin;
    }

    // Service for user or admin login.
    login(data) {
        return this.http.post(`/authentication/login`, data, this.httpOptions)
        .pipe(map((data:any) => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            if(data.success) {
                this.currentUserSubject.next(data.user);
                localStorage.setItem('currentLIBUser', JSON.stringify(data.user));
            }
            return data;
        }));
    }

    // Service for user or admin logout.
    logout() {
        localStorage.removeItem('currentLIBUser');
        this.currentUserSubject.next(null);
    }

    // Service to get user details.
    getUserDets() {
        return this.http.post('/authentication/getUserDetails', this.currentUserValue, this.httpOptions);
    }

    // Service to update user details.
    userUpdateDetails(data) {
        return this.http.post('/authentication/updateUser', data, this.httpOptions);
    }

    // Service to update user password.
    userpasswordReset(data) {
        return this.http.post('/authentication/passwordReset', data, this.httpOptions);
    }

    // Service to update user membership days.
    reduceMemberShipDays() {
        this.http.post('/authentication/updateMembership', this.currentUserValue, this.httpOptions).subscribe((data:any) => {
            if(data && data.user) {
                let currentVal = this.currentUserValue;
                currentVal.membership = data.user.membershipdays;
                this.currentUserSubject.next(currentVal);
                localStorage.setItem('currentLIBUser', JSON.stringify(currentVal));
            }
        })
    }
}