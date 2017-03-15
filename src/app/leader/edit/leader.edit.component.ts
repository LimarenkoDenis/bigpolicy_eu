import { OnInit, Component } from '@angular/core';
import { LeaderService, LeaderModel } from '../../shared/leader';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DriveService } from '../../shared/drive';
import { UserService } from '../../shared/user';

@Component({
  templateUrl: './leader.edit.component.html',
  styleUrls: ['./leader.edit.component.scss']
  })

export class LeaderEditComponent implements OnInit {

  leader: LeaderModel = new LeaderModel();

  isUpdateMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leaderService: LeaderService,
    public userService: UserService,
    public dialog: MdDialog,
    public driveService: DriveService
  ) {}

  /**
   * Initialization Event Handler, used to parse route params
   * like `id` in leader/:id/edit)
   */
  ngOnInit() {
    // FIXME
    const p = this.userService.userProfile;
    const fullname = p ? p['name'] : '';
    this.leader.name = fullname.split(' ')[0];
    this.leader.surName = fullname.split(' ')[1];
    this.route.params
      .map(params => params['id'])
      .subscribe((id) => {
        // console.log('Leader Editor by ID from route params:', id);

        // TODO Test unauthorised user can't see the page
        if (id && this.userService.authenticated()) {
           this.isUpdateMode = true;
           this.leaderService.getLeader(id)
          .subscribe(
            data => {
              this.setLeader(data);
            },
            err => console.error(err),
            () => {}
          );
        }
      });
  }

  /**
   * Leader loading handler
   * @param {data} Loaded leader data
   */
  setLeader(data) {
    this.leader = new LeaderModel();
    this.leader.parseData(data);
    this.driveService.checkConnection();
  }

  /**
   * Remove this leader
   * @param {leader} Leader being viewed
   */
  deleteLeader(leader: LeaderModel) {
    // Delete from DB
    this.leaderService.deleteLeader(leader);

    this.router.navigate(['/leaders']);
    return false;
  }

  /**
   * Saves new or edited leader by asking one of two service methods for DB.
   * @returns return false to prevent default form submit behavior to refresh the page.
   */
  // FIXME: Complete Leader processing
  onSaveLeaderClick(): boolean {
    // FIXME - Dummy test for leader's files saving
    const files = [];
    const links = ['http://goo.com/1/file.txt', 'http://foobar.com/2/file.html' ];
    const titles = ['Text File', 'HTML File' ];
    for (let i = 0; i < links.length; i++) {
      const file = {
        link: links[i],
        title: titles[i],
        name: titles[i]
      };
      files.push(file);
    }
    this.leader.leaderFiles = files;
    console.log('Leader files to save:', this.leader.leaderFiles);

    if (this.isUpdateMode) {
      // Update existing leader:
      this.leaderService.updateLeader(this.leader)
      .subscribe(
        data => { this.leaderService.gotoLeaderView(data); },
        err => (er) => console.error('Leader update error: ', er),
        () => {}
      );
    } else {
      // Create new leader

      // FTUX: If user's unauthorised, save him to localStorage, continue after login
      if ( !this.userService.authenticated()) {
        this.saveToLocalStorage(this.leader);
        return false;
      }

      // NO FTUX - user is authorized already
      this.leaderService.createLeader(this.leader, this.userService.getEmail());
    }
    return false;
  }

  /**
   * FTUX - Lazy Leader Registration.
   * Save Leader to LocalStorage to let unauthorised user to start registration
   */
  saveToLocalStorage(leader) {
    console.log('≥≥≥ unauthorised, saving to localStorage');
    localStorage.setItem('BigPolicyLeaderRegistration', leader);
    this.showRegistrationIsNeededWarning();
  }

  showRegistrationIsNeededWarning() {
    const dialogRef = this.dialog.open(ContinueRegistrationDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        console.log('Заходимо у систему');
        this.userService.login();
      });
  }
}

@Component({
  selector: 'app-dialog-result-example-dialog',
  template: `
      <h2 md-dialog-title>Потрібна авторизація</h2>
      <md-dialog-content>
        <p>
          Для завершення реєстрації треба увійти в систему — натисніть "Продовжити"'
        </p>
      </md-dialog-content>
      <md-dialog-actions [attr.align]="actionsAlignment">
        <button
          md-raised-button
          color="primary"
          md-dialog-close>Продовжити</button>
      </md-dialog-actions>
  `,
})
export class ContinueRegistrationDialogComponent {
  actionsAlignment: string;
  constructor(public dialog: MdDialog) { }
}
