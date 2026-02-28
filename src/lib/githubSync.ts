const REPO = "yiminglin-ai/travel-map";
const FILE_PATH = "public/data/profiles.json";
const API = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

const PAT_KEY = "travelmap_github_pat";

export function getToken(): string | null {
  return localStorage.getItem(PAT_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(PAT_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(PAT_KEY);
}

interface GitHubFileResponse {
  sha: string;
  content: string;
}

async function getFileSha(token: string): Promise<string> {
  const res = await fetch(API, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const data: GitHubFileResponse = await res.json();
  return data.sha;
}

export async function commitProfiles(
  json: string,
  token: string
): Promise<boolean> {
  try {
    const sha = await getFileSha(token);
    const content = btoa(unescape(encodeURIComponent(json)));
    const res = await fetch(API, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update travel data",
        content,
        sha,
      }),
    });
    return res.ok;
  } catch (e) {
    console.error("Failed to sync to GitHub:", e);
    return false;
  }
}
