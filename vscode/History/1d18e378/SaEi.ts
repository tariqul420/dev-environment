import { IComment } from './comment';

export interface IInterview {
  id: string;
  title: string;
  description?: string;
  startTime: number;
  endTime?: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  streamCallId: string;
  candidateId: string;
  interviewerIds: string[];
  comments?: IComment[];
}
