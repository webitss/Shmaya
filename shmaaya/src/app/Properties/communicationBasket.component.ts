import { Component } from '@angular/core';

@Component({
  selector: 'communication',
  template: `
  <div dir="rtl">
  <input type="button" (click)="showDialog = !showDialog" value="הוספת חדש">
  <table>
  <th>עריכה</th>
  <th>סוג זכאות</th>
  <th>תעריף</th>
 </table>
 </div>
 <app-dialog [(visible)]="showDialog">
 <label>הוספת ערך</label>
 <label>סוג זכאות</label><input type="text"><br>
 <label>תעריף</label><input type="text"><br>
 <input type="button" value="ביטול">
 <input type="button" value="שמירה">
</app-dialog>
  `,
  styles: []
})
export class CommunicationComponent {

}