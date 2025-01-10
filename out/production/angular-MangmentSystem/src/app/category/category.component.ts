import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ApiService} from "../service/api.service";

interface Category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  categoryNames: string = '';
  message: string = '';
  isEditing: boolean = false;
  editingCategoryId: string | null = null;

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.getCategories();
  }

  // Get all categories
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

  // Add new category
  addCategory(): void {
    if (!this.categoryNames) {
      this.showMessage("Category name is required");
      return;
    }
    this.apiService.createCategory({name: this.categoryNames}).subscribe({
      next: (data: any) => {
        if (data.status === 200) {
          this.showMessage(data.message);

          this.categoryNames = '';
          this.getCategories();
        }
      },
      error: (error: any) => {
        this.showMessage(error?.error?.message || error?.message || "Enable to add category" + error);
      }
    });
  }

  // Edit category
  editCategory(): void {
    if (!this.editingCategoryId || !this.categoryNames) {
      return;
    }
    this.apiService.updateCategory(this.editingCategoryId, {name: this.categoryNames}).subscribe({
      next: (data: any) => {
        if (data.status === 200) {
          this.showMessage("Category updated successfully");
          this.categoryNames = '';
          this.isEditing = false;
          this.editingCategoryId = null;
          this.getCategories();
        }
      },
      error: (error: any) => {
        this.showMessage(error?.error?.message || error?.message || "Enable to edit category" + error);
      }
    });
  }

  // set category to edit
  handleEditCategory(category: Category): void {
    this.isEditing = true;
    this.editingCategoryId = category.id;
    this.categoryNames = category.name;

  }

  // Delete category
  deleteCategory(categoryId: string) {
    if (window.confirm("Are you sure you want to delete this category?")) {
      this.apiService.deleteCategory(categoryId).subscribe({
        next: (data: any) => {
          if (data.status === 200) {
            this.showMessage("Category deleted successfully");
            this.getCategories();
          }
        },
        error: (error: any) => {
          this.showMessage(error?.error?.message || error?.message || "Enable to delete category" + error);
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
