export function AlreadySubmittedState({ session }: { session: any }) {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="text-center max-w-md">
        <h1 className="font-display text-3xl text-ivory-50 mb-4">Submission Received</h1>
        <p className="text-steel-400 text-sm">Your carrier profile has been locked for compliance review. We will contact you at {session?.lead?.email} once verification is complete.</p>
      </div>
    </div>
  );
}