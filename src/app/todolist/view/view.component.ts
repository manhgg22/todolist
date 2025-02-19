import { Component, Inject } from '@angular/core';
import { NzModalRef, NZ_MODAL_DATA, NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-view',
  imports:[NzModalModule],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  todo: any; 

  constructor(
    private modal: NzModalRef,
    @Inject(NZ_MODAL_DATA) public data: { todo: any } 
  ) {
    this.todo = data.todo;
    console.log('Dữ liệu nhận trong ViewComponent:', this.todo);
  }

  closeModal() {
    this.modal.destroy();   
  }
}
