import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';

@Injectable()
export class UserService {
    private 


    constructor(
        private apiService: ApiService,
        private jwtService: JwtService
    ) { }

    register(data: Object): Observable<any> {
        return this.apiService.post('/company/register', data);
    }

    attemptAuth(credentials): Observable<any> {
        return this.apiService.post('/oauth/login', credentials)
        .map(
            data => {
                this.jwtService.saveToken(data.token);
                return data;
            });
    }

    logout() {
        this.jwtService.destroyToken();
    }


}