import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app-settings';
@Injectable()
export class WarrantyService {
  header: HttpHeaders | undefined;
  common: any;
  isProcessing: boolean = false;
  duration: number = 2000;
  spinnerDelay: number = 1000;
  constructor(private http: HttpClient) {
    this.header = new HttpHeaders().set(
      "Auth-Token", AppSettings.AuthToken
    );
  }

  setCommonData(commonData: any) {
    this.common = commonData;
  }

  getWarrantyStatus(inputData: any): Observable<any> {
    return this.http.post(AppSettings.WarrantyAPI, inputData, { headers: this.header });
  }

}


//To enable cache for API request, Commneted this since not fully implemented.

//const CACHE_REQUEST_FLAG_HEADER_NAME = 'CACHE_REQUEST_FLAG';
//const CACHE_REQUEST_ID_HEADER_NAME = 'CACHE_REQUEST_ID';
//@Injectable()
//export class HttpCacheInterceptor implements HttpInterceptor {
//  intercept(request: HttpRequest<any>, next: HttpHandler) {
//    const isCached = Boolean(request.headers.get(CACHE_REQUEST_FLAG_HEADER_NAME));
//    const cacheId = request.headers.get(CACHE_REQUEST_ID_HEADER_NAME)
//    if (isCached) {
//      //  let observable = this.cache.get(cacheId);
//      //  if (observable) {
//      //    return observable;
//      //  }
//      // Cache request
//    }
//    return next.handle(request);
//  }
//}
