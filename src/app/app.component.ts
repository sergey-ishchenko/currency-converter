import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CurrencyExchangeComponent } from './components/currency-exchange/currency-exchange.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports:[
    RouterOutlet, 
    HeaderComponent,
    FooterComponent,
    CurrencyExchangeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'currency-rate'; 

  constructor(){ }
}