import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import {Router} from "@angular/router";


@Component({
  selector: 'app-root',
  template: `
  <div>
 <container></container>
</div>
    
  `,
  styles: []
})
export class AppComponent implements OnInit{
  constructor(private router:Router){}
  ngOnInit()
  {
    // this.router.navigate(['login']);
  }
  
  
}
