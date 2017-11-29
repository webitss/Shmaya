import { Component } from '@angular/core';

@Component({
  selector: 'reports',
  template: `
  <div class="sub-header-main">
  <div class="container">

  <ul class="nav nav-pills">
  <li routerLink="serviceproviders_rep"  routerLinkActive="active">דוח נותני שירות</li>
  <li routerLink="reciveservice_rep"  routerLinkActive="active">דוח מקבלי שירות</li>
  <li routerLink="products_rep"  routerLinkActive="active">דוח מוצרים</li>
  </ul>
  
  </div>
 </div>

 <div class="container">
  <router-outlet></router-outlet>
 </div>

  `,
  styles: []
})
export class ReportsComponent {

}