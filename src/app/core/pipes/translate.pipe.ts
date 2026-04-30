import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationService } from '../services/translation.service';

@Pipe({ name: 'translate', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform, OnDestroy {
  private sub: Subscription;

  constructor(
    private translationService: TranslationService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.sub = translationService.lang$.subscribe(() => {
      this.cdRef.markForCheck();
    });
  }

  transform(key: string): string {
    return this.translationService.t(key);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
