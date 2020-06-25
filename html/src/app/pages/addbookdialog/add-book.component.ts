import { NbMenuService, NbDialogRef } from '@nebular/theme';
import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../../@service';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ngx-add-book',
  styleUrls: ['./add-book.component.scss'],
  templateUrl: './add-book.component.html',
})
export class AddBookComponent implements OnInit {
  bookForm: FormGroup
  @Input() type;
  @Input() data;
  constructor(protected ref: NbDialogRef<AddBookComponent>,private formBuilder: FormBuilder) {
    this.bookForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      author: ['', [Validators.required]],
      publish: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      takehome: [false]
    });
  }

  ngOnInit() {
    if(this.type == 'Update') {
      this.bookForm.setValue({
        name: this.data.name, 
        author: this.data.author,
        publish: this.data.publish,
        stock: this.data.stock,
        takehome: this.data.takehome,
        
      });
      this.bookForm.addControl('id', this.formBuilder.control(this.data._id));
    }
  }

  cancel() {
    this.ref.close();
  }

  addBook() {
    if(this.bookForm.valid) {
      this.ref.close(this.bookForm.value);
    }
  }

}
