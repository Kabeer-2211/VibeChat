import { Request } from "express";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Socket } from "socket.io";

import { User } from "../../models/User.model";

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

declare module "socket.io" {
  interface Socket<
    ListenEvents extends DefaultEventsMap = DefaultEventsMap,
    EmitEvents extends DefaultEventsMap = DefaultEventsMap,
    ServerSideEvents extends DefaultEventsMap = DefaultEventsMap,
    SocketData = any
  > {
    user: User;
  }
}
