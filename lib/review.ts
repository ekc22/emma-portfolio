/**
 * Review notes ("Draft — awaiting Emma's approval", placeholder labels) are shown
 * by default so nothing unapproved slips through unnoticed.
 * At launch, set NEXT_PUBLIC_SHOW_REVIEW_NOTES=false in Vercel to hide the draft badges.
 * Image placeholders stay labelled until real images are added.
 */
export const showReviewNotes = process.env.NEXT_PUBLIC_SHOW_REVIEW_NOTES !== "false";
