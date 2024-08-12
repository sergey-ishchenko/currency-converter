import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';


export interface CurrencyRate {
  code: string,
  value: number
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private apiUrl = environment.currencyApi.url;
  private apiKey = environment.currencyApi.key;

  private headers = new HttpHeaders()
    .set('apikey', this.apiKey);

  constructor(private http: HttpClient) { }

  getRates(baseCurrency?: string, currencies?: string) {
    const headers = this.headers;

    let params = new HttpParams()
    if (baseCurrency)
      params = params.set('base_currency', baseCurrency)
    if (currencies)
      params = params.set('currencies', currencies.replace(/\s/g, ''))

    return this.http.get<any>(`${this.apiUrl}/latest`, { headers, params })
      .pipe(map(respose => {
        return Object.values(respose.data) as CurrencyRate[]
      }));
  } 

  checkStatus() {
    const headers = this.headers;
    return this.http.get(`${this.apiUrl}/status`, { headers })
  }

  //available with a paid subscription
  convert(value: number, baseCurrency?: string, currencies?: string) {
    const headers = this.headers;

    let params = new HttpParams()
      .set('value', value)
    if (baseCurrency)
      params = params.set('base_currency', baseCurrency)
    if (currencies)
      params = params.set('currencies', currencies)

    return this.http.get<any>(`${this.apiUrl}/convert`, { headers, params })
  }
}