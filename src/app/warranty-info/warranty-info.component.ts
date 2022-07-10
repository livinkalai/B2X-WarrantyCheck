import { Component, Input, OnInit } from '@angular/core';
import { WarrantyService } from '../services/warranty.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { ConfigService } from '../services/config.service';
import { catchError, timeout } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-warranty-info',
  templateUrl: './warranty-info.component.html',
  styleUrls: ['./warranty-info.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => active', [ 
        style({ opacity: 0 }),
        animate(3000, style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate(1000, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class WarrantyInfoComponent implements OnInit {
  @Input() common: any; //Shared Common Data

  data: any = { result: null };
  isShowResults: boolean = false;
  hideSuccessMessage: boolean = true;
  selected: any = {};
  regexp: any = {};
  constructor(private configService: ConfigService, private warrantyService: WarrantyService, public dialog: MatDialog) {
    this.warrantyService.setCommonData(this.common);
    this.regexp["sno"] = new RegExp('\\d{5}\/\\d{8}$');
    this.regexp["imei"] = new RegExp('\\d{15}$');
  }

  ngOnInit(): void {
    this.selected = {
      countryCode: 0,
      findNumber: ""
    }
  }

  //#region - UI Interaction Methods
  onClickGetWarranty() {
    this.isShowResults = false;
    if (!navigator.onLine) {
      this.showErrorDialog({ "title": "Internet Connetion Error !!", "message": "Check Your Internet Connection!" });
    }
    else {
      let input = this.prepareInput(this.selected.findNumber, this.selected.countryCode);
      if (input.uniquecode || input.imei) {
        this.common.spinner.show = true;
        if (this.common.requestTimeout > 0) {
          this.warrantyService.getWarrantyStatus(input)
            .pipe(timeout(this.common.requestTimeout), catchError(this.handleTimeoutError.bind(this)))
            .subscribe((res: any) => { this.onWarratySearchSuccess(res); });
        } else {
          this.warrantyService.getWarrantyStatus(input)
            .subscribe((res: any) => { this.onWarratySearchSuccess(res); });
        }
      } else {
        this.showErrorDialog({ "message": "Seriol No or IMEI is in valid." });
      }
    }
  }

  evaluate(scriptString: string) {
    return eval(scriptString);
  }
  //#endregion

  //#region -Private Methods
  private onWarratySearchSuccess(res: any) {
    this.common.spinner.show = false;
    if (res.statusCode == 200 && res.body) {
      this.fadeOutMessage();
      var imeiInfo = res.body.returnImeiDatalist;
      this.data.result = imeiInfo;
      this.isShowResults = true;
    } else {
      this.showErrorDialog({ "title": "Server Error !", "message": res.message });
    }
  }
  private handleTimeoutError(err: any): Observable<any> {
    this.common.spinner.show = false;
    this.showErrorDialog({ "title": "Timeout Error !", "message": "Server is taking too long to respond" });
    throw err;
  }

  fadeOutMessage() {
    this.hideSuccessMessage = false;
    setTimeout(() => {
      this.hideSuccessMessage = true;
    }, 2000);
  }

  private prepareInput(SNorIMEI: string, countryCode: number) {
    let input: any = {
      "fsn": "",
      "countryid": countryCode
    }
    if (this.isSerialNo(SNorIMEI)) {
      input["uniquecode"] = SNorIMEI;
    } else if (this.isIMEI(SNorIMEI)) {
      input["imei"] = SNorIMEI;
    }
    return input;
  }

  private isSerialNo(sno: string): boolean {
    return this.regexp["sno"].test(sno);
  }

  private isIMEI(imei: string): boolean {
    return this.regexp["imei"].test(imei);

  }

  private showErrorDialog(data: any): void {
    this.dialog.open(ErrorDialogComponent, {
      width: '500px',
      data: data,
      panelClass: "warranty-error-dialog"
    });
  }
  //#endregion
}
