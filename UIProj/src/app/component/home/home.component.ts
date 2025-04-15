import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CompanyService } from '../../_Service/Company/company.service';
import { SalesData } from './../../_model/SalesData.model';
import {Chart, registerables} from 'chart.js';
Chart.register(...registerables)


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  response : any;
  amountEarnedToday!: number;
  amountEarnedMonth!: number;
  bestPerformer!: string;
  bestPerformerValue!: string;
  SalesData: SalesData[] = [{Month:'Jan', Amount: 2000, ColorCode : 'green'}, {Month:'Feb', Amount: 5000, ColorCode : 'blue'}];

  constructor(private companyService: CompanyService) {
    this.MonthlyYearData();
  }
  ngOnInit(): void {
    this.RenderChart();
  }

  MonthlyYearData() {
    this.companyService.GetCompanyEarningSummary().subscribe((item) => {
      this.response = item;
      this.amountEarnedMonth = this.response.amountEarnedMonth;
      this.amountEarnedToday = this.response.amountEarnedToday;
      this.bestPerformer = this.response.bestPerformer.name;
      this.bestPerformerValue = this.response.bestPerformer.workedFor;
      console.log(item);
    });
  }

  RenderChart()
  {
    
    var myBarChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [{
          label: "Monthly Revenue",
          backgroundColor: "#4e73df",
          hoverBackgroundColor: "#2e59d9",
          borderColor: "#4e73df",
          data: [10000, 5312, 6251, 7841, 9821, 14984],
        }],
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
          }
        },
        // tooltips: {
        //   titleMarginBottom: 10,
        //   titleFontColor: '#6e707e',
        //   titleFontSize: 14,
        //   backgroundColor: "rgb(255,255,255)",
        //   bodyFontColor: "#858796",
        //   borderColor: '#dddfeb',
        //   borderWidth: 1,
        //   xPadding: 15,
        //   yPadding: 15,
        //   displayColors: false,
        //   caretPadding: 10
        // },
      }
    });
  }

}
