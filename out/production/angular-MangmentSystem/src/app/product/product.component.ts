import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ApiService} from "../service/api.service";
import {Router} from "@angular/router";
import {PaginationComponent} from "../pagination/pagination.component";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router) {
  }

  products: any[] = [];
  message: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 10;


  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.apiService.getAllProducts().subscribe({
      next: (data: any) => {
        if (data.status === 200) {
          const products = data.products;
          this.products = data.products || [];
          this.totalPages = Math.ceil(products.length / this.itemsPerPage);
          this.products = products.slice(
            (this.currentPage - 1) * this.itemsPerPage,
            this.currentPage * this.itemsPerPage);
        } else {
          this.showMessage(data.message);
        }
      },
      error: (error: any) => {
        this.showMessage(error?.error?.message || error?.message || "Enable to get products" + error);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getProducts();
  }

  handleDeleteProduct(productId: string): void {
    if (window.confirm("Are you sure you want to delete this product?")) {
      this.apiService.deleteProduct(productId).subscribe({
        next: (data: any) => {
          if (data.status === 200) {
            this.showMessage("Product deleted successfully");
            this.getProducts();
          }
        },
        error: (error: any) => {
          this.showMessage(error?.error?.message || error?.message || "Enable to delete product" + error);
        }
      });
    }
  }

  navigateToAddProduct(): void {
    this.router.navigate(['/add-product']);
  }

  navigateToEditProduct(productId: string): void {
    this.router.navigate([`/edit-product/${productId}`]);
  }

  showMessage(message: string): void {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

}
