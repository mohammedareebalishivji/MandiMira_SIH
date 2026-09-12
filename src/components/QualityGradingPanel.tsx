import React, { useState, useRef } from 'react';
import {
  ScanLine, Camera, Loader2, Check, TriangleAlert, X, CircleHelp,
  IndianRupee, Lightbulb, Upload
} from 'lucide-react';
import { assessQuality } from '../services/geminiService';
import { buyerDemands } from '../data/marketData';
import { FarmerLot, QualityAssessment, QualitySpec } from '../types';

interface Props {
  lot: FarmerLot;
}

const MEETS_STYLE: Record<QualitySpec['meets'], { bg: string; fg: string; Icon: React.ElementType; label: string }> = {
  pass: { bg: '#b2f1be', fg: '#00210c', Icon: Check, label: 'Meets' },
  borderline: { bg: '#ffdcc3', fg: '#663500', Icon: TriangleAlert, label: 'Borderline' },
  fail: { bg: '#ffdad6', fg: '#93000a', Icon: X, label: 'Fails' },
  unknown: { bg: '#e0e3df', fg: '#404941', Icon: CircleHelp, label: 'Unknown' }
};

/**
 * Solution #3 — Quality requirements, made legible before despatch.
 * The farmer picks a buyer's published spec, describes (and optionally
 * photographs) the lot, and Gemini grades it attribute by attribute so a
 * rejection at the gate is caught here instead of 80 km away.
 */
export const QualityGradingPanel: React.FC<Props> = ({ lot }) => {
  const relevant = buyerDemands.filter((d) => d.cropType === lot.cropType && d.status !== 'closed');
  const [demandId, setDemandId] = useState(relevant[0]?.id ?? buyerDemands[0].id);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<{ data: string; mimeType: string; preview: string } | null>(null);
  const [result, setResult] = useState<QualityAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const demand = buyerDemands.find((d) => d.id === demandId) ?? buyerDemands[0];

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setImage({
        data: dataUrl.split(',')[1] ?? '',
        mimeType: file.type || 'image/jpeg',
        preview: dataUrl
      });
    };
    reader.readAsDataURL(file);
  };

  const run = async () => {
    setLoading(true);
    setNote('');
    const res = await assessQuality(
      lot,
      demand.qualitySpecs,
      description,
      image ? { data: image.data, mimeType: image.mimeType } : undefined
    );
    setResult(res.data);
    if (res.error) setNote(res.error);
    setLoading(false);
  };

  const qtl = lot.quantityKg / 100;
  const premiumTotal = result ? Math.round(result.estimatedPremiumPerQtl * qtl) : 0;

  return (
    <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-[#002b7b]/10 flex items-center justify-center flex-shrink-0">
          <ScanLine className="w-4.5 h-4.5 text-[#002b7b]" />
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="font-headline-sm font-bold text-[#191c1a] text-[15px]">AI Quality Grading</h3>
          <span className="font-label-sm text-[11px] text-[#404941]">
            Check your lot against the buyer’s written spec before you load the truck
          </span>
        </div>
      </div>

      {/* Buyer spec selector */}
      <label className="flex flex-col gap-1.5">
        <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#717970]">
          Grade against this buyer’s specification
        </span>
        <select
          value={demandId}
          onChange={(e) => { setDemandId(e.target.value); setResult(null); }}
          className="min-h-[44px] rounded-xl border border-[#c0c9be] bg-[#f7faf5] px-3 font-body-sm text-[13px] text-[#191c1a] outline-none focus:border-[#16532d] cursor-pointer"
        >
          {buyerDemands.map((d) => (
            <option key={d.id} value={d.id}>
              {d.buyerName} — {d.cropNameEn} @ ₹{d.pricePerQtl}/Qtl ({d.gradeRequired})
            </option>
          ))}
        </select>
      </label>

      {/* The published spec */}
      <div className="bg-[#f1f4ef] rounded-xl border border-[#c0c9be]/40 p-3 flex flex-col gap-1.5">
        <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#717970]">
          {demand.buyerName} requires
        </span>
        {demand.qualitySpecs.map((s) => (
          <div key={s.id} className="flex items-baseline justify-between gap-3 text-[12px]">
            <span className="font-body-sm text-[#404941]">{s.attribute}</span>
            <span className="font-label-sm text-[#191c1a] text-right">{s.requirement}</span>
          </div>
        ))}
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-2">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Describe your lot in your own words — size, colour, moisture, how long it was cured, any damage you can see."
          className="rounded-xl border border-[#c0c9be] bg-[#f7faf5] p-3 font-body-sm text-[13px] text-[#191c1a] outline-none focus:border-[#16532d] resize-none placeholder:text-[#a0a8a0]"
        />

        <div className="flex items-center gap-2 flex-wrap">
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            className="min-h-[40px] px-3 rounded-xl border border-[#c0c9be] bg-white font-label-sm text-xs text-[#404941] flex items-center gap-1.5 hover:border-[#16532d] hover:text-[#16532d] transition-colors cursor-pointer"
          >
            {image ? <Upload className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
            {image ? 'Change photo' : 'Add photo of produce'}
          </button>
          {image && (
            <div className="flex items-center gap-1.5">
              <img src={image.preview} alt="Lot sample" className="w-10 h-10 rounded-lg object-cover border border-[#c0c9be]" />
              <button
                onClick={() => { setImage(null); if (fileRef.current) fileRef.current.value = ''; }}
                className="w-7 h-7 rounded-full bg-[#ecefea] flex items-center justify-center text-[#404941] hover:text-[#ba1a1a] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={run}
          disabled={loading}
          className="min-h-[46px] rounded-xl bg-[#002b7b] text-white font-label-md text-sm flex items-center justify-center gap-2 hover:bg-[#003fab] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
          {loading ? 'Grading your lot…' : 'Grade my lot'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="flex flex-col gap-3 pt-1 border-t border-[#c0c9be]/40">
          <div className="flex items-stretch gap-2 flex-col sm:flex-row">
            <div className="flex-1 bg-[#003b1b] rounded-xl p-3 flex flex-col gap-0.5">
              <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#88c695]">
                Assessed grade · {result.confidencePercent}% confidence
              </span>
              <span className="font-metric-lg text-white">{result.grade}</span>
            </div>
            <div
              className="flex-1 rounded-xl p-3 flex flex-col gap-0.5"
              style={{ backgroundColor: result.estimatedPremiumPerQtl >= 0 ? '#b2f1be' : '#ffdad6' }}
            >
              <span
                className="font-label-sm text-[10px] uppercase tracking-wider"
                style={{ color: result.estimatedPremiumPerQtl >= 0 ? '#14512b' : '#93000a' }}
              >
                Price impact on {lot.quantityKg} kg
              </span>
              <span
                className="font-metric-lg flex items-center"
                style={{ color: result.estimatedPremiumPerQtl >= 0 ? '#00210c' : '#93000a' }}
              >
                {result.estimatedPremiumPerQtl >= 0 ? '+' : '−'}
                <IndianRupee className="w-4 h-4 mx-0.5" />
                {Math.abs(premiumTotal).toLocaleString('en-IN')}
              </span>
              <span
                className="font-label-sm text-[10px]"
                style={{ color: result.estimatedPremiumPerQtl >= 0 ? '#14512b' : '#93000a' }}
              >
                ₹{Math.abs(result.estimatedPremiumPerQtl)}/Qtl × {qtl.toFixed(1)} Qtl
              </span>
            </div>
          </div>

          <p className="font-body-sm text-[13px] text-[#404941] leading-snug bg-[#f1f4ef] rounded-xl p-3 border border-[#c0c9be]/40">
            {result.summary}
          </p>

          {/* Attribute-by-attribute verdict */}
          <div className="flex flex-col gap-1.5">
            <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#717970]">
              Against each requirement
            </span>
            {result.specs.map((s) => {
              const st = MEETS_STYLE[s.meets];
              return (
                <div
                  key={s.id}
                  className="flex items-start gap-2 rounded-xl border border-[#c0c9be]/40 bg-white p-2.5"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: st.bg }}
                  >
                    <st.Icon className="w-3.5 h-3.5" style={{ color: st.fg }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <span className="font-label-sm text-[12px] text-[#191c1a]">{s.attribute}</span>
                      <span className="font-label-sm text-[10px] uppercase tracking-wider" style={{ color: st.fg }}>
                        {st.label}
                      </span>
                    </div>
                    <p className="font-body-sm text-[11.5px] text-[#404941] leading-snug">
                      Needs <span className="font-bold">{s.requirement}</span>
                      {s.farmerValue ? <> · yours reads <span className="font-bold">{s.farmerValue}</span></> : null}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {result.improvementActions.length > 0 && (
            <div className="bg-[#ffdcc3] rounded-xl border border-[#fe932c]/40 p-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-[#663500]" />
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#663500]">
                  Do this before despatch to lift the grade
                </span>
              </div>
              {result.improvementActions.map((a, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="font-mono text-[10px] text-[#663500] mt-0.5">{i + 1}.</span>
                  <span className="font-body-sm text-[12px] text-[#2f1500] leading-snug">{a}</span>
                </div>
              ))}
            </div>
          )}

          <p className="font-label-sm text-[10px] text-[#717970] italic">
            {result.source === 'ai'
              ? 'AI assessment — indicative only. Final grade is decided at the buyer’s gate.'
              : `Local assessment used${note ? ` (${note})` : ''}. Get a physical check before committing.`}
          </p>
        </div>
      )}
    </section>
  );
};
