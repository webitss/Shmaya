import { Component } from '@angular/core';

@Component({
  selector: 'privatedetails_a',
  template: `
  <div>
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
    <label>סוג עובד</label>
    <select>
      <option>עוסק פטור</option>
      <option>עוסק מורשה</option>
      <option>עובד</option>
    </select><br>
  </div>
  `,
  styles: []
})
export class PrivateDetailsAComponent {

}