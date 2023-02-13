import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { SignalrService } from './services/signalr.service';
import { HttpClient } from '@angular/common/http';
import { ChartMeta } from 'chart.js';
import { ChartModel } from './_interfaces/chartmodel.model';
//import { ChartConfiguration, ChartType } from 'chart.js';
import { NgZone } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  
  chartOptions: any['options'] = {
    responsive: true,
    scales: {
      y: {
        min: 0
      }
    }
  };

  chartLabels: string[] = ['Real time data for the chart'];
 // chartType: ChartType = 'bar';
  chartLegend: boolean = true;
  inputs:string[]=[];
  constructor(public signalRService: SignalrService, private http: HttpClient,private zone: NgZone,private changeDetectorRef: ChangeDetectorRef) { }
 val:Subscription;
  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addTransferChartDataListener().subscribe((data)=>{
      //console.log("data", data);
    });
    this.signalRService.addBroadcastChartDataListener();   
    this.startHttpRequest();
   this.val= this.signalRService.inputDataListener().subscribe((data:ChartModel[])=>{
    debugger;
      this.inputs.push(data[0].startDate.toString());
    //  this.zone.run(() => { });
    this.changeDetectorRef.detectChanges();
     console.log(this.inputs)
    })
    //--------------observers-------------
   // this.signalRService.test();
  }

  private startHttpRequest = () => {
    this.http.get('https://localhost:5001/api/chart')
      .subscribe(res => {
        console.log(res);
      })
  }

  public chartClicked = (event) => {
    console.log(event);
    this.signalRService.broadcastChartData();
  }
  public unscribe(){
    this.val&& this.val.unsubscribe();
    this.signalRService.stoplistner();
  }
  public subscribe(){
    this.signalRService.inputDataListener().subscribe((data:ChartModel[])=>{
   
        this.inputs.push(data[0].startDate.toString());
      //  this.zone.run(() => { });
      this.changeDetectorRef.detectChanges();
       console.log(this.inputs)
      })
  }
}
