import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { JwtService } from './jwt.service';

@Injectable()
export class ApiService {
    constructor(
        private http: Http,
        private jwtService: JwtService
    ) { }

    private setHeaders(): Headers {
        const headersConfig = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (this.jwtService.getToken()) {
            headersConfig['Authorization'] = `Token ${this.jwtService.getToken()}`;
        }
        return new Headers(headersConfig);
    }

    private formatResult(res: Response) {
        return res.json();
    }

    private formatErrors(error: any) {
        return Observable.throw(error.json());
    }

    get(path: string, params: URLSearchParams = new URLSearchParams()): Observable<any> {
        return this.http.get(`${environment.api_url}${path}`, { params: params, headers: this.setHeaders() })
            .catch(this.formatErrors)
            .map(this.formatResult);
    }

    post(path: string, body: Object = {}): Observable<any> {
        return this.http.post(`${environment.api_url}${path}`, JSON.stringify(body), { headers: this.setHeaders() })
            .catch(this.formatErrors)
            .map(this.formatResult);
    }

    put(path: string, body: Object = {}): Observable<any> {
        return this.http.put(`${environment.api_url}${path}`, JSON.stringify(body), { headers: this.setHeaders() })
            .catch(this.formatErrors)
            .map(this.formatResult);
    }

    delete(path): Observable<any> {
        return this.http.delete(`${environment.api_url}${path}`, { headers: this.setHeaders() })
            .catch(this.formatErrors)
            .map(this.formatResult);
    }
}