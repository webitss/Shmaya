import { Component } from '@angular/core';

@Component({
  selector: 'container',
  template: `

  
  <div class="header-main">
  <div class="container">
  <div class="logo-img"><img src="../assets/pictures/logo.png"/></div>
  <ul class="nav nav-pills">
      <li routerLink="/order"  routerLinkActive="active">הזמנות</li>
      <li routerLink="/alfon"  routerLinkActive="active">אלפון</li>
      <li routerLink="/sendmessages"  routerLinkActive="active">שליחת הודעות</li>
      <li routerLink="/properties"  routerLinkActive="active">הגדרות</li>
      <li routerLink="/reports"  routerLinkActive="active">דוחות</li>
  </ul>
  </div>
  </div>
 
    <div >
       <router-outlet></router-outlet> 
    </div>


    
  `,
  styles: []
})
export class ContainerComponent {
  title = 'app';
}