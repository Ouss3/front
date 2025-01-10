import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {ApiService} from "../service/api.service";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private apiService: ApiService, private router: Router) {
  }

  formData = {

    email: '',
    password: ''
  }
  message: string | null = null;

  async handleSubmit() {
    if (
      !this.formData.email ||
      !this.formData.password
    ) {
      this.showMessage("Please fill all fields");
      return;
    }
    try {
      const response: any = await firstValueFrom(this.apiService.loginUser(this.formData));
      if (response.status === 200) {
        this.apiService.encryptAndSaveTpStorage('token', response.token);
        this.apiService.encryptAndSaveTpStorage('role', response.role);
        await this.router.navigate(["/dashboard"]);
      }
    } catch (e: any) {
      console.log(e);
      this.showMessage(e?.error?.message || e?.message || "Enable to login" + e);
    }
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = null;
    }, 5000);
  }


}
