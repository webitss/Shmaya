import { Component } from '@angular/core';

@Component({
  selector: 'privatedetails',
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
  <label>האם עובד</label>
  <select>
    <option>כן</option>
    <option>לא</option>
  </select><br>
  <label>תאריך הצטרפות</label>
  <select>
    <option></option>
  </select><br>
  <label>תאריך תחילת זכאות</label>
  <select>
    <option></option>
  </select>
  <label>סוג זכאות</label>
  <select>
    <option></option>
  </select><br>
  <label>מס' שעות זכאות</label><input type="text"/>
  <label>בנק שעות</label><input type="text"/><br>
  <label>סל תקשורת</label>
  <select>
    <option></option>
  </select>
  <label>דמי תקשורת</label>
  <select>
    <option></option>
  </select><br>
  </div>
  `,
  styles: []
})
export class PrivateDetailsComponent {

}