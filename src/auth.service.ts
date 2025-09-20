import { Injectable, signal } from '@angular/core';

export interface User {
  name: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Simula un usuario que ha iniciado sesión.
  currentUser = signal<User>({
    name: 'Alfredo',
    avatar: 'https://i.pravatar.cc/40?u=alfredo',
  });

  constructor() {}

  // En una aplicación real, aquí irían los métodos de login, logout, etc.
}