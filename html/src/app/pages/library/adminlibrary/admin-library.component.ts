import { Component, Input, OnInit } from '@angular/core';
import { AddBookComponent } from '../../addbookdialog/add-book.component';
import { LibraryService } from '../../../@service/library.service';
import { AlertDialogComponent } from '../../alertdialog/alert-dialog.component';
import {
  NbDialogService,
  NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrService,
  NbToastrConfig,
} from '@nebular/theme';

@Component({
  selector: 'ngx-admin-library',
  styleUrls: ['./admin-library.component.scss'],
  templateUrl: './admin-library.component.html',
})
export class AdminLibraryComponent implements OnInit {
  @Input()booksList;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_LEFT;
  config: NbToastrConfig;
  constructor(private dialogService: NbDialogService, private libraryService: LibraryService,private toastrService: NbToastrService) {
  }

  ngOnInit() {
    console.log(this.booksList);
  }

  addNewBook() {
    this.dialogService.open(AddBookComponent,{
      context: {
        type: 'New',
        data: ''
      },})
      .onClose.subscribe((data:any) => {
        if(data) {
          console.log(data);
          this.libraryService.createBook(data).subscribe((data: any) => {
            this.booksList = data;
            this.showToast('success', "New Book created", "Successfull!");
          })
        }
      });
  }

  updateBook(book) {
    this.dialogService.open(AddBookComponent,{
      context: {
        type: 'Update',
        data: book
      },})
      .onClose.subscribe((data:any) => {
        if(data) {
          this.libraryService.updateBook(data).subscribe((data: any) => {
            this.booksList = data;
            this.showToast('success', "Updated", "Successfull!");
          })
        }
      });
  }

  deleteBook(book) {
    this.dialogService.open(AlertDialogComponent,{
      context: {
        title: 'Are you Sure want to delete book "'+ book.name+ '" ?',
      },})
      .onClose.subscribe((data:any) => {
        if(data) {
          this.libraryService.deleteBook(book).subscribe((data: any) => {
            this.booksList = data;
            this.showToast('success', "Deleted", "Successfull!");
          })
        }
      });
  }

  showToast(type: NbComponentStatus, title: string, body: string) {
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
}
