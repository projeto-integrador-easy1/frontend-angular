import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-tela-placeholder',
  imports: [CommonModule],
  templateUrl: './tela-placeholder.component.html',
  styleUrls: ['./tela-placeholder.component.css']
})
export class TelaPlaceholderComponent {
  mensagem = 'Tela carregando ...';
  constructor(private route: ActivatedRoute) {
    const dataMsg = this.route.snapshot.data['mensagem'];
    if (dataMsg) this.mensagem = dataMsg;
  }
}
