import { Component, Output, EventEmitter, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { TelecallerFetchService } from "../../../shared/services/telecaller.service";
import { AtcUser } from "src/app/shared/model";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  isActive: boolean;
  collapsed: boolean;
  showMenu: string;
  pushRightClass: string;
  mockGroups;

  @Output() collapsedEvent = new EventEmitter<boolean>();

  constructor(
    private translate: TranslateService,
    public telecallerService: TelecallerFetchService,
    public router: Router
  ) {
    this.router.events.subscribe(val => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });
  }

  ngOnInit() {
    this.isActive = false;
    this.collapsed = false;
    this.showMenu = "";
    this.pushRightClass = "push-right";
    let username = JSON.parse(localStorage.getItem("username"));
    let params = this.telecallerService.getUserName(username);

    this.telecallerService.get(params).subscribe(
      res => {
        const user = new AtcUser().deserialize(res.results[0]);
        this.mockGroups = user.group;
      }
    );
  }

  eventCalled() {
    this.isActive = !this.isActive;
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = "0";
    } else {
      this.showMenu = element;
    }
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.collapsedEvent.emit(this.collapsed);
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector("body");
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector("body");
    dom.classList.toggle(this.pushRightClass);
  }

  rltAndLtr() {
    const dom: any = document.querySelector("body");
    dom.classList.toggle("rtl");
  }

  changeLang(language: string) {
    this.translate.use(language);
  }

  onLoggedout() {
    localStorage.removeItem("user");
  }

  get isTrustManager() {
    return this.mockGroups
      ? this.mockGroups.find(group => group.name === "Trust Manager")
      : false;
  }

  get isDonationVerifier() {
    return this.mockGroups
      ? this.mockGroups.find(group => group.name === "Donation Verifier")
      : false;
  }

  isAccessible(sidebbar) {
    if (this.mockGroups) {
      if (this.mockGroups.find(group => group.name === "ALL")) return true;
      return this.mockGroups.find(group => group.name === sidebbar);
    }
    return false;
  }
}
