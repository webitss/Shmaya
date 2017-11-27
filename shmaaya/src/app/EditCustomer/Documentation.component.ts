import { Component } from '@angular/core';
import { appService } from '../app.service';

@Component({
  selector: 'documentation',
  template: `
  <div dir="rtl">
  <input type="button" (click)="showDialog = !showDialog" value="שיחה חדשה"/>
 </div>
 <app-dialog [(visible)]="showDialog">
 <form [formGroup]="service.frmNewCon" (ngSubmit)="service.login(service.frmNewCon)">
    <label>שיחה חדשה</label><br>
    <label>נושא</label><input type="text" formControlName="con_subject">
    <label>תוכן</label>
    <textarea rows="4" cols="50" formControlName="con_content"></textarea><br>
    <input type="button" value="ביטול">
    <input type="submit" value="שמירה" [disabled]="!service.frmNewCon.valid">
 </form>
 <app-dialog>

  `,
  styles: []
})
export class DocumentationComponent {
    constructor(public service:appService){}

}