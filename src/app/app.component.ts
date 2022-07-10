import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'B2X Warranty Check';
  common: any = {}
  constructor(private configService: ConfigService) {
    this.common.brandName = 'Xiomi';
    this.common.spinner = this.getSpinner(); //Common spinner
    this.common.requestTimeout = 30000; //http request timeout (ms)
    this.common.countries = [];
    this.common.responseConfig = {}
    this.configService.loadXmlToJson('/assets/config/countries.xml', this.common, "countries");
    this.configService.getJSON('/assets/config/response.config.json').subscribe((res) => {
      let returnImeiDatalist: [] = res['returnImeiDatalist'];
      returnImeiDatalist = returnImeiDatalist.sort((a: any, b: any) => {
        if (a.seqNo < b.seqNo)
          return -1;
        return 1;
      });
      this.common.responseConfig['returnImeiDatalist'] = res['returnImeiDatalist'];
    });
  }

  getSpinner() {
    let color: ThemePalette = 'primary';
    let mode: ProgressSpinnerMode = 'indeterminate';
    let value = 50;
    return {
      color: color,
      mode: mode,
      value: value,
      show: false
    }
  }
}
