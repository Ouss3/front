import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ApiService} from "../service/api.service";

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css'
})
export class PurchaseComponent implements OnInit {

  constructor(private apiService: ApiService) {
  }

  products: any[] = [];
  suppliers: any[] = [];
  productId: string = '';
  supplierId: string = '';
  description: string = '';
  quantity: string = '';
  message: string = '';

  ngOnInit(): void {
    this.getProductsAndSuppliers();

  }

  getProductsAndSuppliers(): void {
    this.apiService.getAllProducts().subscribe({
      next: (data: any) => {
        if (data.status === 200) {
          this.products = data.products;
        } else {
          this.showMessage(data.message);
        }
      },
      error: (error: any) => {
        this.showMessage(error?.error?.message || error?.message || "Enable to get products" + error);
      }
    })

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
    })
  }

  handleSubmit(): void {
    if (!this.productId || !this.supplierId || !this.quantity) {
      this.showMessage("Please fill all fields");
      return;
    }

    const body = {
      productId: this.productId,
      supplierId: this.supplierId,
      description: this.description,
      quantity: parseInt(this.quantity, 10)
    }
    this.apiService.purchaseProduct(body).subscribe({
      next: (data: any) => {
        if (data.status === 200) {
          this.showMessage(data.message);
          this.restForm();
        } else {
          this.showMessage(data.message);
        }
      },
      error: (error: any) => {
        this.showMessage(error?.error?.message || error?.message || "Enable to purchase product" + error);
      }
    })
  }

  restForm(): void {
    this.productId = '';
    this.supplierId = '';
    this.description = '';
    this.quantity = '';
  }


  showMessage(message: string): void {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}
