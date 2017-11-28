import { Component } from '@angular/core';

@Component({
  selector: 'eligibility',
  template: `
  <div dir="rtl">
  <input type="button" value="הוספת חדש" (click)="showDialog = !showDialog">
  <table>
  <th>עריכה</th>
  <th>סוג זכאות</th>
  <th>מס' שעות זכאות</th>
 </table>
 </div>
 <app-dialog [(visible)]="showDialog">
  <label>הוספת ערך</label>
  <label>סוג זכאות</label><input type="text"><br>
  <label>מספר שעות</label><input type="text"><br>
  <input type="button" value="ביטול">
  <input type="button" value="שמירה">
 </app-dialog>
  `,
  styles: []
})
export class EligibilityComponent {

}