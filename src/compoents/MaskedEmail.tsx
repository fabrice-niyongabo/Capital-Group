export default function MaskedEmail({ email }: { email: string }) {
  if (!email.includes("@")) return email;

  const [localPart, domain] = email.split("@");

  // show only first 2 chars from local part, then mask
  const maskedLocal =
    localPart.length > 2 ? localPart.slice(0, 2) + ".." : localPart[0] + "..";

  return (
    <span>
      {maskedLocal}@{domain}
    </span>
  );
}
