import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ApiService} from "../service/api.service";

@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sell.component.html',
  styleUrl: './sell.component.css'
})
export class SellComponent implements OnInit {

  constructor(private apiService: ApiService) {
  }

  products: any[] = [];

  productId: string = '';

  description: string = '';
  quantity: string = '';
  message: string = '';

  ngOnInit(): void {
    this.getProducts();

  }

  getProducts(): void {
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

  }

  handleSubmit(): void {
    if (!this.productId || !this.quantity) {
      this.showMessage("Please fill all fields");
      return;
    }

    const body = {
      productId: this.productId,
      description: this.description,
      quantity: parseInt(this.quantity, 10)
    }
    this.apiService.sellProduct(body).subscribe({
      next: (data: any) => {
        if (data.status === 200) {
          this.showMessage(data.message);
          this.restForm();
        } else {
          this.showMessage(data.message);
        }
      },
      error: (error: any) => {
        this.showMessage(error?.error?.message || error?.message || "Enable to sell product" + error);
      }
    })
  }

  restForm(): void {
    this.productId = '';
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
