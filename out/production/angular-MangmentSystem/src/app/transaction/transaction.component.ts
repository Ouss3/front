import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ApiService} from "../service/api.service";
import {Router} from "@angular/router";
import {PaginationComponent} from "../pagination/pagination.component";

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [FormsModule, CommonModule, PaginationComponent],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {
  }

  trasactions: any[] = [];
  message: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 3;
  searchInput: string = '';
  valueToSearch: string = '';

  ngOnInit(): void {
    this.getTransactions();
  }

  private getTransactions() {
    this.apiService.getAllTransactions(this.valueToSearch).subscribe({
      next: (data: any) => {
        if (data.status === 200) {
          const transactions = data.transactions;
          this.trasactions = data.transactions || [];
          this.totalPages = Math.ceil(transactions.length / this.itemsPerPage);
          this.trasactions = transactions.slice(
            (this.currentPage - 1) * this.itemsPerPage,
            this.currentPage * this.itemsPerPage);
        } else {
          this.showMessage(data.message);
        }
      },
      error: (error: any) => {
        this.showMessage(error?.error?.message || error?.message || "Enable to get transactions" + error);
      }
    });
  }

  handleSearch(): void {
    this.currentPage = 1;
    this.valueToSearch = this.searchInput;
    this.getTransactions();
  }

  navigateToTransactionDeatilsPage(transactionId: string): void {
    this.router.navigate([`/transaction/${transactionId}`]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getTransactions();
  }


  showMessage(message: string): void {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}
