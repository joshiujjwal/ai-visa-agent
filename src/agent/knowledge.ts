// src/agent/knowledge.ts
// Retrieval layer for country requirements from the database.
// Includes staleness check: warns if data is > 90 days old.
//
// TODO (Phase 5): Implement full retrieval logic

const STALENESS_THRESHOLD_DAYS = 90;

export function isDataStale(lastVerifiedAt: Date): boolean {
  const diffMs = Date.now() - lastVerifiedAt.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > STALENESS_THRESHOLD_DAYS;
}

export function buildStalenessWarning(lastVerifiedAt: Date): string {
  return (
    `⚠️ Note: This information was last verified on ` +
    `${lastVerifiedAt.toISOString().split('T')[0]}. ` +
    `Requirements may have changed — please verify with the official embassy website.`
  );
}
