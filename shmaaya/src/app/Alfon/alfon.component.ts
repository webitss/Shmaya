import { Component } from '@angular/core';

@Component({
  selector: 'alfon',
  template: `

  <div class="sub-header-main">
  <div class="container">

  <ul class="nav nav-pills">
  <li routerLink="customers"  routerLinkActive="active">לקוחות</li>
  <li routerLink="serviceprovider"  routerLinkActive="active">נותני שירות</li>
  <li routerLink="administrators"  routerLinkActive="active">מנהלים</li>
  </ul>
  </div>
  </div>

  <div class="container">
    <router-outlet></router-outlet>
  </div>
  
    <app-dialog [(visible)]="showDialog">
    <privatedetails></privatedetails>
    </app-dialog>
 
  `,
  styles: []
})
export class AlfonComponent {
  showDialog:boolean=false; 

}