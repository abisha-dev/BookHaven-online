import { Loader2 } from 'lucide-react';

interface Props {
  message?: string;
}

export default function LoadingSpinner({ message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 size={32} className="text-gold animate-spin" />
      {message && <p className="text-white/50 text-sm">{message}</p>}
    </div>
  );
}
