import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, NgClass, NgIf, ButtonComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})

export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;
  role: string = ''
  roles: any = {
    patient: 'A Jugar',
    parent: 'Hola Padres',
    professional: 'Bienvenido Profesional'
  }

  constructor(private readonly _formBuilder: FormBuilder, private readonly _router: Router, private _authService: AuthService) {

    let _role = this._router.parseUrl(this._router.url).queryParams['role']
    if(_role){
      this.role = this.roles[_role]
    }

    const token = this._authService.getToken()
    if(!token) return

    this._authService.validate(token).subscribe(res => {
      if(res === true){
        this._router.navigate(['/dashboard']);
      }
    })

  }

  onClick() {
    console.log('Button clicked');
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('fono@gmail.com')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(1500)]],
    });
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;
    const { email, password } = this.form.value;
    // stop here if form is invalid
    if (this.form.invalid) {
      console.log('>> >invalido d:', email, password);
      return;
    }
    console.log('>> >>  email, password:', email, password);
    this._authService.login(this.form.getRawValue()).subscribe(res => {
      this._authService.setToken(res.token)
      this._authService.setRole(res.role)
      this._router.navigate(['/dashboard']);
    })

  }
}
