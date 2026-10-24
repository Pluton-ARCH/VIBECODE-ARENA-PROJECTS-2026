import React, { useState, useEffect } from 'react';
import { EVALUATION_DATASET } from '../../data/seedData';
import { runDetection } from '../../server/engine/scorer';
import { ConfusionMatrix, EvaluationSample, ScanResult } from '../../shared/dictionary';
import {
  Activity,
  Play,
  CheckCircle2,
  AlertOctagon,
  Percent,
  Sliders,
  Filter,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface EvaluationHubProps {
  onLoadSampleToScanner: (sample: EvaluationSample) => void;
}

interface EvaluatedItem {
  sample: EvaluationSample;
  result: ScanResult;
  predicted: 'phishing' | 'legitimate';
  classification: 'TP' | 'FP' | 'TN' | 'FN';
}

export const EvaluationHub: React.FC<EvaluationHubProps> = ({ onLoadSampleToScanner }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [evaluatedItems, setEvaluatedItems] = useState<EvaluatedItem[]>([]);
  const [matrix, setMatrix] = useState<ConfusionMatrix | null>(null);
  const [filterClass, setFilterClass] = useState<'ALL' | 'TP' | 'FP' | 'TN' | 'FN' | 'MISCLASSIFIED'>('ALL');

  const runBenchmark = () => {
    setIsRunning(true);
    setTimeout(() => {
      let tp = 0;
      let fp = 0;
      let tn = 0;
      let fn = 0;

      const items: EvaluatedItem[] = EVALUATION_DATASET.map(sample => {
        const result = runDetection(sample.channel, sample.content);
        // Classification logic: High or Medium risk is predicted as phishing/suspicious; Low is legitimate
        const predicted: 'phishing' | 'legitimate' = result.riskLevel !== 'LOW' ? 'phishing' : 'legitimate';

        let classification: 'TP' | 'FP' | 'TN' | 'FN';
        if (sample.groundTruth === 'phishing' && predicted === 'phishing') {
          classification = 'TP';
          tp++;
        } else if (sample.groundTruth === 'legitimate' && predicted === 'phishing') {
          classification = 'FP';
          fp++;
        } else if (sample.groundTruth === 'legitimate' && predicted === 'legitimate') {
          classification = 'TN';
          tn++;
        } else {
          classification = 'FN';
          fn++;
        }

        return {
          sample,
          result,
          predicted,
          classification
        };
      });

      const total = items.length;
      const accuracy = total > 0 ? ((tp + tn) / total) * 100 : 0;
      const precision = tp + fp > 0 ? (tp / (tp + fp)) * 100 : 0;
      const recall = tp + fn > 0 ? (tp / (tp + fn)) * 100 : 0;
      const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
      const falsePositiveRate = fp + tn > 0 ? (fp / (fp + tn)) * 100 : 0;

      setMatrix({
        tp,
        fp,
        tn,
        fn,
        accuracy,
        precision,
        recall,
        f1Score,
        falsePositiveRate
      });

      setEvaluatedItems(items);
      setIsRunning(false);
    }, 200);
  };

  useEffect(() => {
    runBenchmark();
  }, []);

  const filteredItems = evaluatedItems.filter(item => {
    if (filterClass === 'ALL') return true;
    if (filterClass === 'MISCLASSIFIED') return item.classification === 'FP' || item.classification === 'FN';
    return item.classification === filterClass;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Card */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full">
              Automated Forensic Benchmark Harness
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 mt-2">
              Engine Performance & Evaluation Dataset
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Continuous validation against 60 balanced samples (30 active cybercrime vectors + 30 legitimate transactional controls) measuring precision, recall, and false positive resistance.
            </p>
          </div>

          <button
            onClick={runBenchmark}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-cyan-950/50 cursor-pointer self-start md:self-auto shrink-0"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{isRunning ? 'Running Benchmark...' : 'Re-Run All 60 Tests'}</span>
          </button>
        </div>
      </div>

      {/* Confusion Matrix & Metrics Grid */}
      {matrix && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Column 1 & 2: Performance Metrics */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accuracy</span>
              <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
                {matrix.accuracy.toFixed(1)}%
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Overall Correctness</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Precision</span>
              <div className="text-3xl font-black font-mono text-cyan-400 mt-1">
                {matrix.precision.toFixed(1)}%
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Threat Accuracy</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recall</span>
              <div className="text-3xl font-black font-mono text-cyan-400 mt-1">
                {matrix.recall.toFixed(1)}%
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Threat Catch Rate</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">False Positive Rate</span>
              <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
                {matrix.falsePositiveRate.toFixed(1)}%
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">False Alarm Resistance</span>
            </div>
          </div>

          {/* Column 3: 2x2 Confusion Matrix Box */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Confusion Matrix (N = 60)
            </span>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="text-[10px] uppercase text-emerald-400 font-mono">True Positives (TP)</div>
                <div className="text-2xl font-black font-mono text-emerald-300 mt-0.5">{matrix.tp}</div>
                <div className="text-[10px] text-slate-400">Scams Caught</div>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <div className="text-[10px] uppercase text-rose-400 font-mono">False Positives (FP)</div>
                <div className="text-2xl font-black font-mono text-rose-300 mt-0.5">{matrix.fp}</div>
                <div className="text-[10px] text-slate-400">False Alarms</div>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <div className="text-[10px] uppercase text-rose-400 font-mono">False Negatives (FN)</div>
                <div className="text-2xl font-black font-mono text-rose-300 mt-0.5">{matrix.fn}</div>
                <div className="text-[10px] text-slate-400">Missed Threats</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="text-[10px] uppercase text-emerald-400 font-mono">True Negatives (TN)</div>
                <div className="text-2xl font-black font-mono text-emerald-300 mt-0.5">{matrix.tn}</div>
                <div className="text-[10px] text-slate-400">Legit Cleared</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dataset Filter & Inspection List */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Benchmark Dataset Samples ({filteredItems.length})</span>
          </h4>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterClass('ALL')}
              className={`px-3 py-1 rounded-lg ${filterClass === 'ALL' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              All (60)
            </button>
            <button
              onClick={() => setFilterClass('TP')}
              className={`px-3 py-1 rounded-lg ${filterClass === 'TP' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              TP (Caught)
            </button>
            <button
              onClick={() => setFilterClass('TN')}
              className={`px-3 py-1 rounded-lg ${filterClass === 'TN' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              TN (Legit Cleared)
            </button>
            <button
              onClick={() => setFilterClass('MISCLASSIFIED')}
              className={`px-3 py-1 rounded-lg ${filterClass === 'MISCLASSIFIED' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Misclassified ({matrix ? matrix.fp + matrix.fn : 0})
            </button>
          </div>
        </div>

        {/* Samples Table / List */}
        <div className="space-y-2.5">
          {filteredItems.map(item => {
            const isCorrect = item.sample.groundTruth === item.predicted;
            return (
              <div
                key={item.sample.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400">{item.sample.id}</span>
                    <span className="text-xs font-bold text-slate-200">{item.sample.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.sample.channel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-mono truncate select-all">
                    {item.sample.content}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span>Truth: <strong className="uppercase text-slate-300">{item.sample.groundTruth}</strong></span>
                    <span>•</span>
                    <span>Engine Score: <strong className="font-mono text-cyan-400">{item.result.score}/100</strong> ({item.result.riskLevel})</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase ${
                    isCorrect
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {item.classification}
                  </span>

                  <button
                    onClick={() => onLoadSampleToScanner(item.sample)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                    title="Load into scanner tab"
                  >
                    <span>Test in Scanner</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
