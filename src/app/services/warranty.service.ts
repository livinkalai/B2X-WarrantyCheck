import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';

const CACHE_REQUEST_FLAG_HEADER_NAME = 'CACHE_REQUEST_FLAG';
const CACHE_REQUEST_ID_HEADER_NAME = 'CACHE_REQUEST_ID';
@Injectable()
export class WarrantyService {
  apiUrl: string = "https://xmfunctionapp-apim.azure-api.net/xmb2x-func-dev/WarrantyQuery";
  header: HttpHeaders | undefined;
  common: any;
  private requestDataId = '12345';
  isProcessing: boolean = false;
  duration: number = 2000;
  spinnerDelay: number = 1000;
  constructor(private http: HttpClient) {
    this.header = new HttpHeaders().set(
      "Auth-Token", "a4a9ba474a2c4171b79a4ee03f27bebe"
    );
    this.header.set(CACHE_REQUEST_FLAG_HEADER_NAME, 'true');
    this.header.set(CACHE_REQUEST_ID_HEADER_NAME, this.requestDataId);
  }

  setCommonData(commonData: any) {
    this.common = commonData;
  }

  getWarrantyStatus(inputData: any): Observable<any> {
    return this.http.post(this.apiUrl, inputData, { headers: this.header });
  }

}

@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    debugger
    const isCached = Boolean(request.headers.get(CACHE_REQUEST_FLAG_HEADER_NAME));
    const cacheId = request.headers.get(CACHE_REQUEST_ID_HEADER_NAME)

    if (isCached) {
      //  let observable = this.cache.get(cacheId);

      //  if (observable) {
      //    return observable;
      //  }

      // Cache request
    }

    return next.handle(request);
  }
}
