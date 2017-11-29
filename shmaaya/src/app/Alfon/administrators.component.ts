import { Component } from '@angular/core';

@Component({
  selector: 'administrators',
  template: `
  <div dir="rtl">
  
  <input type="button" value="הוספת חדש" (click)="showDialog = !showDialog" >
  <input type="button" value="שליחת הודעה"/>
  <table>
      <th>עריכה</th>
      <th>מחיקה</th>
      <th>בחירה</th>
      <th>שם פרטי</th>
      <th>שם משפחה</th>
      <th>מספר זהות</th>
      <th>מין</th>
      <th>כתובת</th>
      <th>איזור</th>
      <th>טלפון נייד</th>
      <th>מייל</th>
      <th>סוג עובד</th> 
      </table>
      <app-dialog [(visible)]="showDialog"><privatedetails_a></privatedetails_a></app-dialog>
 </div>
  `,
  styles: []
})
export class AdministratorsComponent {

}