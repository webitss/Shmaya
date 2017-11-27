import { Component } from '@angular/core';

@Component({
  selector: 'properties',
  template: `
  <div dir="rtl">
  <a routerLink="eligibility"  routerLinkActive="active">טבלת זכאות</a>|
  <a routerLink="communication"  routerLinkActive="active">סל תקשורת</a>|
  <a routerLink="payments"  routerLinkActive="active">תשלומים</a>|
  <a routerLink="products"  routerLinkActive="active">מוצרים</a>|
  <a routerLink="monthes"  routerLinkActive="active">חודשים</a>|
  <router-outlet></router-outlet>
 </div>

  `,
  styles: []
})
export class PropertiesComponent {

}