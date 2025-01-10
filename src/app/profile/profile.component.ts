import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ApiService} from "../service/api.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  constructor(private apiService: ApiService) {
  }

  user: any = null;
  message: string = '';


  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    this.apiService.getLoggedInUserInfo().subscribe({
      next: (res) => {
        this.user = res;
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
          error?.message ||
          'Unable to Get Profile Info' + error
        );
      }
    })
  }


  showMessage(message: string): void {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 3000);

  }

}
