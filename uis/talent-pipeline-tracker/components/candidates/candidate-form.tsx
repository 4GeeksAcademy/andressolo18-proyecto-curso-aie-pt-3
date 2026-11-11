"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { apiErrorMessage, recordsApiUrl } from "@/lib/api";
import type {
  Candidate,
  CandidateCreateRequest,
  CandidateMutationResponse,
  CandidateUpdateRequest,
} from "@/types/candidate";

type FormMode = "create" | "edit";
type FormState = Omit<
  CandidateCreateRequest,
  "experience_years" | "phone" | "linkedin_url" | "cv_url"
> & {
  experience_years: string;
  phone: string;
  linkedin_url: string;
  cv_url: string;
};

const emptyForm: FormState = {
  full_name: "",
  email: "",
  phone: "",
  position: "",
  linkedin_url: "",
  cv_url: "",
  experience_years: "",
};

export default function CandidateForm({
  mode,
  candidate,
}: {
  mode: FormMode;
  candidate?: Candidate;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() =>
    candidate
      ? {
          full_name: candidate.full_name,
          email: candidate.email,
          phone: candidate.phone ?? "",
          position: candidate.position,
          linkedin_url: candidate.linkedin_url ?? "",
          cv_url: candidate.cv_url ?? "",
          experience_years: String(candidate.experience_years),
        }
      : emptyForm,
  );
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
    candidateId?: string;
  } | null>(null);

  function updateField(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setFeedback(null);
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fullName = form.full_name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const position = form.position.trim();
    const experience = Number(form.experience_years);

    if (!fullName || !email || !phone || !position) {
      setFeedback({ type: "error", message: "Rellena todos los campos requeridos para continuar." });
      return;
    }
    if (!Number.isFinite(experience) || experience < 0) {
      setFeedback({ type: "error", message: "Por favor, indica años de experiencia válidos." });
      return;
    }

    const payload: CandidateCreateRequest | CandidateUpdateRequest = {
      full_name: fullName,
      email,
      phone,
      position,
      experience_years: experience,
      linkedin_url: form.linkedin_url.trim() || null,
      cv_url: form.cv_url.trim() || null,
    };

    setSubmitting(true);
    setFeedback(null);
    try {
      const response = await fetch(
        recordsApiUrl(mode === "create" ? "records" : `records/${candidate?.id}`),
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) throw new Error(await apiErrorMessage(response));
      const savedCandidate = (await response.json()) as CandidateMutationResponse;

      if (mode === "create") {
        router.replace(`/?created=1&candidateId=${encodeURIComponent(savedCandidate.id)}`);
      } else {
        router.replace(`/candidates/${savedCandidate.id}?updated=1`);
      }
    } catch (requestError) {
      setFeedback({
        type: "error",
        message: requestError instanceof Error ? requestError.message : "No se pudo guardar el perfil. Inténtalo de nuevo.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="candidate-form" onSubmit={submitForm}>
      <div className="form-grid">
        <label className="form-field">
          <span>Nombre completo <b aria-hidden="true">*</b></span>
          <input
            autoComplete="name"
            name="full_name"
            value={form.full_name}
            onChange={(event) => updateField("full_name", event.currentTarget.value)}
            required
          />
        </label>
        <label className="form-field">
          <span>Correo electrónico <b aria-hidden="true">*</b></span>
          <input
            autoComplete="email"
            type="email"
            name="email"
            value={form.email}
            onChange={(event) => updateField("email", event.currentTarget.value)}
            required
          />
        </label>
        <label className="form-field">
          <span>Teléfono <b aria-hidden="true">*</b></span>
          <input
            autoComplete="tel"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={(event) => updateField("phone", event.currentTarget.value)}
            required
          />
        </label>
        <label className="form-field">
          <span>Puesto <b aria-hidden="true">*</b></span>
          <input
            name="position"
            value={form.position}
            onChange={(event) => updateField("position", event.currentTarget.value)}
            required
          />
        </label>
        <label className="form-field">
          <span>Años de experiencia <b aria-hidden="true">*</b></span>
          <input
            type="number"
            name="experience_years"
            min="0"
            step="any"
            value={form.experience_years}
            onChange={(event) => updateField("experience_years", event.currentTarget.value)}
            required
          />
        </label>
        <label className="form-field">
          <span>Perfil de LinkedIn</span>
          <input
            type="url"
            name="linkedin_url"
            placeholder="https://linkedin.com/in/..."
            value={form.linkedin_url}
            onChange={(event) => updateField("linkedin_url", event.currentTarget.value)}
          />
        </label>
        <label className="form-field form-field-wide">
          <span>Enlace al CV</span>
          <input
            type="url"
            name="cv_url"
            placeholder="https://..."
            value={form.cv_url}
            onChange={(event) => updateField("cv_url", event.currentTarget.value)}
          />
        </label>
      </div>

      {feedback && (
        <div className={`form-feedback feedback-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
          <span>{feedback.message}</span>
          {feedback.candidateId && (
            <Link href={`/candidates/${feedback.candidateId}`}>Ver candidatura</Link>
          )}
        </div>
      )}

      <div className="candidate-form-actions">
        <Link className="form-cancel" href={mode === "create" ? "/" : `/candidates/${candidate?.id}`}>
          Cancelar
        </Link>
        <button className="form-submit" type="submit" disabled={submitting}>
          {submitting
            ? "Guardando..."
            : mode === "create"
              ? "Añadir perfil"
              : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}