export function InvalidLinkState() {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="text-center max-w-md">
        <h1 className="font-display text-3xl text-ivory-50 mb-4">Link Not Recognized</h1>
        <p className="text-steel-400 text-sm">This onboarding link is invalid or has been permanently revoked. Please contact dispatch support.</p>
      </div>
    </div>
  );
}