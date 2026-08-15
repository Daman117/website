import type { Cap } from '../types';

export const CAPS: Cap[] = [
{
  id:'enview',name:'enVIEW',cat:'SCADA / Live Process Intelligence',
  tag:'See your plant. Live.',color:'#2563EB',
  status:'Available',statusBg:'#0A1E38',statusBorder:'#1E40AF',statusText:'#60A5FA',
  zerod:true,
  body:`enVIEW is what SCADA looks like when you start from scratch today — not when you migrate a 1990s Windows system to the cloud. Native Apple Silicon. Three synchronized views of your plant from one data model. An AI operator assistant that understands your process. A CLI that lets you manage everything without touching the GUI.`,
  body2:`Every incumbent SCADA was built for the world before Apple Silicon, before LLMs, before engineers expected software to respond in milliseconds. enVIEW wasn't constrained by any of that.`,
  tabs:[
    {label:'Three Views',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">One data model. Three ways to see your plant.</p>
      <p style="font-size:12px;color:var(--text-muted);line-height:1.7;margin-bottom:12px">Three views, one live data model — the engineering schematic, the operator mimic and the 3D plant, always in step. What the engineer designs is exactly what the operator sees — no separate configuration.</p>
      <ul class="blist">
        <li><span>—</span><span><b style="color:var(--text-secondary)">P&ID View</b> — ISA-101 compliant schematics, ISA-5.1 instrument bubbles, 331 SVG symbols. The engineer's view.</span></li>
        <li><span>—</span><span><b style="color:var(--text-secondary)">DCS Mimic View</b> — Metallic equipment graphics, live value badges, stream-colored piping. The operator's view.</span></li>
        <li><span>—</span><span><b style="color:var(--text-secondary)">3D Plant View</b> — RealityKit with PBR materials, orbit camera, equipment labels. Spatial awareness.</span></li>
      </ul>`},
    {label:'AI-Native',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">AI built in from day one — not added as a module.</p>
      <ul class="blist">
        <li><span>—</span><span><b style="color:var(--text-secondary)">AI Operator Assistant</b> — "Why is the reactor temperature rising?" Gets an answer grounded in live process data.</span></li>
        <li><span>—</span><span><b style="color:var(--text-secondary)">AI Security Analysis</b> — Behavioral baseline monitoring. AI-powered threat explanation, not just alerts.</span></li>
        <li><span>—</span><span><b style="color:var(--text-secondary)">MCP Integration</b> — Exposes plant data to Claude Desktop and other AI tools for advanced analysis.</span></li>
      </ul>`},
    {label:'CLI-First',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">21 commands. Complete plant management from the terminal.</p>
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
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">ISA-18.2 alarm management. Built in — not a module.</p>
      <ul class="blist">
        <li><span>—</span><span>Full alarm lifecycle: active → acknowledged → shelved → out-of-service</span></li>
        <li><span>—</span><span>Critical: safety impact within minutes · Warning: process impact within 30 min</span></li>
        <li><span>—</span><span>Shelving during startup/shutdown · Audit trail with timestamp and operator</span></li>
        <li><span>—</span><span><span class="mono" style="font-size:10px">vplant alarm list --unacked · vplant alarm ack · vplant alarm ack-all</span></span></li>
      </ul>`},
    {label:'Historian',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">5-year process history. No database server.</p>
      <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:5px"><span style="font-size:11px;color:var(--text-muted)">Raw samples</span><span class="mono" style="font-size:11px;color:var(--teal)">500ms · 30 days</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:5px"><span style="font-size:11px;color:var(--text-muted)">Minute rollup (avg/min/max)</span><span class="mono" style="font-size:11px;color:var(--teal)">1 year</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:5px"><span style="font-size:11px;color:var(--text-muted)">Hourly rollup (avg/min/max)</span><span class="mono" style="font-size:11px;color:var(--teal)">5 years</span></div>
      </div>
      <p style="font-size:11px;color:var(--text-muted)">SQLite — portable, queryable, no separate database server process. Export as SQLite files for offline analysis.</p>`},
    {label:'Quick Start',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">From download to live PLC data in under 5 minutes.</p>
      <p style="font-size:12px;color:var(--text-muted);line-height:1.7;margin-bottom:10px">Single .dmg installer (~50MB). Drag to Applications. No setup wizard, no Java, no Windows, no database to provision.</p>
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
      <p style="font-size:12px;color:var(--text-secondary);font-weight:500;margin-bottom:6px">The I&C engineer who always knows — now every I&C engineer does.</p>
      <p style="font-size:11px;color:var(--text-muted);line-height:1.6;margin-bottom:10px">Your instrument database is scattered across datasheets, loop drawings, and P&IDs never designed to connect. enGRAM connects them through the tag number.</p>
      <ul class="blist">
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"What is the calibrated range of FT-3045?"</span></li>
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"Which instruments in area 2 have no linked datasheet?"</span></li>
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"List all flow transmitters connected to the same loop as FCV-202."</span></li>
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"Which tags have a last calibration date older than 12 months?"</span></li>
      </ul>`},
    {label:'Electrical',content:`
      <p style="font-size:12px;color:var(--text-secondary);font-weight:500;margin-bottom:8px">The right drawing. The right panel. First time.</p>
      <ul class="blist">
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"What panel is motor M-302 terminated in?"</span></li>
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"What cable feeds JB-45 terminal 12?"</span></li>
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"What is the cable route for instrument loop FIC-201?"</span></li>
      </ul>`},
    {label:'Chemical',content:`
      <p style="font-size:12px;color:var(--text-secondary);font-weight:500;margin-bottom:8px">An operator who reasons like a specialist.</p>
      <ul class="blist">
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"What is the design pressure of vessel V-301?"</span></li>
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"Which P&ID shows the feed to reactor R-201?"</span></li>
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"What procedure governs the startup of train 3?"</span></li>
      </ul>`},
    {label:'Operations',content:`
      <p style="font-size:12px;color:var(--text-secondary);font-weight:500;margin-bottom:8px">The right procedure. The right isolation. First time you look.</p>
      <ul class="blist">
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"What is the isolation procedure for V-204?"</span></li>
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"What is the last recorded maintenance activity on pump P-112?"</span></li>
        <li><span>›</span><span class="mono" style="font-size:10px;font-style:italic">"What is the safe operating range for this vessel?"</span></li>
      </ul>`},
    {label:'Manager',content:`
      <p style="font-size:12px;color:var(--text-secondary);font-weight:500;margin-bottom:8px">The person this decision belongs to.</p>
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
  tag:'Draw it. Import it. Describe it. It becomes structured.',color:'#A78BFA',
  status:'Available',statusBg:'#0A1E38',statusBorder:'#1E40AF',statusText:'#60A5FA',
  airgap:true,
  body:`enSTUDIO meets engineers where they are. Draw the unit on a canvas, import an existing drawing, or describe it in plain language — every channel produces the same structured, LLM-ready output, and every channel runs on local AI models inside your network. No internet. No cloud.`,
  specs:[
    {l:'Speed',v:'<2 min'},{l:'Accuracy',v:'99.3%'},
    {l:'Drawings',v:'139+'},{l:'Tags',v:'5,945+'},
  ],
  tabs:[
    {label:'Draw',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">Author the unit from scratch on the canvas.</p>
      <ul class="blist">
        <li><span>—</span><span>Drag ISA-5.1 symbols onto the canvas and draw the connections between them</span></li>
        <li><span>—</span><span>Fill parameter forms as you go — ranges, setpoints, service conditions</span></li>
        <li><span>—</span><span>Every action writes straight to the same internal model the other channels build</span></li>
        <li><span>—</span><span>Useful where no drawing exists, or where the drawing no longer matches the plant</span></li>
      </ul>`},
    {label:'Import',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">Drop any P&ID. It gets read.</p>
      <ul class="blist">
        <li><span>—</span><span>Scanned drawing from 1987 or a vector export from AutoCAD — it doesn't matter</span></li>
        <li><span>—</span><span>Multi-page PDFs split and processed in parallel</span></li>
        <li><span>—</span><span>Legend pages detected automatically — company convention profiles built and applied</span></li>
        <li><span>—</span><span>Under 2 minutes per drawing at 99.3% page accuracy</span></li>
      </ul>`},
    {label:'Describe',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">No drawing? Describe what you know.</p>
      <div class="cli-block" style="margin-bottom:10px">
        <div style="color:#A78BFA">Input:</div>
        <div style="color:var(--text-muted);font-style:italic">"FT-3045 is a flow transmitter on the feed line to R-201. Range 0–500 kg/h. Alarm at 450. Connected to FCV-201 downstream."</div>
        <div style="color:#A78BFA;margin-top:8px">Output:</div>
        <div>tag: FT-3045 | type: flow_transmitter | range: 0–500 kg/h</div>
        <div>alarm_hi: 450 | connected_to: R-201, FCV-201</div>
      </div>
      <p style="font-size:11px;color:var(--text-muted)">Same VIDS / YAML / Markdown outputs as the import channel. No second-class treatment.</p>`},
    {label:'Describe · Spoken',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">Talk through a process unit. It builds the model as you go.</p>
      <div class="cli-block" style="margin-bottom:10px">
        <div><span style="color:#A78BFA">enSTUDIO:</span> <span style="color:var(--text-muted)">What units are in section 2?</span></div>
        <div><span style="color:var(--text-secondary)">Engineer:</span> <span style="color:var(--text-muted)">Feed preheat, the main reactor, separator.</span></div>
        <div><span style="color:#A78BFA">enSTUDIO:</span> <span style="color:var(--text-muted)">What does the feed preheat connect to?</span></div>
        <div><span style="color:var(--text-secondary)">Engineer:</span> <span style="color:var(--text-muted)">Shell-and-tube HX. FT-1001 on tube side, TC on shell outlet.</span></div>
        <div><span style="color:#A78BFA">enSTUDIO:</span> <span style="color:var(--text-muted)">Added: HX-101 · FT-1001 · TT-102 ✓</span></div>
      </div>
      <p style="font-size:11px;color:var(--text-muted)">Runs entirely on local LLM. The conversation never leaves the network.</p>`},
    {label:'Outputs',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">Four formats. All downstream-ready.</p>
      <div style="display:flex;flex-direction:column;gap:5px">
        <div style="display:grid;grid-template-columns:90px 1fr;gap:10px;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px"><span class="mono" style="font-size:10px;color:#A78BFA">VIDS</span><span style="font-size:11px;color:var(--text-muted)">Process simulation — equipment, streams, connections</span></div>
        <div style="display:grid;grid-template-columns:90px 1fr;gap:10px;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px"><span class="mono" style="font-size:10px;color:#A78BFA">VPlant YAML</span><span style="font-size:11px;color:var(--text-muted)">enABLE plant matrix M — topology as structured data</span></div>
        <div style="display:grid;grid-template-columns:90px 1fr;gap:10px;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px"><span class="mono" style="font-size:10px;color:#A78BFA">YMPL / YAML</span><span style="font-size:11px;color:var(--text-muted)">enVIEW tag database, alarm setpoints, screen config</span></div>
        <div style="display:grid;grid-template-columns:90px 1fr;gap:10px;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px"><span class="mono" style="font-size:10px;color:#A78BFA">Markdown</span><span style="font-size:11px;color:var(--text-muted)">Full tag lists — ready for enGRAM indexing</span></div>
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
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">Your whole plant, written as one mathematical object.</p>
      <p style="font-size:12px;color:var(--text-muted);line-height:1.7;margin-bottom:12px">The engineer draws the plant as a flowsheet. Each unit operation contributes a small matrix block; each stream connection injects off-diagonal coupling. The assembled matrix M — with input matrix B — is the linearized plant. The same matrix drives both the analysis and the live simulation.</p>
      <div class="matrix-eq">
        dx/dt = M·x + B·u<br/><br/>
        M  = unit-operation blocks + stream coupling<br/>
        Analysis and live simulation run from the <b>same</b> M<br/>
        Recomputed live on every build
      </div>`},
    {label:'What It Computes',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">Eigenvalue-based judgment — derived analytically, no step tests.</p>
      <ul class="blist">
        <li><span>—</span><span><b style="color:var(--text-secondary)">Eigenvalues</b> — stability and response speed; any eigenvalue with a positive real part is an unstable mode.</span></li>
        <li><span>—</span><span><b style="color:var(--text-secondary)">Relative Gain Array (RGA)</b> — which loop should drive which valve, and where loops interact — computed without plant step tests.</span></li>
        <li><span>—</span><span><b style="color:var(--text-secondary)">Condition number</b> — how ill-conditioned and hard to control the plant is.</span></li>
        <li><span>—</span><span><b style="color:var(--text-secondary)">Eigenvalue sensitivity</b> — the basis for ranked recommended changes and change-impact previews.</span></li>
        <li><span>—</span><span><b style="color:var(--text-secondary)">Fiedler value</b> — partitions the plant into naturally weakly-coupled control zones.</span></li>
      </ul>`},
    {label:'Analyze → Simulate',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">One model. A fast design verdict, then a live dynamic test.</p>
      <ul class="blist">
        <li><span>—</span><span><b style="color:var(--text-secondary)">Verdict-first analysis</b> — stable / marginal / unstable, with margin, slowest-mode time constant and the bottleneck equipment identified.</span></li>
        <li><span>—</span><span><b style="color:var(--text-secondary)">Recommended changes</b> — ranked parameter changes <span class="mono" style="font-size:10px">predicted</span> to improve stability, each a forecast to confirm.</span></li>
        <li><span>—</span><span><b style="color:var(--text-secondary)">Live closed-loop simulation</b> — controllers, operator-style faceplates, trends, alarms, a startup sequence and fault injection.</span></li>
        <li><span>—</span><span>Move from a fast verdict to a full dynamic test without rebuilding the plant in a second tool.</span></li>
      </ul>`},
    {label:'HAZOP Pre-fill',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">HAZOP, seeded from the physics in the matrix.</p>
      <p style="font-size:12px;color:var(--text-muted);line-height:1.7;margin-bottom:10px">Eigenvalue perturbations seed a 22-column worksheet — equipment state, guide word, matrix perturbation, eigenvalue bound, severity — plus an action register and equipment schedule. It is a computer-aided pre-fill and facilitator aid: a qualified multidisciplinary team must review and complete it.</p>
      <ul class="blist">
        <li><span>—</span><span>Alarm priorities and setpoints derived from mode speeds, for ISA-18.2 team review.</span></li>
        <li><span>—</span><span>Draft control narrative and SIMC PID starting points.</span></li>
        <li><span>—</span><span>Export: HTML · CSV · Print-to-PDF.</span></li>
      </ul>`},
    {label:'Validated',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">Correctness enforced by the test suite — assertions, not marketing.</p>
      <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:5px"><span style="font-size:11px;color:var(--text-muted)">Eigenvalues vs analytic (two-tank)</span><span class="mono" style="font-size:11px;color:var(--teal)">≤ 1e-10</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:5px"><span style="font-size:11px;color:var(--text-muted)">Stability verdict</span><span class="mono" style="font-size:11px;color:var(--teal)">100% · 5/5</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:5px"><span style="font-size:11px;color:var(--text-muted)">RGA loop pairing</span><span class="mono" style="font-size:11px;color:var(--teal)">100%</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:5px"><span style="font-size:11px;color:var(--text-muted)">Recommended-change direction</span><span class="mono" style="font-size:11px;color:var(--teal)">100% · 28/28</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:5px"><span style="font-size:11px;color:var(--text-muted)">Change-impact (10% change)</span><span class="mono" style="font-size:11px;color:var(--teal)">&lt; 3% error</span></div>
      </div>
      <p style="font-size:11px;color:var(--text-muted)">Results hold on the benchmark set (two-tank, heat exchanger, CSTR stable/unstable, interacting 2×2). They are not a claim of accuracy on every possible plant.</p>`},
    {label:'Honesty Model',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">Every output is labeled by how much to trust it.</p>
      <ul class="blist">
        <li><span>—</span><span><b style="color:var(--text-secondary)">Computed / exact</b> — eigenvalues, RGA, condition number: exact for the assembled matrix, covered by gate tests.</span></li>
        <li><span>—</span><span><b style="color:var(--text-secondary)">Predicted — confirm in Simulate</b> — recommended changes, change-impact, operating-range sweep.</span></li>
        <li><span>—</span><span><b style="color:var(--text-secondary)">Draft — requires engineer review</b> — SIMC tuning, control narrative, alarm bounds.</span></li>
        <li><span>—</span><span><b style="color:var(--text-secondary)">Pre-fill, not a substitute</b> — the HAZOP report aids a qualified team; it does not replace them.</span></li>
        <li><span>—</span><span><b style="color:var(--text-secondary)">Import basis disclosed</b> — every imported parameter is tagged data-derived or handbook-default.</span></li>
      </ul>`},
  ],
  right:'specs',
},{
  id:'engenie',name:'enGENIE',cat:'Instrument Selection & Specification',
  tag:'From process conditions to a cited, issue-ready specification.',color:'#1B6FD8',
  status:'Early Access',statusBg:'#0A1E38',statusBorder:'#1E40AF',statusText:'#60A5FA',
  body:`enGENIE takes your service conditions and returns the right instrument — with the standard that justifies it and the reason every alternative was excluded. The finished specification is ready to issue, already matching your engineering standards, approved suppliers and purchasing rules. Grounded in Lipták — the authoritative reference every serious I&C engineer already uses.`,
  specs:[
    {l:'Disciplines',v:'8'},{l:'Technologies',v:'70'},
    {l:'Standards',v:'8'},{l:'Status',v:'Early Access'},
  ],
  tabs:[
    {label:'The Vault',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">Engineering knowledge that doesn't walk out the door.</p>
      <ul class="blist">
        <li><span>—</span><span>Every selection locked to the standard that justifies it — not an opinion, a cited position</span></li>
        <li><span>—</span><span>Every exclusion and TBD documented — defensible to any client, auditor, or HAZOP team</span></li>
        <li><span>—</span><span>Lipták, ISA, ISO, ASME — the standards senior engineers carry in their heads, now in the system</span></li>
        <li><span>—</span><span>Offline in the field, in Teams, on a tablet. No server. No login wall.</span></li>
      </ul>`},
    {label:'How It Works',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">Process conditions in. Cited, specified technology out.</p>
      <div style="display:flex;flex-direction:column;gap:6px">
        <div style="display:flex;gap:10px;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px">
          <span class="mono" style="font-size:10px;color:#F97316;flex-shrink:0;margin-top:1px">01</span>
          <p style="font-size:12px;color:var(--text-muted);line-height:1.5">Enter process conditions once — fluid, temp, pressure, flow range, line size, SIL, cost tier.</p>
        </div>
        <div style="display:flex;gap:10px;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px">
          <span class="mono" style="font-size:10px;color:#F97316;flex-shrink:0;margin-top:1px">02</span>
          <p style="font-size:12px;color:var(--text-muted);line-height:1.5">Hard constraints eliminate. Each removal cites the exact standard and reason.</p>
        </div>
        <div style="display:flex;gap:10px;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px">
          <span class="mono" style="font-size:10px;color:#F97316;flex-shrink:0;margin-top:1px">03</span>
          <p style="font-size:12px;color:var(--text-muted);line-height:1.5">Survivors ranked with fit %. Options with reasons — not a single black-box answer.</p>
        </div>
        <div style="display:flex;gap:10px;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px">
          <span class="mono" style="font-size:10px;color:#F97316;flex-shrink:0;margin-top:1px">04</span>
          <p style="font-size:12px;color:var(--text-muted);line-height:1.5">Spec form pre-filled — no re-entry. TBD-explicit. Excel + Markdown download immediately.</p>
        </div>
      </div>`},
    {label:'Cited Decisions',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">Every decision has a citation.</p>
      <div class="excl-card"><p class="excl-title" style="color:var(--red)">Excluded: Magnetic Flowmeter</p><p class="excl-body">Fluid conductivity &lt;5 µS/cm — below minimum for reliable signal. <span class="excl-cite">Lipták §3.7, Table 3.7-2.</span></p></div>
      <div class="excl-card"><p class="excl-title" style="color:var(--red)">Excluded: Vortex Flowmeter</p><p class="excl-body">Process temperature 420°C exceeds standard body rating of 400°C. <span class="excl-cite">Lipták §3.3, temperature limits.</span></p></div>
      <div class="excl-card" style="border-color:rgba(245,158,11,.2)"><p class="excl-title" style="color:var(--warn)">Warning: Thermowell</p><p class="excl-body">Insertion length and flow velocity may approach resonance. Calculate per <span class="excl-cite">ASME PTC 19.3 TW-2016</span> before issue.</p></div>`},
    {label:'8 Disciplines',content:`
      <p style="font-size:12px;color:var(--text-secondary);font-weight:500;margin-bottom:8px">70 technologies. Every service condition.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px">
        <div style="padding:8px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px"><p style="font-size:10px;color:#F97316;font-weight:600;margin-bottom:2px">Flow</p><p style="font-size:9px;color:var(--text-muted)">12 technologies · DN6–DN600+ · three-tier cost advisory</p></div>
        <div style="padding:8px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px"><p style="font-size:10px;color:#F97316;font-weight:600;margin-bottom:2px">Level</p><p style="font-size:9px;color:var(--text-muted)">DP · radar · guided wave · capacitance · float</p></div>
        <div style="padding:8px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px"><p style="font-size:10px;color:#F97316;font-weight:600;margin-bottom:2px">Temperature</p><p style="font-size:9px;color:var(--text-muted)">RTD Pt100 · thermocouple · thermowell · IR</p></div>
        <div style="padding:8px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px"><p style="font-size:10px;color:#F97316;font-weight:600;margin-bottom:2px">Pressure</p><p style="font-size:9px;color:var(--text-muted)">Gauge · absolute · DP · remote seal</p></div>
        <div style="padding:8px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px"><p style="font-size:10px;color:#F97316;font-weight:600;margin-bottom:2px">Control Valves</p><p style="font-size:9px;color:var(--text-muted)">Globe · butterfly · ball · Cv sizing ISA 75.01</p></div>
        <div style="padding:8px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px"><p style="font-size:10px;color:#F97316;font-weight:600;margin-bottom:2px">Analytical + Density</p><p style="font-size:9px;color:var(--text-muted)">pH · conductivity · O₂ · Coriolis density</p></div>
      </div>`},
  ],
  right:'specs',
},{
  id:'entie',name:'enTIE',cat:'Connected Intelligence',
  tag:'One connected layer. Zero lock-in. Every system you already run.',color:'#60A5FA',
  status:'Roadmap',statusBg:'#1C1030',statusBorder:'#2C1C48',statusText:'#A78BFA',
  openTie:true,
  body:`enTIE connects enxco capabilities to the plant systems you already run — DCS, historian, MES, ERP. It also exposes plant data via MCP server for Claude Desktop and other AI tools. The intelligence you build in enxco doesn't stay in enxco.`,
  body2:`Built as an integration layer, not a migration project — open protocol adapters sit alongside your installed base, so adoption is incremental, standards-compliant, and reversible at every step.`,
  specs:[
    {l:'Protocol',v:'Open'},{l:'MCP',v:'Yes'},
    {l:'Lock-in',v:'None'},{l:'Status',v:'Roadmap'},
    {l:'Deployment',v:'Incremental'},{l:'Security',v:'Encrypted transit'},
  ],
  tabs:[
    {label:'The Layer',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">One connectivity layer between enxco and everything you already run.</p>
      <p style="font-size:12px;color:var(--text-muted);line-height:1.7;margin-bottom:12px">enTIE sits alongside your installed base — not underneath it. Each connected system gets its own adapter; enTIE doesn't become a new system of record, so nothing you already trust has to be replaced.</p>
      <div class="matrix-eq">
        enxco  ⇄  enTIE  ⇄  DCS · Historian · MES · ERP<br/><br/>
        Open protocol adapters — no proprietary formats<br/>
        MCP server exposes the same data to Claude Desktop &amp; AI tools
      </div>`},
    {label:'Connections',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">Plugs into the systems already on your floor.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px">
        <div style="padding:8px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px"><p style="font-size:10px;color:#60A5FA;font-weight:600;margin-bottom:2px">DCS</p><p style="font-size:9px;color:var(--text-muted)">OPC-UA · Modbus adapters</p></div>
        <div style="padding:8px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px"><p style="font-size:10px;color:#60A5FA;font-weight:600;margin-bottom:2px">Historian</p><p style="font-size:9px;color:var(--text-muted)">Time-series read/write bridge</p></div>
        <div style="padding:8px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px"><p style="font-size:10px;color:#60A5FA;font-weight:600;margin-bottom:2px">MES</p><p style="font-size:9px;color:var(--text-muted)">Work-order &amp; batch context</p></div>
        <div style="padding:8px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px"><p style="font-size:10px;color:#60A5FA;font-weight:600;margin-bottom:2px">ERP</p><p style="font-size:9px;color:var(--text-muted)">Asset &amp; procurement data</p></div>
        <div style="padding:8px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px"><p style="font-size:10px;color:#60A5FA;font-weight:600;margin-bottom:2px">Claude Desktop</p><p style="font-size:9px;color:var(--text-muted)">MCP server — AI tools query live plant data</p></div>
        <div style="padding:8px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px"><p style="font-size:10px;color:#60A5FA;font-weight:600;margin-bottom:2px">enxco</p><p style="font-size:9px;color:var(--text-muted)">enVIEW · enGENIE · enABLE · enSTUDIO · enGRAM</p></div>
      </div>`},
    {label:'Safe · Secure · Scalable',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">Defense in depth, built in — not bolted on after.</p>
      <ul class="blist">
        <li><span>—</span><span><b style="color:var(--text-secondary)">Safe</b> — read-scoped adapters; enTIE exposes data, it never overwrites your systems of record.</span></li>
        <li><span>—</span><span><b style="color:var(--text-secondary)">Secure</b> — encrypted data in transit on every connection, with an auditable log per adapter.</span></li>
        <li><span>—</span><span><b style="color:var(--text-secondary)">Scalable</b> — add one adapter at a time; the same layer covers a single line or a multi-plant rollout.</span></li>
      </ul>`},
    {label:'Deployment',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">Connect one system at a time — nothing gets torn out.</p>
      <div style="display:flex;flex-direction:column;gap:6px">
        <div style="display:flex;gap:10px;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px">
          <span class="mono" style="font-size:10px;color:#60A5FA;flex-shrink:0;margin-top:1px">01</span>
          <p style="font-size:12px;color:var(--text-muted);line-height:1.5">Turn on a single adapter — historian is the common starting point.</p>
        </div>
        <div style="display:flex;gap:10px;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px">
          <span class="mono" style="font-size:10px;color:#60A5FA;flex-shrink:0;margin-top:1px">02</span>
          <p style="font-size:12px;color:var(--text-muted);line-height:1.5">Runs alongside legacy DCS/SCADA during the transition — nothing is switched off.</p>
        </div>
        <div style="display:flex;gap:10px;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px">
          <span class="mono" style="font-size:10px;color:#60A5FA;flex-shrink:0;margin-top:1px">03</span>
          <p style="font-size:12px;color:var(--text-muted);line-height:1.5">Add MES/ERP adapters as needed — lower TCO than a forklift integration project.</p>
        </div>
        <div style="display:flex;gap:10px;padding:8px 12px;background:var(--surface-section);border:1px solid var(--border-default);border-radius:4px">
          <span class="mono" style="font-size:10px;color:#60A5FA;flex-shrink:0;margin-top:1px">04</span>
          <p style="font-size:12px;color:var(--text-muted);line-height:1.5">Time-to-value in weeks, not a multi-quarter rollout.</p>
        </div>
      </div>`},
    {label:'Status',content:`
      <p style="font-size:13px;color:var(--text-body);font-weight:500;margin-bottom:8px">Where enTIE stands today.</p>
      <ul class="blist">
        <li><span>—</span><span><b style="color:var(--text-secondary)">Roadmap</b> — enTIE is not yet generally available; architecture and adapter list above reflect the current design.</span></li>
        <li><span>—</span><span><b style="color:var(--text-secondary)">Design principle</b> — no proprietary lock-in on either side, honoured from the first adapter shipped.</span></li>
        <li><span>—</span><span><b style="color:var(--text-secondary)">Get involved</b> — tell us which system (DCS, historian, MES or ERP) you'd connect first.</span></li>
      </ul>`},
  ],
  right:'specs',
}];
