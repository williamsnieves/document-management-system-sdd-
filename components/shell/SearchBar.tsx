'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@base-ui/react/input';
import styles from './SearchBar.module.css';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/library?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/library');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Search className={styles.icon} size={18} />
      <Input
        className={styles.input}
        placeholder="Search documents..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
