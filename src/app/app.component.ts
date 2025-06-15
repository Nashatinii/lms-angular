import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,  
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],  // Corrected to 'styleUrls'
  animations: [
    trigger('pageAnimations', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('1s ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AppComponent {

  // getAnimation(outlet: RouterOutlet) {
  //   return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  // }
}
