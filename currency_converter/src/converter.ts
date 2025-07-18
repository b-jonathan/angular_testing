import { Component, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './converter.scss',
  templateUrl: './converter.html',
})
export class ConverterComponent implements OnInit {
  currencies = signal<string[]>([]);
  baseCurrency = signal<string>('USD');
  targetCurrency = signal<string>('EUR');
  result = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<any>('https://api.frankfurter.app/currencies')
      .subscribe((data) => {
        this.currencies.set(Object.keys(data));
      });
  }

  convert() {
    const from = this.baseCurrency();
    const to = this.targetCurrency();

    this.http
      .get<any>(
        `https://api.frankfurter.app/latest?amount=1&from=${from}&to=${to}`
      )
      .subscribe((data) => {
        const rate = data.rates[to];
        this.result.set(`1 ${from} = ${rate} ${to}`);
      });
  }

  swap() {
    const from = this.baseCurrency();
    const to = this.targetCurrency();
    this.baseCurrency.set(to);
    this.targetCurrency.set(from);
  }
}
