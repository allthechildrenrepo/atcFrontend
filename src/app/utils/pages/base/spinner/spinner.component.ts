import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

/**
 * @title Basic progress-spinner
 */
@Component({
  selector: 'spinner',
  templateUrl: 'spinner.component.html',
  styleUrls: ['spinner.component.scss'],
})
export class SpinnerComponent {

    constructor(
        public dialogRef: MatDialogRef<SpinnerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
      ){
          
      }
}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */