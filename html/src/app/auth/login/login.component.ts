import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../@service/authentication.service';
@Component({
    selector: 'ngx-login',
    styleUrls: ['./login.component.scss'],
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    returnUrl: string;
    constructor(
          private formBuilder: FormBuilder,
          private route: ActivatedRoute,
          private router: Router,
          private authService: AuthenticationService,
          private dialogService: NbDialogService) {
            this.loginForm = this.formBuilder.group({
                username: ['', [Validators.required]],
                password: ['', [Validators.required]]
            });
            if (this.authService.currentUserValue) {
                this.router.navigateByUrl('/pages');
            }
      }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        if(this.loginForm.valid) {
            this.authService.login(this.loginForm.value).subscribe((data:any) => {
                if(data.success) {
                    this.router.navigateByUrl(this.returnUrl);
                }
                else {
                    if(data.err == 'pwdwrg') {
                        this.loginForm.get('password').setErrors({"pwdwrg": true});
                    }
                    if(data.err == 'nouser') {
                        this.loginForm.get('username').setErrors({"nouser": true});
                    }
                }
            })
        }
        
    }

    
}