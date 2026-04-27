import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, ToastController, ViewWillEnter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, checkmarkOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';

interface PersonalInfoForm {
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
}

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.page.html',
  styleUrls: ['./personal-info.page.scss'],
  imports: [CommonModule, FormsModule, IonContent, IonIcon],
})
export class PersonalInfoPage implements OnInit, ViewWillEnter {
  isSaving = false;

  form: PersonalInfoForm = {
    name: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
  ) {
    addIcons({ arrowBackOutline, checkmarkOutline });
  }

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.form.name    = user.name  || '';
      this.form.phone   = (user as any).phone || '';
      this.form.email   = (user as any).email || '';
      this.form.dob     = (user as any).dob || '';
      this.form.address = (user as any).address || '';
    }
  }

  goBack(): void {
    this.router.navigate(['/tabs/profile']);
  }

  async saveChanges(): Promise<void> {
    if (this.isSaving) return;
    this.isSaving = true;
    // TODO: call profile update API
    await new Promise((r) => setTimeout(r, 800));
    this.isSaving = false;
    const toast = await this.toastController.create({
      message: 'Profile updated successfully.',
      duration: 2500,
      position: 'top',
      color: 'success',
    });
    await toast.present();
  }
}
