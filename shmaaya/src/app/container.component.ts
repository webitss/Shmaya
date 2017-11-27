import { Component } from '@angular/core';

@Component({
  selector: 'container',
  template: `
  <div dir="rtl">
  <nav>
      <a routerLink="/order"  routerLinkActive="active">הזמנות</a> |
      <a routerLink="/alfon"  routerLinkActive="active">אלפון</a> |
      <a routerLink="/sendmessages"  routerLinkActive="active">שליחת הודעות</a> |
      <a routerLink="/properties"  routerLinkActive="active">הגדרות</a> |
      <a routerLink="/reports"  routerLinkActive="active">דוחות</a> |
  
  </nav>
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