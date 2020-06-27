import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../../../@service';
import { Router } from '@angular/router';
import { IssueService } from '../../../@service/issue.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [ ];
  public badgeVal:any = '';
  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private authService: AuthenticationService,
              private layoutService: LayoutService,
              private issueService: IssueService, 
              private router: Router,
              private breakpointService: NbMediaBreakpointsService) {
                if(!this.authService.isAdmin) this.userMenu.push({ title: 'Profile' });
                this.userMenu.push({ title: 'Log out' } );
                if(authService.isAdmin) this.adminFuntCall();
                else this.userFuntCall();
                
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    const current: any = this.authService.currentUserValue;
    this.user = current;

    this.menuService.onItemClick().subscribe(( event ) => {
      switch(event.item.title) {
        case 'Profile': this.router.navigateByUrl('pages/profile')
                        break;
        case 'Log out': this.logout();
                        break;
      }           
    });

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }

  moveToIssue() {
    this.router.navigateByUrl('/pages/issue');
  }

  adminFuntCall() {
    this.issueService.adminIssueList.subscribe((data:any) => {
      if(data && data.length > 0) {
        this.badgeVal = data.length;
      }
      else this.badgeVal = '';
    })
  }

  userFuntCall() {
    this.issueService.userIssueList.subscribe((data:any) => {
      if(data && data.length > 0) {
        this.badgeVal = data.length;
      }
      else this.badgeVal = '';
    })
  }
}
