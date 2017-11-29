import { Component } from '@angular/core';
import { appService } from '../app.service';

@Component({
  selector: 'order',
  template: `
  <div class="sub-header-main">
  <div class="container">
    <ul class="nav nav-pills">
       <li routerLink="orderlist"  routerLinkActive="active" (click)="service.isShowBtnNewOrder=true">תצוגת רשימה</li> 
       <li routerLink="orderboard"  routerLinkActive="active" (click)="service.isShowBtnNewOrder=true">תצוגת לוח</li>
    </ul>
 </div>
 </div>


 <div class="container">
 <router-outlet></router-outlet>
 </div>

 
 <input type="button" (click)="showDialog = !showDialog" *ngIf="service.isShowBtnNewOrder==true" value="הזמנה חדשה"/>


 <app-dialog [(visible)]="showDialog">
 <form [formGroup]="service.frmNewOrder" (ngSubmit)="this.service.saveOrder('hi')" >
    <label>הזמנה חדשה</label>
    <input type="submit" (click)="showDialog = !showDialog" [disabled]="!service.frmNewOrder.valid" value="שמירה"/>
    <label>סוג הזמנה</label>
    <select>
      <option>תרגום</option>
      <option>תמלול</option>
      <option>שעתוק</option>
    </select>
    <label>תאריך</label><br>
    <label>שם לקוח</label>
    <select formControlName="custName">
      <option>aaaa</option>
      <option>bbbb</option>
      <option>cccc</option>
    </select>
    <label>שם מתורגמן</label>
    <select>
      <option></option>
    </select><br>
    <label>שיוך לחודש</label>
    <select>
      <option></option>
    </select>
    <label>שיוך לשנה</label>
    <select>
      <option></option>
    </select><br>
    <label>זמן התחלה</label><input type="text"/>
    <label>זמן תרגום</label><input type="text"/><br>
    <label>זמן סיום</label>
    <label>זמן נסיעה</label><input type="text"/><br>
    <label>זמן המתנה</label><input type="text"/>
    <label>סוג תרגום</label><input type="text"/><br>
    <label>איזור</label>
    <select>
      <option></option>
    </select>
    <label>עיר</label>
    <select>
      <option></option>
    </select><br>
    <label>משתמש מזין</label>
    <label>תאריך הזנה</label>
  </form>
  </app-dialog>
  `,
  styles: []
})
export class OrderComponent { 
  constructor(public service:appService){
  }
  
}