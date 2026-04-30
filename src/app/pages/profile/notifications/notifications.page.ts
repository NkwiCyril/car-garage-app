import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, notificationsOutline } from 'ionicons/icons';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  imports: [CommonModule, IonContent, IonIcon, TranslatePipe],
})
export class NotificationsPage implements OnInit {
  notificationsEnabled = true;

  constructor(
    private router: Router,
    public translationService: TranslationService,
  ) {
    addIcons({ arrowBackOutline, notificationsOutline });
  }

  ngOnInit(): void {
    const saved = localStorage.getItem('notifications_enabled');
    this.notificationsEnabled = saved !== 'false';
  }

  toggle(): void {
    this.notificationsEnabled = !this.notificationsEnabled;
    localStorage.setItem('notifications_enabled', String(this.notificationsEnabled));
  }

  goBack(): void {
    this.router.navigate(['/tabs/profile']);
  }
}
