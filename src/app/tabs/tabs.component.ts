import { Component, OnInit, ViewChild } from '@angular/core';

import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ITab } from '../view-models/ITab';
import { DataService } from '../service/data.service';
import { RouterLink, Router } from '@angular/router';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {

  closableTabs: ITab[] = [];
  admin: boolean;

  @ViewChild('tabs')
  tabset: NgbTabset;

  constructor(private dataService: DataService, private router: Router) {
    
  }

  ngOnInit() {
    this.admin = this.dataService.user.admin;
    if (this.admin) ++this.pos;
  }

  private pos = 4;
  closeTab(tab: ITab, $event) {
    $event.preventDefault();
    let idx = this.closableTabs.indexOf(this.closableTabs.find(t => t.id === tab.id));
    let deletedTab = this.closableTabs.splice(idx, 1);
  }
  
  createUniqueTab(newTab: ITab) {
    let tab = this.closableTabs.find( tab => tab.id === newTab.id);
    if (!tab) {
      tab = newTab;
      tab.position = ( ++this.pos  ).toString();
      this.closableTabs.push(tab);
    }
    this.tabset.activeId = "ngb-tab-" + tab.position;
  }
}
