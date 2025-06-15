import { Component } from '@angular/core';
import { UserService } from '../../../services/User/user.service';
import { WaitUser, AppUser } from '../../../model/user.model';

@Component({
  selector: 'app-manage-users',
  standalone : false,
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
})
export class ManageUsersComponent {
  waitUsers: WaitUser[] = [];
  currentUsers: AppUser[] = [];

  constructor(private userService: UserService) {
    this.refreshLists();
  }

  async refreshLists(): Promise<void> {
    try{
      this.waitUsers =await this.userService.getUsersWaitList();
      this.currentUsers =await this.userService.getUsersList();
    }catch(error){
      console.error(error);
    }
  }
  
  onClickActivation(email: string , status : boolean): void {
    this.userService.userActivation(email,status);
    this.refreshLists();
  }

  onClickDelete(email: string): void {
    this.userService.deleteUser(email);
    this.refreshLists();
  }
}
