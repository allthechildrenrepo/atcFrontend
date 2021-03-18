import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public onlineEvent: Observable<Event>;
    public offlineEvent: Observable<Event>;
    public subscriptions: Subscription[] = [];
    public connectionStatusMessage: string;
    public connected: boolean;

    constructor() {
    }

    ngOnInit() {

        this.onlineEvent = fromEvent(window, 'online');
        this.offlineEvent = fromEvent(window, 'offline');
        this.subscriptions.push(this.onlineEvent.subscribe(event => {
            this.connectionStatusMessage = 'Connected to internet! You are online now. Page will be refreshed in 3 seconds';
            this.connected = true;
            setTimeout(function () {
                location.reload()
            }, 2000);
        }));
        this.subscriptions.push(this.offlineEvent.subscribe(e => {
            this.connectionStatusMessage = 'Connection lost! You are offline, Please check your internet connection';
            this.connected = false;
        }));

    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

}
