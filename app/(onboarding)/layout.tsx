export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem 2rem', borderBottom: '1px solid #e5e7eb' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>LexVault DMS Onboarding</h1>
      </header>
      <main style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        {children}
      </main>
    </div>
  );
}
