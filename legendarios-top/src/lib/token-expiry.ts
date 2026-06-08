export function isExameUploadOpen(eventoData: string | null | undefined): boolean {
  if (!eventoData) return true;
  const deadline = new Date(eventoData);
  deadline.setUTCDate(deadline.getUTCDate() - 3);
  deadline.setUTCHours(23, 59, 59, 999);
  return new Date() <= deadline;
}

export function isMensagemPortalOpen(eventoData: string | null | undefined): boolean {
  if (!eventoData) return true;
  const deadline = new Date(eventoData);
  deadline.setUTCDate(deadline.getUTCDate() + 1);
  deadline.setUTCHours(23, 59, 59, 999);
  return new Date() <= deadline;
}
