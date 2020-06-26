import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';
import {
    NbDialogService,
    NbComponentStatus,
    NbGlobalPhysicalPosition,
    NbGlobalPosition,
    NbToastrService,
    NbToastrConfig,
} from '@nebular/theme';

@Injectable({
    providedIn: 'root'
})
export class IssueService {
    socket;
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
    position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
    config: NbToastrConfig;
    public adminIssueList: BehaviorSubject<any>;
    public userIssueList: BehaviorSubject<any>;
    constructor(private authService: AuthenticationService,
        private toastrService: NbToastrService,
        private http: HttpClient) {
        if (authService.isAdmin) { 
            this.adminIssueList = new BehaviorSubject<any>('');
            this.getAdminRequestList();
        }
        else {
            this.userIssueList = new BehaviorSubject<any>('');
            this.getUserRequestList(authService.currentUserValue);
        }
    }

    public get currentAdminIssueList() {
        return this.adminIssueList.value;
    }

    public get currentUserIssueList() {
        return this.userIssueList.value;
    }

    // showing up toast 
    public showToast(type: NbComponentStatus, title: string, body: string) {
        const config = {
            status: type,
            destroyByClick: true,
            duration: 3000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
        };

        this.toastrService.show(
            body,
            title,
            config);
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// Socket Calls /////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////

    // socket connection call
    setupSocketConnection() {
        let currentUser = this.authService.currentUserValue;
        this.socket = io.connect(environment.SOCKET_ENDPOINT, {
            query: { token: currentUser.token }
        });
    }

    // each user joining to socket room for real time communication b/w user and admin
    joinRoom(roomData) {
        this.socket.emit('join-room', roomData);
    }

    // new request of book issue to admin
    requestIssue(data) {
        this.socket.emit('request-issue', data);
    }

    // socket emit by user for deleting request book issue
    deleteRequest(issue) {
        this.socket.emit('delete-issue', issue);
    }

    // socket emit by admin when approving book issue request 
    approvalByAdmin(data) {
        this.socket.emit('approval-issue', data);
    }

    // socket emit by user sending request to admin for returning book.
    userReturnBook(issue) {
        this.socket.emit('return-req-book', issue);
        // return this.http.post('/issue/userReturnBook', issue, this.httpOptions);
    }

    // socket open for admin getting updated request lists
    updatedReqList() {
        return Observable.create(observer => {
            this.socket.on('updated-req-list', data => {
                observer.next(data);
            });
        });
    }

    // socket open for user getting updated request lists
    userUpdatedReqList() {
        return Observable.create(observer => {
            this.socket.on('user-updated-req-list', data => {
                observer.next(data);
            });
        });
    }

    

    // socket listen to user after approval by admin
    approvalReceiveUser() {
        return Observable.create(observer => {
            this.socket.on('approval-to-user', data => {
                observer.next(data);
            });
        });
    }

    // update to all users library data
    updateAllUsers() {
        return Observable.create(observer => {
            this.socket.on('all-user-update-library', data => {
                observer.next(data);
            });
        });
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// Https Calls /////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////

    // Admin call getting all pending request from all users
    getAdminRequestList() {
        this.http.get('/issue/getPendingRequest').subscribe((data: any) => {
            this.adminIssueList.next(data);
            for (let item of data) {
                this.showToast('primary', item.book.name, "New Request");
            }
        })
    }

    // user call getting all his/her pending request 
    getUserRequestList(user) {
        this.http.post('/issue/getUserPendingRequest', user, this.httpOptions).subscribe((data: any) => {
            this.userIssueList.next(data);
        })
    }

    // getting users history issued list
    getUserDataList(data) {
        return this.http.post('/issue/getUserDataIssue', data, this.httpOptions);
    }

    // user deleting history data
    deleteOldIssuedBook(issue) {
        return this.http.post('/issue/deleteOldIssuedBook', issue, this.httpOptions);
    }

    // all users history data to admin.
    getAdminAllOldData() {
        return this.http.get('/issue/adminAllOldData');
    }

}