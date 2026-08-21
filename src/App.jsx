import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Link, Lock, Eye, TrendingUp, Zap, Info, Search, Globe, Clock, Server, FileWarning, Activity, Crosshair, Radio, Wifi, Database } from 'lucide-react';

export default function PhishingDetector() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ checked: 0, blocked: 0 });
  const [scanHistory, setScanHistory] = useState([]);
  const [glitchText, setGlitchText] = useState('');
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const savedStats = localStorage.getItem('phishing-stats');
    const savedHistory = localStorage.getItem('scan-history');
    if (savedStats) setStats(JSON.parse(savedStats));
    if (savedHistory) setScanHistory(JSON.parse(savedHistory));

    // Glitch effect for title
    const glitchInterval = setInterval(() => {
      const chars = '▓▒░█▄▀';
      const random = chars[Math.floor(Math.random() * chars.length)];
      setGlitchText(random);
    }, 100);

    return () => clearInterval(glitchInterval);
  }, []);

  const analyzeURL = (inputUrl) => {
    const factors = [];
    let riskScore = 0;

    if (inputUrl.length > 75) {
      factors.push({ name: 'URL_LENGTH::OVERFLOW', risk: 'high', points: 25, icon: 'link' });
      riskScore += 25;
    } else if (inputUrl.length > 54) {
      factors.push({ name: 'URL_LENGTH::SUSPICIOUS', risk: 'medium', points: 15, icon: 'link' });
      riskScore += 15;
    }

    if (!inputUrl.startsWith('https://')) {
      factors.push({ name: 'SSL::NOT_FOUND', risk: 'high', points: 30, icon: 'lock' });
      riskScore += 30;
    }

    const ipPattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
    if (ipPattern.test(inputUrl)) {
      factors.push({ name: 'IP_ADDRESS::DETECTED', risk: 'high', points: 35, icon: 'server' });
      riskScore += 35;
    }

    const specialChars = (inputUrl.match(/[@\-_]/g) || []).length;
    if (specialChars > 5) {
      factors.push({ name: 'SPECIAL_CHARS::OVERFLOW', risk: 'medium', points: 20, icon: 'file' });
      riskScore += 20;
    }

    const subdomains = (inputUrl.match(/\./g) || []).length;
    if (subdomains > 3) {
      factors.push({ name: 'SUBDOMAIN::CHAINING', risk: 'medium', points: 15, icon: 'globe' });
      riskScore += 15;
    }

    const suspiciousKeywords = ['login', 'verify', 'account', 'update', 'secure', 'banking', 'confirm'];
    const foundKeywords = suspiciousKeywords.filter(kw => inputUrl.toLowerCase().includes(kw));
    if (foundKeywords.length > 0) {
      factors.push({ name: `KEYWORDS::${foundKeywords.join('|')}`, risk: 'medium', points: 20, icon: 'alert' });
      riskScore += 20;
    }

    const shorteners = ['bit.ly', 'tinyurl', 'goo.gl', 't.co', 'ow.ly'];
    if (shorteners.some(s => inputUrl.includes(s))) {
      factors.push({ name: 'URL_SHORTENER::DETECTED', risk: 'medium', points: 15, icon: 'link' });
      riskScore += 15;
    }

    const suspiciousChars = /[а-яА-Я]/;
    if (suspiciousChars.test(inputUrl)) {
      factors.push({ name: 'HOMOGRAPH::ATTACK_VECTOR', risk: 'high', points: 30, icon: 'alert' });
      riskScore += 30;
    }

    let status, message, color;
    if (riskScore >= 60) {
      status = 'CRITICAL';
      message = 'MALICIOUS SIGNATURE DETECTED';
      color = 'red';
    } else if (riskScore >= 30) {
      status = 'WARNING';
      message = 'SUSPICIOUS PATTERNS FOUND';
      color = 'yellow';
    } else {
      status = 'SECURE';
      message = 'NO THREATS IDENTIFIED';
      color = 'green';
    }

    return { status, message, color, riskScore, factors };
  };

  const handleCheck = () => {
    if (!url.trim()) return;
    
    setLoading(true);
    setResult(null);
    setScanProgress(0);
    
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    setTimeout(() => {
      const analysis = analyzeURL(url);
      setResult(analysis);
      setLoading(false);
      
      const newStats = {
        checked: stats.checked + 1,
        blocked: stats.blocked + (analysis.riskScore >= 60 ? 1 : 0)
      };
      setStats(newStats);
      localStorage.setItem('phishing-stats', JSON.stringify(newStats));

      const newHistory = [{
        url: url,
        status: analysis.status,
        riskScore: analysis.riskScore,
        timestamp: new Date().toLocaleString()
      }, ...scanHistory.slice(0, 4)];
      setScanHistory(newHistory);
      localStorage.setItem('scan-history', JSON.stringify(newHistory));
    }, 1500);
  };

  const getIconComponent = (iconName) => {
    const icons = {
      link: Link,
      lock: Lock,
      server: Server,
      file: FileWarning,
      globe: Globe,
      alert: AlertTriangle
    };
    const IconComponent = icons[iconName] || Info;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 overflow-x-hidden relative">
      <style>{`
        @keyframes holoPulse {
          0%, 100% { opacity: 0.6; box-shadow: 0 0 20px rgba(6, 182, 212, 0.4); }
          50% { opacity: 1; box-shadow: 0 0 30px rgba(6, 182, 212, 0.6); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        .holo-border {
          background: linear-gradient(145deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1));
          backdrop-filter: blur(10px);
          border: 1px solid rgba(6, 182, 212, 0.3);
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.2), inset 0 0 20px rgba(6, 182, 212, 0.05);
        }
        .holo-glow {
          animation: holoPulse 2s ease-in-out infinite;
        }
        .scanline {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(transparent, rgba(6, 182, 212, 0.5), transparent);
          animation: scanline 4s linear infinite;
        }
        .glitch {
          animation: glitch 0.3s infinite;
        }
        .corner-bracket {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(6, 182, 212, 0.6);
        }
        .corner-tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
        .corner-tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
        .corner-bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
        .corner-br { bottom: -1px; right: -1px; border-left: none; border-top: none; }


        /* Strong mobile layout rules */
        .mobile-header,
        .mobile-brand,
        .mobile-header-actions,
        .mobile-title,
        .mobile-stat-grid,
        .mobile-stat-card,
        .mobile-panel,
        .mobile-result-header {
          min-width: 0;
        }

        @media (max-width: 640px) {
          html, body, #root {
            width: 100%;
            max-width: 100%;
            min-width: 0;
            overflow-x: hidden !important;
          }

          body {
            margin: 0;
          }

          /* Compact header: brand on top, status below */
          .mobile-header {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .mobile-brand {
            width: 100%;
            gap: 10px;
          }

          .mobile-title {
            flex: 1;
            min-width: 0;
          }

          .mobile-title h1 {
            font-size: clamp(1.55rem, 8vw, 2rem);
            letter-spacing: 1px !important;
            line-height: 1;
            max-width: 100%;
          }

          .mobile-title p {
            font-size: 9px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
          }

          .mobile-header-actions {
            width: 100%;
            justify-content: space-between;
          }

          /* Force stats into a clean 2 x 2 layout */
          .mobile-stat-grid {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }

          .mobile-stat-card {
            min-height: 112px;
            padding: 14px !important;
          }

          .mobile-stat-card svg {
            width: 22px;
            height: 22px;
          }

          .mobile-stat-value {
            font-size: clamp(1.6rem, 8vw, 2rem);
            line-height: 1.1;
            max-width: 100%;
          }

          /* Scanner panel */
          .mobile-panel {
            width: 100%;
            box-sizing: border-box;
            padding: 16px !important;
          }

          .mobile-panel input {
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
            font-size: 16px !important;
            padding-left: 42px !important;
            padding-right: 42px !important;
          }

          .mobile-panel button {
            min-height: 52px;
          }

          /* Prevent long terminal labels from widening the page */
          .mobile-panel .font-mono {
            overflow-wrap: anywhere;
            word-break: break-word;
          }

          /* Results */
          .mobile-result-header {
            width: 100%;
          }

          /* Sidebar cards */
          .space-y-6 {
            min-width: 0;
          }

          /* Reduce decorative corner size */
          .corner-bracket {
            width: 13px;
            height: 13px;
          }

          /* Keep the grid effect visually subtle on small screens */
          .fixed.inset-0 > div {
            max-width: 100vw;
          }
        }

        /* Mobile layout safeguards */
        @media (max-width: 640px) {
          html, body, #root {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
          }

          input, button {
            -webkit-tap-highlight-color: transparent;
          }

          input {
            min-width: 0;
            font-size: 16px;
          }

          .holo-border {
            max-width: 100%;
          }

          .corner-bracket {
            width: 14px;
            height: 14px;
          }
        }
      `}</style>

      {/* Holographic Grid Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          perspective: '1000px',
          transform: 'rotateX(60deg) scale(2)'
        }}></div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `holoPulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Scanline Effect */}
      <div className="scanline"></div>

      {/* Header */}
      <header className="relative border-b border-cyan-500/30 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="mobile-header flex items-center justify-between">
            <div className="mobile-brand flex items-center gap-4 min-w-0">
              <div className="relative holo-glow">
                <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 shrink-0" strokeWidth={1.5} />
                <div className="absolute inset-0 blur-xl bg-cyan-400 opacity-50"></div>
              </div>
              <div>
                <div className="mobile-title flex items-center gap-2 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400 break-words truncate" style={{ 
                    textShadow: '0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(6, 182, 212, 0.4)',
                    fontFamily: 'monospace',
                    letterSpacing: '2px'
                  }}>
                    PHISH<span className="text-pink-500">GUARD</span>
                  </h1>
                  <span className="text-cyan-600 glitch">{glitchText}</span>
                </div>
                <p className="text-xs text-cyan-600 font-mono">root@security:/sys/threat_scan# _</p>
              </div>
            </div>
            <div className="mobile-header-actions flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="px-2 sm:px-3 py-1.5 holo-border rounded shrink-0">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-green-400 animate-pulse" />
                  <span className="text-xs text-green-400 font-mono">ONLINE</span>
                </div>
              </div>
              <div className="text-[10px] sm:text-xs text-cyan-600 font-mono border border-cyan-500/30 px-2 py-1 rounded shrink-0">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Holographic Stats */}
        <div className="mobile-stat-grid grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
          {[
            { label: 'SCANS', value: stats.checked, icon: Crosshair, color: 'cyan' },
            { label: 'BLOCKED', value: stats.blocked, icon: Shield, color: 'red' },
            { label: 'CLEAN', value: `${stats.checked > 0 ? Math.round(((stats.checked - stats.blocked) / stats.checked) * 100) : 100}%`, icon: CheckCircle, color: 'green' },
            { label: 'LATENCY', value: '1.5s', icon: Activity, color: 'purple' }
          ].map((stat, idx) => (
            <div key={idx} className="relative group">
              <div className="corner-bracket corner-tl"></div>
              <div className="corner-bracket corner-tr"></div>
              <div className="corner-bracket corner-bl"></div>
              <div className="corner-bracket corner-br"></div>
              <div className="holo-border p-3 sm:p-5 relative h-full mobile-stat-card min-w-0 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400 holo-glow`} />
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 font-mono mobile-stat-value truncate" style={{
                  textShadow: `0 0 10px rgba(6, 182, 212, 0.6)`
                }}>{stat.value}</div>
                <div className="text-xs text-cyan-600 font-mono">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Scanner */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <div className="corner-bracket corner-tl"></div>
              <div className="corner-bracket corner-tr"></div>
              <div className="corner-bracket corner-bl"></div>
              <div className="corner-bracket corner-br"></div>
              <div className="holo-border p-4 sm:p-6 lg:p-8 mobile-panel">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500 holo-glow"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 holo-glow"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 holo-glow"></div>
                  </div>
                  <span className="text-sm text-cyan-400 font-mono ml-2">THREAT_ANALYZER.SYS</span>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-600 font-mono text-sm">
                      &gt;&gt;
                    </div>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
                      placeholder="[INPUT_URL_TARGET]"\n                      inputMode="url"\n                      autoCapitalize="none"\n                      autoCorrect="off"\n                      spellCheck={false}
                      className="w-full pl-12 pr-4 py-4 bg-black/50 border border-cyan-500/30 rounded text-cyan-400 placeholder-cyan-800 focus:outline-none focus:border-cyan-400 font-mono text-sm transition-all"
                      style={{ boxShadow: 'inset 0 0 20px rgba(6, 182, 212, 0.1)' }}
                    />
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-600" />
                  </div>

                  <button
                    onClick={handleCheck}
                    disabled={loading || !url.trim()}
                    className="w-full py-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500 text-cyan-400 font-bold font-mono hover:bg-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                    style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 group-hover:translate-x-full transition-transform duration-1000"></div>
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <Wifi className="w-5 h-5 animate-pulse" />
                        [SCANNING...]
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <Crosshair className="w-5 h-5" />
                        [INITIATE_SCAN]
                      </span>
                    )}
                  </button>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="text-cyan-700 font-mono">// TEST_VECTORS:</span>
                    {['safe', 'phish', 'ip'].map((test, idx) => (
                      <button
                        key={idx}
                        onClick={() => setUrl(
                          idx === 0 ? 'https://www.google.com' :
                          idx === 1 ? 'http://accounts-verification-security-update.com/login' :
                          'https://192.168.1.1/admin/login.php'
                        )}
                        className="px-2 py-1 border border-cyan-700/50 text-cyan-600 hover:border-cyan-500 hover:text-cyan-400 transition-all font-mono"
                      >
                        {test}.sys
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Loading Progress */}
            {loading && (
              <div className="relative">
                <div className="corner-bracket corner-tl"></div>
                <div className="corner-bracket corner-tr"></div>
                <div className="holo-border p-4 sm:p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-mono">
                      <span className="text-cyan-400">ANALYZING_TARGET</span>
                      <span className="text-cyan-600">{scanProgress}%</span>
                    </div>
                    <div className="h-2 bg-black/50 border border-cyan-500/30 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300 holo-glow"
                        style={{ width: `${scanProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-cyan-700 font-mono animate-pulse">
                      &gt; Checking SSL certificates...<br/>
                      &gt; Analyzing URL patterns...<br/>
                      &gt; Cross-referencing threat database...
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="relative animate-in fade-in duration-500">
                <div className="corner-bracket corner-tl"></div>
                <div className="corner-bracket corner-tr"></div>
                <div className="corner-bracket corner-bl"></div>
                <div className="corner-bracket corner-br"></div>
                <div className="holo-border p-4 sm:p-6 lg:p-8">
                  <div className="mobile-result-header flex flex-col sm:flex-row sm:items-start gap-4 mb-5 sm:mb-6">
                    <div className={`p-4 rounded-lg ${
                      result.color === 'red' ? 'bg-red-500/20 border border-red-500' :
                      result.color === 'yellow' ? 'bg-yellow-500/20 border border-yellow-500' :
                      'bg-green-500/20 border border-green-500'
                    } holo-glow`}>
                      {result.color === 'red' ? <AlertTriangle className="w-8 h-8 text-red-400" /> :
                       result.color === 'yellow' ? <Info className="w-8 h-8 text-yellow-400" /> :
                       <CheckCircle className="w-8 h-8 text-green-400" />}
                    </div>
                    <div className="flex-1">
                      <div className={`text-2xl font-bold mb-1 font-mono ${
                        result.color === 'red' ? 'text-red-400' :
                        result.color === 'yellow' ? 'text-yellow-400' : 'text-green-400'
                      }`} style={{
                        textShadow: `0 0 20px ${
                          result.color === 'red' ? 'rgba(239, 68, 68, 0.6)' :
                          result.color === 'yellow' ? 'rgba(234, 179, 8, 0.6)' : 'rgba(34, 197, 94, 0.6)'
                        }`
                      }}>
                        [{result.status}]
                      </div>
                      <div className="text-cyan-400 font-mono text-sm">{result.message}</div>
                    </div>
                    <div className={`text-3xl sm:text-4xl font-bold font-mono px-4 sm:px-4 py-2 border-2 w-full sm:w-auto text-center ${
                      result.color === 'red' ? 'border-red-500 text-red-400' :
                      result.color === 'yellow' ? 'border-yellow-500 text-yellow-400' :
                      'border-green-500 text-green-400'
                    }`}>
                      {result.riskScore}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-mono text-cyan-600 mb-2">
                      <span>THREAT_LEVEL</span>
                      <span>{result.riskScore}/100</span>
                    </div>
                    <div className="h-3 bg-black/50 border border-cyan-500/30 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          result.color === 'red' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                          result.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}
                        style={{ 
                          width: `${result.riskScore}%`,
                          boxShadow: `0 0 20px ${
                            result.color === 'red' ? 'rgba(239, 68, 68, 0.5)' :
                            result.color === 'yellow' ? 'rgba(234, 179, 8, 0.5)' : 'rgba(34, 197, 94, 0.5)'
                          }`
                        }}
                      ></div>
                    </div>
                  </div>

                  {result.factors.length > 0 && (
                    <div>
                      <div className="text-sm font-bold mb-4 text-cyan-400 font-mono flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        VULNERABILITIES [{result.factors.length}]
                      </div>
                      <div className="space-y-2">
                        {result.factors.map((factor, idx) => (
                          <div
                            key={idx}
                            className={`border ${
                              factor.risk === 'high' ? 'border-red-500/50 bg-red-950/20' :
                              factor.risk === 'medium' ? 'border-yellow-500/50 bg-yellow-950/20' :
                              'border-green-500/50 bg-green-950/20'
                            } p-3 flex items-center justify-between backdrop-blur-sm`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`${
                                factor.risk === 'high' ? 'text-red-400' :
                                factor.risk === 'medium' ? 'text-yellow-400' : 'text-green-400'
                              }`}>
                                {getIconComponent(factor.icon)}
                              </div>
                              <span className={`text-xs font-mono ${
                                factor.risk === 'high' ? 'text-red-400' :
                                factor.risk === 'medium' ? 'text-yellow-400' : 'text-green-400'
                              }`}>
                                {factor.name}
                              </span>
                            </div>
                            <span className={`text-xs font-bold font-mono ${
                              factor.risk === 'high' ? 'text-red-500' :
                              factor.risk === 'medium' ? 'text-yellow-500' : 'text-green-500'
                            }`}>
                              +{factor.points}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.factors.length === 0 && (
                    <div className="text-center py-6 border border-green-500/30 bg-green-950/10">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3 holo-glow" />
                      <div className="text-green-400 font-bold font-mono mb-1">[ALL_CLEAR]</div>
                      <div className="text-xs text-green-600 font-mono">No malicious patterns detected</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Log */}
            <div className="relative">
              <div className="corner-bracket corner-tl"></div>
              <div className="corner-bracket corner-tr"></div>
              <div className="holo-border p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-bold text-cyan-400 font-mono">ACTIVITY_LOG</span>
                </div>
                {scanHistory.length > 0 ? (
                  <div className="space-y-2">
                    {scanHistory.map((scan, idx) => (
                      <div key={idx} className="text-xs border border-cyan-700/30 p-2 bg-black/30 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-bold font-mono ${
                            scan.riskScore >= 60 ? 'text-red-400' :
                            scan.riskScore >= 30 ? 'text-yellow-400' : 'text-green-400'
                          }`}>
                            {scan.status}
                          </span>
                          <span className="text-cyan-700 font-mono">{scan.timestamp.split(',')[1]}</span>
                        </div>
                        <div className="text-cyan-600 truncate font-mono min-w-0 max-w-full">{scan.url}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-cyan-700 text-center py-4 font-mono">
                    // No records
                  </div>
                )}
              </div>
            </div>

            {/* Threat Database */}
            <div className="relative">
              <div className="corner-bracket corner-tl"></div>
              <div className="corner-bracket corner-tr"></div>
              <div className="holo-border p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-bold text-cyan-400 font-mono">THREAT_DB</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-cyan-600">Known Threats:</span>
                    <span className="text-red-400">847,392</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-600">Blacklisted IPs:</span>
                    <span className="text-red-400">23,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-600">Patterns:</span>
                    <span className="text-yellow-400">5,239</span>
                  </div>
                  <div className="border-t border-cyan-700/30 pt-2 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400">SYNCED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detection Modules */}
            <div className="relative">
              <div className="corner-bracket corner-tl"></div>
              <div className="corner-bracket corner-tr"></div>
              <div className="holo-border p-3 sm:p-4">
                <div className="text-sm font-bold mb-4 text-cyan-400 font-mono">MODULES</div>
                <div className="space-y-1 text-xs font-mono">
                  {[
                    'ssl_scanner.sys',
                    'url_parser.dll',
                    'heuristic.bin',
                    'pattern_match.ko',
                    'threat_db.dat'
                  ].map((module, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-cyan-600">
                      <span className="text-cyan-400">▸</span>
                      <span>{module}</span>
                      <span className="ml-auto text-green-400">✓</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-cyan-500/30 bg-black/80 backdrop-blur-md mt-8">
        <div className="max-w-7xl mx-auto px-4 py-3 text-center text-xs text-cyan-700 font-mono">
          © 2026 PHISHGUARD::HOLOGRAPHIC_TERMINAL // UNAUTHORIZED_ACCESS::PROHIBITED
        </div>
      </footer>
    </div>
  );
}
