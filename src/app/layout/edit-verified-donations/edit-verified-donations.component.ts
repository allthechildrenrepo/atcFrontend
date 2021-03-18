import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-verified-donations',
  templateUrl: './edit-verified-donations.component.html',
  styleUrls: ['./edit-verified-donations.component.scss']
})
export class EditVerifiedDonationsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  get columnsToDisplay() {
    return [
      "name",
      "number",
      "mode",
      "transactionId",
      "amount",
      // "verifiedBy",
      "telecallerId",
      "voiceCallingName",
      "telecallerName",
      "donatedDate",
      "generateReceipt",
      "edit",
      "details",
    ];
  }

}
