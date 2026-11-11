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
  notes?: CandidateNote[];
};

export type CandidateNote = {
  id: string;
  record_id: string;
  content: string;
  created_at: string;
};

export type CandidateResponse = Candidate;

export type CandidateListResponse = {
  data: Candidate[];
  total: number;
  page: number;
  limit: number;
};

export type CandidateNotesResponse = {
  data: CandidateNote[];
  meta: {
    total: number;
  };
};

export type CandidateCreateRequest = {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  experience_years: number;
  linkedin_url?: string | null;
  cv_url?: string | null;
};

export type CandidateUpdateRequest = CandidateCreateRequest;

export type CandidatePatchRequest = {
  status?: string | null;
  stage?: string | null;
};

export type CandidateNoteCreateRequest = {
  content: string;
};

export type CandidateMutationResponse = Candidate;

export type ApiValidationIssue = {
  loc: Array<string | number>;
  msg: string;
  type: string;
};

export type ApiErrorResponse = {
  detail?: string | ApiValidationIssue[];
};