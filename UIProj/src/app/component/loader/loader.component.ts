import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
loading: boolean = true; // Set to true when loading

  // You can add a method to toggle loading if needed
  toggleLoading() {
    this.loading = !this.loading;
  }
}
