import { Directory, File, Paths } from 'expo-file-system';
import { CryptoDigestAlgorithm, digest } from 'expo-crypto';
import { getRemoteSoundDescriptor, resolveBundledSoundAsset, SOUND_TRACKS } from './soundManifest';

const { cacheFileName, expectedSoundChecksum } = require('../core/packModel') as {
  cacheFileName: (id: string) => string;
  expectedSoundChecksum: (id: string) => string;
};

const PACK_DIR = new Directory(Paths.document, 'consciousness-lab-packs-v1');

function ensurePackDir() {
  if (!PACK_DIR.exists) PACK_DIR.create({ intermediates: true });
}

function cachedFile(id: string) {
  return new File(PACK_DIR, cacheFileName(id));
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function sha256File(file: File) {
  return toHex(await digest(CryptoDigestAlgorithm.SHA256, await file.arrayBuffer()));
}

export function getDownloadedTrackIds(): string[] {
  ensurePackDir();
  return SOUND_TRACKS.filter((track) => !track.bundled && cachedFile(track.id).exists).map((track) => track.id);
}

export function isTrackDownloaded(id: string) {
  const descriptor = getRemoteSoundDescriptor(id);
  if (!descriptor) return false;
  ensurePackDir();
  return cachedFile(id).exists;
}

export async function downloadTrack(id: string): Promise<string> {
  const descriptor = getRemoteSoundDescriptor(id);
  if (!descriptor?.remoteUrl) throw new Error(`Track is not downloadable: ${id}`);
  ensurePackDir();
  const target = cachedFile(id);
  const file = await File.downloadFileAsync(descriptor.remoteUrl, target, { idempotent: true });
  const actual = await sha256File(file);
  const expected = expectedSoundChecksum(id);
  if (actual !== expected) {
    if (file.exists) file.delete();
    throw new Error(`Downloaded track failed SHA-256 validation: ${id}`);
  }
  return file.uri;
}

export function removeTrack(id: string): void {
  const descriptor = getRemoteSoundDescriptor(id);
  if (!descriptor) return;
  ensurePackDir();
  const file = cachedFile(id);
  if (file.exists) file.delete();
}

export function removeAllDownloadedTracks(): void {
  for (const id of getDownloadedTrackIds()) removeTrack(id);
}

export async function resolvePlayableSoundSource(id: string): Promise<number | string | null> {
  if (id === 'off') return null;
  const bundled = resolveBundledSoundAsset(id);
  if (bundled) return bundled;
  const descriptor = getRemoteSoundDescriptor(id);
  if (!descriptor) return null;
  ensurePackDir();
  const file = cachedFile(id);
  return file.exists ? file.uri : null;
}

export function downloadedBytes(): number {
  ensurePackDir();
  return SOUND_TRACKS.filter((track) => !track.bundled).reduce((sum, track) => {
    const file = cachedFile(track.id);
    return sum + (file.exists ? (file.size ?? 0) : 0);
  }, 0);
}
