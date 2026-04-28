import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, ViewWillEnter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  shieldCheckmarkOutline,
  shieldOutline,
  checkmarkCircle,
  checkmarkCircleOutline,
  lockClosedOutline,
  documentTextOutline,
  flashOutline,
  heartOutline,
  sunnyOutline,
  eyeOffOutline,
  scanOutline,
  hourglassOutline,
  cameraOutline,
  arrowForwardOutline,
  notificationsOutline,
  closeCircleOutline,
} from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';

interface Privilege {
  icon: string;
  color: string;
  title: string;
  desc: string;
}

interface VerificationDoc {
  name: string;
  filename: string;
}

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
  imports: [CommonModule, IonContent, IonIcon],
})
export class VerificationPage implements OnInit, ViewWillEnter {
  @ViewChild('frontInput') frontInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('backInput') backInputRef!: ElementRef<HTMLInputElement>;

  isVerified = false;
  step = 0;

  frontIdUploaded = false;
  backIdUploaded = false;
  frontIdFile: File | null = null;
  backIdFile: File | null = null;
  frontIdPreview: string | null = null;
  backIdPreview: string | null = null;

  // Verified-state mock data
  readonly verifiedDate = 'October 24, 2023';
  readonly verificationId = 'CM-7782-PX';
  readonly documents: VerificationDoc[] = [
    { name: 'National ID Card', filename: 'ID_CARD_CAN_9901.jpg' },
    { name: 'Driving License',  filename: 'LIC_FRONT_2024.png'   },
  ];

  // Not-verified-state privileges
  readonly privileges: Privilege[] = [
    {
      icon: 'shield-checkmark-outline',
      color: 'blue',
      title: 'Access premium listings',
      desc: 'Gain priority access to limited edition vehicles and luxury estates.',
    },
    {
      icon: 'flash-outline',
      color: 'accent',
      title: 'Secure instant bookings',
      desc: 'Skip the wait with pre-approved booking status on all listings.',
    },
    {
      icon: 'heart-outline',
      color: 'rose',
      title: 'Build trust with sellers',
      desc: 'A verified profile increases response rates from high-end sellers by 85%.',
    },
  ];

  get stepTitle(): string {
    const titles: Record<number, string> = {
      1: 'National ID<br/>Upload',
      2: 'Verification<br/>Pending',
    };
    return titles[this.step] ?? '';
  }

  get stepPercent(): number {
    const pcts: Record<number, number> = { 1: 50, 2: 100 };
    return pcts[this.step] ?? 0;
  }

  constructor(private router: Router, private authService: AuthService) {
    addIcons({
      arrowBackOutline,
      shieldCheckmarkOutline,
      shieldOutline,
      checkmarkCircle,
      checkmarkCircleOutline,
      lockClosedOutline,
      documentTextOutline,
      flashOutline,
      heartOutline,
      sunnyOutline,
      eyeOffOutline,
      scanOutline,
      hourglassOutline,
      cameraOutline,
      arrowForwardOutline,
      notificationsOutline,
      closeCircleOutline,
    });
  }

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    // this.isVerified = !!((this.authService.currentUser as any)?.isVerified);
  }

  goBack(): void {
    if (this.step > 1) {
      this.step--;
    } else if (this.step === 1) {
      this.step = 0;
    } else {
      this.router.navigate(['/tabs/profile']);
    }
  }

  startVerification(): void {
    this.step = 1;
  }

  nextStep(): void {
    if (this.step < 2) this.step++;
  }

  finishVerification(): void {
    this.router.navigate(['/tabs/profile']);
  }

  triggerFrontUpload(): void {
    this.frontInputRef.nativeElement.click();
  }

  triggerBackUpload(): void {
    this.backInputRef.nativeElement.click();
  }

  onFrontFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.frontIdFile = file;
    this.frontIdUploaded = true;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.frontIdPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  onBackFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.backIdFile = file;
    this.backIdUploaded = true;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.backIdPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  clearFront(): void {
    this.frontIdFile = null;
    this.frontIdUploaded = false;
    this.frontIdPreview = null;
    if (this.frontInputRef) this.frontInputRef.nativeElement.value = '';
  }

  clearBack(): void {
    this.backIdFile = null;
    this.backIdUploaded = false;
    this.backIdPreview = null;
    if (this.backInputRef) this.backInputRef.nativeElement.value = '';
  }
}
