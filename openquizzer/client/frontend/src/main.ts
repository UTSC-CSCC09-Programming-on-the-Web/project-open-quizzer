import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Masterform } from './app/components/masterform/masterform';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
