import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public isDarkTheme$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  public changeTheme(isDark: boolean): void {
    this.isDarkTheme$.next(isDark);
    sessionStorage.setItem("theme", isDark ? "dark" : "light");
  }
}
