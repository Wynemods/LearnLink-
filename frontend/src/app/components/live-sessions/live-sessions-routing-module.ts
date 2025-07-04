import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveSessionsRoom } from './live-sessions-room/live-sessions-room';
import { LiveSessionsDashboard } from './live-sessions-dashboard/live-sessions-dashboard';
import { LiveSessionsCreate } from './live-sessions-create/live-sessions-create';

const routes: Routes = [
  { path: '', component: LiveSessionsDashboard },
  { path: 'create', component: LiveSessionsCreate },
  { path: 'room/:sessionId', component: LiveSessionsRoom },
  { path: 'join/:sessionId', redirectTo: 'room/:sessionId' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveSessionsRoutingModule { }
