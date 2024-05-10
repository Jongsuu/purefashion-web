import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { dtoUserLogin } from '../../interfaces/user.interface';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { dtoActionResponse } from '../../interfaces/response.interface';
import { fadeIn } from '../animations';

const passwordStrengthTrigger = trigger("passwordStrength", [
  state("-1", style({
    width: "0%",
    "background-color": "rgb(239, 68, 68)"
  })),
  state("0", style({
    width: "0%",
    "background-color": "rgb(239, 68, 68)"
  })),
  state("1", style({
    width: "25%",
    "background-color": "rgb(239, 68, 68)"
  })),
  state("2", style({
    width: "50%",
    "background-color": "rgb(249, 115, 22)"
  })),
  state("3", style({
    width: "75%",
    "background-color": "rgb(34, 197, 94)"
  })),
  state("4", style({
    width: "100%",
    "background-color": "rgb(21, 128, 61)"
  })),
  transition("* <=> *", animate("300ms"))
]);


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [fadeIn, passwordStrengthTrigger]
})
export class LoginComponent {
  private fb = inject(FormBuilder);

  showPassword = false;
  submitting = false;

  emailStatus: -1 | 0 | 1 | 2 = -1;
  passwordStatus: -1 | 0 | 1 | 2 | 3 | 4 = -1;

  form = this.fb.nonNullable.group({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)])
  });

  constructor(private toast: ToastService, private auth: AuthService, private router: Router) { }

  onSubmit(): void {
    this.submitting = true;
    if (this.form.controls.email.valid) {
      if (this.form.controls.password.valid) {
        const formData = this.form.getRawValue();
        const userLogin: dtoUserLogin = {
          email: formData.email ?? "",
          password: formData.password ?? ""
        };
        this.loginUser(userLogin);
      }
      else {
        this.toast.warningToast("You must enter a valid password")
        setTimeout(() => {
          this.submitting = false;
        }, 500);
      }
    }
    else {
      this.toast.warningToast("You must enter a valid email")
      setTimeout(() => {
        this.submitting = false;
      }, 500);
    }
  }

  changePasswordVisibility(passwordInput: HTMLInputElement): void {
    this.showPassword = !this.showPassword;
    passwordInput.type = this.showPassword ? "text" : "password";
  }

  checkEmail(emailInput: HTMLInputElement): void {
    let email = emailInput.value.length;

    if (email === 0) {
      this.emailStatus = 0;
      return;
    }

    this.form.controls.email.updateValueAndValidity();
    if (this.form.controls.email.valid) {
      this.emailStatus = 2;
    }
    else {
      this.emailStatus = 1;
    }
  }

  checkPassword(passwordInput: HTMLInputElement): void {
    let password = passwordInput.value.length;

    if (password < 8)
      this.passwordStatus = 0;
    else
      this.passwordStatus = 1;
  }

  continueAsGuest(): void {
    this.auth.continueAsGuest();
    this.router.navigateByUrl("/");
  }

  private handleLoginError(error: HttpErrorResponse) {
    try {
      const response = error.error as dtoActionResponse<string>;
      this.submitting = false;

      if (response && response.message)
        this.toast.errorToast(response.message);

      return throwError(() => new Error(response.message));
    }
    catch (ex) {
      return throwError(() => ex);
    }
  }

  private loginUser(userLogin: dtoUserLogin): void {
    this.auth.login(userLogin).pipe(catchError(this.handleLoginError.bind(this))).subscribe(response => {
      this.submitting = false;
      this.toast.successToast(`Welcome back ${response.data!.username}!`);
      this.auth.setUser(response.data);

      let navigateTo = this.router.lastSuccessfulNavigation?.previousNavigation?.extractedUrl.toString();
      this.router.navigateByUrl(navigateTo ?? "/");
    });
  }
}
