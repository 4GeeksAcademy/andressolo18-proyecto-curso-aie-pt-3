export function recordsApiUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) throw new Error("Falta configurar la URL de la API.");
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
}

export async function apiErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as { detail?: string };
    if (body.detail) return body.detail;
  } catch {
    return "La solicitud no se pudo completar.";
  }
  return "La solicitud no se pudo completar.";
}