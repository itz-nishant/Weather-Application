import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: [
    {
      description: string;
      icon: string;
    }
  ];
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  weatherForm!: FormGroup;
  isLoading = false;
  weatherData: WeatherData | null = null;
  errorMessage: string | null = null;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.weatherForm = this.formBuilder.group({
      cityName: ['', Validators.required]
    });
  }

  searchWeather(): void {
    if (this.weatherForm.invalid) {
      return;
    }

    const cityName = this.weatherForm.value.cityName;
    const apiKey = '20e6b200c5184f5e6fce3122e35d313b';

    this.isLoading = true;
    this.weatherData = null;
    this.errorMessage = null;

    this.http.get<WeatherData>(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`)
    .subscribe(
      (data: WeatherData) => {
        this.isLoading = false;
        this.weatherData = data;
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error fetching weather data. Please try again.';
      }
    );
  }

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  }
}
