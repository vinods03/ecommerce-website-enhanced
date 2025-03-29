import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}
  ngOnInit(): void {
    // if user is null, isAuthenticated is false, else true
    this.authService.user.subscribe((data) => {
      this.isAuthenticated = !data ? false : true;
    });
  }

  signOut() {
    this.authService.signOut();
    this.router.navigate(['/']);
  }
}
