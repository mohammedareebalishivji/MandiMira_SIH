import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Sprout, Users, Handshake, Factory, Truck, Warehouse, ShieldCheck,
  ChevronRight, ChevronLeft, Phone, Check, Globe, ArrowRight, Loader2, LucideIcon,
  KeyRound, Eye, EyeOff, MessageSquareCode, Copy, User
} from 'lucide-react';
import { ROLES } from '../data/roles';
import { DEMO_SESSIONS } from '../data/roles';
import { UserRole, UserSession } from '../types';
import { authenticateAs, credentialFor, DEMO_PASSWORD } from '../services/auth';
import { SupportedLang } from '../i18n';

const ICONS: Record<string, LucideIcon> = {
  Sprout, Users, Handshake, Factory, Truck, Warehouse, ShieldCheck
};

interface LoginScreenProps {
  onLogin: (session: UserSession) => void;
  currentLang: SupportedLang;
  onOpenLanguagePicker: () => void;
}

type Step = 'role' | 'credentials' | 'otp';
type Method = 'password' | 'otp';

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  currentLang,
  onOpenLanguagePicker
}) => {
  const [step, setStep] = useState<Step>('role');
  const [method, setMethod] = useState<Method>('password');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const role = useMemo(() => ROLES.find((r) => r.id === selectedRole) ?? null, [selectedRole]);
  const isHindi = currentLang !== 'en';

  // Focus the first OTP box as soon as we land on that step
  useEffect(() => {
    if (step === 'otp') otpRefs.current[0]?.focus();
  }, [step]);

  const handlePickRole = (id: UserRole) => {
    setSelectedRole(id);
    setPhone(DEMO_SESSIONS[id].phone.replace(/\D/g, '').slice(0, 10));
    setIdentifier(credentialFor(id).username);
    setPassword('');
    setError('');
    setStep('credentials');
  };

  const handlePasswordLogin = () => {
    if (!selectedRole) return;
    const result = authenticateAs(selectedRole, identifier, password);
    if (result.ok === false) {
      setError(result.error);
      return;
    }
    const { session } = result;
    setError('');
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      onLogin(session);
    }, 500);
  };

  const handleCopyCredentials = async () => {
    if (!selectedRole) return;
    const c = credentialFor(selectedRole);
    try {
      await navigator.clipboard.writeText(`${c.username} / ${c.password}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard is unavailable in some embedded viewers; the values stay on screen.
      setCopied(false);
    }
  };

  const handleSendOtp = () => {
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Enter the full 10-digit mobile number registered with your Aadhaar or KCC.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    // Demo OTP dispatch. A real deployment swaps this for the SMS gateway call.
    window.setTimeout(() => {
      setIsSubmitting(false);
      setOtp(['', '', '', '', '', '']);
      setStep('otp');
    }, 700);
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError('');
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    if (!digits.length) return;
    e.preventDefault();
    const next = ['', '', '', '', '', ''];
    digits.forEach((d, i) => (next[i] = d));
    setOtp(next);
    otpRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  const handleVerify = () => {
    if (otp.join('').length < 6) {
      setError('Enter all 6 digits of the OTP.');
      return;
    }
    if (!selectedRole) return;
    setError('');
    setIsSubmitting(true);
    window.setTimeout(() => {
      const session = { ...DEMO_SESSIONS[selectedRole], phone };
      setIsSubmitting(false);
      onLogin(session);
    }, 800);
  };

  const handleDemoSkip = () => {
    if (!selectedRole) return;
    onLogin({ ...DEMO_SESSIONS[selectedRole], phone });
  };

  return (
    <div className="min-h-screen bg-[#f7faf5] text-[#191c1a] font-sans flex flex-col selection:bg-[#b2f1be]">
      {/* Top bar: brand + language */}
      <header className="w-full border-b border-[#c0c9be]/30 bg-[#f7faf5]/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#003b1b] flex items-center justify-center flex-shrink-0">
              <Sprout className="w-5 h-5 text-[#b2f1be]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-headline-sm font-bold text-[#003b1b] leading-tight text-base sm:text-lg">
                {isHindi ? 'मंडीमित्र' : 'MandiMitra'}
              </span>
              <span className="font-label-sm text-[#404941] text-[11px] leading-tight truncate">
                {isHindi ? 'मंडी निर्णय केंद्र' : 'Farm-gate to buyer, transparently'}
              </span>
            </div>
          </div>
          <button
            onClick={onOpenLanguagePicker}
            className="min-h-[38px] px-3 rounded-full border border-[#c0c9be] bg-white flex items-center gap-1.5 font-label-sm text-xs text-[#404941] hover:border-[#16532d] hover:text-[#16532d] transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span className="uppercase">{currentLang}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col">
        {/* ---------------- STEP 1: ROLE SELECTION ---------------- */}
        {step === 'role' && (
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2 max-w-2xl">
              <span className="font-label-sm text-[#16532d] uppercase tracking-wider text-[11px]">
                Step 1 of 3 · Choose your role
              </span>
              <h1 className="font-display-lg text-[#003b1b]">
                Who are you in the mandi?
              </h1>
              <p className="font-body-sm text-[#404941] max-w-xl">
                Every role sees a different side of the same transaction. Pick yours and
                MandiMitra will show the prices, buyers and tools that actually apply to you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ROLES.map((r) => {
                const Icon = ICONS[r.icon] ?? Sprout;
                return (
                  <button
                    key={r.id}
                    onClick={() => handlePickRole(r.id)}
                    className="group text-left bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3 hover:border-[#16532d] hover:shadow-[0_4px_20px_rgba(0,59,27,0.08)] active:scale-[0.99] transition-all cursor-pointer min-h-[168px]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${r.accent}14` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: r.accent }} />
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#c0c9be] group-hover:text-[#16532d] transition-colors flex-shrink-0" />
                    </div>

                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-headline-sm font-bold text-[#191c1a] text-[15px]">{r.label}</span>
                        <span className="font-label-sm text-[#717970] text-[11px]">{r.labelHi}</span>
                      </div>
                      <p className="font-body-sm text-[#404941] text-[13px] leading-snug">{r.tagline}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {r.capabilities.slice(0, 2).map((c) => (
                        <span
                          key={c}
                          className="font-label-sm text-[10px] px-2 py-0.5 rounded-full bg-[#f1f4ef] text-[#404941] border border-[#c0c9be]/40"
                        >
                          {c}
                        </span>
                      ))}
                      {r.capabilities.length > 2 && (
                        <span className="font-label-sm text-[10px] px-2 py-0.5 rounded-full bg-[#f1f4ef] text-[#717970] border border-[#c0c9be]/40">
                          +{r.capabilities.length - 2}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-[#e6e9e4] rounded-xl p-3 border border-[#c0c9be]/40 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#003b1b] flex-shrink-0 mt-0.5" />
              <p className="font-label-sm text-[11px] text-[#404941] leading-relaxed">
                Sign in with your MandiMitra username and password, or with an OTP sent to the
                mobile number linked to your Aadhaar, KCC or APMC trading licence. Buyers and
                traders additionally pass GSTIN and bank penny-drop verification before they
                can transact.
              </p>
            </div>
          </div>
        )}

        {/* ---------------- STEP 2 & 3: PHONE / OTP ---------------- */}
        {(step === 'credentials' || step === 'otp') && role && (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start w-full max-w-4xl mx-auto">
            {/* Selected role recap */}
            <aside className="w-full lg:w-64 flex-shrink-0 bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${role.accent}14` }}
                >
                  {React.createElement(ICONS[role.icon] ?? Sprout, {
                    className: 'w-5 h-5',
                    style: { color: role.accent }
                  })}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline-sm font-bold text-[#191c1a] text-sm">{role.label}</span>
                  <span className="font-label-sm text-[#717970] text-[11px]">{role.labelHi}</span>
                </div>
              </div>

              <p className="font-body-sm text-[13px] text-[#404941] leading-snug">{role.description}</p>

              <div className="flex flex-col gap-1.5 pt-1 border-t border-[#c0c9be]/40">
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#717970]">
                  You will get
                </span>
                {role.capabilities.map((c) => (
                  <div key={c} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#16532d] flex-shrink-0 mt-0.5" />
                    <span className="font-label-sm text-[11px] text-[#404941] leading-snug">{c}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setStep('role'); setError(''); }}
                className="mt-1 min-h-[38px] rounded-lg border border-[#c0c9be] text-[#404941] font-label-sm text-xs flex items-center justify-center gap-1 hover:border-[#16532d] hover:text-[#16532d] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Change role
              </button>
            </aside>

            {/* Credential entry */}
            <div className="flex-1 w-full bg-white rounded-2xl border border-[#c0c9be]/60 p-5 sm:p-6 flex flex-col gap-4">
              {step === 'credentials' ? (
                <>
                  {/* Method switch */}
                  <div className="flex gap-1 bg-[#ecefea] rounded-xl p-1">
                    {([['password', 'Password', KeyRound], ['otp', 'Mobile OTP', MessageSquareCode]] as const).map(
                      ([id, label, Icon]) => (
                        <button
                          key={id}
                          onClick={() => { setMethod(id); setError(''); }}
                          className={`flex-1 min-h-[38px] rounded-lg font-label-sm text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            method === id ? 'bg-white text-[#003b1b] shadow-xs' : 'text-[#404941] hover:text-[#191c1a]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                        </button>
                      )
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="font-label-sm text-[#16532d] uppercase tracking-wider text-[11px]">
                      Step 2 of {method === 'password' ? '2' : '3'} · Sign in as {role.label}
                    </span>
                    <h2 className="font-headline-lg text-[#003b1b]">
                      {method === 'password' ? 'Enter your credentials' : 'Enter your mobile number'}
                    </h2>
                    <p className="font-body-sm text-[13px] text-[#404941]">
                      {method === 'password'
                        ? 'Use the username issued with your MandiMitra account.'
                        : 'We send a 6-digit OTP. This is the number your payments and dispute notifications will go to.'}
                    </p>
                  </div>

                  {method === 'password' ? (
                    <>
                      <label className="flex flex-col gap-1.5">
                        <span className="font-label-sm text-[11px] text-[#404941] uppercase tracking-wider">
                          Username, email or mobile
                        </span>
                        <div className="flex items-center gap-2 rounded-xl border border-[#c0c9be] bg-[#f7faf5] focus-within:border-[#16532d] focus-within:ring-2 focus-within:ring-[#16532d]/15 transition-all overflow-hidden">
                          <span className="pl-3 text-[#404941] flex-shrink-0">
                            <User className="w-4 h-4" />
                          </span>
                          <input
                            type="text"
                            autoComplete="username"
                            value={identifier}
                            onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
                            onKeyDown={(e) => e.key === 'Enter' && handlePasswordLogin()}
                            placeholder={credentialFor(role.id).username}
                            className="flex-1 bg-transparent py-3 pr-3 font-body-sm text-[14px] outline-none text-[#191c1a] placeholder:text-[#a0a8a0] min-w-0"
                          />
                        </div>
                      </label>

                      <label className="flex flex-col gap-1.5">
                        <span className="font-label-sm text-[11px] text-[#404941] uppercase tracking-wider">
                          Password
                        </span>
                        <div className="flex items-center gap-2 rounded-xl border border-[#c0c9be] bg-[#f7faf5] focus-within:border-[#16532d] focus-within:ring-2 focus-within:ring-[#16532d]/15 transition-all overflow-hidden">
                          <span className="pl-3 text-[#404941] flex-shrink-0">
                            <KeyRound className="w-4 h-4" />
                          </span>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            onKeyDown={(e) => e.key === 'Enter' && handlePasswordLogin()}
                            placeholder="••••••••"
                            className="flex-1 bg-transparent py-3 font-mono text-[14px] outline-none text-[#191c1a] placeholder:text-[#a0a8a0] min-w-0"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            title={showPassword ? 'Hide password' : 'Show password'}
                            className="px-3 py-3 text-[#717970] hover:text-[#16532d] cursor-pointer flex-shrink-0"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </label>

                      {error && (
                        <p className="font-label-sm text-xs text-[#ba1a1a] bg-[#ffdad6] rounded-lg px-3 py-2">{error}</p>
                      )}

                      <button
                        onClick={handlePasswordLogin}
                        disabled={isSubmitting}
                        className="min-h-[48px] rounded-xl bg-[#16532d] text-white font-label-md flex items-center justify-center gap-2 hover:bg-[#003b1b] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        {isSubmitting ? 'Signing in…' : `Sign in as ${role.label}`}
                      </button>

                      {/* Demo credentials for this role */}
                      <div className="rounded-xl border border-[#fe932c]/40 bg-[#ffdcc3] p-3 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#663500]">
                            Demo account for this role
                          </span>
                          <button
                            onClick={handleCopyCredentials}
                            className="font-label-sm text-[10px] text-[#663500] flex items-center gap-1 underline cursor-pointer"
                          >
                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copied ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-label-sm text-[11px] text-[#663500]">Username</span>
                          <span className="font-mono text-[12px] font-bold text-[#2f1500]">
                            {credentialFor(role.id).username}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-label-sm text-[11px] text-[#663500]">Password</span>
                          <span className="font-mono text-[12px] font-bold text-[#2f1500]">{DEMO_PASSWORD}</span>
                        </div>
                        <button
                          onClick={() => {
                            setIdentifier(credentialFor(role.id).username);
                            setPassword(DEMO_PASSWORD);
                            setError('');
                          }}
                          className="mt-0.5 min-h-[34px] rounded-lg bg-[#904d00] text-white font-label-sm text-[11px] cursor-pointer hover:bg-[#663500] transition-colors"
                        >
                          Fill these in
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <label className="flex flex-col gap-1.5">
                        <span className="font-label-sm text-[11px] text-[#404941] uppercase tracking-wider">
                          Mobile number
                        </span>
                        <div className="flex items-center gap-2 rounded-xl border border-[#c0c9be] bg-[#f7faf5] focus-within:border-[#16532d] focus-within:ring-2 focus-within:ring-[#16532d]/15 transition-all overflow-hidden">
                          <span className="pl-3 flex items-center gap-1.5 text-[#404941] font-mono text-sm border-r border-[#c0c9be] pr-2.5 py-3 flex-shrink-0">
                            <Phone className="w-4 h-4" />
                            +91
                          </span>
                          <input
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel"
                            value={phone}
                            onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                            placeholder="98220 41234"
                            className="flex-1 bg-transparent py-3 pr-3 font-mono text-base tracking-wider outline-none text-[#191c1a] placeholder:text-[#a0a8a0] min-w-0"
                          />
                        </div>
                      </label>

                      {error && (
                        <p className="font-label-sm text-xs text-[#ba1a1a] bg-[#ffdad6] rounded-lg px-3 py-2">{error}</p>
                      )}

                      <button
                        onClick={handleSendOtp}
                        disabled={isSubmitting}
                        className="min-h-[48px] rounded-xl bg-[#16532d] text-white font-label-md flex items-center justify-center gap-2 hover:bg-[#003b1b] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        {isSubmitting ? 'Sending OTP…' : 'Send OTP'}
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-label-sm text-[#16532d] uppercase tracking-wider text-[11px]">
                      Step 3 of 3 · Confirm
                    </span>
                    <h2 className="font-headline-lg text-[#003b1b]">Enter the 6-digit OTP</h2>
                    <p className="font-body-sm text-[13px] text-[#404941]">
                      Sent to <span className="font-mono font-bold text-[#191c1a]">+91 {phone}</span>.{' '}
                      <button
                        onClick={() => { setStep('credentials'); setError(''); }}
                        className="underline text-[#16532d] font-bold cursor-pointer"
                      >
                        Change
                      </button>
                    </p>
                  </div>

                  <div className="flex gap-2 justify-between max-w-sm" onPaste={handleOtpPaste}>
                    {otp.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={i === 0 ? 'one-time-code' : 'off'}
                        maxLength={1}
                        value={d}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-full aspect-square max-w-[54px] rounded-xl border border-[#c0c9be] bg-[#f7faf5] text-center font-mono text-xl font-bold text-[#191c1a] outline-none focus:border-[#16532d] focus:ring-2 focus:ring-[#16532d]/15 transition-all"
                      />
                    ))}
                  </div>

                  {error && (
                    <p className="font-label-sm text-xs text-[#ba1a1a] bg-[#ffdad6] rounded-lg px-3 py-2">{error}</p>
                  )}

                  <button
                    onClick={handleVerify}
                    disabled={isSubmitting}
                    className="min-h-[48px] rounded-xl bg-[#16532d] text-white font-label-md flex items-center justify-center gap-2 hover:bg-[#003b1b] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    {isSubmitting ? 'Verifying…' : `Verify & enter as ${role.label}`}
                  </button>

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-label-sm text-[11px] text-[#717970]">
                      Demo build — any 6 digits will pass.
                    </span>
                    <button
                      onClick={handleDemoSkip}
                      className="font-label-sm text-[11px] text-[#16532d] underline font-bold cursor-pointer"
                    >
                      Skip OTP (demo)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="w-full border-t border-[#c0c9be]/30 py-3 px-4">
        <p className="max-w-6xl mx-auto font-label-sm text-[11px] text-[#717970] text-center">
          Prices are indicative and sourced from APMC / e-NAM feeds. Verify the rate at the
          gate before unloading. MandiMitra does not guarantee any sale price.
        </p>
      </footer>
    </div>
  );
};
