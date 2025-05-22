
export interface StudySession {
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
}

export interface StudyGoal {
  targetHours: number;
  completedMinutes: number;
}
