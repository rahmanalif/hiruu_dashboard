export const resolveAccessToken = (tokens) => {
  if (!tokens) {
    return null;
  }

  if (typeof tokens === "string") {
    return tokens;
  }

  const candidates = [
    tokens.accessToken,
    tokens.access,
    tokens.token,
    tokens.jwt,
    tokens.access?.token,
    tokens.access?.accessToken,
    tokens.access?.jwt,
    tokens.token?.accessToken,
    tokens.token?.token,
    tokens.data?.accessToken,
    tokens.data?.token,
  ];

  const matchedToken = candidates.find(
    (candidate) => typeof candidate === "string" && candidate.trim()
  );

  return matchedToken || null;
};

export const readStoredAuth = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const localAuth = JSON.parse(localStorage.getItem("auth") || "null");
    if (localAuth?.user && localAuth?.tokens) {
      return localAuth;
    }

    const sessionAuth = JSON.parse(sessionStorage.getItem("auth") || "null");
    if (sessionAuth?.user && sessionAuth?.tokens) {
      return sessionAuth;
    }
  } catch {
    return null;
  }

  return null;
};
