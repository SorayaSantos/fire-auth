import { User } from './../user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    'email': ['', [Validators.required, Validators.email]],
    'password': ['', [Validators.required, Validators.minLength(6)]]
  });

  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService,
    private snackbar: MatSnackBar, private router: Router) { }


  ngOnInit(): void {
  }

  private loginOkNotification(u: User) {
    this.snackbar.open(
      'Logged in successfully. Welcome ' + u.firstname + '!', 'OK', { duration: 2000 }
    );
  }

  private loginErrorNotification(err) {
    this.snackbar.open(
      err, 'OK', { duration: 2000 }
    );
  }

  onSubmit() {
    this.loading = true;
    let email = this.loginForm.value.email;
    let password = this.loginForm.value.password;

    this.authService.login(email, password).subscribe(
      (u) => {
        this.loginOkNotification(u);
        this.router.navigateByUrl('/');
        this.loading = false;
      },
      (err) => {
        this.loginErrorNotification(err);
        this.loading = false;
      }
    )
  }

  // loginGoogle() {
  //   this.loading = true;
  //   this.authService.loginGoogle().subscribe(
  //     (u) => {
  //       this.loginOkNotification(u);
  //       this.router.navigateByUrl('/');
  //       this.loading = false;
  //     },
  //     (err) => {
  //       this.loginErrorNotification(err);
  //       this.loading = false;
  //     }
  //   )
  // }

}
