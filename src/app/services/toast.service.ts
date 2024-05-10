import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const TOAST_STATE = {
  success: "toast-success",
  warning: "toast-warning",
  error: "toast-error",
  info: "toast-info"
};

export const TOAST_DURATION = 4000;

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  showsToast$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public toastMessage$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public toastState$: BehaviorSubject<string> = new BehaviorSubject<string>(TOAST_STATE.success);

  private timer: any;

  private showToast(toastState: string, toastMsg: string, duration = TOAST_DURATION): void {
    if (this.timer) {
      this.dismissToast();
      setTimeout(() => {
        this.showsToast$.next(true);
        this.toastState$.next(toastState);
        this.toastMessage$.next(toastMsg);

        this.timer = setTimeout(() => {
          this.dismissToast();
        }, duration);
      }, 500);
    }
    else {
      this.showsToast$.next(true);
      this.toastState$.next(toastState);
      this.toastMessage$.next(toastMsg);

      this.timer = setTimeout(() => {
        this.dismissToast();
      }, duration);
    }
  }

  dismissToast(): void {
    this.showsToast$.next(false);
    clearTimeout(this.timer);
    this.timer = null;
  }

  warningToast(toastMsg: string): void {
    this.showToast(TOAST_STATE.warning, toastMsg);
  }

  successToast(toastMsg: string): void {
    this.showToast(TOAST_STATE.success, toastMsg);
  }

  errorToast(toastMsg: string): void {
    this.showToast(TOAST_STATE.error, toastMsg);
  }

  infoToast(toastMsg: string): void {
    this.showToast(TOAST_STATE.info, toastMsg);
  }
}
