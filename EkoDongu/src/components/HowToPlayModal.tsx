import React from 'react';
import { X, CheckCircle, AlertTriangle, Sparkles, Volume2, MousePointer, Hand } from 'lucide-react';
import { WASTE_CATEGORIES_INFO } from '../utils/educationalData';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-xl w-full max-h-[90vh] bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-white flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
              ?
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Nasıl Oynanır?</h3>
              <p className="text-xs text-slate-400">Sıfır Atık Ayrıştırma Rehberi</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1">
          {/* Controls description */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MousePointer className="w-4 h-4 text-emerald-400" />
              <span>Oyun Kontrolleri</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Yukarıdan düşen atıkları <strong>fare (mouse)</strong> veya dokunmatik ekranda <strong>parmağınızla tutup sürükleyerek</strong> alttaki doğru geri dönüşüm kutusuna bırakın. Düşen atığı doğrudan kutuların içine de düşürebilirsiniz!
            </p>
          </div>

          {/* Stars & Level Map description */}
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span className="text-amber-400">⭐</span>
              <span>Seviye Haritası & 1, 2, 3 Yıldız Sistemi</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Her seviyede belirlenen atık hedefine ulaştığınızda, topladığınız skora göre <strong>1, 2 veya 3 Yıldız</strong> kazanırsınız. Kazandığınız yıldızlarla haritada yeni bölgelerin (Sahil, Pil Tesisi, Teknoloji Vadisi, Eko Metropol) kilitlerini açın!
            </p>
          </div>

          {/* 7 Categories Card List */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              7 Geri Dönüşüm Kategorisi
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(WASTE_CATEGORIES_INFO) as (keyof typeof WASTE_CATEGORIES_INFO)[]).map((cat) => {
                const info = WASTE_CATEGORIES_INFO[cat];
                return (
                  <div
                    key={cat}
                    className="p-3 rounded-2xl border flex flex-col gap-1.5"
                    style={{
                      backgroundColor: `${info.hex}18`,
                      borderColor: `${info.hex}44`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full inline-block"
                          style={{ backgroundColor: info.hex }}
                        />
                        {info.name}
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white shadow-xs"
                        style={{ backgroundColor: info.hex }}
                      >
                        {info.colorName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {info.description}
                    </p>
                    <div className="text-[10px] text-slate-400">
                      <strong>Örnekler:</strong> {info.examples.slice(0, 3).join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rules & Bonuses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span>Doğru Eşleştirme</span>
              </h5>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Her doğru atık için <strong>+100 Puan</strong> kazanırsınız. Ardı ardına doğru atışlar <strong>5x Kombo Çarpanı</strong> sağlar!
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <h5 className="text-xs font-bold text-red-400 flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Hatalı Kutulama / Kaçırma</span>
              </h5>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Yanlış kutuya atılan veya yere düşen her atık <strong>1 Can</strong> kaybettirir ve kombo serisini sıfırlar.
              </p>
            </div>
          </div>

          {/* Audio feature note */}
          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/40 flex items-start gap-2.5">
            <Volume2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Oyun içerisinde başarı (ding), hata (buzzer) ve arka plan melodisi (BGM) mevcuttur. Dilediğiniz an sağ üstteki butonla sesi açıp kapatabilirsiniz.
            </p>
          </div>
        </div>

        {/* Footer Button */}
        <div className="pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all"
          >
            Anladım, Oyuna Dön
          </button>
        </div>
      </div>
    </div>
  );
};
