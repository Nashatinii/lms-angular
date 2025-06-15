import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, collection, doc, getDocs, setDoc, deleteDoc, query, where, updateDoc } from '@angular/fire/firestore';
import { AppUser, WaitUser } from '../../model/user.model';
import { BehaviorSubject } from 'rxjs';
// import { AuthService } from '../../auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private currentUser: AppUser | null = null;

  constructor(private router: Router, 
    private auth: Auth, 
    // private authService: AuthService, 
    private firestore: Firestore) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserSubject.next(user);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  private async getUserFromFirestore(email: string): Promise<AppUser | null> {
    const registeredUsersRef = collection(this.firestore, 'registered_users');
    const snapshot = await getDocs(query(registeredUsersRef, where('email', '==', email)));
    if (snapshot.docs.length > 0) {
      return snapshot.docs[0].data() as AppUser;
    }
    return null;
  }

  async addUser(newUser: AppUser): Promise<void> {
    const registeredUsersRef = collection(this.firestore, 'registered_users');
    await setDoc(doc(registeredUsersRef, newUser.email), newUser);
  }

  async login(email: string, password: string): Promise<string | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.currentUserSubject.next(userCredential.user);
      const user = await this.getUserFromFirestore(email);
      if (!user) {
        throw new Error('User not found in database.');
      }
      if (!user.activated) {
        throw new Error('auth/user-disabled');
      }
      this.currentUser = user;
      localStorage.setItem('userName', user.name);
      return this.getUserRole();
    } catch (error) {
      throw error;
    }
  }

  async validateCredentialstoRegister(newUser: WaitUser): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, newUser.email, newUser.password);
      await this.addToWaitList(newUser);
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUserSubject.next(null);
      this.currentUser = null;
      this.router.navigate(['/login']);
     
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');

      // Replace the current page with the login page and force reload
      this.router.navigate(['/login']);
      window.location.replace('/login');
      window.location.reload();

    } catch (error) {
      throw error;
    }
  }

  async addToWaitList(newUser: WaitUser): Promise<void> {
    const waitingUsersRef = collection(this.firestore, 'waiting_users');
    await setDoc(doc(waitingUsersRef, newUser.email), newUser);
  }

  async removeFromWaitList(email: string): Promise<void> {
    const waitingUsersRef = doc(this.firestore, 'waiting_users', email);
    try {
      await deleteDoc(waitingUsersRef);
    } catch (error) {
      throw error;
    }
  }

  async userActivation(email: string, activateStatus: boolean): Promise<void> {
    const registeredUserRef = doc(this.firestore, 'registered_users', email);
    try {
      await updateDoc(registeredUserRef, { activated: activateStatus });
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(email: string): Promise<void> {
    const registeredUserRef = doc(this.firestore, 'registered_users', email);
    try {
      await deleteDoc(registeredUserRef);
    } catch (error) {
      throw error;
    }
  }

  async getUserRole(): Promise<string | null> {
    if (!this.currentUserSubject.value) {
      return null;
    }
    const email = this.currentUserSubject.value.email;
    if (!email) {
      return null;
    }
    const user = await this.getUserFromFirestore(email);
    return user ? user.role : null;
  }

  async getUserName(): Promise<string | null> {
    if (!this.currentUserSubject.value) {
      return null;
    }
    const email = this.currentUserSubject.value.email;
    if (!email) {
      return null;
    }
    const user = await this.getUserFromFirestore(email);
    return user ? user.name : null;
  }

  async getUsersList(): Promise<AppUser[]> {
    try {
      const registeredUsersRef = collection(this.firestore, 'registered_users');
      const snapshot = await getDocs(registeredUsersRef);
      return snapshot.docs.map(doc => ({
        ...(doc.data() as AppUser),
        email: doc.id
      }));
    } catch (error) {
      throw error;
    }
  }

  async getUsersWaitList(): Promise<WaitUser[]> {
    try {
      const waitingUsersRef = collection(this.firestore, 'waiting_users');
      const snapshot = await getDocs(waitingUsersRef);
      return snapshot.docs.map(doc => ({
        ...(doc.data() as WaitUser),
        email: doc.id
      }));
    } catch (error) {
      throw error;
    }
  }
}
