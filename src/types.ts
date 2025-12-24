
export interface UserProfile {
  name: string;
  email: string;
  password?: string;
  enrolledCourses: Course[];
  studyHoursPerDay: number;
}

export interface Course {
  id: string;
  name: string;
  syllabus: string;
  targetDuration: string; 
  agentName: string;
  status: 'active' | 'completed';
  progress: number;
  roadmap: StudyModule[];
}

export interface StudyModule {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDuration: string;
  status: 'pending' | 'in-progress' | 'completed';
  resources?: string[]; 
}

// Added Task interface for TaskManager component
export interface Task {
  id: string;
  title: string;
  deadline: string;
  priority: 'Low' | 'Medium' | 'High';
  isCompleted: boolean;
}

// Added JSSPTask interface for Planner and Scheduler components
export interface JSSPTask {
  id: string;
  jobName: string;
  operation: string;
  processingTime: number;
  machineId: number;
  priority: number;
  startTime?: number;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export type ViewType = 'auth' | 'dashboard' | 'tasks' | 'roadmap' | 'planner' | 'performance' | 'research' | 'agents' | 'study';