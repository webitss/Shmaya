import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'login',
  template: `
  <div dir="rtl">
  <label>שם משתמש</label>
  <input type="text" placeholder="שם משתמש">
  <label>סיסמא</label>
  <input type="text" placeholder="סיסמא">
  <input type="button" value="כניסה" (click)="enter()">
  <a href="#">שכחתי סיסמא</a>
 
 </div>
  `,
  styles: []
})
export class LoginComponent {
    constructor(private router:Router){}
    enter(){this.router.navigate(['container']);}
    

}