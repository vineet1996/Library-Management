import { Component } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created with ♥ by <b>VG</b> {{year}}
    </span>
    
  `,
})
export class FooterComponent {
  year = moment().format("YYYY")
}
// <div class="socials">
//       <a href="#" target="_blank" class="ion ion-social-github"></a>
//       <a href="#" target="_blank" class="ion ion-social-facebook"></a>
//       <a href="#" target="_blank" class="ion ion-social-twitter"></a>
//       <a href="#" target="_blank" class="ion ion-social-linkedin"></a>
//     </div>