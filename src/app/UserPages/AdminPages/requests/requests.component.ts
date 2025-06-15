import { Component } from '@angular/core';
import { UserService } from '../../../services/User/user.service';
import { WaitUser, AppUser } from '../../../model/user.model';

@Component({
  selector: 'app-requests',
  standalone: false,
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent {

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

  async onClickApprove(user: WaitUser): Promise<void> {
    const newUser: AppUser = { ...user, activated: true };
    try{
      await this.userService.addUser(newUser);
      await this.userService.removeFromWaitList(user.email);

    }
    catch(error){
      console.error(error);
    }
    this.refreshLists();
  }

  onClickReject(email: string): void {
    this.userService.removeFromWaitList(email);
    this.refreshLists();
  }

}
