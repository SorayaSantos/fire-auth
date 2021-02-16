import { throwError, Observable, from, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from './user';
import { AngularFireAuth } from '@angular/fire/auth';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
//import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userCollection: AngularFirestoreCollection<User> = this.afs.collection('users');

  constructor(private afs: AngularFirestore, private fAuth: AngularFireAuth) { }

  register(user: User): Observable<boolean> {
    return from(this.fAuth.createUserWithEmailAndPassword(user.email, user.password))
      .pipe(
        switchMap(
          (u) =>
            this.userCollection.doc(u.user.uid)
              .set({ ...user, id: u.user.uid })
              .then(() => true)
        ),
        catchError((err) => throwError(err))
      )
  }

  login(email: string, password: string): Observable<User> {
    return from(this.fAuth.signInWithEmailAndPassword(email, password))
      .pipe(
        switchMap((u) => this.userCollection.doc<User>(u.user.uid).valueChanges()),
        catchError(() => throwError('Invalid credentials or user is not registered'))
      )
  }

  logout() {
    this.fAuth.signOut();
  }

  getUser(): Observable<User> {
    return this.fAuth.authState.pipe(
      switchMap(u => (u) ? this.userCollection.doc<User>(u.uid).valueChanges() : of(null))
    )
  }

  authenticated(): Observable<boolean> {
    return this.fAuth.authState.pipe(
      map(u => (u) ? true : false)
    )
  }

  // oldLoginGoogle(): Observable<User> {
  //   const provider = new auth.GoogleAuthProvider();
  //   return from(this.fAuth.signInWithPopup(provider)).pipe(
  //     tap((data) => console.log(data)),
  //     switchMap((u: auth.UserCredential) => {
  //       const newUser: User = {
  //         firstname: u.user.displayName,
  //         lastname: '',
  //         address: '',
  //         city: '',
  //         state: '',
  //         phone: '',
  //         mobilephone: '',
  //         email: u.user.email,
  //         password: '',
  //         id: u.user.uid
  //       };
  //       return this.userCollection.doc(u.user.uid).set(newUser).then(() => newUser);
  //     }
  //     )
  //   )
  // }

  // async updateUserData(u: auth.UserCredential) {
  //   try {
  //     const newUser: User = {
  //       firstname: u.user.displayName,
  //       lastname: '',
  //       address: '',
  //       city: '',
  //       state: '',
  //       phone: '',
  //       mobilephone: '',
  //       email: u.user.email,
  //       password: '',
  //       id: u.user.uid
  //     };
  //     await this.userCollection.doc(u.user.uid).set(newUser);
  //     return newUser;
  //   }
  //   catch (e) {
  //     throw new Error(e);
  //   }
  // }

  // async loginWithGoogleAccount() {
  //   try {
  //     const provider = new auth.GoogleAuthProvider();
  //     let credentials: auth.UserCredential = await this.fAuth.signInWithPopup(provider);
  //     let user: User = await this.updateUserData(credentials);
  //     return user;
  //   }
  //   catch (e) {
  //     throw new Error(e);
  //   }
  // }

  // loginGoogle(): Observable<User> {
  //   return from(this.loginWithGoogleAccount());
  // }
}
