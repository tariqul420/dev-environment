import { IComment } from './comment';

export type Status = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

export interface IInterview {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  status: Status;
  streamCallId: string;
  candidateId: string;
  interviewerIds: string[];
  comments?: IComment[];
}
