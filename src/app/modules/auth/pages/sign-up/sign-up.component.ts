import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, RouterLink, AngularSvgIconModule, ButtonComponent, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  form: FormGroup<{
    name: FormControl,
    age: FormControl,
    gender: FormControl,
    email: FormControl,
    password: FormControl,
  }>

  constructor(private formBuilder: FormBuilder){
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      age: ['', [Validators.required, Validators.min(4), Validators.max(100) ]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(1500) ]],
    })
  }

  handleSubmit(event: any){
    event.preventDefault()
    if (this.form.invalid) {
      return;
    }
    localStorage.setItem('token', JSON.stringify(this.form.getRawValue()) )
  }
}
