// Google Meet teleconsultation helpers.
//
// NOTE: Google Meet (meet.google.com) sends `X-Frame-Options: DENY`, so the
// live call itself cannot be embedded in an <iframe>. The teleconsultation
// "frame" in the UI therefore shows a local camera preview + a lobby, and the
// actual call is joined by opening the Meet link in a new tab. The generated
// link format matches Google Meet's `xxx-xxxx-xxx` room codes.

const ALPHA = 'abcdefghijklmnopqrstuvwxyz'

function segment(len: number): string {
  let out = ''
  for (let i = 0; i < len; i++) out += ALPHA[Math.floor(Math.random() * ALPHA.length)]
  return out
}

/** Generate a Google Meet style link: https://meet.google.com/abc-defg-hij */
export function generateMeetLink(): string {
  return `https://meet.google.com/${segment(3)}-${segment(4)}-${segment(3)}`
}

/** Pull the human-readable room code out of a Meet URL. */
export function meetCode(url: string): string {
  return url.replace(/^https?:\/\/meet\.google\.com\//, '')
}

/** Whether a string looks like a valid Google Meet link. */
export function isMeetLink(url: string): boolean {
  return /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/.test(url)
}
