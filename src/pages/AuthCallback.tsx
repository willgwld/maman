import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Connexion en cours...');

  useEffect(() => {
    const handleCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);

      const accessToken = hashParams.get('access_token');
      const code = queryParams.get('code');

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      if (accessToken) {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data?.session) {
          const meta = data.session.user.user_metadata || {};
          const onboardingDone = meta.onboarding_completed || localStorage.getItem('mamanzen_onboarding_completed') === 'true';
          navigate(onboardingDone ? '/dashboard' : '/onboarding', { replace: true });
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const meta = session.user.user_metadata || {};
        const onboardingDone = meta.onboarding_completed || localStorage.getItem('mamanzen_onboarding_completed') === 'true';
        navigate(onboardingDone ? '/dashboard' : '/onboarding', { replace: true });
      } else {
        navigate('/auth', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] via-[#F6F3EE] to-[#FAFAF9] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-3 border-[#A3B899] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[#4A4A4A] font-medium">{status}</p>
      </div>
    </div>
  );
}
