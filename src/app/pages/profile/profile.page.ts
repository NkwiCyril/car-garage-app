import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  cardOutline,
  carOutline,
  settingsOutline,
  helpCircleOutline,
  shieldCheckmarkOutline,
  logOutOutline,
  chevronForward,
  createOutline,
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
  ],
})
export class ProfilePage implements OnInit {
  userName: string = '';
  userPhone: string = '';

  menuItems = [
    {
      icon: 'person-outline',
      label: 'Personal Information',
      subtitle: 'Name, phone, email',
      route: null,
    },
    {
      icon: 'card-outline',
      label: 'Payment Methods',
      subtitle: 'Cards, mobile money',
      route: null,
    },
    {
      icon: 'car-outline',
      label: 'My Vehicles',
      subtitle: 'Registered cars',
      route: null,
    },
    {
      icon: 'shield-checkmark-outline',
      label: 'Privacy & Security',
      subtitle: 'Password, 2FA',
      route: null,
    },
    {
      icon: 'settings-outline',
      label: 'Settings',
      subtitle: 'Notifications, language',
      route: null,
    },
    {
      icon: 'help-circle-outline',
      label: 'Help & Support',
      subtitle: 'FAQ, contact us',
      route: null,
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({
      personOutline,
      cardOutline,
      carOutline,
      settingsOutline,
      helpCircleOutline,
      shieldCheckmarkOutline,
      logOutOutline,
      chevronForward,
      createOutline,
    });
  }

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.userName = user.name || 'User';
      this.userPhone = user.phone || '';
    }
  }

  async confirmLogout(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Logout',
          role: 'confirm',
          cssClass: 'alert-logout-btn',
          handler: () => {
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  onMenuItemClick(item: any): void {
    // TODO: Navigate to respective settings pages
  }
}
