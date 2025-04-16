import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CompanyService } from '../../_Service/Company/company.service';
import { StaffService } from '../../_Service/Staff/staff.service';
import { SalesData } from './../../_model/SalesData.model';
import { LatestTransactionDto, MonthlyRevenueChartDto } from './../../_model/Chart.modal';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


Chart.register(...registerables);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  response: any;
  amountEarnedToday!: number;
  amountEarnedMonth!: number;
  amountEarnedCurrentYear: number = 0;
  bestPerformer!: string;
  bestPerformerValue!: string;  
  transactions: LatestTransactionDto[] = [];
  displayedColumns: string[] = ['staffName', 'serviceName', 'serviceFee', 'time' ];
  dataSource = this.transactions;
  constructor(private companyService: CompanyService, private staffService: StaffService) {
    
  }
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.MonthlyYearData();
    this.getMonthlyRevenue();
    this.fetchLatestTransactions();


    interval(20000) // every 20 seconds
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => 
      this.MonthlyYearData()
    );
    interval(20000) // every 20 seconds
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => 
      this.getMonthlyRevenue()
    );
    interval(20000) // every 20 seconds
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => 
      this.fetchLatestTransactions()
    );
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  MonthlyYearData() {
    this.companyService.GetCompanyEarningSummary().subscribe((item) => {
      this.response = item;
      this.amountEarnedMonth = this.response.amountEarnedMonth;
      this.amountEarnedCurrentYear = this.response.amountEarnedCurrentYear;
      this.amountEarnedToday = this.response.amountEarnedToday;
      this.bestPerformer = this.response.bestPerformer.name;
      this.bestPerformerValue = this.response.bestPerformer.workedFor;
      console.log(item);
    });
  }

  monthlyRevenueData: MonthlyRevenueChartDto[] = [];
  
  getMonthlyRevenue() {
 // Fetching monthly revenue data from the API.
    this.companyService.getMonthlyRevenue().subscribe((item) => {
      this.monthlyRevenueData = item;
      console.log(item);
      this.RenderChart();
    });
  }

  RenderChart() {
    const labels = this.monthlyRevenueData.map(x => x.monthLabel);
    const data = this.monthlyRevenueData.map(x => x.revenue);
  
    const myBarChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: "Monthly Revenue",
          backgroundColor: "#4e73df",
          hoverBackgroundColor: "#2e59d9",
          borderColor: "#4e73df",
          data: data,borderRadius: 6,
          barPercentage: 0.5,
          categoryPercentage: 0.5
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#4e73df',
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          },
          tooltip: {
            backgroundColor: "#f8f9fc",
            titleColor: "#6e707e",
            bodyColor: "#858796",
            borderColor: "#dddfeb",
            borderWidth: 1,
            padding: 10
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6c757d',
              font: {
                weight: 'bold'
              }
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return 'AED ' + value;
              },
              color: '#6c757d'
            },
            grid: {
              color: '#e3e6f0'
            }
          }
        }
      }
    });
  }


  fetchLatestTransactions(): void {
    this.staffService.getLatestTransactions().subscribe(
      (data) => {
        this.transactions = data;
      },
      (error) => {
        console.error('Error fetching transactions', error);
      }
    );
  }


}
