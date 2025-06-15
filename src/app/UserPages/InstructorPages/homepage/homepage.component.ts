import { Component } from '@angular/core';
import { UserService } from '../../../services/User/user.service';
@Component({
  selector: 'app-homepage',
  standalone: false,
  
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  userName: string | null = null;
  constructor(private userService: UserService){}
  // ngOnInit(): void {
  //   this.loadUserName();
  // }

  async ngOnInit(): Promise<void> {
    try {
      const storedUserName = localStorage.getItem('userName');
      this.userName = storedUserName;
      // this.userName = await this.userService.getUserName();
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  }
  // async ngOnInit() {
  //   try{
  //     this.userName = await this.userService.getUserName();
  //     if(this.userName  == 'Guest')
  //       this.userName = 'Instructor';
  //   }
  //   catch(error){
  //     console.error(error);
  //   }
  //   console.log(this.userName);
    
  // }

}
