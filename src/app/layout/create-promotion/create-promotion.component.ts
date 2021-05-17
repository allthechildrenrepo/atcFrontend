import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WassanggerDevice, User } from '../../shared/model';
import { FetchWassanggerFiles } from '../../shared/services';
import { WassangerFile } from '../../shared/model/wassangger-file';
import { BasePage } from '../../utils';
import { MatSnackBar } from '@angular/material';
import { PromotionService } from '../../shared/services/promotion.service';
import { Branch } from '../../shared/model/branch';

@Component({
  selector: 'app-create-promotion',
  templateUrl: './create-promotion.component.html',
  styleUrls: ['./create-promotion.component.scss']
})
export class CreatePromotionComponent extends BasePage implements OnInit {

  @ViewChild("image1", { static: false }) image1Ref: any;
  @ViewChild("image2", { static: false }) image2Ref: any;
  @ViewChild("image3", { static: false }) image3Ref: any;

  images = { image1: null, image2: null, image3: null };
  previewUrl = { image1: null, image2: null, image3: null };
  preview = { image1: true, image2: true, image3: true };
  fileSize = { image1: 0, image2: 0, image3: 0 };

  promotionForm: FormGroup;
  selectedDevice: WassanggerDevice;
  filesAdded: WassangerFile[] = [];
  textMessage: string = null;
  name: string = null; 

  numberFiles: File = null;
  @ViewChild('file', { static: false }) file;
  fileUploading = false;
  cronTime: Date;
  cronTimeNotSelected: boolean = true;
  user: User;
  branch: Branch;

  images1;
  images2;
  images3;
  imagesFileSize = [];
  uploadedVideo;

  files: string[];

  constructor(
    public dialogRef: MatDialogRef<CreatePromotionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fetchWassanggerFiles: FetchWassanggerFiles,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public promotionService: PromotionService
  ) {
    super(dialog, snackBar)
    this.selectedDevice = data.selectedDevice;
    this.branch = data.branch;
  }

  ngOnInit() {
    this.user = new User().deSerialize(JSON.parse(localStorage.getItem('user')));
    this.promotionForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      textMessage: new FormControl("")
    })
  }

  selectCronTime() {
    if (this.cronTime) {
      if (this.cronTime > new Date())
        this.cronTimeNotSelected = false;
      else
        this.showNotification("bottom", "center", "failure", "", "Please select the future date")
    }
  }

  changeCronTime() {
    this.cronTimeNotSelected = true;
    this.cronTime = null;
  }

  ngAfterViewInit() {
    if (this.file)
      this.file.nativeElement.value = null;
    this.numberFiles = null;
  }

  addCSVFiles() {
    this.file.nativeElement.click();
  }

  removeFile() {
    this.file.nativeElement.value = null;
    this.fileUploading = false;
    this.numberFiles = null;
  }

  /**
   * Check the files type is csv or not
   * If csv file then ready to upload
   * if not a csv file throw error notification
   */
  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    if (files[0].size / (1000 * 1000) > 15) {
      this.showNotification("bottom", "center", "failure", "", `File not uploaded. File size must be less than 15 MB.`
      );
      return
    }
    this.numberFiles = files[0];
  }

  uploadScreenshot(event, image) {
    this.fileSize[image] = Math.round(event.target.files[0].size / 1024);
    if (event.target.files.length > 0 && this.fileSize[image] <= 500) {
      this.images[image] = event.target.files[0];
    }
    if (image == 'image1')
      this.image1Ref.nativeElement.value = "";
    else if (image == 'image2')
      this.image2Ref.nativeElement.value = "";
    else
      this.image3Ref.nativeElement.value = "";
  }

  AddFile(AddFile) {
    this.presentLoader();
    if (!AddFile) {
      this.dismissLoader();
      return;
    }
    this.fetchWassanggerFiles.get({ search: AddFile, branch_id: this.branch.branch_id }).subscribe((res) => {
      res.results.forEach(element => {
        let file = new WassangerFile().deserializer(element);
        if (!this.filesAdded.find((eme) => eme.id == file.id))
          this.filesAdded.push(file)
        else
          this.showNotification("bottom", "center", "success", "", "File Already added")
      });
      this.dismissLoader();
    })
  }

  viewFile(file: WassangerFile) {

  }

  deleteFile(file: WassangerFile) {
    let index = this.filesAdded.indexOf(file);
    this.filesAdded.splice(index, 1)
  }

  createPromotion() {
    this.presentLoader();
    if (!this.numberFiles) {
      this.showNotification("bottom", "center", "failure", "", "Please add sent to file");
      this.dismissLoader();
      return;
    }

    if (!this.cronTime) {
      this.dismissLoader();
      this.showNotification("botton", "center", "failure", "", "Please select schedule time ");
      return;
    }

    if (!this.textMessage) {
      this.dismissLoader();
      this.showNotification("botton", "center", "failure", "", "Please enter  Promotion Message")
      return;
    }

    if (this.textMessage.length > 250) {
      this.dismissLoader();
      this.showNotification("botton", "center", "failure", "", "Promotion Message Should not be above 250 letters")
      return;
    }

    let params = new FormData();
    params.append("consumer_file", this.numberFiles, this.numberFiles.name);
    params.append("message", this.textMessage);
    params.append("device_id", this.selectedDevice.id);
    params.append("name", this.name);
    params.append("created_by", this.user.userid.toString());
    params.append("branch_id", this.branch.branch_id.toString());
    let files: any[] = [];
    if (this.filesAdded.length > 0) {
      this.filesAdded.forEach((file) => files.push(file.id.toString()))
    }
    params.append("files", JSON.stringify(files));
    params.append("cron_time", this.formatDate(this.cronTime))
    this.promotionService.postMultiPardData(params).subscribe((res) => {
      if(res.status) {
        this.dismissLoader();
        this.showNotification("bottom","center","success","",res.message);
        this.dialogRef.close(true);
        return;
      }
      this.showNotification("bottom","center","failure","",res.message);
      this.dismissLoader();
      return;
    })
  }

  formatDate(date: Date) {
    var today = date;
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
// %Y-%m-%d %H:%M:%S
    return yyyy+"-"+mm+"-"+dd+" "+hours+":"+min+":"+sec;
  }


}
