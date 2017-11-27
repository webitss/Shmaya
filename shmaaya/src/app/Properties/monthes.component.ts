import { Component } from '@angular/core';

@Component({
  selector: 'monthes',
  template: `
  <div dir="rtl">
  <input type="button" value="שמירה"><br>
 <label>בחר חודש</label>
 <select>
    <option>ינואר</option>
    <option>פברואר</option>
    <option>מרץ</option>
    <option>אפריל</option>
    <option>מאי</option>
 </select><br>
 <label>מתאריך</label><input type="text"><br>
 <label>עד תאריך</label><input type="text">
 </div>

  `,
  styles: []
})
export class monthesComponent {

}