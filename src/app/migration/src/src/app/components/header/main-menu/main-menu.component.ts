import { ResourceService } from './../../../services/resource/resource.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
  }

}
