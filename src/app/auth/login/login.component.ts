import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public formdata = { username: '', password: '' };
  submit = false;
  errorMessage = { username: '', password: '' };
  loginMessageError = '';
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.canAuthenticate();
  }

  onSubmit() {
    if (!this.validateFields()) {
      return;
    }
    this.auth
      .login(this.formdata.username, this.formdata.password)
      .subscribe({
        next: (data) => {
          this.auth.storeToken(data.token);
          console.log('logged user token is ' + data.token);
          this.auth.canAuthenticate();
        },
        error: (error) => {
          console.log(error);
          this.loginMessageError = error;
        },
      })
      .add(() => {
        console.log('Completed!');
      });
  }
  validateFields(): boolean {
    if (!this.formdata.username || !this.formdata.password) {
      if (!this.formdata.username) {
        this.errorMessage.username = 'Input Name is not empty.';
      } else {
        this.errorMessage.username = '';
      }
      if (!this.formdata.password) {
        this.errorMessage.password = 'Input Password is not emapty';
      } else {
        this.errorMessage.username = '';
      }
      return false;
    }
    return true;
  }
}
