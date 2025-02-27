import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CredentialService } from '../services/credential.service';
import { Credential } from '../models/Credential';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';



@Component({
  selector: 'app-credential-form',
  templateUrl: './credential-form.component.html', // Adjust the path if necessary
  styleUrls: ['./credential-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]// Adjust the path if necessary
})
export class CredentialFormComponent implements OnInit {
  credential: Credential = { id: 0, name: '', password: '' };
  credentialForm: FormGroup;


  constructor(private router: Router, private credentialService: CredentialService, private route: ActivatedRoute, private fb: FormBuilder) {
    this.credentialForm = this.fb.group({
      name: [''],
      password: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.credentialService.getCredentialById(id).subscribe(credential => {
        this.credential = credential;
        this.populateForm(credential);
      });
    }
  }

  populateForm(credential: Credential): void {
    this.credentialForm.patchValue({
      name: credential.name,
      password: credential.password
    });
  }

  onSubmit(): void {
    const formValues = this.credentialForm.value;
    const updatedCredential: Credential = {
      ...formValues,
      id: this.route.snapshot.paramMap.get('id')
    } as Credential;

    if (updatedCredential.id === null) {
      this.createCredential(updatedCredential);
      this.router.navigate(['/']);
    } else {
      this.credentialService.updateCredentials(updatedCredential).subscribe(result => {
        this.credential = result;
      });
      this.router.navigate(['/']);
    }

  }

  private createCredential(formValues: Credential): void {
    const newCredential: Credential = { ...formValues } as Credential;
    this.credentialService.createCredentials(newCredential).subscribe(response => {
      this.router.navigate(['/credentials']);
    });
  }
}
