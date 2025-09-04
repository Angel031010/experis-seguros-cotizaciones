// nav-menu.component.ts
import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navmenu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  
  isNavbarCollapsed = true;
  showUserMenu = false;

  get userName(): string {
    const user = this.authService.currentUser();
    return user?.nombre || user?.email || 'Usuario';
  }

  get userRole(): string {
    return this.authService.userRole();
  }

  get userInitials(): string {
    const user = this.authService.currentUser();
    if (user?.nombre) {
      const names = user.nombre.split(' ');
      return names.map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);
    }
    return 'U';
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  toggleUserMenu(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.showUserMenu = !this.showUserMenu;
  }

  closeMenus(): void {
    this.showUserMenu = false;
    this.isNavbarCollapsed = true;
  }

  logout(): void {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
      this.closeMenus();
      this.authService.logout();
    }
  }

  navigateToChangePassword(): void {
    this.closeMenus();
    this.router.navigate(['/cambiar-contrasena']);
  }

  // Agregar este método para manejar clics fuera del menú
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown') && this.showUserMenu) {
      this.showUserMenu = false;
    }
  }
}