import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {

  constructor(private Fb: FormBuilder,
    private http: HttpClient,
  ) {}

  base_url="https://jsonplaceholder.typicode.com/users"

  data: any[] = [];

  showform: boolean = false;
  selectedId: number | null = null;

  profileForm = this.Fb.group({
    name: [''],
    email: [''],
    phone: [''],
    address: [''],
    website: [''],
  });


  getUser():void {
    this.http.get<any>(this.base_url).subscribe(res => {
      console.log(res);
      this.data = res;
    })
    
  }

  updateUser(id: number): void {
    this.selectedId = id;
    this.http.get<any>(`${this.base_url}/${id}`).subscribe(res => {
      console.log(res.phone);
      this.profileForm.patchValue({
        name: res.name,
        email: res.email,
        phone: res.phone,
        address: res.address?.city,
        website: res.website
      });
      this.showform = true;
    });
  }

  onsave(): void {
    if (this.selectedId) {
      const id = this.selectedId;
      this.http.put<any>(`${this.base_url}/${id}`, this.profileForm.value).subscribe(res => {
        const index = this.data.findIndex((u: any) => u.id === id);
        if (index !== -1) this.data[index] = { ...this.profileForm.value, id };
        this.profileForm.reset();
        this.selectedId = null;
        this.showform = false;
      });
    } else {
      this.http.post<any>(this.base_url, this.profileForm.value).subscribe(res => {
        this.data.push(res);
        this.profileForm.reset();
        this.showform = false;
      });
    }
  }

  viewUser(id:number){
    this.http.get<any>(`${this.base_url}/${id}`).subscribe(res =>
    {
      console.log(res);
      this.profileForm.patchValue({
        name: res.name,
        email: res.email,
        phone: res.phone,
        address: res.address?.city,
        website: res.website
      });
      this.showform = true;
    }

    )


  }

  addUser(){
    this.showform = true;
  }

  deleteUser(id:number):void {
    this.http.delete<any>(`${this.base_url}/${id}`).subscribe(res =>
    {
      console.log(res);
      this.data.splice(id-1, 1);
    }

    )

  }

  ngOnInit(): void {
    this.getUser();
  }





}
