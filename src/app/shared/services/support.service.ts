import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { URLSearchParams } from '@angular/http';

import { ApiService } from './api.service';
import { Message } from '../models/support-message.model';

@Injectable()
export class SupportService {
    private readonly path: string = '/support';

    constructor(
        private apiService: ApiService
    ) { }

    getMessages(limit: number = 30, offset: number = 0): Observable<Message[]> {
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        params.append('offset', offset.toString());

        return this.apiService.get(this.path, params)
            .map(data => {
                const result = (data.result as any[]).map(b => {
                    return this.mapFromApiModel(b);
                });

                return result.sort((message1, message2) => {
                    if(message1.time < message2.time) {
                        return -1;
                    }
                    else if (message1.time > message2.time) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
            });
    }

    send(text: string): Observable<Message> {
        return this.apiService.post(this.path, {text: text})
        .map(data => {
            return this.mapFromApiModel(data.result);
        });
    }

    checkMoreMessages(limit: number, offset: number): Observable<boolean> {
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        params.append('offset', offset.toString());

        return this.apiService.get(this.path, params)
        .map(data => {
            return data.result.length > 0;
        });
    }

    private mapFromApiModel(message: any): Message {
        return new Message(
            message.text,
            new Date(message.ts),
            message.username
        );
    }

    
}