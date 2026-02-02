import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Edit3, X, Check, Maximize2, Minimize2, FileText, Eye, EyeOff } from 'lucide-react';

// ============================================
// THEME & COLORS
// ============================================
const colors = {
  green: '#d2f058',
  graphite: '#3b3b3c',
  powder: '#b7e4f7',
  desert: '#f9aa7d',
  ash: '#d3d1c5',
  ashLight: '#eeeeea',
  darkBlue: '#1a3a5c',
};

// ============================================
// PRESENTER NOTES (editable per slide)
// ============================================
const defaultPresenterNotes = {
  0: "Welcome the audience. Introduce yourself and the Epicosity team. Set the stage for a strategic conversation about growth and security.",
  1: "Pause for effect. This isn't fear-mongering—it's a wake-up call. Let the numbers sink in before moving forward.",
  2: "Acknowledge Century's legacy. This slide builds emotional connection before diving into solutions.",
  3: "Celebrate their expansion. Make them feel proud of their growth trajectory.",
  4: "Rhetorical question. Let it hang for a moment. This is the pivot point of the presentation.",
  5: "Soften the pitch. We're partners, not vendors.",
  6: "Side-by-side comparison creates clear contrast. Emphasize the architectural difference.",
  7: "Transition slide. Brief pause before diving into the core problem.",
  8: "Identify the pain point they're experiencing daily. Marketing teams relate to this immediately.",
  9: "The solution reveal. Energy should pick up here.",
  10: "Explain the bridge metaphor. Keep it simple and tangible.",
  11: "Show you understand their specific technical environment.",
  12: "Walk through the data flow visually. Point at each stage.",
  13: "Transition to security focus.",
  14: "The table is powerful—let them read it. The compliance badges add credibility.",
  15: "Transition to growth possibilities.",
  16: "Concrete campaign examples make it real. Reference their specific markets.",
  17: "More concrete examples focused on prospect acquisition.",
  18: "Social proof. Let the quote speak for itself.",
  19: "ROI transition—this is what leadership cares about.",
  20: "Explain attribution clearly. The dashboard stats should impress.",
  21: "Implementation overview transition.",
  22: "Walk through each phase. Emphasize quick wins.",
  23: "Stakeholder-specific value proposition.",
  24: "Summary of benefits by role.",
  25: "Why Epicosity transition.",
  26: "Credibility slide. Introduce team members briefly.",
  27: "Build anticipation for the demo.",
  28: "LIVE DEMO—have dev site ready. Show specific features.",
  29: "Investment transition.",
  30: "INTERACTIVE PRICING—let them play with the calculator. Be ready to answer questions.",
  31: "Next steps transition.",
  32: "Clear action items. Make it easy to say yes.",
  33: "Call to action.",
  34: "Thank them. Open for questions.",
};

// ============================================
// LOGO COMPONENT
// ============================================
const Logo = ({ variant = 'dark' }) => {
  const gradientId = `logo-gradient-${variant}-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <svg width="140" height="32" viewBox="0 0 140 32" className="transition-transform duration-300 hover:scale-105">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a4b545" />
          <stop offset="100%" stopColor="#7ab8b8" />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="24"
        fill={variant === 'dark' ? `url(#${gradientId})` : colors.graphite}
        style={{fontSize: 28, fontWeight: 900, fontFamily: 'Arial Black, Arial, sans-serif', letterSpacing: '-0.02em'}}
      >
        epicosity
      </text>
    </svg>
  );
};

// ============================================
// SLIDE WRAPPER COMPONENTS
// ============================================
const TitleSlide = ({ children, bg = `linear-gradient(135deg, ${colors.graphite} 0%, #2a2a2b 100%)`, isActive }) => (
  <div
    className={`h-full flex flex-col items-center justify-center text-center p-8 md:p-12 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
    style={{background: bg}}
  >
    <div className="animate-fade-in-up">
      {children}
    </div>
  </div>
);

const ContentSlide = ({ title, children, bg = colors.ashLight, dark = false, isActive }) => (
  <div
    className={`h-full flex flex-col p-6 md:p-10 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
    style={{backgroundColor: bg}}
  >
    <div className="mb-4 animate-fade-in"><Logo variant={dark ? 'dark' : 'light'} /></div>
    <h2
      className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 animate-fade-in-up"
      style={{color: dark ? colors.green : colors.graphite, animationDelay: '100ms'}}
    >
      {title}
    </h2>
    <div className="flex-1 flex flex-col justify-center animate-fade-in-up" style={{animationDelay: '200ms'}}>
      {children}
    </div>
  </div>
);

// ============================================
// MAIN PRESENTATION COMPONENT
// ============================================
export default function Presentation() {
  const [slide, setSlide] = useState(0);
  const [platforms, setPlatforms] = useState(1);
  const [showAnnual, setShowAnnual] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [presenterNotes, setPresenterNotes] = useState(defaultPresenterNotes);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);

  // Pricing calculations
  const integrationCost = platforms === 1 ? 27500 : 42500;
  const prismaticAnnual = 12000;
  const supportAnnual = 28800;
  const hubspotAnnual = 59040;
  const totalYear1 = integrationCost + prismaticAnnual + supportAnnual + hubspotAnnual;
  const totalOngoing = prismaticAnnual + supportAnnual + hubspotAnnual;

  // Content management
  const getContent = (key, defaultVal) => editedContent[key] !== undefined ? editedContent[key] : defaultVal;

  // Slide navigation with transition
  const goToSlide = useCallback((newSlide) => {
    if (newSlide < 0 || newSlide >= 35 || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSlide(newSlide);
      setIsTransitioning(false);
    }, 150);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => goToSlide(slide + 1), [slide, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(slide - 1), [slide, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (editMode) return; // Disable nav when editing

      switch(e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'Backspace':
          e.preventDefault();
          prevSlide();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(34);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          setShowNotes(prev => !prev);
          break;
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slide, editMode, isFullscreen, nextSlide, prevSlide, goToSlide]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Editable text component
  const EditableText = ({ id, defaultText, className = '', style = {}, multiline = false }) => {
    const [localEdit, setLocalEdit] = useState(false);
    const [tempVal, setTempVal] = useState('');
    const currentVal = getContent(id, defaultText);

    if (editMode && localEdit) {
      return multiline ? (
        <div className="flex gap-2 items-start">
          <textarea
            value={tempVal}
            onChange={e => setTempVal(e.target.value)}
            className="flex-1 p-2 rounded border-2 border-blue-500 focus:ring-2 focus:ring-blue-300"
            style={{...style, minHeight: 80}}
            autoFocus
          />
          <button
            onClick={() => { setEditedContent({...editedContent, [id]: tempVal}); setLocalEdit(false); }}
            className="p-1 bg-green-500 rounded hover:bg-green-600 transition-colors"
          >
            <Check size={16} color="white"/>
          </button>
          <button
            onClick={() => setLocalEdit(false)}
            className="p-1 bg-red-500 rounded hover:bg-red-600 transition-colors"
          >
            <X size={16} color="white"/>
          </button>
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <input
            value={tempVal}
            onChange={e => setTempVal(e.target.value)}
            className="flex-1 p-2 rounded border-2 border-blue-500 focus:ring-2 focus:ring-blue-300"
            style={style}
            autoFocus
          />
          <button
            onClick={() => { setEditedContent({...editedContent, [id]: tempVal}); setLocalEdit(false); }}
            className="p-1 bg-green-500 rounded hover:bg-green-600 transition-colors"
          >
            <Check size={16} color="white"/>
          </button>
          <button
            onClick={() => setLocalEdit(false)}
            className="p-1 bg-red-500 rounded hover:bg-red-600 transition-colors"
          >
            <X size={16} color="white"/>
          </button>
        </div>
      );
    }

    return (
      <span
        className={`${className} ${editMode ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-2 rounded transition-all duration-200' : ''}`}
        style={style}
        onClick={() => { if(editMode) { setTempVal(currentVal); setLocalEdit(true); } }}
      >
        {currentVal}
      </span>
    );
  };

  // Progress bar component
  const ProgressBar = () => (
    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
      <div
        className="h-full transition-all duration-300 ease-out"
        style={{
          width: `${((slide + 1) / 35) * 100}%`,
          background: `linear-gradient(90deg, ${colors.green}, ${colors.powder})`
        }}
      />
    </div>
  );

  // Presenter notes panel
  const NotesPanel = () => (
    <div
      className={`absolute right-0 top-0 bottom-0 w-80 bg-gray-900 border-l border-gray-700 p-4 transition-transform duration-300 ${showNotes ? 'translate-x-0' : 'translate-x-full'}`}
      style={{zIndex: 50}}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          <FileText size={18} />
          Presenter Notes
        </h3>
        <button onClick={() => setShowNotes(false)} className="text-gray-400 hover:text-white">
          <X size={18} />
        </button>
      </div>
      <div className="text-sm text-gray-300 leading-relaxed">
        <textarea
          value={presenterNotes[slide] || ''}
          onChange={(e) => setPresenterNotes({...presenterNotes, [slide]: e.target.value})}
          className="w-full h-64 bg-gray-800 text-gray-300 p-3 rounded border border-gray-700 focus:border-green-500 focus:outline-none resize-none"
          placeholder="Add notes for this slide..."
        />
      </div>
      <div className="mt-4 text-xs text-gray-500">
        Slide {slide + 1} of 35
      </div>
    </div>
  );

  // ============================================
  // SLIDES CONTENT
  // ============================================
  const slides = [
    // 1: Title
    <TitleSlide key={0} isActive={slide === 0}>
      <Logo variant="dark" />
      <h1 className="text-4xl md:text-5xl font-bold text-white mt-8 mb-4">
        <EditableText id="title-main" defaultText="Core Connected Marketing" />
      </h1>
      <p className="text-lg md:text-xl" style={{color: colors.powder}}>
        <EditableText id="title-sub" defaultText="The Growth Engine for Century Bank's Next Chapter." />
      </p>
      <p className="mt-10 text-sm" style={{color: colors.ash}}>
        300 N MAIN AVE. SIOUX FALLS, SD 57104 | 605.275.3742 | EPICOSITY.COM
      </p>
    </TitleSlide>,

    // 2: Breach Stats
    <ContentSlide key={1} title="" bg={colors.graphite} dark isActive={slide === 1}>
      <div>
        <p className="text-3xl md:text-4xl font-bold mb-4" style={{color: colors.desert}}>
          <EditableText id="breach-stat" defaultText="823,548 customers exposed." />
        </p>
        <p className="text-xl md:text-2xl mb-3" style={{color: colors.powder}}>80+ banks and credit unions.</p>
        <p className="text-lg md:text-xl mb-3" style={{color: colors.powder}}>SSNs. Account numbers. Dates of birth.</p>
        <p className="text-lg md:text-xl mb-8" style={{color: colors.powder}}>One vendor. One breach. One lesson.</p>
        <p className="text-base md:text-lg" style={{color: colors.desert}}>This is about architecture.</p>
      </div>
    </ContentSlide>,

    // 3: The Legacy - 137 Years
    <TitleSlide key={2} bg={`linear-gradient(135deg, ${colors.darkBlue} 0%, #2c5a7c 100%)`} isActive={slide === 2}>
      <h2 className="text-3xl md:text-4xl font-light text-white mb-4">The legacy.</h2>
      <p className="text-6xl md:text-8xl font-bold text-white">
        <EditableText id="years" defaultText="137" /> <span className="text-2xl md:text-3xl font-light">years.</span>
      </p>
      <p className="text-lg md:text-xl mt-8" style={{color: colors.powder}}>You survived by being the <em style={{color: colors.green}}>most trusted</em>.</p>
      <p className="text-base md:text-lg mt-6" style={{color: colors.desert}}>That trust is why this decision matters.</p>
    </TitleSlide>,

    // 4: Now You're Growing
    <ContentSlide key={3} title="Now you're growing." isActive={slide === 3}>
      <div>
        <ul className="space-y-4 text-lg md:text-xl" style={{color: colors.graphite}}>
          <li className="flex items-start gap-2">
            <span style={{color: colors.darkBlue, fontWeight: 'bold'}}>▪</span>
            <span>Six branches across New Mexico.</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{color: colors.darkBlue, fontWeight: 'bold'}}>▪</span>
            <span>Loan production offices in Dallas & Houston.</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{color: colors.darkBlue, fontWeight: 'bold'}}>▪</span>
            <span>Los Alamos — new building at Trinity Drive, across from Ashley Pond.</span>
          </li>
        </ul>
        <p className="mt-8 text-lg md:text-xl" style={{color: colors.graphite}}>New markets. New customers. New expectations.</p>
        <p className="text-lg md:text-xl font-bold mt-3" style={{color: colors.desert}}>This is the moment.</p>
      </div>
    </ContentSlide>,

    // 5: Does the way you market today scale?
    <TitleSlide key={4} bg={`linear-gradient(135deg, ${colors.darkBlue} 0%, #2c5a7c 100%)`} isActive={slide === 4}>
      <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-2xl">
        <EditableText id="scale-q" defaultText="Does the way you market today scale to where you're going tomorrow?" multiline />
      </h2>
      <p className="text-lg md:text-xl mt-6" style={{color: colors.desert}}>And does it protect you while you get there?</p>
    </TitleSlide>,

    // 6: We're not here to pitch software
    <ContentSlide key={5} title="We're not here to pitch software." isActive={slide === 5}>
      <div>
        <p className="text-lg md:text-xl mb-6" style={{color: colors.graphite}}>
          We're here to talk about what Core Connected Marketing means for Century's next chapter.
        </p>
        <p className="text-lg md:text-xl" style={{color: colors.graphite}}>
          And why this choice shapes how you grow for the next decade.
        </p>
      </div>
    </ContentSlide>,

    // 7: Where your customer data lives matters
    <ContentSlide key={6} title="Where your customer data lives matters." isActive={slide === 6}>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="flex-1 rounded-lg p-4 md:p-6 transition-transform hover:scale-[1.02]" style={{backgroundColor: 'white', border: `3px solid ${colors.desert}`}}>
          <h3 className="font-bold text-lg md:text-xl mb-4" style={{color: colors.desert}}>Old Model:</h3>
          <ul className="space-y-2 md:space-y-3 text-base md:text-lg" style={{color: colors.graphite}}>
            <li>▪ Vendor stores your customer database</li>
            <li>▪ SSNs, account numbers, balances all in one external system</li>
            <li>▪ One breach = 80+ institutions exposed</li>
            <li>▪ 3+ months before notification</li>
          </ul>
        </div>
        <div className="flex-1 rounded-lg p-4 md:p-6 transition-transform hover:scale-[1.02]" style={{backgroundColor: colors.darkBlue}}>
          <h3 className="font-bold text-lg md:text-xl mb-4" style={{color: colors.green}}>The Core Connected Model:</h3>
          <ul className="space-y-2 md:space-y-3 text-base md:text-lg" style={{color: colors.powder}}>
            <li><span style={{color: colors.green}}>✓</span> Your core remains source of truth</li>
            <li><span style={{color: colors.green}}>✓</span> Only marketing-relevant data moves</li>
            <li><span style={{color: colors.green}}>✓</span> One-way, read-only sync</li>
            <li><span style={{color: colors.green}}>✓</span> Your data never leaves your control</li>
          </ul>
        </div>
      </div>
    </ContentSlide>,

    // 8: The disconnect
    <TitleSlide key={7} bg={`linear-gradient(135deg, ${colors.darkBlue} 0%, #2c5a7c 100%)`} isActive={slide === 7}>
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">The disconnect.</h2>
      <p className="text-xl md:text-2xl" style={{color: colors.powder}}>Multiple systems. One customer.</p>
      <p className="text-xl md:text-2xl" style={{color: colors.desert}}>No connection.</p>
    </TitleSlide>,

    // 9: Your core is powerful
    <ContentSlide key={8} title="Your core is powerful." isActive={slide === 8}>
      <div>
        <p className="text-lg md:text-xl mb-5" style={{color: colors.graphite}}>
          Your core knows everything. Every relationship. Every product. Every dollar that moves.
        </p>
        <p className="text-lg md:text-xl mb-5" style={{color: colors.graphite}}>
          Your marketing doesn't – leaving customers getting the wrong message at the wrong time.
        </p>
        <p className="text-lg md:text-xl font-bold" style={{color: colors.darkBlue}}>
          The data exists. It's not connected.
        </p>
      </div>
    </ContentSlide>,

    // 10: The solution
    <TitleSlide key={9} bg={colors.green} isActive={slide === 9}>
      <h2 className="text-4xl md:text-5xl font-bold" style={{color: colors.graphite}}>The solution.</h2>
      <p className="text-xl md:text-2xl mt-4" style={{color: colors.darkBlue}}>Core Connected Marketing.</p>
    </TitleSlide>,

    // 11: What it actually is
    <ContentSlide key={10} title="What it actually is." isActive={slide === 10}>
      <div>
        <p className="text-lg md:text-xl mb-5" style={{color: colors.graphite}}>
          A secure bridge between your core and HubSpot.
        </p>
        <p className="text-lg md:text-xl mb-5" style={{color: colors.graphite}}>
          So every message, every ad, every email is triggered by real customer behavior.
        </p>
        <p className="text-lg md:text-xl font-bold" style={{color: colors.darkBlue}}>Not guesswork.</p>
      </div>
    </ContentSlide>,

    // 12: We understand how your systems are built
    <ContentSlide key={11} title="We understand how your systems are built." isActive={slide === 11}>
      <div>
        <p className="text-lg md:text-xl mb-4" style={{color: colors.graphite}}>
          No account hierarchies. No loan mapping. No way to see the full customer relationship.
        </p>
        <p className="text-lg md:text-xl mb-4" style={{color: colors.graphite}}>
          We build HubSpot to think like a core — from day one.
        </p>
        <p className="text-lg md:text-xl mb-4" style={{color: colors.graphite}}>
          Banking customers. Account relationships. Core-connected deals.
        </p>
        <p className="text-lg md:text-xl font-bold" style={{color: colors.darkBlue}}>
          No retrofitting. Built right from the start.
        </p>
      </div>
    </ContentSlide>,

    // 13: How it actually connects
    <ContentSlide key={12} title="How it actually connects." isActive={slide === 12}>
      <div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6 text-sm md:text-lg font-bold" style={{color: colors.graphite}}>
          <span className="px-2 md:px-3 py-2 rounded transition-transform hover:scale-105" style={{backgroundColor: colors.powder}}>Your Core</span>
          <span style={{color: colors.desert}}>→</span>
          <span className="px-2 md:px-3 py-2 rounded transition-transform hover:scale-105" style={{backgroundColor: colors.desert, color: 'white'}}>Secure Export</span>
          <span style={{color: colors.desert}}>→</span>
          <span className="px-2 md:px-3 py-2 rounded transition-transform hover:scale-105" style={{backgroundColor: colors.darkBlue, color: 'white'}}>Integration Layer</span>
          <span style={{color: colors.desert}}>→</span>
          <span className="px-2 md:px-3 py-2 rounded transition-transform hover:scale-105" style={{backgroundColor: colors.green}}>HubSpot</span>
        </div>
        <ul className="space-y-2 md:space-y-3 text-base md:text-lg" style={{color: colors.graphite}}>
          <li><span style={{color: colors.darkBlue, fontWeight: 'bold'}}>▪</span> Customer and account data syncs on a scheduled basis</li>
          <li><span style={{color: colors.darkBlue, fontWeight: 'bold'}}>▪</span> Only marketing-relevant fields move over, not sensitive PII</li>
          <li><span style={{color: colors.darkBlue, fontWeight: 'bold'}}>▪</span> Changes in the core trigger updates in HubSpot automatically</li>
          <li><span style={{color: colors.darkBlue, fontWeight: 'bold'}}>▪</span> HubSpot engagement data stays in HubSpot — doesn't write back</li>
        </ul>
        <p className="text-lg md:text-xl font-bold mt-6" style={{color: colors.darkBlue}}>One-way sync. Secure handoff. Clear boundaries.</p>
      </div>
    </ContentSlide>,

    // 14: Data integrity and security
    <TitleSlide key={13} bg={colors.green} isActive={slide === 13}>
      <h2 className="text-4xl md:text-5xl font-bold" style={{color: colors.graphite}}>Data integrity and security.</h2>
    </TitleSlide>,

    // 15: Secure. Compliant. Automated.
    <ContentSlide key={14} title="Secure. Compliant. Automated." isActive={slide === 14}>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr style={{backgroundColor: colors.darkBlue}}>
                <th className="p-2 md:p-3 text-left" style={{color: colors.powder}}>What Moves</th>
                <th className="p-2 md:p-3 text-left" style={{color: colors.powder}}>What Doesn't</th>
                <th className="p-2 md:p-3 text-left" style={{color: colors.desert}}>Old Model Risk</th>
              </tr>
            </thead>
            <tbody style={{backgroundColor: 'white'}}>
              <tr className="border-b"><td className="p-2 md:p-3" style={{color: colors.graphite}}>Hashed customer IDs</td><td className="p-2 md:p-3" style={{color: colors.graphite}}>SSNs</td><td className="p-2 md:p-3 font-bold" style={{color: colors.desert}}>✗ SSNs stored externally</td></tr>
              <tr className="border-b"><td className="p-2 md:p-3" style={{color: colors.graphite}}>Product ownership flags</td><td className="p-2 md:p-3" style={{color: colors.graphite}}>Account balances</td><td className="p-2 md:p-3 font-bold" style={{color: colors.desert}}>✗ Balances exposed</td></tr>
              <tr className="border-b"><td className="p-2 md:p-3" style={{color: colors.graphite}}>Lifecycle dates</td><td className="p-2 md:p-3" style={{color: colors.graphite}}>Transaction details</td><td className="p-2 md:p-3 font-bold" style={{color: colors.desert}}>✗ Full history</td></tr>
              <tr><td className="p-2 md:p-3" style={{color: colors.graphite}}>Segment assignments</td><td className="p-2 md:p-3" style={{color: colors.graphite}}>Sensitive PII</td><td className="p-2 md:p-3 font-bold" style={{color: colors.desert}}>✗ Complete records</td></tr>
            </tbody>
          </table>
        </div>
        <div className="w-full md:w-28 flex md:flex-col items-center justify-center gap-2">
          <div className="flex gap-2">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded flex items-center justify-center text-xs font-bold transition-transform hover:scale-110" style={{backgroundColor: colors.powder, color: colors.darkBlue}}>CCPA</div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded flex items-center justify-center text-xs font-bold transition-transform hover:scale-110" style={{backgroundColor: colors.darkBlue, color: colors.powder}}>GDPR</div>
          </div>
          <div className="flex gap-2">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded flex items-center justify-center text-xs font-bold transition-transform hover:scale-110" style={{backgroundColor: colors.desert, color: 'white'}}>SOC</div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded flex items-center justify-center text-xs font-bold transition-transform hover:scale-110" style={{backgroundColor: colors.green, color: colors.graphite}}>TRUSTe</div>
          </div>
        </div>
      </div>
    </ContentSlide>,

    // 16: Then the real growth starts
    <TitleSlide key={15} bg={`linear-gradient(135deg, ${colors.darkBlue} 0%, #2c5a7c 100%)`} isActive={slide === 15}>
      <h2 className="text-4xl md:text-5xl font-bold text-white">Then the real growth starts.</h2>
    </TitleSlide>,

    // 17: What becomes possible - customers
    <ContentSlide key={16} title="What becomes possible — customers." isActive={slide === 16}>
      <div>
        <p className="text-base md:text-lg font-bold mb-4 md:mb-5" style={{color: colors.darkBlue}}>Campaigns that run themselves — triggered by real behavior.</p>
        <div className="space-y-3 md:space-y-4 text-base md:text-lg" style={{color: colors.graphite}}>
          <div className="p-3 rounded-lg transition-all hover:bg-white/50">
            <span className="font-bold" style={{color: colors.darkBlue}}>▪ Welcome Journey - Los Alamos</span><br/>
            <span className="text-sm md:text-base">New account → onboarding → LANL employee triggers → cross-sell wealth at 90 days</span>
          </div>
          <div className="p-3 rounded-lg transition-all hover:bg-white/50">
            <span className="font-bold" style={{color: colors.darkBlue}}>▪ Cross-Sell - Existing Customers</span><br/>
            <span className="text-sm md:text-base">Checking only → detect external mortgage → home equity education → warm handoff</span>
          </div>
          <div className="p-3 rounded-lg transition-all hover:bg-white/50">
            <span className="font-bold" style={{color: colors.darkBlue}}>▪ Loan Renewal - Texas</span><br/>
            <span className="text-sm md:text-base">Loan maturing → refinance offer → Dallas LPO gets warm lead</span>
          </div>
          <div className="p-3 rounded-lg transition-all hover:bg-white/50">
            <span className="font-bold" style={{color: colors.darkBlue}}>▪ 137th Anniversary</span><br/>
            <span className="text-sm md:text-base">Multi-generational families → personalized messaging → event invite</span>
          </div>
        </div>
      </div>
    </ContentSlide>,

    // 18: What becomes possible - Prospects
    <ContentSlide key={17} title="What becomes possible — Prospects." isActive={slide === 17}>
      <div className="space-y-3 md:space-y-4 text-base md:text-lg" style={{color: colors.graphite}}>
        <div className="p-3 rounded-lg transition-all hover:bg-white/50">
          <span className="font-bold" style={{color: colors.darkBlue}}>▪ Los Alamos Market Entry</span><br/>
          <span className="text-sm md:text-base">Search "best bank near me" → see Century → retarget with Trinity Drive campaign</span>
        </div>
        <div className="p-3 rounded-lg transition-all hover:bg-white/50">
          <span className="font-bold" style={{color: colors.darkBlue}}>▪ LANL Employee Targeting</span><br/>
          <span className="text-sm md:text-base">Federal employees within 15 miles → financial wellness → first-time homebuyer</span>
        </div>
        <div className="p-3 rounded-lg transition-all hover:bg-white/50">
          <span className="font-bold" style={{color: colors.darkBlue}}>▪ Competitor Conquest</span><br/>
          <span className="text-sm md:text-base">Geofence competitor branches → serve ads highlighting 137 years of trust</span>
        </div>
        <div className="p-3 rounded-lg transition-all hover:bg-white/50">
          <span className="font-bold" style={{color: colors.darkBlue}}>▪ Texas Expansion Pipeline</span><br/>
          <span className="text-sm md:text-base">Houston/Dallas campaigns → lead capture → nurture → handoff to LPO</span>
        </div>
      </div>
    </ContentSlide>,

    // 19: Success story - Industrial FCU
    <ContentSlide key={18} title="Success story: Industrial FCU" isActive={slide === 18}>
      <div className="rounded-lg p-4 md:p-6 text-base md:text-lg leading-relaxed transition-transform hover:scale-[1.01]" style={{backgroundColor: 'white', color: colors.graphite, border: `3px solid ${colors.darkBlue}`}}>
        <p className="mb-4">"Before working with Epicosity, our marketing team was constantly pulling lists, manually triggering campaigns, and struggling to connect our core data to HubSpot. We knew we had the data, but we couldn't act on it in real time.</p>
        <p className="mb-4">Core Connected Marketing completely changed that. Now, our journeys are behavior-based, our lead alerts are timely, and we can finally show attribution for campaigns that drive real results.</p>
        <p>It is the first time marketing, sales, and digital are working in sync, and our leadership can clearly see the value."</p>
      </div>
    </ContentSlide>,

    // 20: And yes – we can show ROI
    <TitleSlide key={19} bg={`linear-gradient(135deg, ${colors.darkBlue} 0%, #2c5a7c 100%)`} isActive={slide === 19}>
      <h2 className="text-4xl md:text-5xl font-bold text-white">And yes – we can show ROI.</h2>
    </TitleSlide>,

    // 21: Every click. Every conversion. Every dollar.
    <ContentSlide key={20} title="Every click. Every conversion. Every dollar." isActive={slide === 20}>
      <div>
        <ul className="space-y-2 md:space-y-3 text-lg md:text-xl mb-4 md:mb-6" style={{color: colors.graphite}}>
          <li><span style={{color: colors.darkBlue, fontWeight: 'bold'}}>▪</span> Ad clicks → Page visits → Form submissions → Account opened</li>
          <li><span style={{color: colors.darkBlue, fontWeight: 'bold'}}>▪</span> Deal attribution report</li>
          <li><span style={{color: colors.darkBlue, fontWeight: 'bold'}}>▪</span> Campaign influence on closed revenue</li>
        </ul>
        <p className="text-lg md:text-xl mb-4 md:mb-6" style={{color: colors.graphite}}>
          For the first time, you'll be able to answer: <span className="font-bold" style={{color: colors.darkBlue}}>'What did our marketing actually produce?'</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
          <div className="rounded-lg p-4 md:p-5 flex-1 transition-transform hover:scale-105" style={{backgroundColor: colors.desert}}>
            <div className="font-bold text-2xl md:text-3xl text-white">$50,484.32</div>
            <div className="text-base md:text-lg text-white">Associated Deal Value</div>
          </div>
          <div className="rounded-lg p-4 md:p-5 flex-1 transition-transform hover:scale-105" style={{backgroundColor: colors.darkBlue}}>
            <div className="font-bold text-2xl md:text-3xl" style={{color: colors.powder}}>5</div>
            <div className="text-base md:text-lg" style={{color: colors.powder}}>Avg Interactions Per Deal</div>
          </div>
        </div>
      </div>
    </ContentSlide>,

    // 22: How we get there
    <TitleSlide key={21} bg={`linear-gradient(135deg, ${colors.darkBlue} 0%, #2c5a7c 100%)`} isActive={slide === 21}>
      <h2 className="text-4xl md:text-5xl font-bold text-white">How we get there.</h2>
    </TitleSlide>,

    // 23: Timeline
    <ContentSlide key={22} title="Implementation Timeline" isActive={slide === 22}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm md:text-lg">
          <thead>
            <tr style={{backgroundColor: colors.darkBlue}}>
              <th className="p-2 md:p-3 text-left" style={{color: colors.powder}}>Phase</th>
              <th className="p-2 md:p-3 text-left" style={{color: colors.powder}}>What Happens</th>
              <th className="p-2 md:p-3 text-left" style={{color: colors.powder}}>Timeline</th>
              <th className="p-2 md:p-3 text-left" style={{color: colors.green}}>Quick Win</th>
            </tr>
          </thead>
          <tbody style={{backgroundColor: 'white'}}>
            <tr className="border-b hover:bg-gray-50 transition-colors"><td className="p-2 md:p-3 font-bold" style={{color: colors.darkBlue}}>Discovery</td><td className="p-2 md:p-3" style={{color: colors.graphite}}>Executive priorities, core data mapping</td><td className="p-2 md:p-3" style={{color: colors.graphite}}>Weeks 1-3</td><td className="p-2 md:p-3" style={{color: colors.darkBlue}}>Architecture review</td></tr>
            <tr className="border-b hover:bg-gray-50 transition-colors"><td className="p-2 md:p-3 font-bold" style={{color: colors.darkBlue}}>HubSpot Build</td><td className="p-2 md:p-3" style={{color: colors.graphite}}>Platform setup, custom objects, workflows</td><td className="p-2 md:p-3" style={{color: colors.graphite}}>Weeks 4-8</td><td className="p-2 md:p-3" style={{color: colors.darkBlue}}>First workflow live</td></tr>
            <tr className="border-b hover:bg-gray-50 transition-colors"><td className="p-2 md:p-3 font-bold" style={{color: colors.darkBlue}}>Integration</td><td className="p-2 md:p-3" style={{color: colors.graphite}}>Core connection, sync testing</td><td className="p-2 md:p-3" style={{color: colors.graphite}}>Weeks 6-10</td><td className="p-2 md:p-3" style={{color: colors.darkBlue}}>Sync validated</td></tr>
            <tr className="border-b hover:bg-gray-50 transition-colors"><td className="p-2 md:p-3 font-bold" style={{color: colors.darkBlue}}>Campaigns</td><td className="p-2 md:p-3" style={{color: colors.graphite}}>Welcome journeys, cross-sell, acquisition</td><td className="p-2 md:p-3" style={{color: colors.graphite}}>Weeks 9-12</td><td className="p-2 md:p-3" style={{color: colors.darkBlue}}>Los Alamos ready</td></tr>
            <tr className="hover:bg-gray-50 transition-colors"><td className="p-2 md:p-3 font-bold" style={{color: colors.darkBlue}}>Launch</td><td className="p-2 md:p-3" style={{color: colors.graphite}}>Go live, monitor, refine</td><td className="p-2 md:p-3" style={{color: colors.graphite}}>Week 13+</td><td className="p-2 md:p-3" style={{color: colors.darkBlue}}>First conversions</td></tr>
          </tbody>
        </table>
      </div>
    </ContentSlide>,

    // 24: Why this matters to each of you
    <TitleSlide key={23} bg={`linear-gradient(135deg, ${colors.darkBlue} 0%, #2c5a7c 100%)`} isActive={slide === 23}>
      <h2 className="text-4xl md:text-5xl font-bold text-white">Why this matters to each of you.</h2>
    </TitleSlide>,

    // 25: What this means for Century Bank
    <ContentSlide key={24} title="What this means for Century Bank." isActive={slide === 24}>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {['Marketing becomes a revenue engine. Every dollar traceable.','No more manual list pulls. A system that scales.','Secure. Compliant. Integrated.','Audit-ready architecture. No SSN exposure.','Tools to execute strategy with proof.'].map((t,i)=>(
          <div key={i} className="rounded-lg p-3 md:p-4 transition-all hover:scale-105 hover:shadow-lg" style={{backgroundColor: colors.darkBlue}}>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full mb-2 md:mb-3" style={{backgroundColor: colors.green}}/>
            <p style={{color: colors.powder}} className="text-sm md:text-base leading-tight">{t}</p>
          </div>
        ))}
      </div>
    </ContentSlide>,

    // 26: Why Epicosity
    <TitleSlide key={25} bg={`linear-gradient(135deg, ${colors.darkBlue} 0%, #2c5a7c 100%)`} isActive={slide === 25}>
      <h2 className="text-4xl md:text-5xl font-bold text-white">Why <span style={{color: colors.green}}>Epicosity.</span></h2>
    </TitleSlide>,

    // 27: We're not integrators who dabble in marketing
    <ContentSlide key={26} title="We're not integrators who dabble in marketing." isActive={slide === 26}>
      <div>
        <p className="text-lg md:text-xl mb-3" style={{color: colors.graphite}}>We're marketers who learned how to integrate.</p>
        <p className="text-lg md:text-xl mb-4" style={{color: colors.graphite}}>20+ years in financial institutions. We know compliance, board questions, and the pressure to prove ROI.</p>
        <p className="text-lg md:text-xl font-bold mb-6" style={{color: colors.darkBlue}}>We're not learning your world. We live in it.</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {[['CHRIS KAPPEN','Partner & CDO'],['ELISE FERGUSON','Web Developer'],['EMILY ADCOCK','UI/UX Designer'],['LEXY BECHTEL','Web Strategist'],['DAWN GEERTSEMA','Content Creator'],['NIKKI DOHERTY','Account Executive']].map(([n,r],i)=>(
            <div key={i} className="text-left transition-transform hover:scale-105">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full mb-2" style={{background:`linear-gradient(135deg,${colors.powder},${colors.desert})`}}/>
              <p className="text-xs md:text-sm font-bold" style={{color:colors.darkBlue}}>{n}</p>
              <p className="text-xs md:text-sm" style={{color:colors.graphite}}>{r}</p>
            </div>
          ))}
        </div>
      </div>
    </ContentSlide>,

    // 28: We didn't just prepare a pitch
    <TitleSlide key={27} bg={`linear-gradient(135deg, ${colors.darkBlue} 0%, #2c5a7c 100%)`} isActive={slide === 27}>
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">We didn't prepare a pitch.</h2>
      <p className="text-xl md:text-2xl" style={{color: colors.green}}>We built something.</p>
    </TitleSlide>,

    // 29: Dev site walkthrough
    <ContentSlide key={28} title="Dev site walkthrough." isActive={slide === 28}>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-bold mb-4" style={{color: colors.darkBlue}}>[Live Demo]</p>
          <p className="text-lg" style={{color: colors.graphite}}>Switch to browser for live demonstration</p>
        </div>
      </div>
    </ContentSlide>,

    // 30: The investment
    <TitleSlide key={29} bg={`linear-gradient(135deg, ${colors.darkBlue} 0%, #2c5a7c 100%)`} isActive={slide === 29}>
      <Logo variant="dark" />
      <h2 className="text-4xl md:text-5xl font-bold text-white mt-6">The investment.</h2>
    </TitleSlide>,

    // 31: Interactive Pricing Calculator
    <div key={30} className={`h-full flex flex-col p-6 md:p-10 transition-all duration-500 ${slide === 30 ? 'opacity-100' : 'opacity-0'}`} style={{backgroundColor: colors.darkBlue}}>
      <div className="mb-4 md:mb-6"><Logo variant="dark" /></div>
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6" style={{color: colors.green}}>Investment Overview</h2>

      <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full">
        <div className="rounded-lg p-3 md:p-4 mb-3 md:mb-4 transition-all hover:bg-white/15" style={{backgroundColor: 'rgba(255,255,255,0.1)'}}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span style={{color: colors.powder}} className="text-base md:text-lg">Number of Core Platforms</span>
            <div className="flex gap-2 md:gap-3">
              <button onClick={()=>setPlatforms(1)} className="px-3 md:px-4 py-2 rounded text-sm md:text-base font-semibold transition-all hover:scale-105" style={{backgroundColor:platforms===1?colors.green:'rgba(255,255,255,0.2)',color:platforms===1?colors.graphite:colors.powder}}>1 Platform</button>
              <button onClick={()=>setPlatforms(2)} className="px-3 md:px-4 py-2 rounded text-sm md:text-base font-semibold transition-all hover:scale-105" style={{backgroundColor:platforms===2?colors.green:'rgba(255,255,255,0.2)',color:platforms===2?colors.graphite:colors.powder}}>2 Platforms</button>
            </div>
          </div>
        </div>

        <div className="rounded-lg p-3 md:p-4 mb-3 md:mb-4" style={{backgroundColor: 'rgba(255,255,255,0.1)'}}>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-3">
            <div className="rounded px-3 md:px-4 py-2 text-center transition-transform hover:scale-105" style={{backgroundColor:colors.powder}}><div className="font-bold text-sm md:text-base" style={{color: colors.darkBlue}}>Your Core</div></div>
            <span style={{color:colors.desert}} className="text-lg md:text-xl">→</span>
            <div className="rounded px-3 md:px-4 py-2 text-center transition-transform hover:scale-105" style={{backgroundColor:colors.desert}}><div className="font-bold text-sm md:text-base text-white">Prismatic</div></div>
            <span style={{color:colors.desert}} className="text-lg md:text-xl">→</span>
            <div className="rounded px-3 md:px-4 py-2 text-center transition-transform hover:scale-105" style={{backgroundColor:colors.green}}><div className="font-bold text-sm md:text-base" style={{color: colors.graphite}}>HubSpot</div></div>
          </div>
          <p className="text-center text-sm md:text-base" style={{color:colors.powder}}>One-way sync • Read-only • No SSNs transferred</p>
        </div>

        <div className="rounded-lg overflow-hidden mb-3 md:mb-4 transition-all hover:shadow-lg" style={{backgroundColor:'rgba(255,255,255,0.1)'}}>
          <div className="px-3 md:px-4 py-2 md:py-3">
            <span className="font-bold text-lg md:text-xl" style={{color: colors.desert}}>One-Time: ${integrationCost.toLocaleString()}</span>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden mb-3 md:mb-4" style={{backgroundColor:'rgba(255,255,255,0.1)'}}>
          <div className="px-3 md:px-4 py-2 md:py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b" style={{borderColor: 'rgba(255,255,255,0.2)'}}>
            <span className="font-bold text-base md:text-lg" style={{color: colors.powder}}>Ongoing Investment</span>
            <div className="flex gap-2">
              <button onClick={()=>setShowAnnual(false)} className="px-2 md:px-3 py-1 rounded text-xs md:text-sm font-semibold transition-all hover:scale-105" style={{backgroundColor:!showAnnual?colors.green:'rgba(255,255,255,0.2)',color:!showAnnual?colors.graphite:colors.powder}}>Monthly</button>
              <button onClick={()=>setShowAnnual(true)} className="px-2 md:px-3 py-1 rounded text-xs md:text-sm font-semibold transition-all hover:scale-105" style={{backgroundColor:showAnnual?colors.green:'rgba(255,255,255,0.2)',color:showAnnual?colors.graphite:colors.powder}}>Annual</button>
            </div>
          </div>
          <div className="p-3 md:p-4 space-y-2 md:space-y-3 text-base md:text-lg">
            {[{n:'HubSpot Marketing Hub Enterprise',c:colors.green,a:hubspotAnnual},{n:'Prismatic Integration Platform',c:colors.desert,a:prismaticAnnual},{n:'Epicosity Ongoing Support',c:colors.powder,a:supportAnnual}].map((item,i)=>(
              <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                <span style={{color: colors.powder}} className="text-sm md:text-base">{item.n}</span>
                <span className="font-bold" style={{color:item.c}}>${showAnnual?item.a.toLocaleString():Math.round(item.a/12).toLocaleString()}/{showAnnual?'yr':'mo'}</span>
              </div>
            ))}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 pt-2 md:pt-3 border-t" style={{borderColor:'rgba(255,255,255,0.2)'}}>
              <span className="font-bold" style={{color: colors.powder}}>Total Ongoing</span>
              <span className="font-bold" style={{color: colors.powder}}>${showAnnual?totalOngoing.toLocaleString():Math.round(totalOngoing/12).toLocaleString()}/{showAnnual?'yr':'mo'}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg p-4 md:p-5 transition-all hover:scale-[1.02]" style={{backgroundColor:colors.green}}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="text-base md:text-lg font-semibold" style={{color:colors.graphite}}>YEAR 1 TOTAL</div>
            <div className="text-3xl md:text-4xl font-bold" style={{color:colors.graphite}}>${totalYear1.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>,

    // 32: Next steps title
    <TitleSlide key={31} bg={`linear-gradient(135deg, ${colors.darkBlue} 0%, #2c5a7c 100%)`} isActive={slide === 31}>
      <Logo variant="dark" />
      <h2 className="text-4xl md:text-5xl font-bold text-white mt-6">Next steps.</h2>
    </TitleSlide>,

    // 33: Next steps detail
    <ContentSlide key={32} title="Next steps." isActive={slide === 32}>
      <div className="space-y-4 md:space-y-6">
        {[['1','Executive Alignment Session','Lock in growth priorities and success metrics for 2026.'],['2','Core Integration Discovery','Map the data flow between your systems. Define triggers and segments.'],['3','HubSpot Build-Out','Custom objects, workflows, dashboards — configured for Century.'],['4','Launch','Q2 activation. Measurable results. Momentum.']].map(([n,t,d],i)=>(
          <div key={i} className="text-lg md:text-xl p-3 rounded-lg transition-all hover:bg-white/30">
            <span className="font-bold text-xl md:text-2xl" style={{color:colors.desert}}>{n}.</span>{' '}
            <span className="font-bold" style={{color:colors.darkBlue}}>{t}</span><br/>
            <span style={{color:colors.graphite}}>{d}</span>
          </div>
        ))}
      </div>
    </ContentSlide>,

    // 34: Let's build what's next
    <TitleSlide key={33} bg={`linear-gradient(135deg, ${colors.darkBlue} 0%, #2c5a7c 100%)`} isActive={slide === 33}>
      <h2 className="text-4xl md:text-5xl font-bold text-white">Let's build what's next.</h2>
    </TitleSlide>,

    // 35: Thank You
    <TitleSlide key={34} bg={colors.ashLight} isActive={slide === 34}>
      <Logo variant="light" />
      <h2 className="text-5xl md:text-6xl font-bold mt-8 mb-4" style={{color: colors.graphite}}>Thank You.</h2>
      <p className="text-xl md:text-2xl italic" style={{color: colors.darkBlue, fontFamily: 'Georgia, serif'}}>We Champion Growth</p>
      <p className="mt-8 text-sm md:text-base" style={{color: colors.graphite}}>300 N MAIN AVE. SIOUX FALLS, SD 57104 | 605.275.3742 | EPICOSITY.COM</p>
    </TitleSlide>,
  ];

  // ============================================
  // RENDER
  // ============================================
  return (
    <div ref={containerRef} className="h-screen flex flex-col relative" style={{backgroundColor: colors.graphite}}>
      {/* CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>

      {/* Progress bar */}
      <ProgressBar />

      {/* Presenter notes panel */}
      <NotesPanel />

      {/* Main slide area */}
      <div className={`flex-1 overflow-hidden transition-all duration-300 ${showNotes ? 'mr-80' : ''} ${isTransitioning ? 'opacity-50' : ''}`}>
        {slides[slide]}
      </div>

      {/* Controls bar */}
      <div className="p-2 md:p-3 flex items-center justify-between" style={{backgroundColor: '#2a2a2b'}}>
        <button
          onClick={prevSlide}
          disabled={slide===0}
          className="p-2 rounded disabled:opacity-30 transition-all hover:bg-gray-600"
          style={{backgroundColor:'#4a4a4b'}}
          title="Previous slide (← or Backspace)"
        >
          <ChevronLeft size={20} color="white"/>
        </button>

        {/* Slide dots (hidden on small screens) */}
        <div className="hidden md:flex items-center gap-1 max-w-lg overflow-x-auto">
          {slides.map((_,i)=>(
            <button
              key={i}
              onClick={()=>goToSlide(i)}
              className="rounded-full transition-all hover:scale-125"
              style={{
                width: i===slide ? 12 : 6,
                height: 6,
                backgroundColor: i===slide ? colors.green : '#5a5a5b',
                minWidth: i===slide ? 12 : 6
              }}
              title={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Mobile slide indicator */}
        <div className="md:hidden text-sm text-white">
          {slide + 1} / {slides.length}
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          {/* Presenter notes toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="p-2 rounded flex items-center gap-1 transition-all hover:bg-gray-600"
            style={{backgroundColor: showNotes ? colors.powder : '#4a4a4b'}}
            title="Toggle presenter notes (N)"
          >
            {showNotes ? <EyeOff size={16} color={colors.darkBlue}/> : <Eye size={16} color="white"/>}
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded transition-all hover:bg-gray-600"
            style={{backgroundColor: '#4a4a4b'}}
            title="Toggle fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 size={16} color="white"/> : <Maximize2 size={16} color="white"/>}
          </button>

          {/* Edit mode toggle */}
          <button
            onClick={()=>setEditMode(!editMode)}
            className="p-2 rounded flex items-center gap-1 transition-all hover:scale-105"
            style={{backgroundColor: editMode ? colors.green : '#4a4a4b'}}
            title="Toggle edit mode"
          >
            <Edit3 size={16} color={editMode ? colors.graphite : 'white'}/>
            <span className="hidden sm:inline text-xs" style={{color: editMode ? colors.graphite : 'white'}}>{editMode ? 'Done' : 'Edit'}</span>
          </button>

          {/* Next slide */}
          <button
            onClick={nextSlide}
            disabled={slide===slides.length-1}
            className="p-2 rounded disabled:opacity-30 transition-all hover:bg-gray-600"
            style={{backgroundColor:'#4a4a4b'}}
            title="Next slide (→ or Space)"
          >
            <ChevronRight size={20} color="white"/>
          </button>
        </div>
      </div>

      {/* Slide counter (desktop only) */}
      <div className="hidden md:block px-4 py-2 text-center text-sm" style={{color:colors.ash}}>
        {slide+1} / {slides.length} • Press F for fullscreen • N for notes • Arrow keys to navigate
      </div>
    </div>
  );
}
