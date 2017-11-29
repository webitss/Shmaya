import { Component } from '@angular/core';
import { appService } from '../app.service';

@Component({
  selector: 'privatedetails_ps',
  template: `
  <div>
  <form [formGroup]="service.frmDetPS"> 
    <input type="submit" value="שמירה">
    <label>שם פרטי</label><input type="text"/>
    <label>שם משפחה</label><input type="text"/><br>
    <label>ת.ז.</label><input type="text"/>
    <label>תאריך לידה</label><input type="text"/><br>
    <label>מגדר</label><input type="text"/>
    <label>מייל</label><input type="text"/><br>
    <label>כתובת</label><input type="text"/>
    <label>טלפון</label><input type="text"/><br>
    <label>נייד</label><input type="text"/>
    <label>פקס</label><input type="text"/><br>
    <label>סיסמא</label><input type="text"/>
    <label>סוג שירות</label>
    <select>
      <option>מתורגמן</option>
      <option>מתמלל</option>
      <option>משעתק</option>
    </select><br>
    <label>איזור</label>
    <select>
      <option></option>
      </select>
      <label>שעות עבודה</label><input type="text"/>
    <label>שפות תרגום</label>
    <select>
      <option>עברית</option>
      <option>אנגלית</option>
      <option>ערבית</option>
      <option>רוסית</option>
    </select><br>
  </form>
  </div>
  `,
  styles: []
})
export class PrivateDetailsPSComponent {
constructor(public service:appService){}
}