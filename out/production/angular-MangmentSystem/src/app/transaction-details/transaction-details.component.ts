import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ApiService} from "../service/api.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-details.component.html',
  styleUrl: './transaction-details.component.css'
})
export class TransactionDetailsComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  transactionId: string = '';
  transactions: any = null;
  status: string = '';
  message: string = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.transactionId = params['transactionId'];
      this.getTransactionDetails();
    });
  }

  private getTransactionDetails() {
    if (this.transactionId) {
      this.apiService.getTransactionById(this.transactionId).subscribe({
        next: (data: any) => {
          if (data.status === 200) {
            this.transactions = data.transaction;
            this.status = data.transaction.transactionStatus;
          } else {
            this.showMessage(data.message);
          }
        },
        error: (error: any) => {
          this.showMessage(error?.error?.message || error?.message || "Enable to get transaction details" + error);
        }
      });
    }
  }

  handleUpdateTransactionStatus(): void {
    if (this.transactionId && this.status) {
      this.apiService.updateTransactionStatus(this.transactionId, this.status).subscribe({
        next: (data: any) => {
          if (data.status === 200) {
            this.router.navigate(['/transaction']);
          } else {
            this.showMessage(data.message);
          }
        },
        error: (error: any) => {
          this.showMessage(error?.error?.message || error?.message || "Enable to update transaction status" + error);
        }
      });
    }
  }

  showMessage(message: string): void {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}
