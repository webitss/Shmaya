import { Component } from '@angular/core';

@Component({
  selector: 'container',
  template: `
  <div class="container">
  <ul class="nav nav-pills">
      <li routerLink="/order"  routerLinkActive="active">הזמנות</li>
      <li routerLink="/alfon"  routerLinkActive="active">אלפון</li>
      <li routerLink="/sendmessages"  routerLinkActive="active">שליחת הודעות</li>
      <li routerLink="/properties"  routerLinkActive="active">הגדרות</li>
      <li routerLink="/reports"  routerLinkActive="active">דוחות</li>
  </ul>
    <div >
       <router-outlet></router-outlet> 
    </div>
</div>
    
  `,
  styles: []
})
export class ContainerComponent {
  title = 'app';
}