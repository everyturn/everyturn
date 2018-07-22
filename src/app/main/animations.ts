import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeInUp as fadeInUpBase, fadeIn as fadeInBase } from 'ng-animate';

export const fadeInUp = trigger('fadeInUp', [
  transition(':enter', useAnimation(fadeInUpBase, {params: {timing: '0.3', a: '12px'}}))
]);

export const fadeIn = trigger('fadeIn', [
  transition(':enter', useAnimation(fadeInBase, {params: {timing: '0.5'}}))
]);
