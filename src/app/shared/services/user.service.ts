import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models/user.model';


@Injectable()
export class UserService {

    private refreshTimeout;

    constructor(
        private apiService: ApiService,
        private jwtService: JwtService
    ) {
        this.setTimerToRefreshToken();
    }

    register(data: Object): Observable<any> {
        return this.apiService.post('/company/register', data);
    }

    attemptAuth(credentials): Observable<any> {
        return this.apiService.post('/oauth/login', credentials)
            .map(
            data => {
                this.jwtService.saveAuthData(data);
                this.setTimerToRefreshToken();
                return data;
            });
    }

    private refreshAuthData() {
        const refreshToken = this.jwtService.getRefreshToken();
        if (!refreshToken) return;

        return this.apiService.post('/oauth/refreshToken', { refresh_token: refreshToken })
            .subscribe(data => {
                this.jwtService.saveAuthData(data);
                this.setTimerToRefreshToken();
            });
    }

    private setTimerToRefreshToken() {
        clearTimeout(this.refreshTimeout);

        const timeToRefresh = this.jwtService.getTimeToRefresh();
        if (timeToRefresh) {
            const ms = timeToRefresh.getTime() - new Date().getTime();
            console.log(timeToRefresh);
            this.refreshTimeout = setTimeout(() => {
                this.refreshAuthData();
            }, ms);
        }
    }

    logout() {
        this.jwtService.destroyAuthData();
    }

    getCurrentUser() {
        return this.apiService.get('/company')
            .map(data => {
                return this.mapFromApiModel(data.result);
            });
    }

    updateUser(user: User): Observable<User> {
        return this.apiService.put('/company', this.mapToApiModel(user))
            .map(data => {
                return this.mapFromApiModel(data.result);
            });
    }

    mapToApiModel(user: User) {
        return {
            name: user.name,
            email: user.email,
            phone: user.phone.substr(2, 10),
            address: user.address,
            lat: user.lat,
            lng: user.lng
        }
    }

    mapFromApiModel(user: any) {
        return new User(
            user.name,
            user.email,
            '+7' + (user.phone == undefined ? '' : user.phone),
            user.address,
            user.lat,
            user.lng
        );
    }
}