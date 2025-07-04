import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LiveSessionsRoutingModule } from './live-sessions-routing-module';
import { LiveSessionsRoom } from './live-sessions-room/live-sessions-room';
import { LiveSessionsDashboard } from './live-sessions-dashboard/live-sessions-dashboard';
import { LiveSessionsCreate } from './live-sessions-create/live-sessions-create';
import { LiveSessionsControls } from './live-sessions-controls/live-sessions-controls';
import { LiveSessionsParticipants } from './live-sessions-participants/live-sessions-participants';
import { Chat } from './chat/chat';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LiveSessionsRoutingModule,
    LiveSessionsRoom,
    LiveSessionsDashboard,
    LiveSessionsCreate,
    LiveSessionsControls,
    LiveSessionsParticipants,
    Chat
  ],
  exports: [
    LiveSessionsRoom,
    LiveSessionsDashboard,
    LiveSessionsCreate,
    LiveSessionsControls,
    LiveSessionsParticipants,
    Chat
  ]
})
export class LiveSessionModule { }