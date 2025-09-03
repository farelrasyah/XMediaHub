export function pickBestVariant(variants: any[] = []) {
  if (!variants.length) return null;
  // sudah di-sort oleh Worker: bitrate desc
  return variants[0];
}

export function pickByBitrate(variants: any[] = [], target?: number) {
  if (!variants.length) return null;
  if (!target) return pickBestVariant(variants);
  // cari bitrate terdekat <= target kbps
  const sorted = [...variants].sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
  const targetBps = target * 1000;
  const exact = sorted.find(v => v.bitrate === targetBps);
  if (exact) return exact;
  const lower = sorted.find(v => (v.bitrate || 0) <= targetBps);
  return lower || sorted[sorted.length - 1];
}

export function sanitizeFilename(name: string) {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').slice(0, 120);
}
