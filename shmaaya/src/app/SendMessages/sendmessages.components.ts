import { Component } from '@angular/core';

@Component({
  selector: 'sendmessages',
  template: `
  <div dir="rtl">
  <input type="button" value="שלח הודעה"/>
  <label>סוג הודעה</label>
  <form action="">
  <input type="radio" name="type" value="mail">מייל
  <input type="radio" name="type" value="sms">SMS<br>
</form>
<label>אל</label>
<form action="">
<input type="radio" name="type" value="mail">לקוחות
<input type="radio" name="type" value="mail">נותני שירות
<input type="radio" name="type" value="mail">כולם
</form>
<label>סה"כ נבחרו</label>
<label>נושא</label><input type="text"><br>
<label>תוכן</label>
<textarea rows="4" cols="50"></textarea>
<br><br>
<label>מייל לתוצאות</label>
<label>מאת</label><input type="text">
 </div>

  `,
  styles: []
})
export class SendmessagesComponent {

}