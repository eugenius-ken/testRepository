import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models/user.model';

@Injectable()
export class UserService {

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
                this.jwtService.saveToken(data.access_token);
                return data;
            });
    }

    logout() {
        this.jwtService.destroyToken();
    }

    getCurrentUser() {
        return this.apiService.get('/user')
            .map(data => {
                return data.result;
            });
    }

    updateUser(user: User): Observable<User> {
        user.phone = user.phone.substr(2, 10);
        
        return this.apiService.put('/user', user)
            .map(data => {
                return data.result;
            });
    }
}