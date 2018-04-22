import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { LeaderAction, LeaderActionTypes, LoadLeaderSuccess, LoadLeaderFail, CreateLeaderSuccess, CreateLeaderFail, DeleteLeaderFail, DeleteLeaderSuccess, DeleteLeader } from '../actions/leader.actions';
import { LeaderService } from '../../shared/leader';
import { of } from 'rxjs/observable/of';

@Injectable()
export class LeaderEffects {

    @Effect() $createLeader: Observable<LeaderAction> = this.$actions.pipe(
        ofType(LeaderActionTypes.LEADER_CREATE),
        mergeMap((action: LeaderAction) =>
            this.leaderService.createLeader(action.payload).pipe(
                map(data => new CreateLeaderSuccess(data)),
                catchError(err => of(new CreateLeaderFail(err)))
            )
        )
    )

    @Effect() $loadLeader: Observable<LeaderAction> = this.$actions.pipe(
        ofType(LeaderActionTypes.LEADER_LOAD),
        mergeMap((action: LeaderAction) =>
            this.leaderService.getLeader(action.payload).pipe(
                map(data => new LoadLeaderSuccess(data)),
                catchError(err => of(new LoadLeaderFail(err)))
            )
        )
    )

    @Effect() $deleteLeader: Observable<LeaderAction> = this.$actions.pipe(
        ofType(LeaderActionTypes.LEADER_DELETE),
        mergeMap((action: DeleteLeader) =>
            this.leaderService.deleteLeader(action.payload).pipe(
                map(data => new DeleteLeaderSuccess(data)),
                catchError(err => of(new DeleteLeaderFail(err)))
            )
        )
    )

    constructor(
        private leaderService: LeaderService,
        private $actions: Actions
    ) { }
}