import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

interface Language {
  code: string;
  name: string;
  native: string;
  flag: string;
}

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
  imports: [CommonModule, IonContent, IonIcon, TranslatePipe],
})
export class LanguagePage implements OnInit {
  selectedLang = 'en';

  languages: Language[] = [
    { code: 'en', name: 'English (US)', native: 'English',    flag: 'assets/images/flags/gb.svg' },
    { code: 'fr', name: 'French',       native: 'Français',   flag: 'assets/images/flags/fr.svg' },
    { code: 'es', name: 'Spanish',      native: 'Español',    flag: 'assets/images/flags/es.svg' },
    { code: 'zh', name: 'Chinese',      native: '中文',        flag: 'assets/images/flags/cn.svg' },
    { code: 'ar', name: 'Arabic',       native: 'العربية',    flag: 'assets/images/flags/ae.svg' },
    { code: 'nl', name: 'Dutch',        native: 'Nederlands', flag: 'assets/images/flags/nl.svg' },
  ];

  constructor(
    private router: Router,
    public translationService: TranslationService,
  ) {
    addIcons({ arrowBackOutline, checkmarkCircleOutline });
  }

  ngOnInit(): void {
    this.selectedLang = this.translationService.currentLang;
  }

  select(code: string): void {
    this.selectedLang = code;
  }

  confirm(): void {
    this.translationService.setLanguage(this.selectedLang);
    this.router.navigate(['/tabs/profile']);
  }

  goBack(): void {
    this.router.navigate(['/tabs/profile']);
  }
}
