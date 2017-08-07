import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models/user.model';
import { Time } from '../models/time.model';

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
        return this.apiService.post('/company/register', data)
            .catch(error => {
                return Observable.throw(JSON.parse(error._body));
            });
    }

    attemptAuth(credentials): Observable<any> {
        return this.apiService.post('/oauth/login', credentials)
            .map(
            data => {
                this.jwtService.saveAuthData(data);
                this.setTimerToRefreshToken();
                return data;
            })
            .catch(error => {
                return Observable.throw(JSON.parse(error._body));
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

    changePassword(oldPassword: string, newPassword: string) {
        return this.apiService.post('/user/password', { prev_password: oldPassword, password: newPassword })
            .map(data => {
                return data;
            })
            .catch(error => {
                return Observable.throw(JSON.parse(error._body));
            });
    }

    changeEmail(newEmail: string) {
        return this.apiService.post('/user/email', {email: newEmail})
        .catch(error => {
            return Observable.throw(JSON.parse(error._body));
        });
    }

    mapToApiModel(user: User) {
        return {
            name: user.name,
            email: user.email,
            phone: user.phone.substr(2, 10),
            address: user.address,
            lat: user.lat,
            lng: user.lng,
            start_time: user.dayAndNight ? '00:00' : Time.ToString(user.start),
            end_time: user.dayAndNight ? '24:00' : Time.ToString(user.end)
        }
    }

    mapFromApiModel(user: any) {
        return new User(
            user.name,
            user.email,
            '+7' + (user.phone == undefined ? '' : user.phone),
            user.address,
            user.lat,
            user.lng,
            user.start_time ? Time.TryParse(user.start_time) : new Time(0, 0),
            user.end_time ? Time.TryParse(user.end_time) : new Time(24, 0)
        );
    }
}