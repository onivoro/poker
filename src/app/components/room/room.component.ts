import { Component, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, filter, of, take, tap } from 'rxjs';
import { RouteParams } from 'src/app/enums/route-params.enum';
import { PlayerRepository } from 'src/app/repositories/player-repository';
import { IPlayer } from 'src/app/types/player.interface';
import { PlayerFormComponent } from '../player-form/player-form.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements AfterViewInit {
  players$ = this.playerRepository.list$();
  cards$ = of([1, 3, 5, 8, 13, 21])
  player!: IPlayer;
  playerId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerRepository: PlayerRepository,
    private dialog: MatDialog
  ) {
  }
  ngAfterViewInit(): void {
    this.playerId = this.route.snapshot.params[RouteParams.PlayerId];

    of().pipe(
      filter(playerId => !playerId),
      take(1),
      concatMap(() =>
        this.dialog.open(PlayerFormComponent).afterClosed().pipe(tap(player =>
          this.router.navigate([this.route.snapshot.params[RouteParams.RoomId], player.id])
        ))))
      .subscribe();
  }

  async vote (vote: number) {
    await this.playerRepository.patch({vote, id: this.playerId});
  }
}
