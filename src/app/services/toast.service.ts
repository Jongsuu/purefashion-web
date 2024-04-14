import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const TOAST_STATE = {
  success: "toast-success",
  warning: "toast-warning",
  error: "toast-error",
  info: "toast-info"
};

export const TOAST_DURATION = 2000;

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor() { }

  showsToast$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public toastMessage$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public toastState$: BehaviorSubject<string> = new BehaviorSubject<string>(TOAST_STATE.success);

  private timer: any;

  private showToast(toastState: string, toastMsg: string): void {
    this.showsToast$.next(true);
    this.toastState$.next(toastState);
    this.toastMessage$.next(toastMsg);
    if (this.timer)
      clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.dismissToast();
    }, TOAST_DURATION);
  }

  dismissToast(): void {
    this.showsToast$.next(false);
    clearTimeout(this.timer);
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
