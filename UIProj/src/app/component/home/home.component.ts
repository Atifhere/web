import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CompanyService } from '../../_Service/Company/company.service';
import { StaffService } from '../../_Service/Staff/staff.service';
import { SalesData } from './../../_model/SalesData.model';
import {
  LatestTransactionDto,
  MonthlyRevenueChartDto,
} from './../../_model/Chart.modal';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardInsightsDto } from '../../_model/Dashboard.modal';
import { MatDialog } from '@angular/material/dialog';
import { AddAppointmentDialogComponent } from '../login/Appointments/add-appointment-dialog-component';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoaderService } from '../../_Service/loader.service';

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
  myBarChart: any;
  amountEarnedToday!: number;
  amountEarnedMonth!: number;
  topPerformerMax: number = 0;
  amountEarnedCurrentYear: number = 0;
  bestPerformer!: string;
  bestPerformerValue!: string;
  transactions: LatestTransactionDto[] = [];
  insights!: DashboardInsightsDto;
  displayedColumns: string[] = [
    'staffName',
    'serviceName',
    'serviceFee',
    'time',
  ];
  dataSource = this.transactions;
  data: any;
  constructor(
    private companyService: CompanyService,
    private staffService: StaffService,
    private dialog: MatDialog,
    private loaderService: LoaderService
  ) {}
  private destroy$ = new Subject<void>();
  monthlyRevenueData: MonthlyRevenueChartDto[] = [];

  ngOnInit(): void {
    this.loaderService.show(); // Show the loader when the component initializes
    this.loaderService.hide(); // Hide the loader when the data is loaded
    this.MonthlyYearData();
    this.getMonthlyRevenue();
    this.fetchLatestTransactions();
    this.GetDashboardStatistics();
    // this.getDashboardInsights();

    interval(20000) // every 20 seconds
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.MonthlyYearData());
    interval(20000) // every 20 seconds
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getMonthlyRevenue());
    interval(20000) // every 20 seconds
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.fetchLatestTransactions());
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
    });
  }


  getMonthlyRevenue() {
    // Fetching monthly revenue data from the API.
    this.companyService.getMonthlyRevenue().subscribe((item) => {
      this.monthlyRevenueData = item;
      this.RenderChart();
    });
  }

  RenderChart() {
    const labels = this.monthlyRevenueData.map((x) => x.monthLabel);
    const data = this.monthlyRevenueData.map((x) => x.revenue);
    if (this.myBarChart) {
      this.myBarChart.destroy();
    }

    this.myBarChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Monthly Revenue',
            backgroundColor: '#4e73df',
            hoverBackgroundColor: '#2e59d9',
            borderColor: '#4e73df',
            data: data,
            borderRadius: 6,
            barPercentage: 0.5,
            categoryPercentage: 0.5,
          },
        ],
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
                weight: 'bold',
              },
            },
          },
          tooltip: {
            backgroundColor: '#f8f9fc',
            titleColor: '#6e707e',
            bodyColor: '#858796',
            borderColor: '#dddfeb',
            borderWidth: 1,
            padding: 10,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#6c757d',
              font: {
                weight: 'bold',
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return 'AED ' + value;
              },
              color: '#35393c',
            },
            grid: {
              color: '#e3e6f0',
            },
          },
        },
      },
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

  getDashboardInsights(): void {
    this.companyService.getDashboardInsights().subscribe(
      (data) => {
        this.data = data;
      },
      (error) => {
        console.error('Error fetching transactions', error);
      }
    );
  }

  GetDashboardStatistics(): void {
    this.companyService.getDashboardStatistics().subscribe(
      (data1) => {
        this.insights = data1;
        this.topPerformerMax = Math.max(
          ...this.insights.topPerformersTimeline.map((p) => p.workedFor)
        );
      },
      (error) => {
        console.error('Error fetching transactions', error);
      }
    );
  }
}
