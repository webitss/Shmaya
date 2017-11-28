import { Component } from '@angular/core';

@Component({
  selector: 'products',
  template: `
  <div dir="rtl">
  <input type="button" (click)="showDialog = !showDialog" value="הוספת חדש">
  <table>
  <th>עריכה</th>
  <th>סוג מוצר</th>
  <th>שם מוצר</th>
 </table>
 </div>
 <app-dialog [(visible)]="showDialog">
 <label>הוספת מוצר</label>
 <label>סוג מוצר</label><input type="text"><br>
 <label>שם מוצר</label><input type="text"><br>
 <input type="button" value="ביטול">
 <input type="button" value="שמירה">
</app-dialog>

  `,
  styles: []
})
export class ProductsComponent {

}