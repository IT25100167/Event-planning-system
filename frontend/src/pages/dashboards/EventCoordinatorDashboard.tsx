import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'

/* Event Coordinator dashboard — converted from dashboard.html.
   Same layout, colours and API calls; only the packaging changed. */

/* All styles for this page live here (scoped under .coord so other pages are unaffected). */
const COORD_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

/* Event Coordinator dashboard — every rule is scoped under .coord so it
   cannot affect the other dashboards. Colours/layout are unchanged from dashboard.html. */
.coord{ min-height:100vh; }
.coord h1, .coord h2, .coord h3{ font-weight:700; }
.coord .modal h2{ font-size:1.5em; }
  .coord{
    --bg: #F2F4FE;
    --surface: #FFFFFF;
    --surface-tint: #F0EEFF;
    --lavender: #7B6EF6;
    --lavender-deep: #5D50D9;
    --periwinkle: #9B8AFB;
    --sky: #4FA8E0;
    --ink: #23263B;
    --muted: #7A7F9A;
    --border: #E7E8F5;
    --high: #F0637A;
    --med: #F2A65A;
    --low: #4FA8E0;
    --pending: #A6ABC7;
    --progress: #4FA8E0;
    --done: #3FBE8E;
    --radius-lg: 20px;
    --radius-md: 14px;
    --shadow-sm: 0 1px 2px rgba(35,38,59,0.04);
    --shadow-md: 0 10px 30px rgba(35,38,59,0.08);
    --shadow-lift: 0 16px 40px rgba(93,80,217,0.16);
  }
  .coord *{ box-sizing:border-box; }
  .coord{
    margin:0;
    background:
      radial-gradient(1200px 420px at 100% -10%, rgba(123,110,246,0.10), transparent),
      radial-gradient(900px 500px at -10% 15%, rgba(79,168,224,0.10), transparent),
      var(--bg);
    color:var(--ink);
    font-family:'Inter',sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  .coord h1, .coord h2, .coord h3{ font-family:'Sora',sans-serif; margin:0; }
  .coord button{ font-family:'Inter',sans-serif; cursor:pointer; }
  .coord ::selection{ background:var(--lavender); color:#fff; }
  @keyframes coord-fadeInUp{ from{ opacity:0; transform:translateY(10px);} to{ opacity:1; transform:translateY(0);} }
  @keyframes coord-fadeIn{ from{ opacity:0;} to{ opacity:1;} }
  @keyframes coord-floatBlob{ 0%,100%{ transform:translate(0,0) scale(1);} 50%{ transform:translate(14px,-10px) scale(1.05);} }
  @keyframes coord-shimmer{ 0%{ background-position:-300px 0;} 100%{ background-position:300px 0;} }
  @keyframes coord-popIn{ from{ opacity:0; transform:scale(0.94) translateY(6px);} to{ opacity:1; transform:scale(1) translateY(0);} }
  @media (prefers-reduced-motion: reduce){
  .coord *{ animation:none !important; transition:none !important; }
  }
  .coord .animate-in{ animation:coord-fadeInUp .45s ease both; }
  .coord .animate-fade{ animation:coord-fadeIn .3s ease both; }

  /* Layout */
  .coord .shell{ display:flex; min-height:100vh; }
  .coord .sidebar{
    width:230px; flex-shrink:0; background:var(--surface); border-right:1px solid var(--border);
    padding:28px 20px; display:flex; flex-direction:column; gap:6px; position:sticky; top:0; height:100vh;
  }
  .coord .brand{ display:flex; align-items:center; gap:10px; margin-bottom:32px; padding:0 6px; }
  .coord .brand-mark{
    width:36px; height:36px; border-radius:11px;
    background:linear-gradient(135deg, var(--lavender), var(--sky));
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-family:'Sora',sans-serif; font-weight:700; font-size:15px;
    box-shadow:var(--shadow-lift);
  }
  .coord .brand-name{ font-family:'Sora',sans-serif; font-weight:700; font-size:15px; line-height:1.2; }
  .coord .brand-sub{ font-size:11px; color:var(--muted); }
  .coord .navitem{
    display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:11px;
    color:var(--muted); font-size:14px; font-weight:500; border:none; background:transparent;
    text-align:left; width:100%; transition:background .15s ease, color .15s ease;
  }
  .coord .navitem.active{ background:var(--surface-tint); color:var(--lavender-deep); font-weight:600; }
  .coord .navitem:hover:not(.active){ background:#FAFAFF; }
  .coord .navitem svg{ opacity:.8; flex-shrink:0; }
  .coord .navitem.active svg{ opacity:1; }
  .coord .sidebar-footer{
    margin-top:auto; padding:14px; border-radius:var(--radius-md);
    background:linear-gradient(160deg, var(--surface-tint), #EAF4FC);
    font-size:12px; color:var(--muted); line-height:1.5;
  }
  .coord .main{ flex:1; padding:32px 40px 60px; max-width:1500px; }

  /* Hero */
  .coord .hero{
    position:relative; overflow:hidden; border-radius:24px; padding:32px 36px;
    background:linear-gradient(120deg, var(--lavender-deep), var(--lavender) 55%, var(--sky));
    color:#fff; margin-bottom:26px; box-shadow:var(--shadow-lift);
  }
  .coord .hero-blob{ position:absolute; pointer-events:none; border-radius:999px; filter:blur(2px); opacity:.35; animation:coord-floatBlob 9s ease-in-out infinite; }
  .coord .hero-blob.b1{ width:180px; height:180px; background:#fff; top:-70px; right:60px; }
  .coord .hero-blob.b2{ width:120px; height:120px; background:var(--sky); bottom:-50px; right:220px; animation-delay:2s; }
  .coord .hero-blob.b3{ width:90px; height:90px; background:#fff; top:20px; right:280px; opacity:.18; animation-delay:4s; }
  .coord .hero-inner{ position:relative; display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:24px; }
  .coord .hero-greet{ font-size:0.85rem; opacity:.85; margin-bottom:6px; }
  .coord .hero h1{ font-size:1.9rem; color:#fff; }
  .coord .hero p{ margin:6px 0 0; opacity:.85; font-size:0.92rem; max-width:420px; }
  .coord .hero-progress-wrap{ min-width:220px; }
  .coord .hero-progress-label{ display:flex; justify-content:space-between; font-size:0.78rem; opacity:.85; margin-bottom:6px; }
  .coord .hero-progress-track{ height:8px; border-radius:999px; background:rgba(255,255,255,0.28); overflow:hidden; }
  .coord .hero-progress-fill{ height:100%; border-radius:999px; background:#fff; transition:width .6s ease; }
  .coord .event-select{
    display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.16);
    border:1px solid rgba(255,255,255,0.3); padding:8px 14px; border-radius:999px; backdrop-filter:blur(4px);
  }
  .coord .event-select label{ font-size:12px; opacity:.85; }
  .coord .event-select input{ border:none; outline:none; width:50px; font-size:14px; font-weight:700; color:#fff; background:transparent; }
  .coord .event-select select{ 
    border:none; outline:none; min-width:150px; max-width:250px; font-size:14px; font-weight:600; 
    color:#fff; background:transparent; cursor:pointer; 
  }
  .coord .event-select select option{ color:#000; background:#fff; }
  .coord .pill{
    font-size:12px; padding:6px 12px; border-radius:999px; display:inline-flex; align-items:center; gap:6px; font-weight:600;
    background:rgba(255,255,255,0.18); color:#fff; border:1px solid rgba(255,255,255,0.3);
  }
  .coord .pill.err{ background:rgba(240,99,122,0.85); border-color:transparent; }
  .coord .pill .dot{ width:7px; height:7px; border-radius:999px; background:currentColor; }
  .coord .hero-top{ display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:18px; flex-wrap:wrap; }
  .coord .hero-actions{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; }

  /* Stats */
  .coord .stats{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:26px; }
  @media (max-width:1000px){
  .coord .stats{ grid-template-columns:repeat(2,1fr); }
  }
  .coord .stat-card{
    background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px;
    display:flex; flex-direction:column; gap:10px; transition:transform .18s ease, box-shadow .18s ease;
  }
  .coord .stat-card:hover{ transform:translateY(-3px); box-shadow:var(--shadow-md); }
  .coord .stat-icon{ width:38px; height:38px; border-radius:11px; display:flex; align-items:center; justify-content:center; }
  .coord .stat-num{ font-family:'Sora',sans-serif; font-size:1.8rem; font-weight:800; }
  .coord .stat-label{ font-size:0.82rem; color:var(--muted); }
  .coord .stat-trend{ font-size:0.72rem; font-weight:700; display:flex; align-items:center; gap:4px; }

  /* Content grid */
  .coord .content{ display:grid; grid-template-columns:1fr 340px; gap:22px; align-items:start; margin-bottom:22px; }
  @media (max-width:1150px){
  .coord .content{ grid-template-columns:1fr; }
  }
  .coord .card{
    background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:22px;
    box-shadow:var(--shadow-sm);
  }
  .coord .card-head{ display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; gap:12px; flex-wrap:wrap; }
  .coord .card-head h2{ font-size:1.05rem; }
  .coord .btn{
    border-radius:11px; padding:10px 16px; font-size:0.86rem; font-weight:600; border:none;
    display:inline-flex; align-items:center; gap:8px; transition:transform .12s ease, opacity .15s ease, background .15s ease;
  }
  .coord .btn:active{ transform:scale(0.96); }
  .coord .btn-primary{ background:#fff; color:var(--lavender-deep); }
  .coord .btn-primary:hover{ background:#F4F2FF; }
  .coord .btn-outline{ background:transparent; border:1px solid var(--border); color:var(--ink); }
  .coord .btn-outline:hover{ background:var(--surface-tint); }
  .coord .btn-icon{
    width:32px; height:32px; padding:0; border-radius:10px; display:flex; align-items:center; justify-content:center;
    background:var(--surface-tint); border:none; color:var(--ink); transition:background .15s ease, transform .12s ease;
  }
  .coord .btn-icon:hover{ background:#E4E1FF; transform:translateY(-1px); }
  .coord .btn-danger-ghost{ color:var(--high); background:#FDEBEE; }
  .coord .btn-danger-ghost:hover{ background:#FBDBE0; }
  .coord .searchbar{
    display:flex; align-items:center; gap:8px; background:var(--bg); border:1px solid var(--border);
    border-radius:11px; padding:8px 12px; font-size:0.86rem; flex:1; min-width:160px;
  }
  .coord .searchbar input{ border:none; background:transparent; outline:none; width:100%; font-size:0.86rem; }
  .coord .tabs{ display:flex; gap:4px; background:var(--bg); padding:4px; border-radius:11px; }
  .coord .tab{
    border:none; background:transparent; padding:7px 16px; border-radius:8px; font-size:0.82rem; font-weight:700; color:var(--muted);
    transition:background .15s ease, color .15s ease;
  }
  .coord .tab.active{ background:var(--surface); color:var(--lavender-deep); box-shadow:var(--shadow-sm); }
  .coord .filters{ display:flex; gap:8px; flex-wrap:wrap; }
  .coord .filter-chip{
    font-size:0.78rem; padding:6px 12px; border-radius:999px; border:1px solid var(--border); background:transparent;
    color:var(--muted); font-weight:600; transition:background .15s ease, color .15s ease;
  }
  .coord .filter-chip.active{ background:var(--ink); color:#fff; border-color:var(--ink); }
  .coord .filter-chip:hover:not(.active){ background:var(--surface-tint); }

  /* Task list */
  .coord .task-row{
    display:grid; grid-template-columns:1fr 90px 100px 150px 150px 40px; gap:12px; align-items:center;
    padding:14px 6px; border-bottom:1px solid var(--border); transition:background .15s ease;
  }
  .coord .task-row:hover{ background:#FAFAFF; }
  .coord .task-row:last-child{ border-bottom:none; }
  .coord .task-row-head{ font-size:0.7rem; text-transform:uppercase; letter-spacing:0.04em; color:var(--muted); padding:0 6px 10px; border-bottom:1px solid var(--border); }
  .coord .task-title{ font-weight:600; font-size:0.92rem; }
  .coord .task-desc{ color:var(--muted); font-size:0.8rem; margin-top:2px; }
  .coord .task-due{ font-size:0.85rem; color:var(--ink); }
  .coord .task-due.overdue{ color:var(--high); font-weight:700; }
  .coord .badge{ display:inline-flex; align-items:center; gap:6px; font-size:0.74rem; font-weight:700; padding:4px 10px; border-radius:999px; }
  .coord .badge.HIGH{ background:#FDEBEE; color:var(--high); }
  .coord .badge.MEDIUM{ background:#FEF3E7; color:var(--med); }
  .coord .badge.LOW{ background:#EAF4FC; color:var(--low); }
  .coord .status-select{
    font-size:0.76rem; font-weight:700; padding:6px 10px; border-radius:999px; border:1px solid var(--border);
    background:var(--bg); color:var(--ink);
  }
  .coord .status-select.PENDING{ color:var(--pending); }
  .coord .status-select.IN_PROGRESS{ color:var(--progress); }
  .coord .status-select.COMPLETED{ color:var(--done); }
  .coord .assignee{ display:flex; align-items:center; gap:8px; font-size:0.82rem; }
  .coord .avatar{
    width:26px; height:26px; border-radius:999px; display:flex; align-items:center; justify-content:center;
    color:#fff; font-size:0.68rem; font-weight:800; flex-shrink:0; font-family:'Sora',sans-serif;
  }
  .coord .empty-state{ text-align:center; padding:60px 20px; color:var(--muted); }
  .coord .empty-state svg{ opacity:.5; margin:0 auto 12px; display:block; }
  .coord .skeleton-row{ height:52px; border-radius:10px; margin-bottom:8px;
    background:linear-gradient(90deg, #F1F1FA 25%, #F8F8FD 37%, #F1F1FA 63%);
    background-size:600px 100%; animation:coord-shimmer 1.4s linear infinite; }

  /* Board */
  .coord .board{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
  @media (max-width:820px){
  .coord .board{ grid-template-columns:1fr; }
  }
  .coord .board-col{
    background:var(--bg); border-radius:var(--radius-md); padding:12px; min-height:120px;
    border:1.5px dashed transparent; transition:border-color .15s ease, background .15s ease;
  }
  .coord .board-col.drag-over{ border-color:var(--lavender); background:#EFEBFF; }
  .coord .board-col-head{ display:flex; align-items:center; justify-content:space-between; padding:2px 6px 10px; }
  .coord .board-col-title{ font-size:0.8rem; font-weight:700; display:flex; align-items:center; gap:8px; }
  .coord .board-col-dot{ width:8px; height:8px; border-radius:999px; }
  .coord .board-count{ font-size:0.72rem; color:var(--muted); background:var(--surface); padding:2px 8px; border-radius:999px; }
  .coord .board-card{
    background:var(--surface); border-radius:12px; padding:12px 14px; margin-bottom:10px; cursor:grab;
    box-shadow:var(--shadow-sm); transition:box-shadow .15s ease, transform .15s ease; border:1px solid var(--border);
  }
  .coord .board-card:hover{ box-shadow:var(--shadow-md); transform:translateY(-2px); }
  .coord .board-card:active{ cursor:grabbing; }
  .coord .board-card-title{ font-weight:600; font-size:0.86rem; margin-bottom:8px; }
  .coord .board-card-foot{ display:flex; align-items:center; justify-content:space-between; margin-top:10px; }

  /* Donut */
  .coord .donut-wrap{ display:flex; align-items:center; gap:20px; }
  .coord .donut-legend{ display:flex; flex-direction:column; gap:8px; font-size:0.8rem; }
  .coord .legend-row{ display:flex; align-items:center; gap:8px; }
  .coord .legend-dot{ width:9px; height:9px; border-radius:999px; }
  .coord .legend-val{ margin-left:auto; font-weight:700; color:var(--ink); }

  /* Priority bars */
  .coord .pbar-row{ margin-bottom:12px; }
  .coord .pbar-row:last-child{ margin-bottom:0; }
  .coord .pbar-label{ display:flex; justify-content:space-between; font-size:0.78rem; margin-bottom:5px; color:var(--muted); font-weight:600; }
  .coord .pbar-track{ height:8px; border-radius:999px; background:var(--bg); overflow:hidden; }
  .coord .pbar-fill{ height:100%; border-radius:999px; transition:width .6s ease; }

  /* Workload */
  .coord .workload-row{ display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--border); }
  .coord .workload-row:last-child{ border-bottom:none; }
  .coord .workload-info{ flex:1; min-width:0; }
  .coord .workload-name{ font-size:0.85rem; font-weight:600; margin-bottom:5px; }
  .coord .workload-track{ height:6px; border-radius:999px; background:var(--bg); overflow:hidden; }
  .coord .workload-fill{ height:100%; background:linear-gradient(90deg, var(--lavender), var(--sky)); border-radius:999px; transition:width .6s ease; }
  .coord .workload-count{ font-size:0.75rem; color:var(--muted); white-space:nowrap; }

  /* Activity */
  .coord .activity-row{ display:flex; gap:10px; padding:9px 0; }
  .coord .activity-dot{ width:8px; height:8px; border-radius:999px; margin-top:6px; flex-shrink:0; }
  .coord .activity-text{ font-size:0.83rem; }
  .coord .activity-time{ font-size:0.72rem; color:var(--muted); margin-top:1px; }

  /* Calendar */
  .coord .cal-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
  .coord .cal-month{ font-weight:700; font-size:0.95rem; }
  .coord .cal-nav{ display:flex; gap:6px; }
  .coord .cal-grid{ display:grid; grid-template-columns:repeat(7,1fr); gap:4px; }
  .coord .cal-dow{ font-size:0.66rem; color:var(--muted); text-align:center; padding-bottom:6px; font-weight:700; }
  .coord .cal-day{
    aspect-ratio:1; border-radius:10px; display:flex; flex-direction:column; align-items:center; justify-content:center;
    font-size:0.78rem; position:relative; color:var(--ink); background:transparent; border:1px solid transparent;
    transition:background .12s ease, transform .12s ease;
  }
  .coord .cal-day:not(.muted):hover{ background:var(--surface-tint); transform:scale(1.05); }
  .coord .cal-day.muted{ color:var(--border); }
  .coord .cal-day.today{ border-color:var(--lavender); font-weight:700; }
  .coord .cal-day.selected{ background:var(--lavender); color:#fff; }
  .coord .cal-dots{ position:absolute; bottom:4px; display:flex; gap:2px; }
  .coord .cal-dots span{ width:4px; height:4px; border-radius:999px; }
  .coord .cal-legend{ display:flex; gap:12px; margin-top:14px; font-size:0.72rem; color:var(--muted); flex-wrap:wrap; }
  .coord .cal-legend span{ display:inline-flex; align-items:center; gap:5px; }
  .coord .cal-clear{ margin-top:12px; width:100%; }
  .coord .upcoming-item{ display:flex; justify-content:space-between; align-items:flex-start; padding:10px 0; border-bottom:1px solid var(--border); gap:10px; }
  .coord .upcoming-item:last-child{ border-bottom:none; }
  .coord .upcoming-title{ font-size:0.85rem; font-weight:600; }
  .coord .upcoming-date{ font-size:0.75rem; color:var(--muted); margin-top:2px; }
  .coord .bottom-row{ display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
  @media (max-width:1000px){
  .coord .bottom-row{ grid-template-columns:1fr; }
  }

  /* Modal */
  .coord .overlay{ position:fixed; inset:0; background:rgba(35,38,59,0.4); backdrop-filter:blur(2px);
    display:flex; align-items:center; justify-content:center; z-index:50; padding:20px; animation:coord-fadeIn .2s ease; }
  .coord .modal{
    background:var(--surface); border-radius:var(--radius-lg); width:100%; max-width:480px; padding:28px;
    box-shadow:0 30px 60px rgba(35,38,59,0.3); animation:coord-popIn .25s cubic-bezier(.2,.9,.3,1.2);
  }
  .coord .modal h2{ margin-bottom:20px; }
  .coord .field{ margin-bottom:16px; }
  .coord .field label{ display:block; font-size:0.78rem; color:var(--muted); margin-bottom:6px; font-weight:600; }
  .coord .field input, .coord .field select, .coord .field textarea{
    width:100%; padding:10px 12px; border-radius:11px; border:1px solid var(--border);
    background:var(--bg); font-family:'Inter',sans-serif; font-size:0.88rem; color:var(--ink);
    transition:border-color .15s ease;
  }
  .coord .field input:focus, .coord .field select:focus, .coord .field textarea:focus{ outline:none; border-color:var(--lavender); }
  .coord .field textarea{ resize:vertical; min-height:64px; }
  .coord .field-row{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .coord .modal-actions{ display:flex; justify-content:flex-end; gap:10px; margin-top:22px; }
  .coord .form-error{ color:var(--high); font-size:0.82rem; margin-top:4px; min-height:18px; }
  .coord .hero-blob{ pointer-events:none; }
  .coord .hero-top{ position:relative; z-index:2; }
`

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080'

/* fetch wrapper: sends the JWT saved at login (if any) so secured endpoints accept the request */
const authFetch = (url: string, init: RequestInit = {}) => {
  const token = localStorage.getItem('authToken')
  return fetch(url, {
    ...init,
    headers: { ...(init.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  })
}

/* ---------- types ---------- */
type Priority = 'LOW' | 'MEDIUM' | 'HIGH'
type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
type Page = 'dashboard' | 'team' | 'milestones' | 'messages' | 'notifications'

interface Task {
  id: number
  title: string
  description?: string
  priority: Priority
  status: Status
  dueDate: string
  assigneeName?: string
  milestoneName?: string
  createdAt?: string
}
interface CalendarEntry {
  id: number
  date: string
  type?: string
  priority: Priority
  title?: string
}
interface Milestone {
  id: number
  name: string
  description?: string
  dueDate: string
}
interface AppNotification {
  id: number
  message: string
  seen: boolean
  createdAt: string
}
interface ChatMessage {
  id: number
  senderName: string
  senderRole: string
  content: string
  sentAt: string
}
interface Stats {
  total: number
  pending: number
  progress: number
  done: number
}

/* ---------- icons ---------- */
type IconProps = React.SVGProps<SVGSVGElement>
const Icon = {
  Grid: (p: IconProps) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/></svg>),
  Tasks: (p: IconProps) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="M9 6h11M9 12h11M9 18h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Team: (p: IconProps) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8"/><circle cx="17" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5M14 20c0-2.2 1.6-4 4-4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  Plus: (p: IconProps) => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>),
  Trash: (p: IconProps) => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  ChevL: (p: IconProps) => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  ChevR: (p: IconProps) => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Clock: (p: IconProps) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  Bolt: (p: IconProps) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><path d="M13 3L5 14h6l-1 7 9-12h-6l1-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>),
  Check: (p: IconProps) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Layers: (p: IconProps) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3l9 5-9 5-9-5 9-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M3 13l9 5 9-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>),
  Empty: (p: IconProps) => (<svg width="44" height="44" viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M4 10h16M9 3v3M15 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
}

const PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH']
const STATUSES: Status[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED']
const STATUS_META: Record<Status, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'var(--pending)' },
  IN_PROGRESS: { label: 'In progress', color: 'var(--sky)' },
  COMPLETED: { label: 'Completed', color: 'var(--done)' },
}
const PRIORITY_COLOR: Record<string, string> = {
  HIGH: 'var(--high)',
  MEDIUM: 'var(--med)',
  LOW: 'var(--low)',
  MILESTONE: 'var(--lavender-deep)',
}
const AVATAR_PALETTE = ['#7B6EF6', '#4FA8E0', '#3FBE8E', '#F2A65A', '#9B8AFB', '#F0637A']
const todayISO = () => new Date().toLocaleDateString('en-CA')

function hashColor(name?: string) {
  const s = name || 'Unassigned'
  let h = 0
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length]
}
function initials(name?: string) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase()
}

/* count-up hook */
function useCountUp(target: number, duration = 700) {
  const [val, setVal] = useState(0)
  const startRef = useRef<number | null>(null)
  useEffect(() => {
    let raf = 0
    startRef.current = null
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const progress = Math.min((ts - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(target * eased))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return val
}

function relativeTime(iso: string) {
  const then = new Date(iso).getTime()
  const diffMin = Math.max(1, Math.round((Date.now() - then) / 60000))
  if (diffMin < 60) return `${diffMin}m ago`
  const diffH = Math.round(diffMin / 60)
  if (diffH < 24) return `${diffH}h ago`
  const diffD = Math.round(diffH / 24)
  return `${diffD}d ago`
}
function formatNice(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

/* ---------- main component ---------- */
interface CoordinatorDashboardProps {
  onNotify?: (message: string) => void
  onNavigateToPublic?: () => void
  onLogout?: () => void
}

export default function CoordinatorDashboard({ onNotify, onNavigateToPublic, onLogout }: CoordinatorDashboardProps) {
  const [events, setEvents] = useState<Array<{id: number, name: string}>>([])
  const [eventId, setEventId] = useState<number | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [apiOk, setApiOk] = useState<boolean | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | Status>('ALL')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [view, setView] = useState<'list' | 'board'>('list')
  const [page, setPage] = useState<Page>('dashboard')
  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date()
    return { y: d.getFullYear(), m: d.getMonth() }
  })
  const [dragOverCol, setDragOverCol] = useState<Status | null>(null)
  const [calendar, setCalendar] = useState<CalendarEntry[]>([])
  const [calTick, setCalTick] = useState(0)

  // Fetch coordinator's events on mount
  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await authFetch(`${API_BASE}/events/my-events`)
        if (res.ok) {
          const data = await res.json()
          setEvents(data.map((e: any) => ({ id: e.eventId, name: e.eventName })))
          // Auto-select first event
          if (data.length > 0) {
            setEventId(data[0].eventId)
          }
        }
      } catch (e) {
        console.error('Failed to fetch events:', e)
      }
    }
    fetchMyEvents()
  }, [])

  useEffect(() => {
    if (!eventId) return
    authFetch(`${API_BASE}/calendar/event/${eventId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setCalendar)
      .catch(() => setCalendar([]))
  }, [eventId, tasks, calTick])

  const loadTasks = useCallback(async (id: number | null) => {
    if (id === null) return
    setLoading(true)
    try {
      const res = await authFetch(`${API_BASE}/tasks/event/${id}`)
      if (res.ok) {
        setTasks(await res.json())
        setApiOk(true)
      } else if (res.status === 404) {
        setTasks([])
        setApiOk(true)
      } else {
        setApiOk(false)
      }
    } catch (e) {
      setApiOk(false)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadTasks(eventId)
  }, [eventId, loadTasks])

  const updateStatus = async (id: number, status: Status) => {
    try {
      const res = await authFetch(`${API_BASE}/tasks/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        alert('Could not update status (error ' + res.status + ').')
      } else {
        onNotify?.('Task status updated')
      }
      loadTasks(eventId)
    } catch (e) {
      alert('Could not update status — check the API is running.')
    }
  }

  const deleteTask = async (id: number) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await authFetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' })
      onNotify?.('Task deleted')
      loadTasks(eventId)
    } catch (e) {
      alert('Could not delete task — check the API is running.')
    }
  }

  const filtered = useMemo(
    () =>
      tasks.filter((t) => {
        if (statusFilter !== 'ALL' && t.status !== statusFilter) return false
        if (selectedDate && t.dueDate !== selectedDate) return false
        if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
        return true
      }),
    [tasks, statusFilter, selectedDate, search]
  )

  const stats: Stats = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'PENDING').length,
      progress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      done: tasks.filter((t) => t.status === 'COMPLETED').length,
    }),
    [tasks]
  )

  const completionPct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0

  const upcoming = useMemo(
    () =>
      [...tasks]
        .filter((t) => t.status !== 'COMPLETED')
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, 5),
    [tasks]
  )

  const priorityCounts = useMemo(() => {
    const c: Record<Priority, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 }
    tasks.forEach((t) => {
      c[t.priority]++
    })
    return c
  }, [tasks])
  const maxPriority = Math.max(1, ...Object.values(priorityCounts))

  const workload = useMemo(() => {
    const map: Record<string, { name: string; total: number; done: number }> = {}
    tasks.forEach((t) => {
      const name = t.assigneeName || 'Unassigned'
      if (!map[name]) map[name] = { name, total: 0, done: 0 }
      map[name].total++
      if (t.status === 'COMPLETED') map[name].done++
    })
    return Object.values(map)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  }, [tasks])

  const activity = useMemo(
    () =>
      [...tasks]
        .filter((t) => t.createdAt)
        .sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime())
        .slice(0, 5),
    [tasks]
  )

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  return (
    <div className="coord">
      <style>{COORD_CSS}</style>
      <div className="shell">
        <Sidebar page={page} setPage={setPage} onLogout={onLogout ?? onNavigateToPublic} />
        <div className="main">
          <Hero
            eventId={eventId}
            setEventId={setEventId}
            apiOk={apiOk}
            onNew={() => setShowForm(true)}
            greeting={greeting}
            completionPct={completionPct}
            total={stats.total}
            page={page}
            events={events}
          />
          {page === 'dashboard' && <StatsRow stats={stats} />}
          <div className="content" style={page === 'dashboard' ? undefined : { display: 'none' }}>
            <div className="card animate-in">
              <div className="card-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <h2>Tasks {selectedDate ? `— ${formatNice(selectedDate)}` : ''}</h2>
                  <div className="tabs">
                    <button className={'tab' + (view === 'list' ? ' active' : '')} onClick={() => setView('list')}>List</button>
                    <button className={'tab' + (view === 'board' ? ' active' : '')} onClick={() => setView('board')}>Board</button>
                  </div>
                </div>
                <div className="searchbar" style={{ maxWidth: 220 }}>
                  <input placeholder="Search tasks…" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>

              {view === 'list' && (
                <div className="filters" style={{ marginBottom: 16 }}>
                  {(['ALL', ...STATUSES] as const).map((s) => (
                    <button key={s} className={'filter-chip' + (statusFilter === s ? ' active' : '')} onClick={() => setStatusFilter(s)}>
                      {s === 'ALL' ? 'All' : STATUS_META[s].label}
                    </button>
                  ))}
                  {selectedDate && (
                    <button className="filter-chip" onClick={() => setSelectedDate(null)}>✕ {formatNice(selectedDate)}</button>
                  )}
                </div>
              )}

              {loading ? (
                <div>{[0, 1, 2, 3].map((i) => <div className="skeleton-row" key={i} />)}</div>
              ) : view === 'list' ? (
                filtered.length === 0 ? (
                  <div className="empty-state"><Icon.Empty /><div>No tasks match right now. Try "New task" to add one.</div></div>
                ) : (
                  <div className="animate-fade" key={statusFilter + search + selectedDate}>
                    <div className="task-row task-row-head">
                      <span>Task</span><span>Priority</span><span>Due</span><span>Status</span><span>Assignee</span><span></span>
                    </div>
                    {filtered.map((t, i) => (
                      <div className="task-row animate-in" style={{ animationDelay: `${i * 35}ms` }} key={t.id}>
                        <div>
                          <div className="task-title">{t.title}</div>
                          {t.description ? <div className="task-desc">{t.description}</div> : null}
                          {t.milestoneName ? <div className="task-desc" style={{ color: 'var(--lavender-deep)', fontWeight: 600 }}>🏁 {t.milestoneName}</div> : null}
                        </div>
                        <div><span className={`badge ${t.priority}`}>{t.priority}</span></div>
                        <div className={'task-due' + (t.status !== 'COMPLETED' && t.dueDate < todayISO() ? ' overdue' : '')}>{formatNice(t.dueDate)}</div>
                        <div>
                          <select className={`status-select ${t.status}`} value={t.status} onChange={(e) => updateStatus(t.id, e.target.value as Status)}>
                            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
                          </select>
                        </div>
                        <div className="assignee">
                          <span className="avatar" style={{ background: hashColor(t.assigneeName) }}>{initials(t.assigneeName)}</span>
                          {t.assigneeName || <span style={{ color: 'var(--muted)' }}>Unassigned</span>}
                        </div>
                        <button className="btn-icon btn-danger-ghost" onClick={() => deleteTask(t.id)} title="Delete"><Icon.Trash /></button>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <BoardView tasks={filtered} onStatus={updateStatus} onDelete={deleteTask} dragOverCol={dragOverCol} setDragOverCol={setDragOverCol} />
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div className="card animate-in" style={{ animationDelay: '60ms' }}>
                <MiniCalendar calMonth={calMonth} setCalMonth={setCalMonth} entries={calendar} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
              </div>
              <div className="card animate-in" style={{ animationDelay: '100ms' }}>
                <div className="card-head"><h2>Status breakdown</h2></div>
                <StatusDonut stats={stats} />
              </div>
              <div className="card animate-in" style={{ animationDelay: '140ms' }}>
                <div className="card-head"><h2>Upcoming</h2></div>
                {upcoming.length === 0 ? (
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Nothing on the horizon.</div>
                ) : upcoming.map((t) => (
                  <div className="upcoming-item" key={t.id}>
                    <div>
                      <div className="upcoming-title">{t.title}</div>
                      <div className="upcoming-date">{formatNice(t.dueDate)}</div>
                    </div>
                    <span className={`badge ${t.priority}`}>{t.priority}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bottom-row" style={page === 'team' ? undefined : { display: 'none' }}>
            <div className="card animate-in" style={{ animationDelay: '120ms' }}>
              <div className="card-head"><h2>Priority breakdown</h2></div>
              {PRIORITIES.slice().reverse().map((p) => (
                <div className="pbar-row" key={p}>
                  <div className="pbar-label"><span>{p}</span><span>{priorityCounts[p]}</span></div>
                  <div className="pbar-track">
                    <div className="pbar-fill" style={{ width: `${(priorityCounts[p] / maxPriority) * 100}%`, background: PRIORITY_COLOR[p] }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="card animate-in" id="team" style={{ animationDelay: '160ms' }}>
              <div className="card-head"><h2>Team workload</h2><Icon.Team style={{ color: 'var(--muted)' }} /></div>
              {workload.length === 0 ? (
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No assignees yet.</div>
              ) : workload.map((w) => (
                <div className="workload-row" key={w.name}>
                  <span className="avatar" style={{ background: hashColor(w.name) }}>{initials(w.name)}</span>
                  <div className="workload-info">
                    <div className="workload-name">{w.name}</div>
                    <div className="workload-track">
                      <div className="workload-fill" style={{ width: `${w.total ? (w.done / w.total) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <span className="workload-count">{w.done}/{w.total}</span>
                </div>
              ))}
            </div>

            <div className="card animate-in" style={{ animationDelay: '200ms' }}>
              <div className="card-head"><h2>Recent activity</h2></div>
              {activity.length === 0 ? (
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No activity yet.</div>
              ) : activity.map((t) => (
                <div className="activity-row" key={t.id}>
                  <span className="activity-dot" style={{ background: PRIORITY_COLOR[t.priority] }} />
                  <div>
                    <div className="activity-text"><strong>{t.title}</strong> was created</div>
                    <div className="activity-time">{relativeTime(t.createdAt as string)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {page === 'milestones' && eventId && <MilestonesCard eventId={eventId} onChanged={() => setCalTick((t) => t + 1)} />}
          {page === 'messages' && eventId && <MessagesCard eventId={eventId} />}
          {page === 'notifications' && <NotificationsCard />}
        </div>

        {showForm && eventId && (
          <TaskFormModal
            eventId={eventId}
            onClose={() => setShowForm(false)}
            onCreated={() => {
              setShowForm(false)
              onNotify?.('Task created successfully')
              loadTasks(eventId)
            }}
          />
        )}
      </div>
    </div>
  )
}

/* ---------- sidebar & hero ---------- */
function Sidebar({ page, setPage, onLogout }: { page: Page; setPage: (p: Page) => void; onLogout?: () => void }) {
  const nav: { id: Page; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Icon.Grid /> },
    { id: 'team', label: 'Team & activity', icon: <Icon.Team /> },
    { id: 'milestones', label: 'Milestones', icon: <Icon.Layers width="16" height="16" /> },
    { id: 'messages', label: 'Messages', icon: <Icon.Tasks /> },
    { id: 'notifications', label: 'Notifications', icon: <Icon.Bolt width="16" height="16" /> },
  ]
  return (
    <div className="sidebar">
      <div className="brand">
        <div className="brand-mark">CC</div>
        <div>
          <div className="brand-name">Ceylon Celebrations</div>
          <div className="brand-sub">Coordination Suite</div>
        </div>
      </div>
      {nav.map((n) => (
        <button
          key={n.id}
          className={'navitem' + (page === n.id ? ' active' : '')}
          onClick={() => {
            setPage(n.id)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          {n.icon} {n.label}
        </button>
      ))}
      {onLogout && (
        <button className="navitem" style={{ marginTop: 12 }} onClick={onLogout}>
          Log out
        </button>
      )}
    </div>
  )
}

interface HeroProps {
  eventId: number | null
  setEventId: (n: number) => void
  apiOk: boolean | null
  onNew: () => void
  greeting: string
  completionPct: number
  total: number
  page: Page
  events: Array<{id: number, name: string}>
}
function Hero({ eventId, setEventId, apiOk, onNew, greeting, completionPct, total, page, events }: HeroProps) {
  if (page !== 'dashboard') {
    const titles: Record<string, string> = { team: 'Team & activity', milestones: 'Milestones', messages: 'Messages', notifications: 'Notifications' }
    return (
      <div className="hero" style={{ padding: '18px 26px', marginBottom: 22 }}>
        <div className="hero-blob b1"></div>
        <div className="hero-top" style={{ marginBottom: 0 }}>
          <div>
            <h1 style={{ fontSize: '1.35rem' }}>{titles[page]}</h1>
            <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: 2 }}>
              {eventId ? events.find(e => e.id === eventId)?.name || `Event #${eventId}` : 'No event selected'}
            </div>
          </div>
          <div className="hero-actions">
            <span className={'pill' + (apiOk === false ? ' err' : '')}><span className="dot"></span>{apiOk === false ? 'API not reachable' : 'API connected'}</span>
            <div className="event-select">
              <label>Event</label>
              <select value={eventId || ''} onChange={(e) => setEventId(Number(e.target.value))}>
                {events.length === 0 && <option value="">No events assigned</option>}
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.name}</option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" onClick={onNew}><Icon.Plus /> New task</button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="hero">
      <div className="hero-blob b1"></div><div className="hero-blob b2"></div><div className="hero-blob b3"></div>
      <div className="hero-top">
        <span className={'pill' + (apiOk === false ? ' err' : '')}><span className="dot"></span>{apiOk === false ? 'API not reachable' : 'API connected'}</span>
        <div className="hero-actions">
          <div className="event-select">
            <label>Event</label>
            <select value={eventId || ''} onChange={(e) => setEventId(Number(e.target.value))}>
              {events.length === 0 && <option value="">No events assigned</option>}
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.name}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={onNew}><Icon.Plus /> New task</button>
        </div>
      </div>
      <div className="hero-inner">
        <div>
          <div className="hero-greet">{greeting}, coordinator</div>
          <h1>Event #{eventId} at a glance</h1>
          <p>Track every task, deadline and hand-off for this event in one live view.</p>
        </div>
        {total > 0 && (
          <div className="hero-progress-wrap">
            <div className="hero-progress-label"><span>Overall completion</span><span>{completionPct}%</span></div>
            <div className="hero-progress-track"><div className="hero-progress-fill" style={{ width: `${completionPct}%` }} /></div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- stats, donut, board, calendar ---------- */
function StatsRow({ stats }: { stats: Stats }) {
  const total = useCountUp(stats.total)
  const pending = useCountUp(stats.pending)
  const progress = useCountUp(stats.progress)
  const done = useCountUp(stats.done)
  const cards = [
    { label: 'Total tasks', value: total, icon: Icon.Layers, bg: '#EFEBFF', color: 'var(--lavender-deep)' },
    { label: 'Pending', value: pending, icon: Icon.Clock, bg: '#EEF0FA', color: 'var(--pending)' },
    { label: 'In progress', value: progress, icon: Icon.Bolt, bg: '#EAF4FC', color: 'var(--sky)' },
    { label: 'Completed', value: done, icon: Icon.Check, bg: '#E4F8EF', color: 'var(--done)' },
  ]
  return (
    <div className="stats">
      {cards.map((c, i) => (
        <div className="stat-card animate-in" style={{ animationDelay: `${i * 50}ms` }} key={c.label}>
          <div className="stat-icon" style={{ background: c.bg, color: c.color }}><c.icon /></div>
          <div className="stat-num">{c.value}</div>
          <div className="stat-label">{c.label}</div>
        </div>
      ))}
    </div>
  )
}

function StatusDonut({ stats }: { stats: Stats }) {
  const total = stats.total || 1
  const segs: { key: Status; val: number; color: string }[] = [
    { key: 'PENDING', val: stats.pending, color: 'var(--pending)' },
    { key: 'IN_PROGRESS', val: stats.progress, color: 'var(--sky)' },
    { key: 'COMPLETED', val: stats.done, color: 'var(--done)' },
  ]
  const r = 42
  const c = 2 * Math.PI * r
  let offset = 0
  return (
    <div className="donut-wrap">
      <svg width="110" height="110" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#EEF0FA" strokeWidth="12" />
        {segs.map((s) => {
          const len = (s.val / total) * c
          const el = (
            <circle key={s.key} cx="50" cy="50" r={r} fill="none" stroke={s.color} strokeWidth="12"
              strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset}
              transform="rotate(-90 50 50)" strokeLinecap="round" style={{ transition: 'stroke-dasharray .6s ease' }} />
          )
          offset += len
          return el
        })}
        <text x="50" y="47" textAnchor="middle" fontSize="16" fontWeight="800" fill="var(--ink)" fontFamily="Sora">{stats.total}</text>
        <text x="50" y="61" textAnchor="middle" fontSize="7.5" fill="var(--muted)">tasks</text>
      </svg>
      <div className="donut-legend">
        {segs.map((s) => (
          <div className="legend-row" key={s.key}>
            <span className="legend-dot" style={{ background: s.color }}></span>
            {STATUS_META[s.key].label}
            <span className="legend-val">{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface BoardProps {
  tasks: Task[]
  onStatus: (id: number, s: Status) => void
  onDelete: (id: number) => void
  dragOverCol: Status | null
  setDragOverCol: (s: Status | null) => void
}
function BoardView({ tasks, onStatus, onDelete, dragOverCol, setDragOverCol }: BoardProps) {
  const byStatus = (s: Status) => tasks.filter((t) => t.status === s)
  return (
    <div className="board">
      {STATUSES.map((s) => (
        <div
          key={s}
          className={'board-col' + (dragOverCol === s ? ' drag-over' : '')}
          onDragOver={(e) => { e.preventDefault(); setDragOverCol(s) }}
          onDragLeave={() => setDragOverCol(null)}
          onDrop={(e) => {
            e.preventDefault()
            const id = e.dataTransfer.getData('text/plain')
            if (id) onStatus(Number(id), s)
            setDragOverCol(null)
          }}
        >
          <div className="board-col-head">
            <div className="board-col-title"><span className="board-col-dot" style={{ background: STATUS_META[s].color }}></span>{STATUS_META[s].label}</div>
            <span className="board-count">{byStatus(s).length}</span>
          </div>
          {byStatus(s).map((t) => (
            <div className="board-card" key={t.id} draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', String(t.id))}>
              <div className="board-card-title">{t.title}</div>
              <span className={`badge ${t.priority}`}>{t.priority}</span>
              <div className="board-card-foot">
                <div className="assignee">
                  <span className="avatar" style={{ width: 22, height: 22, fontSize: '0.6rem', background: hashColor(t.assigneeName) }}>{initials(t.assigneeName)}</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{formatNice(t.dueDate)}</span>
                <button className="btn-icon btn-danger-ghost" style={{ width: 26, height: 26 }} onClick={() => onDelete(t.id)}><Icon.Trash /></button>
              </div>
            </div>
          ))}
          {byStatus(s).length === 0 && <div style={{ fontSize: '0.78rem', color: 'var(--muted)', padding: '10px 4px' }}>Drop tasks here</div>}
        </div>
      ))}
    </div>
  )
}

interface CalProps {
  calMonth: { y: number; m: number }
  setCalMonth: (v: { y: number; m: number }) => void
  entries: CalendarEntry[]
  selectedDate: string | null
  setSelectedDate: (d: string | null) => void
}
interface CalCell {
  day: number
  muted: boolean
  iso?: string
  priorities?: string[]
  isToday?: boolean
  selected?: boolean
}
function MiniCalendar({ calMonth, setCalMonth, entries, selectedDate, setSelectedDate }: CalProps) {
  const { y, m } = calMonth
  const first = new Date(y, m, 1)
  const startDow = first.getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const daysInPrev = new Date(y, m, 0).getDate()
  const today = todayISO()

  const dueMap = useMemo(() => {
    const map: Record<string, string[]> = {}
    entries.forEach((e) => {
      (map[e.date] = map[e.date] || []).push(e.type === 'MILESTONE' ? 'MILESTONE' : e.priority)
    })
    return map
  }, [entries])

  const cells: CalCell[] = []
  for (let i = 0; i < startDow; i++) cells.push({ day: daysInPrev - startDow + 1 + i, muted: true })
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, iso, muted: false, priorities: dueMap[iso] || [], isToday: iso === today, selected: iso === selectedDate })
  }
  while (cells.length % 7 !== 0) cells.push({ day: cells.length, muted: true })

  const monthName = first.toLocaleString(undefined, { month: 'long', year: 'numeric' })
  const shiftMonth = (delta: number) => {
    const nd = new Date(y, m + delta, 1)
    setCalMonth({ y: nd.getFullYear(), m: nd.getMonth() })
  }

  return (
    <div>
      <div className="cal-head">
        <div className="cal-month">{monthName}</div>
        <div className="cal-nav">
          <button className="btn-icon" onClick={() => shiftMonth(-1)}><Icon.ChevL /></button>
          <button className="btn-icon" onClick={() => shiftMonth(1)}><Icon.ChevR /></button>
        </div>
      </div>
      <div className="cal-grid">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div className="cal-dow" key={i}>{d}</div>)}
        {cells.map((c, i) => (
          <button
            key={i}
            className={'cal-day' + (c.muted ? ' muted' : '') + (c.isToday ? ' today' : '') + (c.selected ? ' selected' : '')}
            disabled={c.muted}
            onClick={() => c.iso && setSelectedDate(c.selected ? null : c.iso)}
          >
            {c.day}
            {c.priorities && c.priorities.length > 0 && (
              <span className="cal-dots">
                {c.priorities.slice(0, 3).map((p, idx) => <span key={idx} style={{ background: c.selected ? '#fff' : PRIORITY_COLOR[p] }}></span>)}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="cal-legend">
        <span><span className="legend-dot" style={{ background: 'var(--high)' }}></span>High</span>
        <span><span className="legend-dot" style={{ background: 'var(--med)' }}></span>Medium</span>
        <span><span className="legend-dot" style={{ background: 'var(--low)' }}></span>Low</span>
        <span><span className="legend-dot" style={{ background: 'var(--lavender-deep)' }}></span>Milestone</span>
      </div>
      {selectedDate && entries.filter((e) => e.date === selectedDate && e.type === 'MILESTONE').map((e) => (
        <div key={'m' + e.id} style={{ marginTop: 10, fontSize: '0.82rem', fontWeight: 600, color: 'var(--lavender-deep)' }}>🏁 {e.title}</div>
      ))}
      {selectedDate && <button className="btn btn-outline cal-clear" onClick={() => setSelectedDate(null)}>Clear date filter</button>}
    </div>
  )
}

/* ---------- new task modal ---------- */
function TaskFormModal({ eventId, onClose, onCreated }: { eventId: number; onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('MEDIUM')
  const [dueDate, setDueDate] = useState(todayISO())
  const [assigneeId, setAssigneeId] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [milestoneId, setMilestoneId] = useState('')
  const [milestones, setMilestones] = useState<Milestone[]>([])

  useEffect(() => {
    authFetch(`${API_BASE}/milestones/event/${eventId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setMilestones)
      .catch(() => setMilestones([]))
  }, [eventId])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    const body: Record<string, unknown> = { title, description, priority, dueDate, eventId }
    if (assigneeId) body.assigneeId = Number(assigneeId)
    if (milestoneId) body.milestoneId = Number(milestoneId)
    try {
      const res = await authFetch(`${API_BASE}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Could not create task.')
        setSaving(false)
        return
      }
      onCreated()
    } catch (err) {
      setError('Network error — is the API running?')
      setSaving(false)
    }
  }

  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <h2>New task</h2>
        <form onSubmit={submit}>
          <div className="field"><label>Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Confirm floral arrangements" /></div>
          <div className="field"><label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional details" /></div>
          <div className="field-row">
            <div className="field"><label>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>{PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}</select></div>
            <div className="field"><label>Due date</label>
              <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
          </div>
          <div className="field"><label>Assignee ID (optional)</label>
            <input type="number" min="1" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} placeholder="user id" /></div>
          <div className="field"><label>Milestone (optional)</label>
            <select value={milestoneId} onChange={(e) => setMilestoneId(e.target.value)}>
              <option value="">None</option>
              {milestones.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select></div>
          <div className="form-error">{error}</div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ background: 'var(--lavender)', color: '#fff' }} disabled={saving}>{saving ? 'Saving…' : 'Create task'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ---------- milestones / notifications / messages ---------- */
function MilestonesCard({ eventId, onChanged }: { eventId: number; onChanged?: () => void }) {
  const [items, setItems] = useState<Milestone[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState(todayISO())
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const res = await authFetch(`${API_BASE}/milestones/event/${eventId}`)
      setItems(res.ok ? await res.json() : [])
    } catch (e) {
      setItems([])
    }
  }, [eventId])

  useEffect(() => {
    load()
  }, [load])

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await authFetch(`${API_BASE}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, dueDate, eventId }),
      })
      if (!res.ok) {
        setError('Could not add milestone.')
        return
      }
      setName('')
      setDescription('')
      load()
      onChanged && onChanged()
    } catch (err) {
      setError('Network error — is the API running?')
    }
  }

  const remove = async (id: number) => {
    if (!window.confirm('Delete this milestone?')) return
    await authFetch(`${API_BASE}/milestones/${id}`, { method: 'DELETE' })
    load()
    onChanged && onChanged()
  }

  const sorted = [...items].sort((a, b) => a.dueDate.localeCompare(b.dueDate))

  return (
    <div className="card animate-in" id="milestones" style={{ marginTop: 22 }}>
      <div className="card-head"><h2>Milestones — Event #{eventId}</h2></div>

      <form onSubmit={add} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr auto', gap: 10, alignItems: 'end', marginBottom: 8 }}>
        <div className="field" style={{ marginBottom: 0 }}><label>Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Venue booked" /></div>
        <div className="field" style={{ marginBottom: 0 }}><label>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" /></div>
        <div className="field" style={{ marginBottom: 0 }}><label>Due date</label>
          <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
        <button type="submit" className="btn" style={{ background: 'var(--lavender)', color: '#fff', height: 40 }}><Icon.Plus /> Add</button>
      </form>
      <div className="form-error">{error}</div>

      {sorted.length === 0 ? (
        <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No milestones for this event yet.</div>
      ) : sorted.map((m) => (
        <div className="upcoming-item" key={m.id}>
          <div>
            <div className="upcoming-title">{m.name}</div>
            <div className="upcoming-date">
              <span className={m.dueDate < todayISO() ? 'task-due overdue' : ''}>{formatNice(m.dueDate)}</span>
              {m.description ? ' · ' + m.description : ''}
            </div>
          </div>
          <button className="btn-icon btn-danger-ghost" onClick={() => remove(m.id)} title="Delete"><Icon.Trash /></button>
        </div>
      ))}
    </div>
  )
}

function NotificationsCard() {
  const [userId, setUserId] = useState(1)
  const [items, setItems] = useState<AppNotification[]>([])

  const load = useCallback(async () => {
    try {
      const res = await authFetch(`${API_BASE}/notifications/user/${userId}`)
      setItems(res.ok ? await res.json() : [])
    } catch (e) {
      setItems([])
    }
  }, [userId])

  useEffect(() => {
    load()
    const t = setInterval(load, 10000)
    return () => clearInterval(t)
  }, [load])

  const markRead = async (id: number) => {
    await authFetch(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' })
    load()
  }

  const unread = items.filter((n) => !n.seen).length

  return (
    <div className="card animate-in" id="notifications" style={{ marginTop: 22 }}>
      <div className="card-head">
        <h2>Notifications {unread > 0 && <span className="badge HIGH" style={{ marginLeft: 8 }}>{unread} new</span>}</h2>
        <div className="field" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ margin: 0 }}>User ID</label>
          <input type="number" min="1" style={{ width: 80 }} value={userId} onChange={(e) => setUserId(Number(e.target.value) || 1)} />
        </div>
      </div>
      {items.length === 0 ? (
        <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No notifications for this user.</div>
      ) : items.map((n) => (
        <div className="upcoming-item" key={n.id} style={{ opacity: n.seen ? 0.55 : 1 }}>
          <div>
            <div className="upcoming-title">{n.message}</div>
            <div className="upcoming-date">{relativeTime(n.createdAt)}</div>
          </div>
          {!n.seen && <button className="btn btn-outline" style={{ padding: '6px 12px' }} onClick={() => markRead(n.id)}>Mark read</button>}
        </div>
      ))}
    </div>
  )
}

function MessagesCard({ eventId }: { eventId: number }) {
  const [items, setItems] = useState<ChatMessage[]>([])
  const [senderName, setSenderName] = useState('')
  const [senderRole, setSenderRole] = useState('COORDINATOR')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const ROLE_COLOR: Record<string, string> = { COORDINATOR: 'var(--lavender-deep)', CUSTOMER: 'var(--done)', VENDOR: 'var(--med)' }

  const load = useCallback(async () => {
    try {
      const res = await authFetch(`${API_BASE}/messages/event/${eventId}`)
      setItems(res.ok ? await res.json() : [])
    } catch (e) {
      setItems([])
    }
  }, [eventId])

  useEffect(() => {
    load()
  }, [load])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await authFetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, senderName, senderRole, content }),
      })
      if (!res.ok) {
        setError('Could not send message.')
        return
      }
      setContent('')
      load()
    } catch (err) {
      setError('Network error — is the API running?')
    }
  }

  return (
    <div className="card animate-in" id="messages" style={{ marginTop: 22 }}>
      <div className="card-head"><h2>Messages — Event #{eventId}</h2></div>

      <div style={{ maxHeight: 260, overflowY: 'auto', marginBottom: 14 }}>
        {items.length === 0 ? (
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No messages yet.</div>
        ) : items.map((m) => (
          <div className="activity-row" key={m.id}>
            <span className="avatar" style={{ background: hashColor(m.senderName) }}>{initials(m.senderName)}</span>
            <div>
              <div className="activity-text">
                <strong>{m.senderName}</strong>{' '}
                <span className="badge" style={{ background: 'var(--bg)', color: ROLE_COLOR[m.senderRole], padding: '2px 8px' }}>{m.senderRole}</span>
              </div>
              <div className="activity-text" style={{ marginTop: 2 }}>{m.content}</div>
              <div className="activity-time">{relativeTime(m.sentAt)}</div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={send} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 3fr auto', gap: 10, alignItems: 'end' }}>
        <div className="field" style={{ marginBottom: 0 }}><label>Your name</label>
          <input required value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="e.g. Nimal" /></div>
        <div className="field" style={{ marginBottom: 0 }}><label>Role</label>
          <select value={senderRole} onChange={(e) => setSenderRole(e.target.value)}>
            <option value="COORDINATOR">Coordinator</option>
            <option value="CUSTOMER">Customer</option>
            <option value="VENDOR">Vendor</option>
          </select></div>
        <div className="field" style={{ marginBottom: 0 }}><label>Message</label>
          <input required value={content} onChange={(e) => setContent(e.target.value)} placeholder="Type a message…" /></div>
        <button type="submit" className="btn" style={{ background: 'var(--lavender)', color: '#fff', height: 40 }}>Send</button>
      </form>
      <div className="form-error">{error}</div>
    </div>
  )
}