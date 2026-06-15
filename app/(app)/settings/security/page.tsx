import { SecurityControlCenter } from '@/components/security/SecurityControlCenter';
import { SettingsSubNav } from '@/components/shell/SettingsSubNav';

export const metadata = {
  title: 'Security Control Center | Settings',
};

export default function SecurityPage() {
  return (
    <div>
      <SettingsSubNav />
      <SecurityControlCenter />
    </div>
  );
}
