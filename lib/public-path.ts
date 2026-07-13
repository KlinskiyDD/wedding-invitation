function normalizeBasePath(value: string | undefined) {
  const basePath = value?.trim() ?? "";

  if (!basePath || basePath === "/") {
    return "";
  }

  if (!basePath.startsWith("/") || basePath.endsWith("/") || basePath.startsWith("//")) {
    throw new Error(
      "NEXT_PUBLIC_BASE_PATH must start with one slash and must not end with a slash.",
    );
  }

  return basePath;
}

const publicBasePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

export function publicAssetPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error(`Public asset path must start with one slash: ${path}`);
  }

  return `${publicBasePath}${path}`;
}

export function getRsvpApiUrl() {
  return process.env.NEXT_PUBLIC_RSVP_API_URL?.trim() || "/api/rsvp";
}
