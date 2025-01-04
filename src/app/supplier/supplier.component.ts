import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ApiService} from "../service/api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css'
})
export class SupplierComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router) {
  }

  suppliers: any = [];
  message: string = '';

  ngOnInit(): void {
    this.getSuppliers();
  }

  getSuppliers(): void {
    this.apiService.getAllSupplier().subscribe({
      next: (data: any) => {
        if (data.status === 200) {
          this.suppliers = data.suppliers;
        } else {
          this.showMessage(data.message);
        }
      },
      error: (error: any) => {
        this.showMessage(error?.error?.message || error?.message || "Enable to get suppliers" + error);
      }
    });
  }


  navigateToAddSupplier() {
    this.router.navigate(["/add-supplier"]);
  }

  navigateToEditSupplier(supplierId: string): void {
    this.router.navigate([`/edit-supplier/${supplierId}`]);
  }

  handleDeleteSupplier(supplierId: string) {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      this.apiService.deleteSupplier(supplierId).subscribe({
        next: (data: any) => {
          if (data.status === 200) {
            this.showMessage("Supplier deleted successfully");
            this.getSuppliers();
          }
        },
        error: (error: any) => {
          this.showMessage(error?.error?.message || error?.message || "Enable to delete supplier" + error);
        }
      });
    }
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

}
