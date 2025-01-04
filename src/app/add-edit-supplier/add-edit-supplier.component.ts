import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";
import {ApiService} from "../service/api.service";

@Component({
  selector: 'app-add-edit-supplier',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-edit-supplier.component.html',
  styleUrl: './add-edit-supplier.component.css'
})
export class AddEditSupplierComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {
  }

  message: string = '';
  isEditing: boolean = false;
  supplierId: string | null = null;

  formData: any = {
    name: '',
    address: ''
  }

  ngOnInit(): void {
    this.supplierId = this.router.url.split("/")[2];
    if (this.supplierId) {
      this.isEditing = true;
      this.getSupplier();
    }
  }


  getSupplier(): void {
    this.apiService.getSupplierById(this.supplierId!).subscribe(
      {
        next: (data: any) => {
          if (data.status === 200) {
            this.formData = {
              name: data.supplier.name,
              address: data.supplier.address
            }
          } else {
            this.showMessage(data.message);
          }
        },
        error: (error: any) => {
          this.showMessage(error?.error?.message || error?.message || "Enable to get supplier" + error);
        }
      }
    )
  }

  // HANDELE FORMSUBMISSION

  handleSubmit(): void {
    if (!this.formData.name || !this.formData.address) {
      this.showMessage("Please fill all fields");
      return;
    }
    const supplierData = {
      name: this.formData.name,
      address: this.formData.address
    }
    if (this.isEditing) {
      this.apiService.updateSupplier(this.supplierId!, supplierData).subscribe({
          next: (data: any) => {
            if (data.status === 200) {
              this.showMessage(data.message);
              this.router.navigate(["/supplier"]);
            }
          },
          error: (error: any) => {
            this.showMessage(error?.error?.message || error?.message || "Enable to update supplier" + error);
          }
        }
      )
    } else {
      this.apiService.addSupplier(supplierData).subscribe({
        next: (data: any) => {
          if (data.status === 200) {
            this.showMessage(data.message);
            this.router.navigate(["/supplier"]);
          }
        },
        error: (error: any) => {
          this.showMessage(error?.error?.message || error?.message || "Enable to add supplier" + error);
        }
      })
    }
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }


}
