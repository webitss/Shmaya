import { Component } from '@angular/core';

@Component({
  selector: 'customers',
  template: `
  <div dir="rtl">
  
  <input type="button" value="הוספת חדש" (click)="showDialog2 = !showDialog2" >
    <table>
        <th>עריכה</th>
        <th>מחיקה</th>
        <th>בחירה</th>
        <th>שם פרטי</th>
        <th>שם משפחה</th>
        <th>ת.ז.</th>
        <th>כתובת</th>
        <th>טלפון נייד</th>
        <th>מייל</th>
        <th>סוג זכאות</th>
        <th>בנק שעות</th>
        <tr>
            <td><input type="button" (click)="showDialog = !showDialog"></td>
            <td><input type="button" (click)="showDialog_del = !showDialog_del"></td>
        </tr>
    </table>
    <app-dialog [(visible)]="showDialog2"><privatedetails></privatedetails></app-dialog>
    <app-dialog [(visible)]="showDialog">
    <a routerLink="privatedetails"  routerLinkActive="active">פרטים אישיים</a> |
    <a routerLink="refunds"  routerLinkActive="active">החזרים ללקוח</a> |
    <a routerLink="sendmessage"  routerLinkActive="active">שליחת הודעות</a> |
    <a routerLink="connections"  routerLinkActive="active">קשרים</a> |
    <a routerLink="documentation"  routerLinkActive="active">תיעוד שיחות</a> |
    <a routerLink="remarks"  routerLinkActive="active">הערות</a> |
    <router-outlet></router-outlet> 
    </app-dialog>
    <app-dialog [(visible)]="showDialog_del">
    <label>מחיקת לקוח</label><br>
    <label>האם להפוך לקוח זה ללא פעיל?</label><br>
    <input type="button" value="כן">
    <input type="button" value="לא">
    </app-dialog>
 </div>
  `,
  styles: []
})
export class CustomersComponent {

}