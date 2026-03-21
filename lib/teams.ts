export interface Team {
  id: string;
  name: string;
  rank: number | null;
  members: string[];
}

export const TOP_RANK_LIMIT = 3;

/**
 * Normalizes a string for comparison: lowercase + trim + collapse whitespace.
 */
export function normalize(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Returns all teams from the local JSON data.
 * In a real app this could be a DB/API call.
 */
export function getAllTeams(): Team[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data: Team[] = require("@/data/teams.json");
  return data;
}

/**
 * Finds an exact team match (case-insensitive).
 */
export function findTeamByName(name: string): Team | null {
  const teams = getAllTeams();
  const query = normalize(name);
  return teams.find((t) => normalize(t.name) === query) ?? null;
}

/**
 * Returns teams whose names contain the query string (partial match).
 */
export function searchTeams(query: string): Team[] {
  if (!query.trim()) return [];
  const q = normalize(query);
  return getAllTeams().filter((t) => normalize(t.name).includes(q));
}

/**
 * Checks if a member name belongs to the given team (case-insensitive).
 */
export function isMemberOfTeam(team: Team, memberName: string): boolean {
  const query = normalize(memberName);
  return team.members.some((m) => normalize(m) === query);
}

/**
 * Returns true if the team is a top-ranked winner (rank 1, 2 or 3).
 */
export function isTopRankedTeam(team: Team): boolean {
  return team.rank !== null && team.rank <= TOP_RANK_LIMIT;
}

/**
 * Safely encodes a team/member name for use in a URL path segment.
 */
export function encodeSegment(value: string): string {
  return encodeURIComponent(value);
}

/**
 * Decodes a URL path segment back to a readable name.
 */
export function decodeSegment(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
