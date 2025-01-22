import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ROLES } from 'src/app/core/constants/roles';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, NgClass, NgIf, ButtonComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})

export class SignInComponent {
  form: FormGroup<{
    email: FormControl
    password: FormControl
    role: any
  }>;
  submitted = false;
  passwordTextType!: boolean;
  roleTextCode: 'patient' | 'professional' | 'parent' | '' = ''
  role: string = ''
  roles: any = {
    patient: 'A Jugar',
    parent: 'Hola Padres',
    professional: 'Bienvenido Profesional'
  }
  error = ''

  constructor(private readonly _formBuilder: FormBuilder, private readonly _router: Router, private _authService: AuthService, private _toastService: ToastService) {
    this._toastService.toast.set({type: 'loading'})
    
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(1500)]],
      role: null
    });
    
    let _role = this._router.parseUrl(this._router.url).queryParams['role']
    if (_role) {
      this.role = this.roles[_role]
      this.roleTextCode = _role
    } else {
      this._router.navigateByUrl('/home')
    }
    
    const token = this._authService.getToken()
    if (!token) {
      this._toastService.toast.set(undefined)
      return
    }

    const dataRole: { [key: string]: any } = {
      "admin": { code: 1, page: '/admin' },
      "professional": { code: 2, page: '/dashboard' },
      "parent": { code: 3, page: '/dashboard' },
      "patient": { code: 4, page: '/games' },
    }
    this._authService.validateAndRole(token).subscribe(res => {
      if (res) {
        this._router.navigate([dataRole[res.role].page]);
      }
      this._toastService.toast.set(undefined)
    })
  }

  ngAfterViewInit() {
    let _role = this._router.parseUrl(this._router.url).queryParams['role']
    if (_role) {
      this.role = this.roles[_role]
      this.roleTextCode = _role
    } else {
      this._router.navigateByUrl('/home')
    }
  }
  
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }
  
  onSubmit(event: any) {
    event.preventDefault()
    this._toastService.toast.set({type: 'loading'})
    this.submitted = true;
    const { email, password } = this.form.value;
    // stop here if form is invalid
    if (this.form.invalid) {
      console.error('>> >invalido d:', email, password);
      return;
    }

    const data = this.form.getRawValue()
    data['role'] = this.roleTextCode
    this._authService.login(data).subscribe({
      next: (res) => {
        if (!res.token) return
        
        this._authService.setToken(res.token)
        this._authService.setRole(res.role)
        this._authService.setEmail(res.email)

        if (ROLES.professional == res.role) {
          this._router.navigate(['/dashboard']);
        } else if (ROLES.patient == res.role) {
          this._router.navigate(['/games']);
        }
        this._toastService.toast.set(undefined)
      },
      error: (err) => {
        this.error = 'Error al iniciar sesión'
        console.error('>> >>  :', err);
        this._toastService.toast.set(undefined)
      },
      
    })

  }
}
