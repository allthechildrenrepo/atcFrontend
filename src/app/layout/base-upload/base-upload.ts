import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { LeadUpdateService } from '../../shared/services/leads';
import { BasePage } from "../../utils";

@Component({
  selector: "app-base-upload",
  templateUrl: "./base-upload.html",
  styleUrls: ["./base-upload.scss"]
})
export class BaseUploadComponent extends BasePage implements AfterViewInit {

  @ViewChild('file', { static: false }) file;
  public fileToUpload: File = null;
  // TO display mat progressbar during upload
  fileUploading = false;
  public alerts: Array<any> = [];

  constructor(
    public leadUpdateService: LeadUpdateService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    super(dialog, snackBar);
  }

  ngAfterViewInit() {
    this.file.nativeElement.value = null;
    this.fileToUpload = null;
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  /**
   * Rest the file by removing the file input element value
   */
  resetFile() {
    this.file.nativeElement.value = null;
    this.fileUploading = false;
  }

  /**
   * Check the files type is csv or not
   * If csv file then ready to upload
   * if not a csv file throw error notification
   */
  onFilesAdded() {
    this.alerts = [];
    const files: { [key: string]: File } = this.file.nativeElement.files;
    if (files[0].size / (1000 * 1000) > 15) {
      this.alerts.push({
        id: 1,
        type: "danger",
        message: `File not uploaded. File size must be less than 15 MB.`
      });
      return
    }
    this.fileToUpload = files[0];
  }

  /**removes the files after it added */
  removeFile() {
    this.fileToUpload = null;
    this.file.nativeElement.value = null;
  }
  /**
   * uploads the file to server
   * and response Generic server response
   */
  uploadFileToServer() {
    this.fileUploading = true;
    const param = this.leadUpdateService.getParams(this.fileToUpload);
    this.leadUpdateService.postMultiPardData(param).subscribe(
      res => {
        if (res.status) {
          this.showNotification(
            "bottom",
            "center",
            "success",
            "info-circle",
            this.fileToUpload.name + " Uploaded Successfully"
          );
          this.fileToUpload = null;
        } else {
          this.showNotification(
            "bottom",
            "center",
            "danger",
            "info-circle",
            this.fileToUpload.name + " not Uploaded, please check the file"
          );
        }
        this.resetFile();
      },
      err => {
        this.somethingWentWrong();
        this.resetFile();
      }
    );
  }
}
