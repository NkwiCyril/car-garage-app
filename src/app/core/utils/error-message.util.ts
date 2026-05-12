import { HttpErrorResponse } from '@angular/common/http';

export function friendlyErrorMessage(error: HttpErrorResponse | Error | unknown): string {
  if (error instanceof HttpErrorResponse) {
    const serverMsg = extractServerMessage(error);
    if (serverMsg && !looksLikeRawTrace(serverMsg)) return serverMsg;
    return statusMessage(error.status);
  }

  if (error instanceof Error && error.message) {
    return looksLikeRawTrace(error.message)
      ? 'Something went wrong. Please try again.'
      : error.message;
  }

  return 'Something went wrong. Please try again.';
}

function extractServerMessage(err: HttpErrorResponse): string | null {
  if (err.error instanceof ErrorEvent) return err.error.message ?? null;
  const body: any = err.error;
  if (typeof body === 'string' && body.trim().length > 0 && body.length < 200) return body;
  if (body?.message && typeof body.message === 'string') return body.message;
  if (Array.isArray(body?.errors)) {
    const msgs = body.errors
      .map((e: any) => e?.msg ?? e?.message)
      .filter(Boolean);
    if (msgs.length) return msgs.join(', ');
  }
  return null;
}

function statusMessage(status: number): string {
  if (status === 0) return 'We couldn’t reach the server. Please check your internet connection and try again.';
  if (status === 400) return 'That didn’t look right. Please review your input and try again.';
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You don’t have permission to do this.';
  if (status === 404) return 'We couldn’t find what you were looking for.';
  if (status === 408 || status === 504) return 'The request took too long. Please try again.';
  if (status === 409) return 'That conflicts with current data. Please refresh and try again.';
  if (status === 422) return 'Some of the information you entered is invalid. Please review it and try again.';
  if (status === 429) return 'You’re doing that a bit too quickly. Please wait a moment and try again.';
  if (status >= 500 && status < 600) return 'Something went wrong on our end. Please try again in a moment.';
  return 'Something went wrong. Please try again.';
}

function looksLikeRawTrace(msg: string): boolean {
  return /\b(at\s+\w+\.|\bError:\s|\bTypeError\b|\bReferenceError\b|stack\b|\n.*\n)/i.test(msg);
}
