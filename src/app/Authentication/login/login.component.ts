import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/User/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  LoginForm: FormGroup;
  logged: boolean = false;
  notExist: boolean = false;
  accountDeactivated: boolean = false;
  submit: boolean = false;

  constructor(private fb: FormBuilder, 
    private userService: UserService, 
    private authService: AuthService,
    private location: Location, 
    private router: Router) {

    this.LoginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    const { email, password } = this.LoginForm.value;
    this.submit = true;

    if (this.LoginForm.valid) {
      try {
        const result = await this.userService.login(email, password);
      
        if (result == 'Admin') {
          this.authService.login('Admin');
          this.location.replaceState('/requests'); 
          // this.router.navigate(['/requests']);
          this.router.navigate(['/requests']).then(() => {
            window.location.reload();
          });
        } 
        
        else if (result == 'student') {
          // console.log('Student');
          this.authService.login('student');
          this.location.replaceState('/studentMyCourse'); 
          this.router.navigate(['/studentMyCourse']);
          // this.router.navigate(['/studetntMyCourse']).then(() => {
          //   window.location.reload();
          // });
        } 
        
        
        else if (result == 'instructor') {
          this.authService.login('instructor');
          this.location.replaceState('/insHome'); 
          // this.router.navigate(['/insHome']);
          this.router.navigate(['/insHome']).then(() => {
            window.location.reload();
          });
        }

        this.logged = true;
        this.notExist = false;
        this.accountDeactivated = false;
        this.LoginForm.reset();
      } catch (error) {
        this.handleError(error);
      }
    }
  }

  private handleError(error: unknown): void {
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    } else if (typeof error === 'object' && error !== null && 'code' in error) {
      const firebaseError = error as { code: string; message: string };
      if (firebaseError.code === 'auth/user-not-found') {
        this.notExist = true;
      } else if (firebaseError.code === 'auth/user-disabled') {
        this.accountDeactivated = true;
      } else {
        console.error('Firebase error:', firebaseError.message);
      }
    } else {
      console.error('Unknown error:', error);
    }
  }
}
