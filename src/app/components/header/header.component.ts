import { Component, OnInit } from '@angular/core';
import { CurrencyRate, CurrencyService } from '../../services/currency.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  rates: CurrencyRate[] = [];

  baseCurrency: string = 'UAH'
  desiredCurrencies: string[] = ['USD', 'EUR']

  constructor(private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.getRates();
  }

  getRates() {
    this.currencyService.getRates(this.baseCurrency, this.desiredCurrencies.join(','))
      .subscribe({
        next: rates => {
          this.rates = rates;
        },
        error: error => console.error(`Error: ${error}`)
      }
    )
  }
}