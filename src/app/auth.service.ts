import { Injectable } from '@angular/core';
import { UserService } from './services/User/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private role: string | null = null;

  constructor(private userService: UserService) {
    // Load the role from localStorage or the backend (if needed)
    this.role = localStorage.getItem('role');
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken'); // Check if there's a token
  }

  // Get the current user role
  getRole(): string | null {
    return this.role;
  }

  // Log the user in (for example)
  login(role: string) {
    localStorage.setItem('authToken', 'your-token'); // Store auth token
    localStorage.setItem('role', role); // Store user role
    this.role = role; // Set role in the service for use in the app
  }

  // Log the user out
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    this.role = null; // Clear the role from the service
  }
}
