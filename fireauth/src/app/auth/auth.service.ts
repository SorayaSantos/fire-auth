import { throwError, Observable, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from './user';
import { AngularFireAuth } from '@angular/fire/auth';
import { catchError, switchMap } from 'rxjs/operators';

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
}
