export interface IInterview {
  title: string;
  description?: string;
  startTime: number;
  endTime?: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  streamCallId: string;
}
