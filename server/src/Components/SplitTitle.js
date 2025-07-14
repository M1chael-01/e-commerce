// Function to truncate a title string if it exceeds 30 characters
export default function splitTitle(title) {
  // Return empty string if input is not a string
  if (typeof title !== "string") return "";

  // If title is longer than 30 characters, return first 30 chars + "..."
  // Otherwise, return the full title as is
  return title.length > 30 ? `${title.slice(0, 30)}...` : title;
}
