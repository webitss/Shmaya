import { Component } from '@angular/core';

@Component({
  selector: 'refunds',
  template: `
  <div dir="rtl">
  <input type="button" (click)="showDialog = !showDialog" value="הוספה"/>
  <label>|סך החזר</label>
  <label>|סך יתרה</label>
  <label>תאריך התחדשות</label><br>
  <table>
  <th>עריכה</th>
  <th>אסמכתא</th>
  <th>סוג מוצר</th>
  <th>שם מוצר</th>
  <th>תאריך רכישה</th>
  <th>סכום לתשלום</th>
  <th>סך החזר</th>
  <th>תאריך הזנה</th>
  <th>שיוך לחודש</th>
  <th>הוזן ע"י</th>
  </table>
 </div>
 <app-dialog [(visible)]="showDialog">
 <label>הוספת רכישה</label><br>
    <label>שם מוצר</label>
    <select>
        <option></option>
    </select><br>
    <label>תאריך רכישה</label>
    <select>
      <option></option>
    </select><br>
    <label>שיוך לחודש</label>
    <select>
      <option></option>
    </select><br>
    <label>סכום לתשלום</label><input type="text"><br>
    <input type="button" value="העלה אסמכתא\ מחק אסמכתא"><br>
    <input type="button" value="ביטול">
    <input type="button"  value="שמירה">

 <app-dialog>
  `,
  styles: []
})
export class RefundsComponent {

}