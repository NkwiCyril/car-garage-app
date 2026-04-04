import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  locationOutline,
  chevronDownOutline,
  searchOutline,
  optionsOutline,
  carOutline,
  carSportOutline,
  keyOutline,
  bagHandleOutline,
  constructOutline,
  notificationsOutline,
  timeOutline,
  cardOutline,
  helpCircleOutline,
  settingsOutline,
  personOutline,
  arrowForwardOutline,
  star,
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [CommonModule, IonContent, IonIcon],
})
export class DashboardPage implements OnInit {
  userName = '';
  currentLocation = 'Yaoundé, Cameroon';

  categories = [
    { icon: 'key-outline', label: 'Rent', route: '/tabs/auto' },
    { icon: 'bag-handle-outline', label: 'Buy', route: '/tabs/auto' },
    { icon: 'car-outline', label: 'Park', route: '/cars/park' },
    { icon: 'person-outline', label: 'My Cars', route: '/cars/my' },
  ];

  featuredServices = [
    {
      icon: 'car-outline',
      iconClass: 'icon-parking',
      title: 'Parking Spots',
      description: 'Secure, scheduled parking with eco-friendly solutions.',
      meta: 'Available Now',
      metaClass: 'meta-success',
      buttonText: 'Book Now',
      route: '/tabs/auto',
    },
    {
      icon: 'construct-outline',
      iconClass: 'icon-auto',
      title: 'Auto Solutions',
      description: 'Professional maintenance and rapid roadside assistance.',
      meta: '24/7 Support',
      metaClass: 'meta-info',
      buttonText: 'Explore',
      route: '/tabs/auto',
    },
  ];

  quickActions = [
    { icon: 'time-outline', label: 'History', route: '/tabs/bookings' },
    { icon: 'card-outline', label: 'Billing', route: '/tabs/profile' },
    { icon: 'help-circle-outline', label: 'Support', route: '/tabs/profile' },
    { icon: 'settings-outline', label: 'Settings', route: '/tabs/profile' },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    addIcons({
      locationOutline,
      chevronDownOutline,
      searchOutline,
      optionsOutline,
      carOutline,
      carSportOutline,
      keyOutline,
      bagHandleOutline,
      constructOutline,
      notificationsOutline,
      timeOutline,
      cardOutline,
      helpCircleOutline,
      settingsOutline,
      personOutline,
      arrowForwardOutline,
      star,
    });
  }

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.userName = user.name?.split(' ')[0] || 'Driver';
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  onSearchFocus(): void {
    // TODO: navigate to search page
  }

  viewAllServices(): void {
    this.navigateTo('/tabs/auto');
  }

  openNotifications(): void {
    // TODO: open notifications
  }
}
