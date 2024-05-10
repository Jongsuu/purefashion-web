import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { dtoUserRegister } from '../../interfaces/user.interface';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { dtoActionResponse } from '../../interfaces/response.interface';
import { fadeIn } from '../animations';

const hideStep = trigger("hideStep", [
  state("open", style({
    transform: "translateX(125%)",
    opacity: 0
  })),
  state("close", style({
    transform: "translateX(0)",
    opacity: 1
  })),
  transition("close => open", animate("200ms ease-in-out"))
]);

const nextStep = trigger("nextStep", [
  state("open", style({
    transform: "translateX(125%)"
  })),
  state("close", style({
    transform: "translateX(0)"
  })),
  transition("close => open", animate("300ms"))
]);

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
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  animations: [fadeIn, hideStep, nextStep, passwordStrengthTrigger]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);

  showPassword = false;
  showConfirmPassword = false;
  submitting = false;

  nameStatus: -1 | 0 | 1 = -1;
  emailStatus: -1 | 0 | 1 | 2 = -1;
  passwordStatus: -1 | 0 | 1 | 2 | 3 | 4 = -1;
  confirmPasswordStatus: 0 | 1 | 2 = 0;

  form = this.fb.nonNullable.group({
    name: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl({ value: "", disabled: true }, [Validators.required, Validators.minLength(8)])
  });

  constructor(private toast: ToastService, private auth: AuthService, private router: Router) { }

  onSubmit(): void {
    this.submitting = true;
    if (this.form.controls.name.valid) {
      if (this.form.controls.email.valid) {
        if (this.form.controls.password.valid) {
          if (this.form.controls.password.value === this.form.controls.confirmPassword.value) {
            const formData = this.form.getRawValue();
            const userRegister: dtoUserRegister = {
              username: formData.name ?? "",
              email: formData.email ?? "",
              password: formData.password ?? ""
            };
            this.registerUser(userRegister);
          }
          else {
            this.toast.warningToast("Passwords must match!")
            setTimeout(() => {
              this.submitting = false;
            }, 500);
          }
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
    else {
      this.toast.warningToast("You must enter your name")
      setTimeout(() => {
        this.submitting = false;
      }, 500);
    }
  }

  changePasswordVisibility(passwordInput: HTMLInputElement, isPassword: boolean): void {
    if (isPassword) {
      this.showPassword = !this.showPassword;
      passwordInput.type = this.showPassword ? "text" : "password";
    }
    else {
      this.showConfirmPassword = !this.showConfirmPassword;
      passwordInput.type = this.showConfirmPassword ? "text" : "password";
    }
  }

  checkName(nameInput: HTMLInputElement): void {
    let name = nameInput.value.length;

    if (name <= 2)
      this.nameStatus = 0;
    else
      this.nameStatus = 1;
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

  checkPassword(passwordInput: HTMLInputElement, confirmPasswordInput: HTMLInputElement): void {
    let password = passwordInput.value.length;

    if (password < 3) {
      this.passwordStatus = 0;
      this.form.controls.confirmPassword.disable();
      confirmPasswordInput.value = "";
    }
    else if (password <= 4) {
      this.passwordStatus = 1;
      this.form.controls.confirmPassword.disable();
      confirmPasswordInput.value = "";
    }
    else if (password < 8) {
      this.passwordStatus = 2;
      this.form.controls.confirmPassword.disable();
      confirmPasswordInput.value = "";
    }
    else if (password >= 8 && password < 12) {
      this.passwordStatus = 3;
      this.form.controls.confirmPassword.enable();
    }
    else if (password >= 12) {
      this.passwordStatus = 4;
      this.form.controls.confirmPassword.enable();
    }
  }

  checkConfirmPassword(passwordInput: HTMLInputElement, confirmPasswordInput: HTMLInputElement): void {
    if (this.passwordStatus < 3)
      return;

    let password = passwordInput.value;
    let confirmPassword = confirmPasswordInput.value;

    if (password.length < 8) {
      this.confirmPasswordStatus = 0;
      return;
    }

    if (password !== confirmPassword)
      this.confirmPasswordStatus = 1;
    else
      this.confirmPasswordStatus = 2;
  }

  continueAsGuest(): void {
    this.auth.continueAsGuest();
    this.router.navigateByUrl("/");
  }

  private handleRegisterError(error: HttpErrorResponse) {
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

  private registerUser(userRegister: dtoUserRegister): void {
    this.auth.register(userRegister).pipe(catchError(this.handleRegisterError.bind(this))).subscribe(response => {
      this.submitting = false;
      this.toast.successToast(`Congrats ${response.data!.username}! You are now part of PureFashion!`);
      this.auth.setUser(response.data);

      let navigateTo = this.router.lastSuccessfulNavigation?.previousNavigation?.extractedUrl.toString();
      this.router.navigateByUrl(navigateTo ?? "/");
    });
  }
}
