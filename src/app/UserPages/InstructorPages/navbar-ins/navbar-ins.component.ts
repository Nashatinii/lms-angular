import { Component } from '@angular/core';
import { UserService } from '../../../services/User/user.service';
import { AuthService } from '../../../auth.service';
@Component({
  selector: 'app-navbar-ins',
  standalone: false,
  templateUrl: './navbar-ins.component.html',
  styleUrl: './navbar-ins.component.css'
})
export class NavbarInsComponent {

  constructor(private userService: UserService, private authService:AuthService){}
  onClickLogOut():void{
    this.authService.logout();
    this.userService.logout();
  }
}
