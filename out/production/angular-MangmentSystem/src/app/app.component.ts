import {ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {ApiService} from "./service/api.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-system';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {
  }


  isAuth(): boolean {
    return this.apiService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.apiService.isAdmin();
  }

  logout() {
    this.apiService.logout();
    this.router.navigate(["/login"]);
  }

}
