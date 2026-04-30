import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  home,
  storefrontOutline,
  storefront,
  calendarOutline,
  calendar,
  personOutline,
  person,
} from 'ionicons/icons';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  imports: [
    CommonModule,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    TranslatePipe,
  ],
})
export class TabsPage {
  constructor(public translationService: TranslationService) {
    addIcons({
      homeOutline,
      home,
      storefrontOutline,
      storefront,
      calendarOutline,
      calendar,
      personOutline,
      person,
    });
  }
}
