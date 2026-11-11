export type Candidate = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  position: string;
  linkedin_url: string | null;
  cv_url: string | null;
  status: string;
  stage: string;
  experience_years: number;
  notes_count: number;
  applied_at: string;
  updated_at: string;
};

export type CandidateNote = {
  id: string;
  record_id: string;
  content: string;
  created_at: string;
};

export type CandidateFormValues = Pick<
  Candidate,
  "full_name" | "email" | "phone" | "position" | "linkedin_url" | "cv_url" | "experience_years"
>;