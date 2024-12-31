import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {ApiService} from "../service/api.service";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private apiService: ApiService, private router: Router) {
  }

  formData = {

    email: '',
    name: '',
    phone: '',
    password: ''
  }
  message: string | null = null;

  async handleSubmit() {
    if (
      !this.formData.email ||
      !this.formData.name ||
      !this.formData.phone ||
      !this.formData.password
    ) {
      this.showMessage("Please fill all fields");
      return;
    }
    try {
      const response: any = await firstValueFrom(this.apiService.registerUser(this.formData));
      if (response.status === 200) {
        this.showMessage(response.message);
        await this.router.navigate(["/login"]);
      }
    } catch (e: any) {
      console.log(e);
      this.showMessage(e?.error?.message || e?.message || "Enable to register" + e);
    }
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = null;
    }, 5000);
  }

}
