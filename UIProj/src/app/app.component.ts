import { AfterViewInit, Component, ViewChild, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppmenuComponent } from "./component/appmenu/appmenu.component";
import { CommonModule } from '@angular/common';
import { MatMenu } from '@angular/material/menu';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppmenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {  
@ViewChild(MatMenu) sidenav!: MatMenu;

constructor(private observer: BreakpointObserver){}
ngAfterViewInit(): void {
  this.observer.observe(['(max-width : 800px)']).subscribe(item=>
  {
    // if(item.matches)
    // {
    //   this.sidenav
    // }
  }
  )
}
  title = 'Barbar Shop';

  
}
