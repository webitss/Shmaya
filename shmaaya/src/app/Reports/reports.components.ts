import { Component } from '@angular/core';

@Component({
  selector: 'reports',
  template: `
  <div dir="rtl">
  <a routerLink="serviceproviders_rep"  routerLinkActive="active">דוח נותני שירות</a>|
  <a routerLink="reciveservice_rep"  routerLinkActive="active">דוח מקבלי שירות</a>|
  <a routerLink="products_rep"  routerLinkActive="active">דוח מוצרים</a>|
  <router-outlet></router-outlet>
 </div>

  `,
  styles: []
})
export class ReportsComponent {

}