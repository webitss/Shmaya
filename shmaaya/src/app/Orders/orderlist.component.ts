import { Component } from '@angular/core';
import { appService } from '../app.service';

@Component({
  selector: 'orderlist',
  template: `

  <table>
  <tr>
    <th>עריכה</th>
    <th>ביטול</th>
    <th>סטטוס</th>
    <th>מספר הזמנה</th>
    <th>שם לקוח</th>
    <th>שם מתורגמן</th>
    <th>סוג הזמנה</th>
    <th>סוג תרגום</th>
    <th>איזור</th>
    <th>כתובת</th>
    <th>תאריך תרגום</th>
    <th>שיוך לחודש</th>
    <th>זמן תרגום</th>
    <th>שעת התחלה</th>
    <th>משתמש מזין</th>
  </tr>
  <tr>
  <td></td>
  <td></td>
  <td><input type="text"></td>
  <td><input type="text"></td>
  <td><input type="text" (input)="service.search($event)"></td>
  <td><input type="text"></td>   
</tr>
  <tr *ngFor="let item of service.custsFilter let i = index">
    <td></td>
    <td><input type="button" (click)="showDialog = !showDialog;service.delete(false,i)"></td>
    <td></td>
    <td></td>
    <td>{{item}}</td>
  </tr>
 </table>
 <label>סה"כ שעות<\label>

 <app-dialog [(visible)]="showDialog">
 <label>ביטול הזמנה</label><br>
 <label>האם לבטל הזמנה זו?</label><br>
 <input type="button" (click)="showDialog = !showDialog;service.delete(true)"  value="כן"/>
 <input type="button" (click)="showDialog = !showDialog" class="btn" value="לא"/>
 
 <app-dialog>
  `,
  styles: []
})
export class OrderlistComponent {
    constructor(public service: appService) {
    }
    
}
