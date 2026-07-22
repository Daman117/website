import type { Cap } from '../types';

export const CAPS: Cap[] = [
{
  id:'enview',name:'enVIEW',cat:'SCADA / Live Process Intelligence',
  tag:'See your plant. Live.',color:'#2563EB',
  status:'Available',statusBg:'#0A1E38',statusBorder:'#1E40AF',statusText:'#60A5FA',
  zerod:true,
  body:`enVIEW is what SCADA looks like when you start from scratch in 2024 — not when you migrate a 1990s Windows system to the cloud. Native Apple Silicon. Three synchronized views of your plant from one data model. An AI operator assistant that understands your process. A CLI that lets you manage everything without touching the GUI.`,
  body2:`Every incumbent SCADA was built for the world before Apple Silicon, before LLMs, before engineers expected software to respond in milliseconds. enVIEW wasn't constrained by any of that.`,
  tabs:[
    {label:'Three Views',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">One data model. Three ways to see your plant.</p>
      <p style="font-size:12px;color:var(--t4);line-height:1.7;margin-bottom:12px">No other SCADA product renders three synchronized views from the same live data. What the engineer designs is exactly what the operator sees — no separate configuration.</p>
      <ul class="blist">
        <li><span>—</span><span><b style="color:var(--t2)">P&ID View</b> — ISA-101 compliant schematics, ISA-5.1 instrument bubbles, 331 SVG symbols. The engineer's view.</span></li>
        <li><span>—</span><span><b style="color:var(--t2)">DCS Mimic View</b> — Metallic equipment graphics, live value badges, stream-coloured piping. The operator's view.</span></li>
        <li><span>—</span><span><b style="color:var(--t2)">3D Plant View</b> — RealityKit with PBR materials, orbit camera, equipment labels. Spatial awareness.</span></li>
      </ul>`},
    {label:'AI-Native',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">The first SCADA with AI built in from day one.</p>
      <ul class="blist">
        <li><span>—</span><span><b style="color:var(--t2)">AI Operator Assistant</b> — "Why is the reactor temperature rising?" Gets an answer grounded in live process data.</span></li>
        <li><span>—</span><span><b style="color:var(--t2)">AI Security Analysis</b> — Behavioral baseline monitoring. AI-powered threat explanation, not just alerts.</span></li>
        <li><span>—</span><span><b style="color:var(--t2)">MCP Integration</b> — Exposes plant data to Claude Desktop and other AI tools for advanced analysis.</span></li>
      </ul>`},
    {label:'CLI-First',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">21 commands. Complete plant management from the terminal.</p>
      <div class="cli-block">
        <div><span class="cli-cmd">vplant import</span> <span class="cli-arg">myplant.yaml --project "My Plant"</span></div>
        <div><span class="cli-cmd">vplant connect</span> <span class="cli-arg">opc.tcp://192.168.1.100:4840</span></div>
        <div><span class="cli-cmd">vplant read</span> <span class="cli-arg">TT-101</span></div>
        <div><span class="cli-cmd">vplant monitor</span> <span class="cli-arg">TT-101 PT-201 FT-301</span></div>
        <div><span class="cli-cmd">vplant alarm list</span> <span class="cli-arg">--unacked</span></div>
        <div><span class="cli-cmd">vplant diag</span></div>
        <div><span class="cli-cmd">vplant archive</span> <span class="cli-arg">--since 30 --yes</span></div>
        <div><span class="cli-ok">✓</span> <span class="cli-comment">Headless operation · SSH · scripted deployment · CI/CD</span></div>
      </div>`},
    {label:'Alarms',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">ISA-18.2 alarm management. Built in — not a module.</p>
      <ul class="blist">
        <li><span>—</span><span>Full alarm lifecycle: active → acknowledged → shelved → out-of-service</span></li>
        <li><span>—</span><span>Critical: safety impact within minutes · Warning: process impact within 30 min</span></li>
        <li><span>—</span><span>Shelving during startup/shutdown · Audit trail with timestamp and operator</span></li>
        <li><span>—</span><span><span class="mono" style="font-size:10px">vplant alarm list --unacked · vplant alarm ack · vplant alarm ack-all</span></span></li>
      </ul>`},
    {label:'Historian',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">5-year process history. No database server.</p>
      <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:5px"><span style="font-size:11px;color:var(--t4)">Raw samples</span><span class="mono" style="font-size:11px;color:var(--teal)">500ms · 30 days</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:5px"><span style="font-size:11px;color:var(--t4)">Minute rollup (avg/min/max)</span><span class="mono" style="font-size:11px;color:var(--teal)">1 year</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:5px"><span style="font-size:11px;color:var(--t4)">Hourly rollup (avg/min/max)</span><span class="mono" style="font-size:11px;color:var(--teal)">5 years</span></div>
      </div>
      <p style="font-size:11px;color:var(--t5)">SQLite — portable, queryable, no separate database server process. Export as SQLite files for offline analysis.</p>`},
    {label:'Quick Start',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">From download to live PLC data in under 5 minutes.</p>
      <p style="font-size:12px;color:var(--t4);line-height:1.7;margin-bottom:10px">Single .dmg installer (~50MB). Drag to Applications. No setup wizard, no Java, no Windows, no database to provision.</p>
      <div class="cli-block">
        <div class="cli-comment"># Install from DMG — drag to Applications</div>
        <div><span class="cli-cmd">vplant import</span> <span class="cli-arg">myplant.yaml --project "My Plant"</span></div>
        <div><span class="cli-cmd">vplant connect</span> <span class="cli-arg">opc.tcp://192.168.1.100:4840</span></div>
        <div><span class="cli-cmd">open</span> <span class="cli-arg">/Applications/IndustrialHMI.app</span></div>
        <div class="cli-ok"># Live. Done.</div>
      </div>`},
  ],
  right:'perf',
},{
  id:'engram',name:'enGRAM',cat:'Plant Knowledge',
  tag:'Ask your plant a question. Get a cited answer.',color:'#FDB022',
  status:'Pilot',statusBg:'#2E1F00',statusBorder:'#594400',statusText:'#FDB022',
  body:`enGRAM indexes every document your plant already has — P&IDs, datasheets, loop drawings, equipment specs, procedures, calibration records — and makes them queryable in plain English. Fully inside your network. No cloud. Every answer traced back to the exact source document, revision, and page.`,
  specs:[
    {l:'Deployment',v:'Local VM'},{l:'Cloud',v:'None'},
    {l:'AI engine',v:'Ollama'},{l:'Pilot',v:'90 days'},
  ],
  tabs:[
    {label:'I&C',content:`
      <p style="font-size:12px;color:var(--t2);font-weight:500;margin-bottom:6px">The I&C engineer who always knows — now every I&C engineer does.</p>
      <p style="font-size:11px;color:var(--t4);line-height:1.6;margin-bottom:10px">Your instrument database is scattered across datasheets, loop drawings, and P&IDs never designed to connect. enGRAM connects them through the tag number.</p>
      <ul class="blist">
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"What is the calibrated range of FT-3045?"</span></li>
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"Which instruments in area 2 have no linked datasheet?"</span></li>
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"List all flow transmitters connected to the same loop as FCV-202."</span></li>
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"Which tags have a last calibration date older than 12 months?"</span></li>
      </ul>`},
    {label:'Electrical',content:`
      <p style="font-size:12px;color:var(--t2);font-weight:500;margin-bottom:8px">The right drawing. The right panel. First time.</p>
      <ul class="blist">
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"What panel is motor M-302 terminated in?"</span></li>
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"What cable feeds JB-45 terminal 12?"</span></li>
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"What is the cable route for instrument loop FIC-201?"</span></li>
      </ul>`},
    {label:'Chemical',content:`
      <p style="font-size:12px;color:var(--t2);font-weight:500;margin-bottom:8px">An operator who reasons like a specialist.</p>
      <ul class="blist">
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"What is the design pressure of vessel V-301?"</span></li>
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"Which P&ID shows the feed to reactor R-201?"</span></li>
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"What procedure governs the startup of train 3?"</span></li>
      </ul>`},
    {label:'Operations',content:`
      <p style="font-size:12px;color:var(--t2);font-weight:500;margin-bottom:8px">The right procedure. The right isolation. First time you look.</p>
      <ul class="blist">
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"What is the isolation procedure for V-204?"</span></li>
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"What is the last recorded maintenance activity on pump P-112?"</span></li>
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"What is the safe operating range for this vessel?"</span></li>
      </ul>`},
    {label:'Manager',content:`
      <p style="font-size:12px;color:var(--t2);font-weight:500;margin-bottom:8px">The person this decision belongs to.</p>
      <ul class="blist">
        <li><span>—</span><span>Incident response time drops. Engineers find answers faster.</span></li>
        <li><span>—</span><span>New engineer onboarding accelerates. The knowledge is in the system.</span></li>
        <li><span>—</span><span>Cross-discipline queries resolve in seconds, not days.</span></li>
        <li><span>—</span><span>No data governance risk. Nothing leaves the network.</span></li>
      </ul>`},
  ],
  right:'specs',
},{
  id:'enstudio',name:'enSTUDIO',cat:'Drawing Intelligence',
  tag:'Upload it. Type it. Say it. It becomes structured.',color:'#A78BFA',
  status:'Available',statusBg:'#0A1E38',statusBorder:'#1E40AF',statusText:'#60A5FA',
  airgap:true,
  body:`enSTUDIO meets engineers where they are. Upload a drawing, type a description, or talk through a process unit — all three produce the same structured, LLM-ready output. All three run on local AI models inside your network. No internet. No cloud.`,
  specs:[
    {l:'Speed',v:'<2 min'},{l:'Accuracy',v:'99.3%'},
    {l:'Drawings',v:'139+'},{l:'Tags',v:'5,945+'},
  ],
  tabs:[
    {label:'Upload',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">Drop any P&ID. It gets read.</p>
      <ul class="blist">
        <li><span>—</span><span>Scanned drawing from 1987 or a vector export from AutoCAD — it doesn't matter</span></li>
        <li><span>—</span><span>Multi-page PDFs split and processed in parallel</span></li>
        <li><span>—</span><span>Legend pages detected automatically — company convention profiles built and applied</span></li>
        <li><span>—</span><span>Under 2 minutes per drawing at 99.3% page accuracy</span></li>
      </ul>`},
    {label:'Describe',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">No drawing? Describe what you know.</p>
      <div class="cli-block" style="margin-bottom:10px">
        <div style="color:#A78BFA">Input:</div>
        <div style="color:var(--t4);font-style:italic">"FT-3045 is a flow transmitter on the feed line to R-201. Range 0–500 kg/h. Alarm at 450. Connected to FCV-201 downstream."</div>
        <div style="color:#A78BFA;margin-top:8px">Output:</div>
        <div>tag: FT-3045 | type: flow_transmitter | range: 0–500 kg/h</div>
        <div>alarm_hi: 450 | connected_to: R-201, FCV-201</div>
      </div>
      <p style="font-size:11px;color:var(--t5)">Same VIDS / YAML / Markdown outputs as the upload channel. No second-class treatment.</p>`},
    {label:'Converse',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">Talk through a process unit. It builds the model as you go.</p>
      <div class="cli-block" style="margin-bottom:10px">
        <div><span style="color:#A78BFA">enSTUDIO:</span> <span style="color:var(--t4)">What units are in section 2?</span></div>
        <div><span style="color:var(--t2)">Engineer:</span> <span style="color:var(--t4)">Feed preheat, the main reactor, separator.</span></div>
        <div><span style="color:#A78BFA">enSTUDIO:</span> <span style="color:var(--t4)">What does the feed preheat connect to?</span></div>
        <div><span style="color:var(--t2)">Engineer:</span> <span style="color:var(--t4)">Shell-and-tube HX. FT-1001 on tube side, TC on shell outlet.</span></div>
        <div><span style="color:#A78BFA">enSTUDIO:</span> <span style="color:var(--t4)">Added: HX-101 · FT-1001 · TT-102 ✓</span></div>
      </div>
      <p style="font-size:11px;color:var(--t5)">Runs entirely on local LLM. The conversation never leaves the network.</p>`},
    {label:'Outputs',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">Six formats. All downstream-ready.</p>
      <div style="display:flex;flex-direction:column;gap:5px">
        <div style="display:grid;grid-template-columns:90px 1fr;gap:10px;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:4px"><span class="mono" style="font-size:10px;color:#A78BFA">VIDS</span><span style="font-size:11px;color:var(--t5)">Process simulation — equipment, streams, connections</span></div>
        <div style="display:grid;grid-template-columns:90px 1fr;gap:10px;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:4px"><span class="mono" style="font-size:10px;color:#A78BFA">VPlant YAML</span><span style="font-size:11px;color:var(--t5)">enABLE plant matrix M — topology as structured data</span></div>
        <div style="display:grid;grid-template-columns:90px 1fr;gap:10px;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:4px"><span class="mono" style="font-size:10px;color:#A78BFA">YMPL / YAML</span><span style="font-size:11px;color:var(--t5)">enVIEW tag database, alarm setpoints, screen config</span></div>
        <div style="display:grid;grid-template-columns:90px 1fr;gap:10px;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:4px"><span class="mono" style="font-size:10px;color:#A78BFA">Markdown</span><span style="font-size:11px;color:var(--t5)">Full tag lists — ready for enGRAM indexing</span></div>
      </div>`},
  ],
  right:'specs',
},{
  id:'enable',name:'enABLE',cat:'Process Intelligence for Design & Control',
  tag:'Turn your plant into a matrix — and get eigenvalue-based engineering judgment.',color:'#10B981',
  status:'In Development',statusBg:'#1E1B4B',statusBorder:'#3730A3',statusText:'#A5B4FC',
  patent:true,
  body:`enABLE is a desktop engineering application for process and control engineers. You draw your plant as a flowsheet — equipment plus stream connections — and enABLE encodes it as a block-matrix model, dx/dt = M·x + B·u. From that one matrix it computes engineering verdicts about the design — stability, controllability, loop pairing, recommended changes, alarm bounds and a HAZOP pre-fill — and then runs the same plant as a live closed-loop dynamic simulation.`,
  body2:`Questions that normally take years of experience or long dynamic studies become calculations: how stable is this design, which loops will fight each other, what does a proposed change do, and where does risk concentrate. The matrix becomes a compact, transferable engineering record — capturing plant knowledge before it retires with the engineers who hold it. enABLE complements the simulators you already run; it does not replace the review, testing and approval a qualified team performs.`,
  specs:[
    {l:'Unit-op builders',v:'37'},{l:'Test functions',v:'~1,990'},
    {l:'Analysis panels',v:'25+'},{l:'Import formats',v:'4'},
  ],
  tabs:[
    {label:'The Matrix',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">Your whole plant, written as one mathematical object.</p>
      <p style="font-size:12px;color:var(--t4);line-height:1.7;margin-bottom:12px">The engineer draws the plant as a flowsheet. Each unit operation contributes a small matrix block; each stream connection injects off-diagonal coupling. The assembled matrix M — with input matrix B — is the linearised plant. The same matrix drives both the analysis and the live simulation.</p>
      <div class="matrix-eq">
        dx/dt = M·x + B·u<br/><br/>
        M  = unit-operation blocks + stream coupling<br/>
        Analysis and live simulation run from the <b>same</b> M<br/>
        Recomputed live on every build
      </div>`},
    {label:'What It Computes',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">Eigenvalue-based judgment — derived analytically, no step tests.</p>
      <ul class="blist">
        <li><span>—</span><span><b style="color:var(--t2)">Eigenvalues</b> — stability and response speed; any eigenvalue with a positive real part is an unstable mode.</span></li>
        <li><span>—</span><span><b style="color:var(--t2)">Relative Gain Array (RGA)</b> — which loop should drive which valve, and where loops interact — computed without plant step tests.</span></li>
        <li><span>—</span><span><b style="color:var(--t2)">Condition number</b> — how ill-conditioned and hard to control the plant is.</span></li>
        <li><span>—</span><span><b style="color:var(--t2)">Eigenvalue sensitivity</b> — the basis for ranked recommended changes and change-impact previews.</span></li>
        <li><span>—</span><span><b style="color:var(--t2)">Fiedler value</b> — partitions the plant into naturally weakly-coupled control zones.</span></li>
      </ul>`},
    {label:'Analyse → Simulate',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">One model. A fast design verdict, then a live dynamic test.</p>
      <ul class="blist">
        <li><span>—</span><span><b style="color:var(--t2)">Verdict-first analysis</b> — stable / marginal / unstable, with margin, slowest-mode time constant and the bottleneck equipment identified.</span></li>
        <li><span>—</span><span><b style="color:var(--t2)">Recommended changes</b> — ranked parameter changes <span class="mono" style="font-size:10px">predicted</span> to improve stability, each a forecast to confirm.</span></li>
        <li><span>—</span><span><b style="color:var(--t2)">Live closed-loop simulation</b> — controllers, operator-style faceplates, trends, alarms, a startup sequence and fault injection.</span></li>
        <li><span>—</span><span>Move from a fast verdict to a full dynamic test without rebuilding the plant in a second tool.</span></li>
      </ul>`},
    {label:'HAZOP Pre-fill',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">HAZOP, seeded from the physics in the matrix.</p>
      <p style="font-size:12px;color:var(--t4);line-height:1.7;margin-bottom:10px">Eigenvalue perturbations seed a 22-column worksheet — equipment state, guide word, matrix perturbation, eigenvalue bound, severity — plus an action register and equipment schedule. It is a computer-aided pre-fill and facilitator aid: a qualified multidisciplinary team must review and complete it.</p>
      <ul class="blist">
        <li><span>—</span><span>Alarm priorities and setpoints derived from mode speeds, for ISA-18.2 team review.</span></li>
        <li><span>—</span><span>Draft control narrative and SIMC PID starting points.</span></li>
        <li><span>—</span><span>Export: HTML · CSV · Print-to-PDF.</span></li>
      </ul>`},
    {label:'Validated',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">Correctness enforced by the test suite — assertions, not marketing.</p>
      <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:5px"><span style="font-size:11px;color:var(--t4)">Eigenvalues vs analytic (two-tank)</span><span class="mono" style="font-size:11px;color:var(--teal)">≤ 1e-10</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:5px"><span style="font-size:11px;color:var(--t4)">Stability verdict</span><span class="mono" style="font-size:11px;color:var(--teal)">100% · 5/5</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:5px"><span style="font-size:11px;color:var(--t4)">RGA loop pairing</span><span class="mono" style="font-size:11px;color:var(--teal)">100%</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:5px"><span style="font-size:11px;color:var(--t4)">Recommended-change direction</span><span class="mono" style="font-size:11px;color:var(--teal)">100% · 28/28</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:5px"><span style="font-size:11px;color:var(--t4)">Change-impact (10% change)</span><span class="mono" style="font-size:11px;color:var(--teal)">&lt; 3% error</span></div>
      </div>
      <p style="font-size:11px;color:var(--t5)">Results hold on the benchmark set (two-tank, heat exchanger, CSTR stable/unstable, interacting 2×2). They are not a claim of accuracy on every possible plant.</p>`},
    {label:'Honesty Model',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">Every output is labelled by how much to trust it.</p>
      <ul class="blist">
        <li><span>—</span><span><b style="color:var(--t2)">Computed / exact</b> — eigenvalues, RGA, condition number: exact for the assembled matrix, covered by gate tests.</span></li>
        <li><span>—</span><span><b style="color:var(--t2)">Predicted — confirm in Simulate</b> — recommended changes, change-impact, operating-range sweep.</span></li>
        <li><span>—</span><span><b style="color:var(--t2)">Draft — requires engineer review</b> — SIMC tuning, control narrative, alarm bounds.</span></li>
        <li><span>—</span><span><b style="color:var(--t2)">Pre-fill, not a substitute</b> — the HAZOP report aids a qualified team; it does not replace them.</span></li>
        <li><span>—</span><span><b style="color:var(--t2)">Import basis disclosed</b> — every imported parameter is tagged data-derived or handbook-default.</span></li>
      </ul>`},
  ],
  right:'specs',
},{
  id:'engenie',name:'enGENIE',cat:'Instrument Engineering Intelligence',
  tag:'The vault for your instrument engineering knowledge.',color:'#1B6FD8',
  status:'Phase 0 Live',statusBg:'#0A1E38',statusBorder:'#1E40AF',statusText:'#60A5FA',
  body:`The vault for your instrument engineering knowledge — every decision cited, locked, and retrievable. From process conditions to a specified, cited, defensible specification. Grounded in Lipták — the authoritative reference every serious I&C engineer already uses.`,
  specs:[
    {l:'Disciplines',v:'8'},{l:'Technologies',v:'70'},
    {l:'Standards',v:'8'},{l:'Phase',v:'0 Live'},
  ],
  tabs:[
    {label:'The Vault',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">Engineering knowledge that doesn't walk out the door.</p>
      <ul class="blist">
        <li><span>—</span><span>Every selection locked to the standard that justifies it — not an opinion, a cited position</span></li>
        <li><span>—</span><span>Every exclusion and TBD documented — defensible to any client, auditor, or HAZOP team</span></li>
        <li><span>—</span><span>Lipták, ISA, ISO, ASME — the standards senior engineers carry in their heads, now in the system</span></li>
        <li><span>—</span><span>Offline in the field, in Teams, on a tablet. No server. No login wall.</span></li>
      </ul>`},
    {label:'How It Works',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">Process conditions in. Cited, specified technology out.</p>
      <div style="display:flex;flex-direction:column;gap:6px">
        <div style="display:flex;gap:10px;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:4px">
          <span class="mono" style="font-size:10px;color:#F97316;flex-shrink:0;margin-top:1px">01</span>
          <p style="font-size:12px;color:var(--t4);line-height:1.5">Enter process conditions once — fluid, temp, pressure, flow range, line size, SIL, cost tier.</p>
        </div>
        <div style="display:flex;gap:10px;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:4px">
          <span class="mono" style="font-size:10px;color:#F97316;flex-shrink:0;margin-top:1px">02</span>
          <p style="font-size:12px;color:var(--t4);line-height:1.5">Hard constraints eliminate. Each removal cites the exact standard and reason.</p>
        </div>
        <div style="display:flex;gap:10px;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:4px">
          <span class="mono" style="font-size:10px;color:#F97316;flex-shrink:0;margin-top:1px">03</span>
          <p style="font-size:12px;color:var(--t4);line-height:1.5">Survivors ranked with fit %. Options with reasons — not a single black-box answer.</p>
        </div>
        <div style="display:flex;gap:10px;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:4px">
          <span class="mono" style="font-size:10px;color:#F97316;flex-shrink:0;margin-top:1px">04</span>
          <p style="font-size:12px;color:var(--t4);line-height:1.5">Spec form pre-filled — no re-entry. TBD-explicit. Excel + Markdown download immediately.</p>
        </div>
      </div>`},
    {label:'Cited Decisions',content:`
      <p style="font-size:13px;color:var(--t3);font-weight:500;margin-bottom:8px">Every decision has a citation.</p>
      <div class="excl-card"><p class="excl-title" style="color:var(--red)">Excluded: Magnetic Flowmeter</p><p class="excl-body">Fluid conductivity &lt;5 µS/cm — below minimum for reliable signal. <span class="excl-cite">Lipták §3.7, Table 3.7-2.</span></p></div>
      <div class="excl-card"><p class="excl-title" style="color:var(--red)">Excluded: Vortex Flowmeter</p><p class="excl-body">Process temperature 420°C exceeds standard body rating of 400°C. <span class="excl-cite">Lipták §3.3, temperature limits.</span></p></div>
      <div class="excl-card" style="border-color:rgba(245,158,11,.2)"><p class="excl-title" style="color:var(--warn)">Warning: Thermowell</p><p class="excl-body">Insertion length and flow velocity may approach resonance. Calculate per <span class="excl-cite">ASME PTC 19.3 TW-2016</span> before issue.</p></div>`},
    {label:'8 Disciplines',content:`
      <p style="font-size:12px;color:var(--t2);font-weight:500;margin-bottom:8px">70 technologies. Every service condition.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px">
        <div style="padding:8px;background:var(--bg);border:1px solid var(--border);border-radius:4px"><p style="font-size:10px;color:#F97316;font-weight:600;margin-bottom:2px">Flow</p><p style="font-size:9px;color:var(--t5)">12 technologies · DN6–DN600+ · three-tier cost advisory</p></div>
        <div style="padding:8px;background:var(--bg);border:1px solid var(--border);border-radius:4px"><p style="font-size:10px;color:#F97316;font-weight:600;margin-bottom:2px">Level</p><p style="font-size:9px;color:var(--t5)">DP · radar · guided wave · capacitance · float</p></div>
        <div style="padding:8px;background:var(--bg);border:1px solid var(--border);border-radius:4px"><p style="font-size:10px;color:#F97316;font-weight:600;margin-bottom:2px">Temperature</p><p style="font-size:9px;color:var(--t5)">RTD Pt100 · thermocouple · thermowell · IR</p></div>
        <div style="padding:8px;background:var(--bg);border:1px solid var(--border);border-radius:4px"><p style="font-size:10px;color:#F97316;font-weight:600;margin-bottom:2px">Pressure</p><p style="font-size:9px;color:var(--t5)">Gauge · absolute · DP · remote seal</p></div>
        <div style="padding:8px;background:var(--bg);border:1px solid var(--border);border-radius:4px"><p style="font-size:10px;color:#F97316;font-weight:600;margin-bottom:2px">Control Valves</p><p style="font-size:9px;color:var(--t5)">Globe · butterfly · ball · Cv sizing ISA 75.01</p></div>
        <div style="padding:8px;background:var(--bg);border:1px solid var(--border);border-radius:4px"><p style="font-size:10px;color:#F97316;font-weight:600;margin-bottom:2px">Analytical + Density</p><p style="font-size:9px;color:var(--t5)">pH · conductivity · O₂ · Coriolis density</p></div>
      </div>`},
  ],
  right:'specs',
},{
  id:'entie',name:'enTIE',cat:'Connected Intelligence',
  tag:'The layer that makes enxplant and your existing systems one.',color:'#60A5FA',
  status:'Roadmap',statusBg:'#1C1030',statusBorder:'#2C1C48',statusText:'#A78BFA',
  body:`enTIE connects enxplant capabilities to the plant systems you already run — DCS, historian, MES, ERP. It also exposes plant data via MCP server for Claude Desktop and other AI tools. The intelligence you build in enxplant doesn't stay in enxplant.`,
  specs:[
    {l:'Protocol',v:'Open'},{l:'MCP',v:'Yes'},
    {l:'Lock-in',v:'None'},{l:'Status',v:'Roadmap'},
  ],
  tabs:[
    {label:'Connections',content:`
      <ul class="blist">
        <li><span>—</span><span>Connects to DCS · Historian · MES · ERP</span></li>
        <li><span>—</span><span>MCP server for Claude Desktop and other AI tools</span></li>
        <li><span>—</span><span>Open protocol adapters — no proprietary formats</span></li>
        <li><span>—</span><span>Designed for the mixed installed base reality</span></li>
        <li><span>—</span><span>No lock-in on either side</span></li>
      </ul>`},
  ],
  right:'specs',
}];
