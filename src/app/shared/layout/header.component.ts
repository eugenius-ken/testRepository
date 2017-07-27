import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { UserService } from '../services/user.service';

@Component({
    selector: 'layout-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    activeRoute: string = '';
    isProfile: boolean = false;

    constructor(
        private router: Router,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.isProfile = this.router.url.indexOf('profile') != -1;
        this.activeRoute = this.getChildPath(this.router.url);

        this.router.events.subscribe(event => {
            if(event instanceof NavigationEnd){
                this.isProfile = this.router.url.indexOf('profile') != -1;
                this.activeRoute = this.getChildPath(event.url);
            }
        });
    }

    logout() {
        this.userService.logout();
        window.location.href = '/';
    }

    private getChildPath(path: string) {
        let i = path.lastIndexOf('/');
        if(i == -1) return '';

        return path.substr(i + 1, path.length - 1);
    }
}