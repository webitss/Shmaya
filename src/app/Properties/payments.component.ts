import { Component } from '@angular/core';

@Component({
  selector: 'payments',
  template: `
  <div dir="rtl">
  <input type="button" value="הוספת חדש">
  <table>
  <th>עריכה</th>
  <th>סוג שעה</th>
  <th>מחיר לשעה</th>
 </table>
 </div>

  `,
  styles: []
})
export class PaymentsComponent {

}