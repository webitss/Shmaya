import { Component } from '@angular/core';

@Component({
  selector: 'serviceprovider',
  template: `
  <div dir="rtl">
  
  <input type="button" value="הוספת חדש" (click)="showDialog2 = !showDialog2" >
    <table>
        <th>עריכה</th>
        <th>מחיקה</th>
        <th>בחירה</th>
        <th>שם פרטי</th>
        <th>שם משפחה</th>
        <th>מספר זהות</th>
        <th>כתובת</th>
        <th>איזור</th>
        <th>טלפון נייד</th>
        <th>מייל</th>
        <th>שעות עבודה</th>
    </table>
    <tr>
    <td><input type="button" (click)="showDialog = !showDialog"></td>
</tr>
<app-dialog [(visible)]="showDialog2"><privatedetails_ps></privatedetails_ps></app-dialog>
<app-dialog [(visible)]="showDialog">
<a routerLink="privatedetails_ps"  routerLinkActive="active">פרטים אישיים</a> |
<a routerLink="sendmessage_ps"  routerLinkActive="active">שליחת הודעות</a> |
<a routerLink="connections_ps"  routerLinkActive="active">קשרים</a> |
<a routerLink="documentation_ps"  routerLinkActive="active">תיעוד שיחות</a> |
<a routerLink="remarks_ps"  routerLinkActive="active">הערות</a> |
<router-outlet></router-outlet> 
</app-dialog>
 </div>
  `,
  styles: []
})
export class ServiceproviderComponent {

}