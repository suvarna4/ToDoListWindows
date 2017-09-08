import { Component, Inject, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { TimerComponent } from './timer/timer.component';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'app';
  tasks: any[] = [];
  selectedTask: any = this.tasks[0];
  currentTask: any;
  prevTask: any;
  render: boolean = true;
  @ViewChild(TimerComponent) private timerComponent: TimerComponent;

  constructor(private cdRef:ChangeDetectorRef) {}

  submitTask(input:string) {
    if(this.selectedTask) {
      const index = this.tasks.findIndex(
        task => task.name == this.selectedTask
      )
      this.tasks.splice(index + 1, 0, {
        name: input,
        ticks: 0
      })
      return;
    }
    this.tasks = this.tasks.concat([
      {
        name: input,
        ticks: 0
      }
    ])
  }

  ticks() { return 0; }

  ngAfterViewInit() {
    // Redefine `seconds()` to get from the `CountdownTimerComponent.seconds` ...
    // but wait a tick first to avoid one-time devMode
    // unidirectional-data-flow-violation error
    setTimeout(() => this.ticks = () => this.timerComponent.ticks, 0);
  }
  beRender() {
    if(this.timerComponent) {
      this.timerComponent.pauseTimer();
    }
    setTimeout(() => this.reRender(), 10);
  }
  reRender() {
    this.prevTask = this.selectedTask;
    this.tasks.map(
      task => {
        if (this.selectedTask == task.name) {
          this.currentTask = task;
        }
      }
    )
    console.log(this.currentTask);
    this.render = false;
    this.cdRef.detectChanges();
    this.render = true;
  }

  changeTicks(event) {
    console.log(event);
    this.tasks = this.tasks.map(
      task => {
        if (task.name == this.prevTask) {
          console.log("hello");
          task.ticks = event;
        }
        return task;
      }
    )
    console.log(this.tasks);

  }
  downloadFile(){
    let text = "";
    for (let i = 0; i < this.tasks.length; i ++) {
      text += this.tasks[i].name + "|" + this.tasks[i].ticks;
      if(i != this.tasks.length - 1) {
        text +="\n";
      }
    }
    const file = new Blob([text], { type: 'text/plain' });
    FileSaver.saveAs(file, "todo.txt");
  }
  openFile(event) {
    let input = event.target;
    let text = "";
    for (var index = 0; index < input.files.length; index++) {
        let reader = new FileReader();
        reader.onload = () => {
            // this 'text' is the content of the file
            text = reader.result;
            console.log(text);
            this.tasks = [];
            let pos = -1;
            let arr = text.split('\n');
            console.log(arr);
            for(let i = 0; i < arr.length; i++) {
              let t = arr[i].split('|');
              console.log(t);
              this.tasks = this.tasks.concat([
                {
                  name: t[0],
                  ticks: Number(t[1])
                }
              ]);
              console.log(this.tasks);
              if(Number(t[1]) == 0 && pos==-1) {
                pos = i;
                this.selectedTask = t[0];
              }
              if ((pos == -1) && i == arr.length - 1) {
                this.selectedTask = t[0];
              }
            }
            
            this.reRender();
        }
        reader.readAsText(input.files[index]);
    }
  }

}
