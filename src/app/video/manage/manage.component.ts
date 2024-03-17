import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import IClip from 'src/app/models/clip.model';

import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

import { Store } from '@ngrx/store';
import { toggleModal } from '@store/modal/modal.actions';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  videoOrder = '1'; //1 ~> DESC, 2 ~> AESC
  clips: IClip[] = [];
  activeClip: IClip | null = null;
  sort$: BehaviorSubject<string>

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService, // converted to ngrx
    private store: Store
  ) {
    //an object that acts like both obeservable and observer
    this.sort$ = new BehaviorSubject(this.videoOrder);
    this.sort$.subscribe(console.log);
    this.sort$.next('test')
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (params: Params) => {
        this.videoOrder = params['sort'] === '2'
          ? params['sort'] 
          : '1';
        this.sort$.next(this.videoOrder);
      } 
    );

    this.clipService.getUserClips(this.sort$).subscribe(
      (docs) => {
        this.clips = [];

        docs.forEach(doc => {
          this.clips.push({
            docID: doc.id,
            ...doc.data(),
          })
        });
      }
    );
  }

  sort(event: Event) {
    const { value } = (event.target as HTMLSelectElement);
    //option-1
    //this.router.navigateByUrl(`/manage?sort=${value}`)
    
    //option-2
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    });
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault();

    this.activeClip = clip;

    //this.modal.toggleModal('editClip'); //converted to ngrx
    this.store.dispatch(toggleModal({ id: 'editClip' }));
  }

  update(event: IClip) {
    this.clips.forEach((element, idx) => {
      if(element.docID === event.docID) {
        this.clips[idx].title = event.title;
      }
    })
  }

  deleteClip(event: Event, clip: IClip) {
    event.preventDefault();

    this.clipService.deleteClip(clip);

    this.clips.forEach((element, idx) => {
      if(element.docID === clip.docID) {
        this.clips.splice(idx, 1);
      }
    });
  }

  async copyToClipboard($event: MouseEvent, docID: string | undefined) {
    $event.preventDefault();

    if(!docID) {
      return
    }

    const LOCATION = location;
    const url = `${LOCATION.origin}/clip/${docID}`;

    await navigator.clipboard.writeText(url);

    alert('Link Copied!');
  }

}
