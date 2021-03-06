import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TaskModel } from '../../shared/task/index';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../shared/user/user.service';
import { DialogService } from '../../shared/dialog/dialog.service';
import { IProject, ITask } from '../../common/models';
import { Store } from '@ngrx/store';
import { IProjectState, getSelectedProject } from '../../state/reducers/project.reducers';
import { LoadProject } from '../../state/actions/project.actions';
import { ITaskState, getSelectedTask } from '../../state/reducers/task.reducers';
import { LoadTask, DeleteTask } from '../../state/actions/task.actions';

@Component({
  selector: 'app-task-view',
  templateUrl: './task.view.component.html',
  styleUrls: ['./task.view.component.scss']
})

export class TaskViewComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public task: ITask = new TaskModel();
  @Input() public project: IProject;
  @Input() public compactView = false;
  @Input() public isUsedInline = false;
  @Input() public showProjectLink = 'dontShow';

  public hasVisual = false;
  public projectTitle = '';
  public managerName = '';
  public managerId = '';
  private selectedTask$;
  private selectedProject$;

  /**
   * Dependency Injection: route (for reading params later)
   */
  constructor(
    public userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private projectStore: Store<IProjectState>,
    private taskStore: Store<ITaskState>
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    this.hasVisual = !!(this.task && (this.task.imageUrl || this.task.videoUrl));
  }

  /**
   * Initialization Event Handler, used to parse route params
   * like `id` in task/:id/edit)
   */
  public ngOnInit() {
    if (this.isUsedInline) {
      // FIXME Use caching - too many requests otherwise
      this.applyProjectChanges(this.project);
    } else {
      this.route.params.subscribe(params => {
        if (params.id) {
          this.taskStore.dispatch(new LoadTask(params.id));
        }
      });
      this.selectedTask$ = this.taskStore.select(getSelectedTask).subscribe(task => this.applyTaskChanges(task));
      this.selectedProject$ = this.projectStore.select(getSelectedProject).subscribe(project => this.applyProjectChanges(project));
    }
  }

  public ngOnDestroy() {
    if (this.selectedTask$) {
      this.selectedTask$.unsubscribe();
      this.selectedProject$.unsubscribe();
    }
  }

  private applyTaskChanges(task: ITask) {
    if (!task) { return; };
    this.task = task;
    this.hasVisual = !!(this.task && (this.task.imageUrl || this.task.videoUrl));

    if (!this.project || !this.project._id || !this.project.managerId) {
      this.retrieveProject();
    } else {
      this.applyProjectChanges(this.project);
    }
  }

  private applyProjectChanges(project: IProject) {
    this.project = project;
    this.projectTitle = project ? project.title : '';
    this.managerName = project ? project.managerName : '';
    this.managerId = project ? project.managerId : '';
  }

  private retrieveProject() {
    if (this.task && this.task.projectId && !this.project) {
      this.projectStore.dispatch(new LoadProject(this.task.projectId));
    }
  }

  public deleteTask(task: ITask, event) {
    this.taskStore.dispatch(new DeleteTask(task));
    this.dialogService.info('Захід видалено', 'Ми видалили цей захід');
    this.router.navigate(['/project/' + task.projectId]);

    event.stopPropagation();
    return false;
  }
}
