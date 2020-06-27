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

    // All users request list for admin.
    public get currentAdminIssueList() {
        return this.adminIssueList.value;
    }

    // Specific user request list.
    public get currentUserIssueList() {
        return this.userIssueList.value;
    }

    // Showing up toastr notification
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

    // Socket connection call
    setupSocketConnection() {
        let currentUser = this.authService.currentUserValue;
        this.socket = io.connect('http://3.18.103.230:80', {
            query: { token: currentUser.token }
        });
    }

    // Each user joining to socket room for real time communication b/w user and admin.
    joinRoom(roomData) {
        this.socket.emit('join-room', roomData);
    }

    // New request of book issue to admin.
    requestIssue(data) {
        this.socket.emit('request-issue', data);
    }

    // Socket event emit by user for deleting request book issue.
    deleteRequest(issue) {
        this.socket.emit('delete-issue', issue);
    }

    // Socket event emit by admin when approving book issue request.
    approvalByAdmin(data) {
        this.socket.emit('approval-issue', data);
    }

    // Socket event emit by user sending request to admin for returning book.
    userReturnBook(issue) {
        this.socket.emit('return-req-book', issue);
    }

    // Socket event listen for admin getting updated request lists.
    updatedReqList() {
        return Observable.create(observer => {
            this.socket.on('updated-req-list', data => {
                observer.next(data);
            });
        });
    }

    // Socket event listen for user getting updated request lists.
    userUpdatedReqList() {
        return Observable.create(observer => {
            this.socket.on('user-updated-req-list', data => {
                observer.next(data);
            });
        });
    }

    

    // Socket event listen to user after approval by admin.
    approvalReceiveUser() {
        return Observable.create(observer => {
            this.socket.on('approval-to-user', data => {
                observer.next(data);
            });
        });
    }

    // Socket event listen to update to all users library data.
    updateAllUsers() {
        return Observable.create(observer => {
            this.socket.on('all-user-update-library', data => {
                observer.next(data);
            });
        });
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// Http Calls /////////////////////////////////////////////
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

    // User call getting all his/her pending request.
    getUserRequestList(user) {
        this.http.post('/issue/getUserPendingRequest', user, this.httpOptions).subscribe((data: any) => {
            this.userIssueList.next(data);
        })
    }

    // Getting users history issued list.
    getUserDataList(data) {
        return this.http.post('/issue/getUserDataIssue', data, this.httpOptions);
    }

    // User deleting history data.
    deleteOldIssuedBook(issue) {
        return this.http.post('/issue/deleteOldIssuedBook', issue, this.httpOptions);
    }

    // All users history data to admin.
    getAdminAllOldData() {
        return this.http.get('/issue/adminAllOldData');
    }

}