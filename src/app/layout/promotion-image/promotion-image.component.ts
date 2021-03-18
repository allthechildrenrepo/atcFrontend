import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { PromotionImageService } from 'src/app/shared/services';

@Component({
  selector: 'app-promotion-image',
  templateUrl: './promotion-image.component.html',
  styleUrls: ['./promotion-image.component.scss']
})
export class PromotionImageComponent implements OnInit {

  imageSrc;

  constructor(
    public promotionImageService: PromotionImageService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // this.promotionImageService.
    this.promotionImageService.get().subscribe(
      data => {
        this.imageSrc = data;
      }
    )
  }

}
