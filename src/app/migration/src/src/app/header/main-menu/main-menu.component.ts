import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../services/resource/resource.service';

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
