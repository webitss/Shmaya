import { Component } from '@angular/core';

@Component({
  selector: 'products',
  template: `
  <div dir="rtl">
  <input type="button" value="הוספת חדש">
  <table>
  <th>עריכה</th>
  <th>סוג מוצר</th>
  <th>שם מוצר</th>
 </table>
 </div>

  `,
  styles: []
})
export class ProductsComponent {

}