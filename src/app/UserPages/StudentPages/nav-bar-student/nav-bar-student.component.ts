import { Component } from '@angular/core';

import { UserService } from '../../../services/User/user.service';
import { AuthService } from '../../../auth.service';
@Component({
  selector: 'app-nav-bar-student',
  templateUrl: './nav-bar-student.component.html',
  styleUrl: './nav-bar-student.component.css'
})
export class NavBarStudentComponent {
 constructor(private userService: UserService, private authService:AuthService){}
  onClickLogOut():void{
    this.authService.logout();
    this.userService.logout();
  }
}
