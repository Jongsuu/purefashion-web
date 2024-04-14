import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dtoUser, dtoUserLogin, dtoUserRegister } from '../../interfaces/user.interface';
import { dtoActionResponse } from '../../interfaces/response.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private env = "http://localhost:5277";

  // undefined -> Not logged in
  // null -> Logged out
  // has value -> Logged in
  public user$ = new BehaviorSubject<dtoUser | null | undefined>(undefined);

  constructor(private http: HttpClient) {
    let user = sessionStorage.getItem("session");

    if (user)
      this.user$.next(JSON.parse(user));
  }

  public register(userRegister: dtoUserRegister) {
    return this.http.post<dtoActionResponse<dtoUser>>(this.env + "/register", userRegister);
  }

  public login(userLogin: dtoUserLogin) {
    return this.http.post<dtoActionResponse<dtoUser>>(this.env + "/login", userLogin);
  }

  public logout(): void {
    this.user$.next(null);
    sessionStorage.removeItem("session");
  }

  public setUser(user: dtoUser): void {
    this.user$.next(user);
    sessionStorage.setItem("session", JSON.stringify(user));
  }
}
