import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const tokenInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);

    // Clone the request object
    let newReq = req.clone();

    // Request
    //
    // If the access token didn't expire, add the Authorization header.
    // We won't add the Authorization header if the access token expired.
    // This will force the server to return a "401 Unauthorized" response
    // for the protected API routes which our response interceptor will
    // catch and delete the access token from the local storage while logging
    // the user out from the app.
    if (authService.getToken()/*  && !AuthUtils.isTokenExpired(authService.accessToken */) {
        newReq = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + authService.getToken()),
        });
    }

    // Response
    return next(newReq).pipe(
        catchError((error) => {
            // Catch "401 Unauthorized" responses
            if (error instanceof HttpErrorResponse && error.status === 401) {
                // Sign out
                /* authService.signup(); */
                localStorage.clear()
                // Reload the app
                location.reload();
            }
            throw new Error(error);
        }),
    );
};
