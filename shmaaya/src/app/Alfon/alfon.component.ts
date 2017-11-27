import { Component } from '@angular/core';

@Component({
  selector: 'alfon',
  template: `
  <div dir="rtl">
  <a routerLink="customers"  routerLinkActive="active">לקוחות</a> |
  <a routerLink="serviceprovider"  routerLinkActive="active">נותני שירות</a> |
  <a routerLink="administrators"  routerLinkActive="active">מנהלים</a> |
    <input type="button" value="שליחת הודעה"/>
    <router-outlet></router-outlet>
    <app-dialog [(visible)]="showDialog">
    <privatedetails></privatedetails>
    </app-dialog>
 </div>
  `,
  styles: []
})
export class AlfonComponent {
  showDialog:boolean=false; 

}