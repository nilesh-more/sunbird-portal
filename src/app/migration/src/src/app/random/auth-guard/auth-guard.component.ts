import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth-guard',
  templateUrl: './auth-guard.component.html',
  styleUrls: ['./auth-guard.component.css']
})
export class AuthGuardComponent implements OnInit {
  profile: any;
    constructor(private route: ActivatedRoute) {
    }
    ngOnInit() {
      this.profile = this.route.snapshot.data['profile'];
    }
}

