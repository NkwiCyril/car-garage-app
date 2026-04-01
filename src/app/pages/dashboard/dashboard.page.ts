import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  locationOutline,
  chevronDown,
  optionsOutline,
  carOutline,
  keyOutline,
  bagHandleOutline,
  pricetagOutline,
  arrowForwardCircle,
  notificationsOutline,
  star,
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
  ],
})
export class DashboardPage implements OnInit {
  userName: string = '';
  userAvatar: string = '';
  currentLocation: string = 'Yaound\u00e9, Cameroon';

  featuredServices = [
    {
      icon: 'car-outline',
      iconClass: 'icon-parking',
      title: 'Parking Spots',
      description: 'Scheduled parking and eco-friendly solutions for a cleaner city.',
      meta: 'Next: Available Now',
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
    {
      icon: 'time-outline',
      label: 'HISTORY',
      route: '/tabs/bookings',
    },
    {
      icon: 'card-outline',
      label: 'BILLING',
      route: '/tabs/profile',
    },
    {
      icon: 'help-circle-outline',
      label: 'SUPPORT',
      route: '/tabs/profile',
    },
    {
      icon: 'settings-outline',
      label: 'SETTINGS',
      route: '/tabs/profile',
    },
  ];

  nearbyParking = [
    {
      name: 'Central Market Parking',
      distance: '0.5km away',
      area: 'Bastos Area',
      price: 500,
      currency: 'CFA',
      unit: 'hr',
      status: 'Open',
      rating: 4.5,
      image: 'assets/images/parking-placeholder-1.svg',
    },
    {
      name: 'Mvan Complex Parking',
      distance: '2.1km away',
      area: 'Mvan',
      price: 300,
      currency: 'CFA',
      unit: 'hr',
      status: 'Open',
      rating: 4.2,
      image: 'assets/images/parking-placeholder-2.svg',
    },
    {
      name: 'Hilton Hotel Parking',
      distance: '3.0km away',
      area: 'Centre',
      price: 750,
      currency: 'CFA',
      unit: 'hr',
      status: 'Open',
      rating: 4.8,
      image: 'assets/images/parking-placeholder-3.svg',
    },
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    addIcons({
      locationOutline,
      chevronDown,
      optionsOutline,
      carOutline,
      keyOutline,
      bagHandleOutline,
      pricetagOutline,
      arrowForwardCircle,
      notificationsOutline,
      star,
    });
  }

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.userName = user.name?.split(' ')[0] || 'User';
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  onSearchFocus(): void {
    // TODO: Navigate to search page
  }

  viewAllServices(): void {
    this.navigateTo('/tabs/auto');
  }

  viewAllParking(): void {
    this.navigateTo('/tabs/auto');
  }

  openNotifications(): void {
    // TODO: Navigate to notifications
  }
}
