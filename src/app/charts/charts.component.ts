import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { UserService } from '../user.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  public doughnutChartLabels: string[] = ['Online', 'On site', 'Free', 'Paid'];
  public doughnutChartData: number[] = [50, 60, 30, 10];
  public doughnutChartType = 'doughnut';
  public doughnutChartOptions: any = {
    responsive: true,
    cutoutPercentage: 65
  };
  public doughnutChartColors: Array<any> = [
    { // primary
      backgroundColor: ['rgba(102,204,255,1)', 'rgba(63, 121, 191, 1)','rgba(255,255,102,1)', 'rgba(255,0,0,1)', 'rgba(191, 63, 178, 1)', 'rgba(255, 124, 0, 1)'],
      pointHoverBackgroundColor: '#fff'
    }
  ];

  public polarAreaChartLabels: Label[] = ['Total','Workshop', 'Soft Skills', 'Technical', 'Social', 'Marketing', 'Recruiting'];
  public polarAreaChartData: SingleDataSet = [255, 50, 60, 70, 10, 20, 45];
  public polarAreaChartType: ChartType = 'polarArea';
  public polarAreaLegend = true;

  constructor(public userService: UserService) { }

  ngOnInit(): void {
  }

  //charts events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
