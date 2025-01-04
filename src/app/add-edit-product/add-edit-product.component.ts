import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../service/api.service";


@Component({
  selector: 'app-add-edit-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-edit-product.component.html',
  styleUrl: './add-edit-product.component.css'
})
export class AddEditProductComponent implements OnInit {


  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  productId: string | null = null;
  name: string = '';
  sku: string = '';
  price: string = '';
  stockQuantity: string = '';
  categoryId: string = '';
  description: string = '';
  imageUrl: string = '';
  imageFile: File | null = null;
  isEditing: boolean = false;
  categories: any = [];
  message: string = '';

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId');
    this.getCategories();
    if (this.productId) {
      this.isEditing = true;
      this.getProductById(this.productId);
    }
  }

  getCategories(): void {
    this.apiService.getAllCategory().subscribe({
      next: (data: any) => {
        if (data.status === 200) {
          this.categories = data.categories;
        }
      },
      error: (error: any) => {
        this.showMessage(error?.error?.message || error?.message || "Enable to get categories" + error);
      }
    });
  }

  getProductById(productId: string): void {
    this.apiService.getProductById(productId).subscribe({
      next: (data: any) => {
        if (data.status === 200) {
          const product = data.product;
          this.name = product.name;
          this.sku = product.sku;
          this.price = product.price;
          this.stockQuantity = product.stockQuantity;
          this.description = product.description;
          this.imageUrl = product.imageUrl;
          this.categoryId = product.categoryId;
        } else {
          this.showMessage(data.message);
        }
      },
      error: (error: any) => {
        this.showMessage(error?.error?.message || error?.message || "Enable to get product" + error);
      }
    });
  }

  handleImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {

      this.imageFile = input.files[0]
      const reader = new FileReader();
      reader.onloadend = () => {
        this.imageUrl = reader.result as string
      }
      reader.readAsDataURL(this.imageFile);
    }
  }

  handleSubmit(event: Event): void {
    event.preventDefault()
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('sku', this.sku);
    formData.append('price', this.price);
    formData.append('stockQuantity', this.stockQuantity);
    formData.append('categoryId', this.categoryId);
    formData.append('description', this.description);
    if (this.imageFile) {
      formData.append('imageFile', this.imageFile);
    }

    if (this.isEditing) {
      formData.append('productId', this.productId!);
      this.apiService.updateProduct(formData).subscribe({
        next: (data: any) => {
          if (data.status === 200) {
            this.showMessage(data.message);
            this.router.navigate(['/product']);
          }
        },
        error: (error: any) => {
          this.showMessage(error?.error?.message || error?.message || "Enable to update product" + error);
        }
      })
    } else {
      this.apiService.addProduct(formData).subscribe({
        next: (data: any) => {
          if (data.status === 200) {
            this.showMessage(data.message);
            this.router.navigate(['/product']);
          }
        },
        error: (error: any) => {
          this.showMessage(error?.error?.message || error?.message || "Enable to add product" + error);
        }
      })
    }
  }

  showMessage(message: string): void {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}
