import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { ChartModel } from '../_interfaces/chartmodel.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  public data: ChartModel[];
  public bradcastedData: ChartModel[];

  private hubConnection: signalR.HubConnection
    public startConnection = () => {
      this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl('https://localhost:5001/chart')
                              .build();
      this.hubConnection
        .start()
        .then(() => console.log('Connection started'))
        .catch(err => console.log('Error while starting connection: ' + err))
    }
    
    public addTransferChartDataListener():Observable<ChartModel[]> {
     
     
      let x:Observable<ChartModel[]>= new Observable((subscriber) => {
      this.hubConnection.on('transferchartdata', (data) => {
        this.data = data;
        subscriber.next(data);
        
      });
    //  let x=1;
    //   setInterval(()=>{
       
    //     subscriber.next(x++);
    //   },100)
    });
  
    return x;
  }
public demo(){
  let a= new Subject();
  a.subscribe(x=>{
    console.log();
  })
  a.next(1);
  

  let b= new Observable(oberver=>{
    oberver.next(2);
  })
  b.subscribe(y=>{
    console.log(y)
  })

}

    public broadcastChartData = () => {
      const data = this.data.map(m => {
        const temp = {
          data: m.data,
          label: m.label
        }
        return temp;
      });

      this.hubConnection.invoke('broadcastchartdata', data)
      .catch(err => console.error(err));
    }

    public addBroadcastChartDataListener = () => {
      this.hubConnection.on('broadcastchartdata', (data) => {
        this.bradcastedData = data;
      })
    }
    public inputDataListener():Observable<ChartModel[]>  {
     return new Observable((observer) => {
     debugger
     if(!((this.hubConnection as any)._methods['inputdata'])){
      this.hubConnection.on('InputData', (data) => {
        observer.next(data);
      })
     } 
     
    
      
    });
    }

    public stoplistner(){
    //  this.hubConnection.off("InputData");
    //  this.hubConnection
    }
//-------------- observer observable

    // test(){
    //  var observable= Observable.create(this.test2)
    //  observable.subscriber(val=>{
    //    console.log(val);
    //  })
    // }
    // test2(observer){
    //   let x=0;
    //   setInterval(()=>{
    //     observer.next("val:"+x++);

    //   },2000)
    // }
}
