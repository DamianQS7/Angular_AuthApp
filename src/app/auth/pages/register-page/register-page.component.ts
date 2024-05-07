import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  private fb: FormBuilder = inject(FormBuilder);

  public registerForm: FormGroup = this.fb.group({
    name: ['', [ Validators.required ]],
    email: ['', [ Validators.required, Validators.email ]],
    password: ['', [ Validators.required, Validators.minLength(6) ]]
  });

  public register(): void {
    const { name, email, password } = this.registerForm.value;
    
  }
}
