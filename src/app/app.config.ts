import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { provideHttpClient } from '@angular/common/http';
import { provideToken } from './core/interceptor/token.provider';

export const appConfig: ApplicationConfig = {
  providers: [provideToken(), provideRouter(routes), provideAnimationsAsync(), provideAngularSvgIcon(), provideHttpClient()]
};
