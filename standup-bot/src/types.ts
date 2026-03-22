export interface StandupSession {
  active: boolean;
  channelId: string;
  members: Map<string, string | null | "unreachable">;
  // string = reply text, null = no reply yet, "unreachable" = DM failed
  triggeredBy: string;
  startedAt: Date;
  timeoutId: NodeJS.Timeout;
}
