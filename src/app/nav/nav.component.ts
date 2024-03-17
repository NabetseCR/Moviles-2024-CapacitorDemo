import { Component, OnInit } from '@angular/core';

import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

import { Store } from '@ngrx/store';
import { toggleModal } from '@store/modal/modal.actions';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  
  constructor(
    public modal: ModalService, //converted to ngrx
    public store: Store,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
      
  }

  openModal($event: Event) {
    $event.preventDefault();

    //this.modal.toggleModal('auth');  //converted to NgRx
    this.store.dispatch(toggleModal({ id: 'auth' }));
  }
}
