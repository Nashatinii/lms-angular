import { Component } from '@angular/core';
import { UserService } from '../../services/User/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  SignUpForm: FormGroup;
  submit: boolean = false;
  mailExist: boolean = false;
  registered: boolean = false;
  validInput: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.SignUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', Validators.required],
    });
  }

  onInputFocus() {
    this.registered = false;
  }

  async onSubmit() {
    const { name, email, password, role } = this.SignUpForm.value;
    this.submit = true;
    if (this.SignUpForm.valid) {
      try {
        await this.userService.validateCredentialstoRegister({ name, email, password, role });
        this.registered = true;
        this.SignUpForm.reset();
        this.SignUpForm.get('role')?.setValue('');
        this.mailExist = false;
        this.submit = false;
      } catch (error) {
        this.mailExist = true;
        this.submit = false;
      }
    }
  }
}
