import { Component } from '@angular/core';

@Component({
  selector: 'payments',
  template: `
  <div dir="rtl">
  <input type="button" (click)="showDialog = !showDialog" value="הוספת חדש">
  <table>
  <th>עריכה</th>
  <th>סוג שעה</th>
  <th>מחיר לשעה</th>
 </table>
 </div>
 <app-dialog [(visible)]="showDialog">
 <label>הוספת ערך</label>
 <label>סוג שעה</label><input type="text"><br>
 <label>מחיר לשעה</label><input type="text"><br>
 <input type="button" value="ביטול">
 <input type="button" value="שמירה">
</app-dialog>

  `,
  styles: []
})
export class PaymentsComponent {

}