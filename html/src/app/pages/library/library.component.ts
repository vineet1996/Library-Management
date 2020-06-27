import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../@service';
import { LibraryService } from '../../@service/library.service';
import { IssueService } from '../../@service/issue.service';


@Component({
  selector: 'ngx-library',
  styleUrls: ['./library.component.scss'],
  templateUrl: './library.component.html',
})
export class LibraryComponent implements OnInit  {
  allBooks:any = [];
  isadmin: boolean = false;
  
  constructor(private authService: AuthenticationService, private libraryService: LibraryService, private issueService: IssueService ) {
    if(this.authService.isAdmin) {
      this.isadmin = true;
    }
    
  }

  ngOnInit() {
    this.getLibrary();
    
    this.issueService.updateAllUsers().subscribe(data => {
      this.getLibrary();
    })
  }

  // Function to get all books.
  getLibrary() {
    this.libraryService.getAllBooks().subscribe((data:any) => {
      this.allBooks = data;
    })
  }

  

}
