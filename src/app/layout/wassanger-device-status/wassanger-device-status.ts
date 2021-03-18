import { BasePage } from '../../utils';
import { OnInit, Component, Input } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { WassanggerDevice } from '../../shared/model';
import { FetchWassanggerDevice } from '../../shared/services';

@Component({
    selector: "wassanger-device-status",
    templateUrl: "./wassanger-device-status.html",
    styleUrls: ["./wassanger-device-status.scss"]
})
export class WassangerDeviceStatusComponent extends BasePage implements OnInit {
    @Input()
    device: WassanggerDevice;
    refreshing: boolean = false;

    constructor(public dialog: MatDialog, public snackBar: MatSnackBar,
        public fetchWassanggerDevice: FetchWassanggerDevice) {
        super(dialog, snackBar)
    }
    ngOnInit() {
    }

    refresh() {
        this.refreshing = true;
        this.fetchWassanggerDevice.get().subscribe((data) => {
            let allDevices: WassanggerDevice[] = [];
            data.results.forEach(device => {
                allDevices.push(new WassanggerDevice().deserializer(device));
            });
            this.device = allDevices.find((device) => device.id == this.device.id);
            this.refreshing = false;
        })
    }
}