import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

import { LoginServiceService } from "../shared/services";
import { Router } from "@angular/router";
import { routerTransition } from "../router.animations";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
  userName: any;
  password: any;
  showPassword: false;
  alerts = [];
  mockUser = {
    "firstname": "Johnson",
    "lastname": "Chelliah",
    "email": "john@gmail.com",
    "token": "59ae80b528812458ab7d85885c993f36f2e90f56",
    "groups": [
        {
            "id": 1,
            "name": "Donation Verifier",
            "permissions": []
        },
        {
            "id": 2,
            "name": "Telecaller",
            "permissions": []
        },
        {
            "id": 3,
            "name": "Trust Manager",
            "permissions": []
        },
        {
            "id": 4,
            "name": "Donar",
            "permissions": []
        }
    ],
    "branch": {
        "id": 4,
        "branch_name": "vyasarpadi trust",
        "phone": "9003974931",
        "updated_at": "2019-12-24T05:16:15.487747Z",
        "created_at": "2019-12-24T05:15:13Z"
    }
}
  constructor(
    public router: Router,
    public loginService: LoginServiceService
  ) {}

  ngOnInit() {
   
  }

  onLoggedin() {
    this.alerts = [];
    // localStorage.setItem("user", JSON.stringify(this.mockUser));
    // localStorage.setItem("user", JSON.stringify({'username':'naveen', 'password':'naveen24'}));
   
    if (!this.userName || !this.password) {
      this.showMessage("Please enter a valid username and password");
      return;
    }
    const params = this.loginService.getParams(this.userName, this.password);
    this.loginService.post(params).subscribe(
      data => {
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", JSON.stringify(this.userName));

        this.router.navigate(["/user-profile"]);
      },
      err => {
        this.showMessage("Invalid Username/Password");
      }
    );
  }

  public showMessage(message) {
    this.alerts.push({
      id: 1,
      type: "danger",
      message: message
    });
  }

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }
}
