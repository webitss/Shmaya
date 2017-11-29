import { Component } from '@angular/core';

@Component({
  selector: 'properties',
  template: `

  <div class="sub-header-main">
  <div class="container">

  <ul class="nav nav-pills">
  <li routerLink="eligibility"  routerLinkActive="active">טבלת זכאות</li>
  <li routerLink="communication"  routerLinkActive="active">סל תקשורת</li>
  <li routerLink="payments"  routerLinkActive="active">תשלומים</li>
  <li routerLink="products"  routerLinkActive="active">מוצרים</li>
  <li routerLink="monthes"  routerLinkActive="active">חודשים</li>
</ul>
</div>
</div>

<div class="container">
  <router-outlet></router-outlet>
 </div>

  `,
  styles: []
})
export class PropertiesComponent {

}