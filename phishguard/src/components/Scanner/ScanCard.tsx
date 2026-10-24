import React, { useState } from 'react';
import { ChannelType, ScanResult } from '../../shared/dictionary';
import { apiService } from '../../services/apiService';
import { extractTextFromImage } from '../../server/engine/ocrService';
import { QUICK_SCAN_SAMPLES } from '../../data/seedData';
import { RiskGauge } from './RiskGauge';
import { IndicatorsList } from './IndicatorsList';
import { AdviceCard } from './AdviceCard';
import { Globe, Mail, MessageSquare, Image as ImageIcon, Search, Sparkles, Upload, Loader2, RefreshCw } from 'lucide-react';

interface ScanCardProps {
  onPreFillReport: (data: { channel: ChannelType; target: string; description: string }) => void;
}

export const ScanCard: React.FC<ScanCardProps> = ({ onPreFillReport }) => {
  const [activeChannel, setActiveChannel] = useState<ChannelType>('URL');
  const [inputVal, setInputVal] = useState('https://amazon.com@arnazon-orders-verification.click/account/signin');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [ocrProgress, setOcrProgress] = useState<number | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  const handleScan = async (overrideText?: string, overrideChannel?: ChannelType) => {
    const textToScan = overrideText !== undefined ? overrideText : inputVal;
    const channelToUse = overrideChannel || activeChannel;

    if (!textToScan.trim()) return;

    setIsScanning(true);
    try {
      const result = await apiService.scan({
        channel: channelToUse,
        payload: textToScan
      });
      setScanResult(result);
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSampleClick = (sample: typeof QUICK_SCAN_SAMPLES[0]) => {
    setActiveChannel(sample.type);
    setInputVal(sample.content);
    setUploadedImagePreview(null);
    handleScan(sample.content, sample.type);
  };

  const handleImageUpload = async (file: File) => {
    setUploadedImagePreview(URL.createObjectURL(file));
    setOcrProgress(15);
    setIsScanning(true);

    try {
      const ocrResult = await extractTextFromImage(file, p => setOcrProgress(p));
      setInputVal(ocrResult.text);

      const result = await apiService.scan({
        channel: 'SCREENSHOT',
        payload: ocrResult.text
      });
      setScanResult(result);
    } catch (err) {
      console.error('Image OCR scan failed:', err);
    } finally {
      setIsScanning(false);
      setOcrProgress(null);
    }
  };

  const handleScreenshotPreset = async (presetKey: string) => {
    setUploadedImagePreview(`Preset: ${presetKey.toUpperCase()}`);
    setOcrProgress(20);
    setIsScanning(true);

    try {
      const ocrResult = await extractTextFromImage(presetKey, p => setOcrProgress(p));
      setInputVal(ocrResult.text);

      const result = await apiService.scan({
        channel: 'SCREENSHOT',
        payload: ocrResult.text
      });
      setScanResult(result);
    } catch (err) {
      console.error('Preset scan failed:', err);
    } finally {
      setIsScanning(false);
      setOcrProgress(null);
    }
  };

  const handleReportPreFill = () => {
    if (!scanResult) return;
    onPreFillReport({
      channel: scanResult.channel,
      target: scanResult.defangedUrl || scanResult.input.slice(0, 100),
      description: `Detected threat with Score ${scanResult.score}/100 (${scanResult.riskLevel} Risk). Primary indicators: ${scanResult.indicators.map(i => i.label).join(', ')}.`
    });
  };

  const channels: { id: ChannelType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'URL', label: 'Suspicious URL', icon: Globe },
    { id: 'SMS', label: 'SMS / Text', icon: MessageSquare },
    { id: 'EMAIL', label: 'Email Content', icon: Mail },
    { id: 'SCREENSHOT', label: 'Screenshot OCR', icon: ImageIcon }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Scanner Input Card */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        {/* Channel Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 mb-6">
          {channels.map(ch => {
            const Icon = ch.icon;
            const isActive = activeChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  setActiveChannel(ch.id);
                  setScanResult(null);
                }}
                className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{ch.label}</span>
              </button>
            );
          })}
        </div>

        {/* Channel Input Area */}
        {activeChannel === 'SCREENSHOT' ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl p-8 text-center bg-slate-950/50 transition-colors">
              <input
                type="file"
                id="screenshot-upload"
                accept="image/*"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              />
              <label htmlFor="screenshot-upload" className="cursor-pointer flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-slate-200 mb-1">
                  Upload scam message or suspicious banking screenshot
                </div>
                <div className="text-xs text-slate-400 mb-3">
                  PNG, JPG, or WEBP. Local OCR extraction runs privately in your browser.
                </div>
                <span className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors">
                  Choose Image File
                </span>
              </label>
            </div>

            {/* Quick Screenshot Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Or test sample scam screenshot:</span>
              <button
                onClick={() => handleScreenshotPreset('sbi_kyc')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs border border-slate-700"
              >
                SBI KYC SMS Screenshot
              </button>
              <button
                onClick={() => handleScreenshotPreset('electricity')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs border border-slate-700"
              >
                Electricity Bill Cutoff
              </button>
              <button
                onClick={() => handleScreenshotPreset('paypal')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs border border-slate-700"
              >
                PayPal Restrict Email
              </button>
            </div>

            {ocrProgress !== null && (
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300 flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Performing visual OCR text extraction & heuristic scoring ({ocrProgress}%)...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              {activeChannel === 'URL' ? (
                <div className="relative">
                  <input
                    type="text"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleScan()}
                    placeholder="e.g. https://paypal.com@verify-account-update.xyz/login"
                    className="w-full pl-4 pr-12 py-4 bg-slate-950 rounded-2xl border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 placeholder-slate-500 text-sm font-mono transition-colors"
                  />
                  {inputVal && (
                    <button
                      onClick={() => setInputVal('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>
              ) : (
                <textarea
                  rows={4}
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  placeholder={
                    activeChannel === 'SMS'
                      ? 'Paste SMS message body here (e.g. "Your SBI account is blocked. Click here to verify OTP...")'
                      : 'Paste raw email text or HTML snippet with links and sender information...'
                  }
                  className="w-full p-4 bg-slate-950 rounded-2xl border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 placeholder-slate-500 text-sm transition-colors"
                />
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Quick Sample Selector */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Try Sample:</span>
                </span>
                {QUICK_SCAN_SAMPLES.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSampleClick(s)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-cyan-200 border border-slate-700/60 transition-colors"
                  >
                    {s.label.split(':')[0]}
                  </button>
                ))}
              </div>

              {/* Scan Action Button */}
              <button
                onClick={() => handleScan()}
                disabled={isScanning || !inputVal.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-950/60 transition-all cursor-pointer"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Indicators...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Analyze for Threat</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scan Results View */}
      {scanResult && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Risk Gauge */}
            <div className="lg:col-span-1">
              <RiskGauge score={scanResult.score} riskLevel={scanResult.riskLevel} />
            </div>

            {/* Column 2 & 3: Indicators breakdown & Protective Advice */}
            <div className="lg:col-span-2 space-y-6">
              <AdviceCard
                riskLevel={scanResult.riskLevel}
                advice={scanResult.advice}
                defangedUrl={scanResult.defangedUrl}
                rawInput={scanResult.input}
                onReportClick={handleReportPreFill}
              />

              <IndicatorsList indicators={scanResult.indicators} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
