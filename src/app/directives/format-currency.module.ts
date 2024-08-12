import { NgModule } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormatCurrencyDirective } from './format-currency.directive';

@NgModule({
  exports: [FormatCurrencyDirective],
  declarations: [FormatCurrencyDirective],
  providers: [CurrencyPipe, DecimalPipe]
})
export class FormatCurrencyModule {}