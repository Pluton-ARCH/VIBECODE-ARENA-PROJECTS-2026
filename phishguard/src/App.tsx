import React, { useState } from 'react';
import { Navbar, ActivePage } from './components/Navbar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScanCard } from './components/Scanner/ScanCard';
import { EducationHub } from './components/Education/EducationHub';
import { ReportForm } from './components/Reporting/ReportForm';
import { TrackReport } from './components/Reporting/TrackReport';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { EvaluationHub } from './components/Evaluation/EvaluationHub';
import { DemoModal } from './components/Demo/DemoModal';
import { PitchDeckModal } from './components/Demo/PitchDeckModal';
import { EvaluationSample } from './shared/dictionary';

export function App() {
  const [activePage, setActivePage] = useState<ActivePage>('scan');
  const [isDark, setIsDark] = useState(true);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(false);

  // Pre-fill state between Scanner -> Report
  const [reportPreFill, setReportPreFill] = useState<{
    channel: string;
    target: string;
    description: string;
  } | null>(null);

  // Pre-fill state between Report -> Track
  const [trackedReportCode, setTrackedReportCode] = useState<string>('');

  const handleToggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const handlePreFillReport = (data: { channel: string; target: string; description: string }) => {
    setReportPreFill(data);
    setActivePage('report');
  };

  const handleNavigateToTrack = (code: string) => {
    setTrackedReportCode(code);
    setActivePage('track');
  };

  const handleLoadSampleToScanner = (sample: EvaluationSample) => {
    setActivePage('scan');
  };

  const handleRunDemoStepAction = (stepNumber: number) => {
    if (stepNumber === 1 || stepNumber === 2) {
      setActivePage('scan');
    } else if (stepNumber === 3) {
      setActivePage('report');
    } else if (stepNumber === 4) {
      setActivePage('admin');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#050811] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Navigation Bar */}
      <Navbar
        activePage={activePage}
        onPageChange={setActivePage}
        onOpenDemo={() => setIsDemoOpen(true)}
        onOpenPitch={() => setIsPitchOpen(true)}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero banner shown on main scan page */}
        {activePage === 'scan' && (
          <Header
            onQuickStart={() => setActivePage('scan')}
            onOpenLearn={() => setActivePage('learn')}
          />
        )}

        {/* View Router */}
        {activePage === 'scan' && (
          <ScanCard onPreFillReport={handlePreFillReport} />
        )}

        {activePage === 'learn' && (
          <EducationHub />
        )}

        {activePage === 'report' && (
          <ReportForm
            preFillData={reportPreFill}
            onNavigateToTrack={handleNavigateToTrack}
          />
        )}

        {activePage === 'track' && (
          <TrackReport initialCode={trackedReportCode} />
        )}

        {activePage === 'evaluate' && (
          <EvaluationHub onLoadSampleToScanner={handleLoadSampleToScanner} />
        )}

        {activePage === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* 60-Second Demo Modal */}
      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onRunStepAction={handleRunDemoStepAction}
      />

      {/* 5-Slide Pitch Deck Modal */}
      <PitchDeckModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
      />
    </div>
  );
}

export default App;
