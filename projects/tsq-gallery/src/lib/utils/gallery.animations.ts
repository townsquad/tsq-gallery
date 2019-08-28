import {trigger, transition, animate, style, AnimationTriggerMetadata} from '@angular/animations';

export const galleryAnimations: AnimationTriggerMetadata[] = [
  trigger('fadeInOut', [
    transition(':enter', [
      style({opacity: 0}),
      animate('200ms ease-in', style({opacity: 1}))
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({opacity: 0}))
    ])
  ])
];
