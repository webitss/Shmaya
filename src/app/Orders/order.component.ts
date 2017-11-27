import { Component } from '@angular/core';

@Component({
  selector: 'order',
  template: `
 <div dir="rtl">
 <a routerLink="orderlist"  routerLinkActive="active">תצוגת רשימה</a> |
 <a routerLink="orderboard"  routerLinkActive="active">תצוגת לוח</a> <br>
 <router-outlet></router-outlet>
 <input type="button" (click)="showDialog = !showDialog" value="הזמנה חדשה"/>


 </div>

 <app-dialog [(visible)]="showDialog">
 <input type="button" (click)="showDialog = !showDialog" class="btn" value="שמור"/>
  <label>סוג הזמנה</label>
  <select>
    <option></option>
  </select>
  <label>תאריך</label><br>
  <label>שם לקוח</label>
  <select>
    <option></option>
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
  <label>זמן התחלה</label>
  <input type="text"/>
  <label>זמן תרגום</label>
  <input type="text"/><br>
  <label>זמן סיום</label>
  <label>זמן נסיעה</label>
  <input type="text"/><br>
  <label>זמן המתנה</label>
  <input type="text"/>
  <label>סוג תרגום</label>
  <input type="text"/><br>
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
 </app-dialog>
  `,
  styles: []
})
export class OrderComponent {
  showDialog:boolean=false; 

}