import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter }        from '@angular/router';
import { provideHttpClient }    from '@angular/common/http';
import { importProvidersFrom }  from '@angular/core';
import { FormsModule }          from '@angular/forms';
import { CodemirrorModule }     from '@ctrl/ngx-codemirror';

import { App } from './app/app';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      FormsModule,
      CodemirrorModule
    )
  ]
});
