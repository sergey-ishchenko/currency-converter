import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyRate, CurrencyService } from '../../services/currency.service';
import { debounceTime, Subject } from 'rxjs';
import { FormatCurrencyModule } from '../../directives/format-currency.module';

@Component({
  selector: 'app-currency-exchange',
  standalone: true,
  imports: [FormsModule, FormatCurrencyModule],
  templateUrl: './currency-exchange.component.html',
  styleUrl: './currency-exchange.component.scss'
})
export class CurrencyExchangeComponent {

  currenciesList = ['UAH', 'USD', 'EUR']

  currencyRateLeft: CurrencyRate = { code: 'UAH', value: 1 };
  currencyRateRight: CurrencyRate = { code: 'UAH', value: 1 };
  currencyValueChanged = new Subject<string>();

  constructor(private currencyService: CurrencyService) {
    this.currencyValueChanged
      .pipe(
        debounceTime(1000))
      .subscribe((baseInput) => {
        this.calculateOtherRate(baseInput);
      })
  }

  calculateOtherRate(baseInput: string) {
    const baseCurrency = baseInput === 'left' ? this.currencyRateLeft.code : this.currencyRateRight.code;
    const currency = baseInput === 'left' ? this.currencyRateRight.code : this.currencyRateLeft.code;
    if (baseCurrency === currency) {
      if (baseInput === 'left') {
        this.currencyRateRight.value = this.currencyRateLeft.value;
      } else {
        this.currencyRateLeft.value = this.currencyRateRight.value;
      }
    }
    else {
      this.currencyService.getRates(baseCurrency, currency)
        .subscribe({
          next: rates => {
            let rate = rates[0];
            if (baseInput === 'left') {
              const leftInputValueNormalized = parseFloat(this.currencyRateLeft.value.toString().replace(/\s/g, ''))
              this.currencyRateRight.value = Math.round((rate.value * leftInputValueNormalized) * 100) / 100;
            } else {
              const rightInputValueNormalized = parseFloat(this.currencyRateRight.value.toString().replace(/\s/g, ''))
              this.currencyRateLeft.value = Math.round((rate.value * rightInputValueNormalized) * 100) / 100;
            }
          },
          error: error => console.error(`Error: ${error}`)
        })
    }
  }

  onRateValueChange(baseInput: string) {
    this.currencyValueChanged.next(baseInput);
  }

  onCurrencyChange(baseInput: string = 'left') {
    this.calculateOtherRate(baseInput);
  }
}
