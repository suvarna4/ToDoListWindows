import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {


  @Input() ticks: number;
  checked:boolean = false;
  minutesDisplay: number = this.getMinutes(this.ticks);
  hoursDisplay: number = this.getHours(this.ticks);
  secondsDisplay: number = this.getSeconds(this.ticks);
  msecondsDisplay: number = this.getMilliSeconds(this.ticks);
  save: number = this.ticks;
  sub: Subscription;
  @Output() change: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit() {
    this.minutesDisplay = this.getMinutes(this.ticks);
    this.hoursDisplay = this.getHours(this.ticks);
    this.secondsDisplay = this.getSeconds(this.ticks);
    this.msecondsDisplay = this.getMilliSeconds(this.ticks);
    this.save = this.ticks;
  }

  private startTimer() {
      let timer = Observable.timer(1, 10);
      this.sub = timer.subscribe(
          t => {
              this.ticks = this.save + t;
              this.msecondsDisplay = this.getMilliSeconds(this.ticks);
              this.secondsDisplay = this.getSeconds(this.ticks);
              this.minutesDisplay = this.getMinutes(this.ticks);
              this.hoursDisplay = this.getHours(this.ticks);
          }
      );
  }

  pauseTimer() {
    this.save = this.ticks;
    if(!this.checked && this.sub) {
        this.sub.unsubscribe();
    }
    this.change.emit(this.ticks);    
  }

  private changeCheck() {
      if(this.checked) {
        this.startTimer();  
      } else {
        this.pauseTimer();
      }
  }

  private getMilliSeconds(ticks: number) {
    return this.pad(ticks % 100);
  }
  private getSeconds(ticks: number) {
      return this.pad(Math.floor(ticks / 100) % 60);
  }

  private getMinutes(ticks: number) {
       return this.pad((Math.floor(ticks / 6000)) % 60);
  }

  private getHours(ticks: number) {
      return this.pad(Math.floor((ticks / 6000) / 60));
  }

  private pad(digit: any) { 
      return digit <= 9 ? '0' + digit : digit;
  }
}
