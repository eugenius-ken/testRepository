import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {

    getToken(): string {
        return window.localStorage['jwtToken'];
    }

    saveAuthData(data: any) {
        let timeToRefresh = new Date();
        timeToRefresh.setHours(timeToRefresh.getHours() + (data.expires_in / 3600 - 1));
        window.localStorage['jwtToken'] = data.access_token;
        window.localStorage['refreshToken'] = data.refresh_token;
        window.localStorage['timeToRefresh'] = timeToRefresh.getTime();
    }

    getTimeToRefresh(): Date {
        return window.localStorage['timeToRefresh'] ? new Date(parseInt(window.localStorage['timeToRefresh'])) : undefined;
    }

    getRefreshToken(): string {
        return window.localStorage['refreshToken'];
    }

    destroyAuthData() {
        window.localStorage.removeItem('jwtToken');
        window.localStorage.removeItem('refreshToken');
        window.localStorage.removeItem('timeToRefresh');
    }

}