import type { StigmaEnvelope, StigmaObject } from '../types/stigma';

export interface BeReply<T = unknown> {
  status: 'ok' | 'error' | string;
  msg?: string;
  data?: T;
  dataset?: StigmaObject[];
}

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function beAction<T = unknown>(
  obj: StigmaObject | StigmaEnvelope,
  action: string,
  url: string,
): Promise<BeReply<T>> {
  const payload = { ...obj, action };
  return postJson<BeReply<T>>(url, payload);
}

export async function beActionWithMsg<T = unknown>(
  msg: string,
  obj: StigmaObject | StigmaEnvelope,
  action: string,
  url: string,
): Promise<BeReply<T>> {
  console.info(`[stigma-form] ${msg}`);
  return beAction<T>(obj, action, url);
}

export async function beActionJson<T = unknown>(
  obj: unknown,
  action: string,
  url: string,
): Promise<BeReply<T>> {
  return postJson<BeReply<T>>(url, { ...((obj as object) ?? {}), action });
}

export async function callBackendJson<T = unknown>(
  url: string,
  payload: unknown,
): Promise<BeReply<T>> {
  return postJson<BeReply<T>>(url, payload);
}

export async function callBackendHtml(url: string, payload: unknown): Promise<string> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.text();
}

export async function xhrHttpJsonJson<T = unknown>(
  url: string,
  payload: unknown,
): Promise<BeReply<T>> {
  return postJson<BeReply<T>>(url, payload);
}
