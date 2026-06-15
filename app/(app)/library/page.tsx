export default function LibraryPage({ searchParams }: { searchParams: { q?: string } }) {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Document Library</h1>
      {searchParams.q && <p>Search Query: <strong>{searchParams.q}</strong></p>}
      <p>Library placeholder content.</p>
    </div>
  );
}
