import { Component } from '@angular/core';

@Component({
  selector: 'container',
  template: `
<<<<<<< HEAD
  <div class="container">
  <ul class="nav nav-pills">
      <li routerLink="/order"  routerLinkActive="active">הזמנות</li>
      <li routerLink="/alfon"  routerLinkActive="active">אלפון</li>
      <li routerLink="/sendmessages"  routerLinkActive="active">שליחת הודעות</li>
      <li routerLink="/properties"  routerLinkActive="active">הגדרות</li>
      <li routerLink="/reports"  routerLinkActive="active">דוחות</li>
  </ul>
=======
  <div dir="rtl">
  <nav>
      <a routerLink="/order"  routerLinkActive="active" >הזמנות</a> |
      <a routerLink="/alfon"  routerLinkActive="active">אלפון</a> |
      <a routerLink="/sendmessages"  routerLinkActive="active">שליחת הודעות</a> |
      <a routerLink="/properties"  routerLinkActive="active">הגדרות</a> |
      <a routerLink="/reports"  routerLinkActive="active">דוחות</a> |
  
  </nav>
>>>>>>> 9eac479607d8c8a7fb7cc80e276e70e9a48175fe
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