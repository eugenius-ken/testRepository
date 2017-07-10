import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { UserService } from '../services/user.service';

@Component({
    selector: 'layout-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    private activeRoute: string = '';

    constructor(
        private router: Router,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.activeRoute = this.getChildPath(this.router.url);
        this.router.events.subscribe(event => {
            if(event instanceof NavigationEnd){
                this.activeRoute = this.getChildPath(event.url);
            }
        });
    }

    logout() {
        this.userService.logout();
        this.router.navigateByUrl('/');
    }

    private getChildPath(path: string) {
        let i = path.lastIndexOf('/');
        if(i == -1) return '';

        return path.substr(i + 1, path.length - 1);
    }
}