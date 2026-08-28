export function parseGithubRepo(repoUrl: string): { owner: string; name: string } | null {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/);
  if (!match) return null;
  return { owner: match[1], name: match[2].replace(/\.git$/, "") };
}

export function githubUserUrl(handle: string) {
  return `https://github.com/${handle}`;
}

export function architectureRawUrl(repoUrl: string, architecturePath: string) {
  const parsed = parseGithubRepo(repoUrl);
  if (!parsed) return null;
  const cleanPath = architecturePath.replace(/^\//, "");
  return `https://raw.githubusercontent.com/${parsed.owner}/${parsed.name}/main/${cleanPath}`;
}

export async function architectureAvailable(url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    return res.ok;
  } catch {
    return false;
  }
}
