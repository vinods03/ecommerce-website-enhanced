import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  isLoginMode: boolean = true;
  error = '';
  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.isLoginMode) {
      // console.log(this.loginForm.value['email']);
      // console.log(this.loginForm.value['password']);
      this.authService
        .signIn(this.loginForm.value['email'], this.loginForm.value['password'])
        .subscribe(
          (data) => {
            alert('Signin Successful !!!');
            this.router.navigate(['/category/1']);
          },
          (errorData) => {
            console.log(errorData);
            console.log(errorData.error.error.message);
            switch (errorData.error.error.message) {
              case 'INVALID_PASSWORD':
                this.error = 'Invalid password';
                break;
              case 'INVALID_EMAIL':
                this.error = 'This email does not exist';
                break;
              case 'USER_DISABLED':
                this.error = 'This user is disabled';
                break;
              case 'INVALID_LOGIN_CREDENTIALS':
                this.error = 'Invalid login credentials';
                break;
              default:
                this.error = 'An Unknown error occurred';
                break;
            }
          }
        );
    } else {
      // console.log(this.loginForm.value['email']);
      // console.log(this.loginForm.value['password']);
      this.authService
        .signUp(this.loginForm.value['email'], this.loginForm.value['password'])
        .subscribe(
          (data) => {
            alert('Signup Successful !!!');
            this.router.navigate(['/category/1']);
          },
          (errorData) => {
            console.log(errorData);
            console.log(errorData.error.error.message);
            switch (errorData.error.error.message) {
              case 'EMAIL_EXISTS':
                this.error = 'This email exists already';
                break;
              case 'OPERATION_NOT_ALLOWED':
                this.error = 'Password sign-in is disabled';
                break;
              case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                this.error = 'Too many attempts, try again later';
                break;
              default:
                this.error = 'An Unknown error occurred';
                break;
            }
          }
        );
    }

    this.loginForm.reset();
  }
}
