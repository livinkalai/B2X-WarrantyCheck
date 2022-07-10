import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
  public parser: DOMParser;
  constructor(private http: HttpClient) {
    this.parser = new DOMParser();
  }

  loadXmlToJson(url: string, resultObject: any, propName: string) {
    this.http.get(url,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/xml')
          .append('Access-Control-Allow-Methods', 'GET')
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
        responseType: 'text'
      })
      .subscribe((data: any) => {
        this.parseXml(data)
          .then((data) => {
            resultObject[propName] = data;
          });
      });
  }

  parseXml(xmlString: string) {
    return new Promise(resolve => {
      let doc = this.parser.parseFromString(xmlString, "text/xml");
      let list = [];
      if (doc.children.length > 0) {
        let root = doc.children[0];
        let childs = root.children;
        if (childs.length > 0) {
          for (let i = 0; i < childs.length; i++) {
            let listItem: any = {};
            let props = childs[i].children;
            for (let j = 0; j < props.length; j++) {
              listItem[props[j].nodeName] = props[j].textContent;
            }
            list.push(listItem);
          }
        }
      }
      resolve(list);
    });
  }

  public getJSON(url: string): Observable<any> {
    return this.http.get(url);
  }

}
