import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SupportService } from '../../../shared/services/support.service';
import { UserService } from '../../../shared/services/user.service';
import { Message } from '../../../shared/models/support-message.model';
import { User } from '../../../shared/models/user.model';

@Component({
    selector: 'support',
    templateUrl: './support.component.html',
    styleUrls: ['../../lk.component.css']
})
export class SupportComponent implements OnInit {

    messages: Message[];
    isSending: boolean = false;
    currentMessage: string;
    myEmail: string;
    isExistMore: boolean = false;

    private offset: number = 0;
    private readonly limit: number = 30;

    @ViewChild('container')
    container: any;

    constructor(
        private supportService: SupportService,
        private userService: UserService
    ) { }

    ngOnInit() {
        Observable.zip(
            this.supportService.getMessages(),
            this.userService.getCurrentUser(),
            (messages, user, isExistMore) => {
                this.messages = messages;
                this.myEmail = user.email;

                this.offset += this.limit;
                this.checkMoreMessages();
                this.scrollMesagesToBottom();
            }
        ).subscribe();
    }

    keyPress(e) {
        if (e.ctrlKey && e.keyCode == 10) {
            this.send(this.currentMessage);
        }
    }

    send(text: string) {
        if (text.trim()) {
            this.isSending = true;
            this.supportService.send(text)
                .subscribe(message => {
                    this.messages.push(message);
                    this.isSending = false;
                    this.currentMessage = '';

                    this.scrollMesagesToBottom();
                });
        }
    }

    getMore() {
        this.supportService.getMessages(this.limit, this.offset)
            .subscribe(messages => {
                this.messages = messages.concat(this.messages);
                this.offset += this.limit;
                this.checkMoreMessages();
            });
    }

    private checkMoreMessages() {
        this.supportService.checkMoreMessages(this.limit, this.offset)
            .subscribe(isExistMore => {
                this.isExistMore = isExistMore;
            });
    }

    private scrollMesagesToBottom() {
        setTimeout(() => {
            (this.container.nativeElement as HTMLElement).scrollTop = (this.container.nativeElement as HTMLElement).scrollHeight;
        }, 100);
    }
}