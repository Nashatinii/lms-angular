import { Component } from '@angular/core';
import { UserService } from '../../../services/User/user.service';
import { AuthService } from '../../../auth.service';
@Component({
  selector: 'app-navbar',
  standalone: false,
  
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private userService: UserService, private authService:AuthService){}
  onClickLogOut():void{
    this.authService.logout();
    this.userService.logout();
    // window.location.reload(); 
  }
}
