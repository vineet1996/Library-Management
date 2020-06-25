import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../@service';
import { LibraryService } from '../../@service/library.service';


@Component({
  selector: 'ngx-library',
  styleUrls: ['./library.component.scss'],
  templateUrl: './library.component.html',
})
export class LibraryComponent implements OnInit  {
  allBooks:any = [];
  isadmin: boolean = false;
  
  constructor(private authService: AuthenticationService, private libraryService: LibraryService, ) {
    if(this.authService.isAdmin) {
      this.isadmin = true;
    }
    
  }

  ngOnInit() {
    this.libraryService.getAllBooks().subscribe((data:any) => {
      this.allBooks = data;
    })
  }

  

}
