import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
// import { CartService } from './cart.service';

// interface AuthResponseData {
//   kind: string;
//   idToken: string;
//   email: string;
//   refreshToken: string;
//   expiresIn: string;
//   localId: string;
//   registered?: boolean;
// }

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private httpClient: HttpClient,
    private router: Router // private cartService: CartService
  ) {}

  user = new BehaviorSubject<User | null | undefined>(null);

  private tokenExpirationTimer: any;

  private signupUrl =
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAOtDwqEoD8xpcTHK-eWU9ERr2LfOliuN4';
  private signinUrl =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAOtDwqEoD8xpcTHK-eWU9ERr2LfOliuN4';

  signUp(email: string, password: string) {
    return this.httpClient
      .post<AuthResponseData>(this.signupUrl, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        tap((resData) => {
          console.log('The response is: ', resData);
          const expirationDate = new Date(
            new Date().getTime() + +resData['expiresIn'] * 1000
          );
          const user = new User(
            resData['email'],
            resData['localId'],
            resData['idToken'],
            expirationDate
          );
          this.user.next(user);
          this.autoLogout(+resData['expiresIn'] * 1000);
          console.log(JSON.stringify(user));
          localStorage.setItem('userData', JSON.stringify(user));
        })
      );
  }

  signIn(email: string, password: string) {
    return this.httpClient
      .post<AuthResponseData>(this.signinUrl, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        tap((resData) => {
          console.log('The response is: ', resData);
          const expirationDate = new Date(
            new Date().getTime() + +resData['expiresIn'] * 1000
          );
          const user = new User(
            resData['email'],
            resData['localId'],
            resData['idToken'],
            expirationDate
          );
          this.user.next(user);

          this.autoLogout(+resData['expiresIn'] * 1000);
          console.log(JSON.stringify(user));
          localStorage.setItem('userData', JSON.stringify(user));
        })
      );
  }

  signOut() {
    this.user.next(null);
    // for auto-logout, this will clear the timer
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    // for manual-logout, this will clear the timer
    this.tokenExpirationTimer = null;
    this.router.navigate(['']);

    localStorage.setItem('userData', JSON.stringify(null));
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      // invoke the auto-logout as per the tokenExpirationDate for the user, provided by firebase
      // expiration date in milliseconds - current date in millieseconds gives the duration after which autoLogout needs to be invoked
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.signOut();
    }, expirationDuration);
  }
}
