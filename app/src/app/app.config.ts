import { ApplicationConfig, importProvidersFrom  } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    importProvidersFrom(HttpClientModule),
    provideAnimations()
]
};
