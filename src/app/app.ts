import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  // If you have a stylesheet for app.component, it would be here
  // styleUrl: './app.scss' 
})
export class App { // Assuming the class name is App based on the error
  title = 'TaskBoard';
}