import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { 
  FileCode, 
  Play, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  Terminal, 
  Map as MapIcon, 
  Compass, 
  Send,
  Zap,
  Globe
} from 'lucide-react';

export const APIPlatformPage: React.FC = () => {
  const { apiRoutes, navigateTo, showToast } = useGIS();
  const [selectedRouteId, setSelectedRouteId] = useState<string>(apiRoutes[0]?.id || 'API-01');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [activeSnippetTab, setActiveSnippetTab] = useState<'curl' | 'javascript' | 'python'>('curl');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);

  const selectedRoute = apiRoutes.find(r => r.id === selectedRouteId) || apiRoutes[0];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(label);
    showToast(`Copied ${label} snippet to clipboard!`);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  const handleExecute = () => {
    setIsExecuting(true);
    setExecutionOutput(null);
    setTimeout(() => {
      setIsExecuting(false);
      setExecutionOutput(selectedRoute.sampleResponse);
      showToast(`200 OK — Executed ${selectedRoute.endpoint} in 42ms`);
    }, 450);
  };

  const getCurlSnippet = () => {
    if (selectedRoute.method === 'GET') {
      return `curl -X GET "https://gis.bhusync.gov.in${selectedRoute.endpoint.replace('{id}', 'P-10212')}" \\
  -H "Authorization: Bearer gov_live_token_77a92f" \\
  -H "Accept: application/geo+json"`;
    }
    return `curl -X POST "https://gis.bhusync.gov.in${selectedRoute.endpoint}" \\
  -H "Authorization: Bearer gov_live_token_77a92f" \\
  -H "Content-Type: application/json" \\
  -d '${selectedRoute.sampleRequest || '{"job_id": "ETL-JOB-01"}'}'`;
  };

  const getJsSnippet = () => {
    return `const response = await fetch("https://gis.bhusync.gov.in${selectedRoute.endpoint.replace('{id}', 'P-10212')}", {
  method: "${selectedRoute.method}",
  headers: {
    "Authorization": "Bearer gov_live_token_77a92f",
    "Content-Type": "application/json"
  }${selectedRoute.sampleRequest ? `,\n  body: JSON.stringify(${selectedRoute.sampleRequest})` : ''}
});
const data = await response.json();
console.log(data);`;
  };

  const getPythonSnippet = () => {
    return `import requests

url = "https://gis.bhusync.gov.in${selectedRoute.endpoint.replace('{id}', 'P-10212')}"
headers = {
    "Authorization": "Bearer gov_live_token_77a92f",
    "Content-Type": "application/json"
}
${selectedRoute.sampleRequest ? `payload = ${selectedRoute.sampleRequest}\nresponse = requests.${selectedRoute.method.toLowerCase()}(url, json=payload, headers=headers)` : `response = requests.${selectedRoute.method.toLowerCase()}(url, headers=headers)`}

print(response.json())`;
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Globe className="w-5 h-5" />
            </span>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Unified WebGIS + Developer API Platform
            </h1>
          </div>
          <p className="text-xs lg:text-sm text-slate-500 mt-1 max-w-2xl">
            High-performance geospatial API gateway and OGC WFS 2.0.0 compliance service. Stream harmonized cadastral parcels, 
            trigger automated transformations, and integrate GIS vector layers directly into QGIS, ArcGIS, or custom applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('gis-map')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            Launch Interactive WebGIS Map
          </button>
        </div>
      </div>

      {/* METRICS & OGC COMPLIANCE BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">OGC Standards Compliance</span>
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">
              WFS 2.0.0 &amp; WMS 1.3.0
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">Interoperable with QGIS &amp; ArcGIS</span>
          </div>
          <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">API Response Latency</span>
            <div className="text-lg font-bold font-mono text-indigo-600 mt-1">
              &lt; 45 ms (p95)
            </div>
            <span className="text-[11px] text-slate-500">PostGIS Spatial Index optimized</span>
          </div>
          <Zap className="w-8 h-8 text-indigo-500 shrink-0" />
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Active API Endpoints</span>
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">
              {apiRoutes.length} Operational
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">REST, GeoJSON &amp; OGC XML</span>
          </div>
          <Terminal className="w-8 h-8 text-blue-500 shrink-0" />
        </div>
      </div>

      {/* API EXPLORER & TESTING WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ENDPOINT SELECTOR */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              API Route Catalogue
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">v1.4 Spec</span>
          </div>

          <div className="space-y-2">
            {apiRoutes.map(route => {
              const isSelected = route.id === selectedRouteId;
              return (
                <div
                  key={route.id}
                  onClick={() => {
                    setSelectedRouteId(route.id);
                    setExecutionOutput(null);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      route.method === 'GET' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' 
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {route.method}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white truncate">
                      {route.endpoint}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {route.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE CONSOLE & CODE SNIPPETS */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                  selectedRoute.method === 'GET' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' 
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {selectedRoute.method}
                </span>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                  {selectedRoute.endpoint}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {selectedRoute.description}
              </p>
            </div>

            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
            >
              {isExecuting ? (
                <span>Executing...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Test Request
                </>
              )}
            </button>
          </div>

          {/* PARAMETERS LIST */}
          {selectedRoute.params && selectedRoute.params.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                Query &amp; Path Parameters:
              </span>
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold text-[11px]">
                    <tr>
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Required</th>
                      <th className="py-2 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedRoute.params.map(p => (
                      <tr key={p.name}>
                        <td className="py-2 px-3 font-mono font-bold text-indigo-600">{p.name}</td>
                        <td className="py-2 px-3 font-mono text-slate-500">{p.type}</td>
                        <td className="py-2 px-3 font-semibold text-slate-700 dark:text-slate-300">
                          {p.required ? 'true' : 'false'}
                        </td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{p.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CODE SNIPPET TABS */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setActiveSnippetTab('curl')}
                  className={`px-3 py-1 rounded font-mono ${activeSnippetTab === 'curl' ? 'bg-white dark:bg-slate-700 font-bold text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
                >
                  cURL
                </button>
                <button
                  onClick={() => setActiveSnippetTab('javascript')}
                  className={`px-3 py-1 rounded font-mono ${activeSnippetTab === 'javascript' ? 'bg-white dark:bg-slate-700 font-bold text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
                >
                  JavaScript Fetch
                </button>
                <button
                  onClick={() => setActiveSnippetTab('python')}
                  className={`px-3 py-1 rounded font-mono ${activeSnippetTab === 'python' ? 'bg-white dark:bg-slate-700 font-bold text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
                >
                  Python Requests
                </button>
              </div>

              <button
                onClick={() => {
                  const text = activeSnippetTab === 'curl' ? getCurlSnippet() : activeSnippetTab === 'javascript' ? getJsSnippet() : getPythonSnippet();
                  handleCopy(text, activeSnippetTab);
                }}
                className="px-2.5 py-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs flex items-center gap-1"
              >
                {copiedSnippet === activeSnippetTab ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>

            <div className="p-3 bg-slate-950 text-slate-200 font-mono text-xs rounded-lg overflow-x-auto leading-relaxed border border-slate-800">
              <pre>
                {activeSnippetTab === 'curl' && getCurlSnippet()}
                {activeSnippetTab === 'javascript' && getJsSnippet()}
                {activeSnippetTab === 'python' && getPythonSnippet()}
              </pre>
            </div>
          </div>

          {/* RESPONSE VIEWER */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Live Gateway Response Output (JSON):
              </span>
              <span className="text-[10px] font-mono text-emerald-500 font-bold">
                Status: 200 OK
              </span>
            </div>

            <div className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg max-h-64 overflow-y-auto leading-relaxed border border-slate-800">
              <pre>{executionOutput || selectedRoute.sampleResponse}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
