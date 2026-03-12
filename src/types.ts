export interface Resource {
  subject: string;
  unit: string;
  topic: string;
  difficulty: string;
  importance: string;
  resource_type: string;
  exam_frequency: string;
  rating: string;
  downloads: string;
}

export interface PYQ {
  subject: string;
  topic: string;
  year: string;
  marks: string;
  question_type: string;
  difficulty: string;
  occurrence_count: string;
  importance_score: string;
}
