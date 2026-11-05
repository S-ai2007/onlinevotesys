import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

const KEYS = {
  users: "vs_users",
  elections: "vs_elections",
  candidates: "vs_candidates",
  votes: "vs_votes",
  current: "vs_current_user"
};

const initialCandidates = [
  { id: "c1", name: "Aarav Sharma", party: "Progress Party", symbol: "🌱", bio: "Focused on education, jobs and sustainable development." },
  { id: "c2", name: "Priya Reddy", party: "People First", symbol: "⭐", bio: "Committed to transparent governance and public services." },
  { id: "c3", name: "Rahul Kumar", party: "United Future", symbol: "🕊️", bio: "Working towards better infrastructure and opportunities." }
];

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function seedData() {
  if (!localStorage.getItem(KEYS.users)) {
    write(KEYS.users, [{ id: "admin-1", name: "Administrator", email: "admin@vote.com", password: "admin123", role: "admin" }]);
  }
  if (!localStorage.getItem(KEYS.candidates)) write(KEYS.candidates, initialCandidates);
  if (!localStorage.getItem(KEYS.elections)) {
    write(KEYS.elections, [{ id: "e1", title: "College Student Council Election", description: "Cast your vote and help choose the next student representative.", active: true }]);
  }
  if (!localStorage.getItem(KEYS.votes)) write(KEYS.votes, []);
}

function Protected({ user, role, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  return children;
}

function Layout({ user, children, onLogout }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to={user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/"} className="brand">
          <span className="brand-mark">✓</span><span>Vote<span className="brand-accent">Sphere</span></span>
        </Link>
        <nav>
          {user ? (
            <>
              <span className="user-chip"><span className="online-dot" />{user.name} · {user.role}</span>
              <button className="btn btn-outline btn-small" onClick={onLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-small">Create account</Link>
            </>
          )}
        </nav>
      </header>
      <main>{children}</main>
      <footer>VoteSphere · Online Voting System <span>Academic demonstration project</span></footer>
    </div>
  );
}

function Home() {
  return (
    <div className="hero-wrap">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse" /> SIMPLE · SECURE-STYLE · TRANSPARENT</div>
          <h1>Your vote.<br /><span>Your voice.</span></h1>
          <p className="hero-sub">A clean online voting platform for managing elections, viewing candidates and recording votes in one place.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/signup">Get started <span>→</span></Link>
            <Link className="btn btn-ghost" to="/login">Sign in</Link>
          </div>
          <div className="hero-note"><span>✓</span> One vote per account in each election</div>
        </div>
        <div className="hero-visual">
          <div className="visual-glow" />
          <div className="vote-card">
            <div className="vote-card-head"><span>LIVE ELECTION</span><span className="status-pill">● ACTIVE</span></div>
            <h3>Student Council</h3>
            <p>Choose the representative who speaks for you.</p>
            <div className="mini-candidate"><span className="avatar green">🌱</span><div><b>Aarav Sharma</b><small>Progress Party</small></div><span className="radio" /></div>
            <div className="mini-candidate"><span className="avatar purple">⭐</span><div><b>Priya Reddy</b><small>People First</small></div><span className="radio" /></div>
            <div className="mini-candidate"><span className="avatar orange">🕊️</span><div><b>Rahul Kumar</b><small>United Future</small></div><span className="radio" /></div>
            <div className="vote-card-foot"><span>YOUR CHOICE MATTERS</span><span>↗</span></div>
          </div>
          <div className="floating-check">✓ <span>Vote recorded</span></div>
        </div>
      </section>
      <section className="feature-row">
        <div><span className="feature-icon">♙</span><b>Easy access</b><small>Simple voter registration and login.</small></div>
        <div><span className="feature-icon">◉</span><b>Fair participation</b><small>One vote per user per election.</small></div>
        <div><span className="feature-icon">▥</span><b>Clear results</b><small>See vote totals and election progress.</small></div>
      </section>
      <div className="demo-hint">Admin demo login: <b>admin@vote.com</b> / <b>admin123</b></div>
    </div>
  );
}

function Auth({ mode, onAuth }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    setError("");
    const users = read(KEYS.users, []);
    const cleanEmail = email.trim().toLowerCase();
    if (mode === "signup") {
      if (name.trim().length < 2) return setError("Please enter your full name (at least 2 characters).");
      if (password.length < 6) return setError("Password must contain at least 6 characters.");
      if (users.some(u => u.email === cleanEmail)) return setError("An account with this email already exists.");
      const user = { id: crypto.randomUUID(), name: name.trim(), email: cleanEmail, password, role: "user" };
      write(KEYS.users, [...users, user]);
      onAuth(user);
      navigate("/dashboard");
    } else {
      const user = users.find(u => u.email === cleanEmail && u.password === password);
      if (!user) return setError("Incorrect email or password.");
      onAuth(user);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-aside">
        <div className="eyebrow"><span className="pulse" /> DEMOCRACY, MADE SIMPLE</div>
        <h2>{mode === "signup" ? "Be part of the decision." : "Welcome back."}</h2>
        <p>{mode === "signup" ? "Create your voter account to participate in available elections." : "Sign in to access your voting dashboard."}</p>
        <div className="aside-stat"><b>01</b><span>Register or sign in</span></div>
        <div className="aside-stat"><b>02</b><span>Review the candidates</span></div>
        <div className="aside-stat"><b>03</b><span>Cast your vote</span></div>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <div className="form-kicker">{mode === "signup" ? "CREATE ACCOUNT" : "ACCOUNT ACCESS"}</div>
        <h1>{mode === "signup" ? "Join VoteSphere" : "Sign in"}</h1>
        <p className="muted">{mode === "signup" ? "It only takes a minute to get started." : "Enter your details to continue."}</p>
        {mode === "signup" && <label>Full name<input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sai Kumar" required /></label>}
        <label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></label>
        <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" required /></label>
        {error && <div className="error-msg">{error}</div>}
        <button className="btn btn-primary btn-full" disabled={busy}>{mode === "signup" ? "Create account →" : "Sign in →"}</button>
        <div className="auth-switch">{mode === "signup" ? "Already registered?" : "New to VoteSphere?"} <Link to={mode === "signup" ? "/login" : "/signup"}>{mode === "signup" ? "Sign in" : "Create an account"}</Link></div>
        {mode === "login" && <div className="admin-hint"><b>Admin demo</b><br />admin@vote.com · admin123</div>}
      </form>
    </div>
  );
}

function Stat({ label, value, detail }) {
  return <div className="stat-card"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>;
}

function Admin({ user, candidates, setCandidates, elections, setElections, votes, users }) {
  const [candidateName, setCandidateName] = useState("");
  const [party, setParty] = useState("");
  const [symbol, setSymbol] = useState("🗳️");
  const [bio, setBio] = useState("");
  const [notice, setNotice] = useState("");
  const election = elections[0];
  const totalVotes = votes.filter(v => v.electionId === election?.id).length;

  function addCandidate(e) {
    e.preventDefault();
    if (!candidateName.trim() || !party.trim()) return;
    const next = [...candidates, { id: crypto.randomUUID(), name: candidateName.trim(), party: party.trim(), symbol, bio: bio.trim() }];
    setCandidates(next); write(KEYS.candidates, next);
    setCandidateName(""); setParty(""); setBio(""); setSymbol("🗳️");
    setNotice("Candidate added successfully.");
  }
  function removeCandidate(id) {
    if (!window.confirm("Delete this candidate?")) return;
    const next = candidates.filter(c => c.id !== id);
    setCandidates(next); write(KEYS.candidates, next);
  }
  function toggleElection() {
    const next = elections.map(e => e.id === election.id ? { ...e, active: !e.active } : e);
    setElections(next); write(KEYS.elections, next);
  }
  const counts = candidates.map(c => ({ ...c, count: votes.filter(v => v.electionId === election?.id && v.candidateId === c.id).length })).sort((a,b) => b.count-a.count);

  return (
    <div className="dashboard">
      <div className="page-heading"><div><div className="form-kicker">ADMINISTRATION</div><h1>Admin dashboard</h1><p className="muted">Manage your election, candidates and results.</p></div><span className="role-label">ADMIN ACCESS</span></div>
      <div className="stats-grid">
        <Stat label="REGISTERED USERS" value={users.filter(u => u.role === "user").length} detail="Voter accounts" />
        <Stat label="CANDIDATES" value={candidates.length} detail="In this election" />
        <Stat label="TOTAL VOTES" value={totalVotes} detail="Votes submitted" />
        <Stat label="ELECTION STATUS" value={election?.active ? "Active" : "Closed"} detail="Current election" />
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-title"><div><h2>Election settings</h2><p>Control voter participation.</p></div><span className={election?.active ? "status-pill" : "status-pill closed"}>{election?.active ? "● ACTIVE" : "● CLOSED"}</span></div>
          <div className="election-info"><span className="election-icon">▤</span><div><b>{election?.title}</b><small>{election?.description}</small></div></div>
          <button className={election?.active ? "btn btn-danger" : "btn btn-primary"} onClick={toggleElection}>{election?.active ? "Close election" : "Open election"}</button>
          <p className="tiny-note">Closing an election prevents new votes. Existing votes remain saved.</p>
        </section>
        <section className="panel">
          <div className="panel-title"><div><h2>Add a candidate</h2><p>Register a person for this election.</p></div></div>
          <form className="candidate-form" onSubmit={addCandidate}>
            <label>Candidate name<input value={candidateName} onChange={e=>setCandidateName(e.target.value)} placeholder="Full name" required /></label>
            <label>Party / group<input value={party} onChange={e=>setParty(e.target.value)} placeholder="Party name" required /></label>
            <label>Symbol<select value={symbol} onChange={e=>setSymbol(e.target.value)}><option>🗳️</option><option>🌱</option><option>⭐</option><option>🕊️</option><option>☀️</option><option>📚</option></select></label>
            <label>Short description<input value={bio} onChange={e=>setBio(e.target.value)} placeholder="Candidate introduction" /></label>
            <button className="btn btn-primary">+ Add candidate</button>
            {notice && <span className="success-msg">{notice}</span>}
          </form>
        </section>
      </div>
      <section className="panel section-gap">
        <div className="panel-title"><div><h2>Candidate management</h2><p>Current candidates and their vote totals.</p></div><span className="count-label">{candidates.length} candidates</span></div>
        <div className="candidate-table">
          {counts.map((c,i)=><div className="candidate-row" key={c.id}><span className="avatar">{c.symbol}</span><div className="candidate-details"><b>{c.name}</b><small>{c.party}</small></div><span className="vote-count">{c.count} votes</span><button className="text-danger" onClick={()=>removeCandidate(c.id)}>Remove</button></div>)}
          {!counts.length && <p className="empty-state">No candidates added yet.</p>}
        </div>
      </section>
      <section className="panel section-gap">
        <div className="panel-title"><div><h2>Registered voters</h2><p>Accounts created through the signup page.</p></div></div>
        <div className="voter-list">{users.filter(u=>u.role==="user").map(u=><div key={u.id}><span className="avatar initials">{u.name.charAt(0).toUpperCase()}</span><span><b>{u.name}</b><small>{u.email}</small></span><span className="count-label">Voter</span></div>)}</div>
        {!users.some(u=>u.role==="user") && <p className="empty-state">No voters registered yet.</p>}
      </section>
    </div>
  );
}

function UserDashboard({ user, candidates, elections, votes, onVote }) {
  const [selected, setSelected] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const election = elections[0];
  const myVote = votes.find(v => v.userId === user.id && v.electionId === election?.id);
  const totalVotes = votes.filter(v=>v.electionId===election?.id).length;
  const counts = candidates.map(c=>({...c,count:votes.filter(v=>v.electionId===election?.id && v.candidateId===c.id).length})).sort((a,b)=>b.count-a.count);

  function castVote() {
    setError(""); setMessage("");
    if (!election?.active) return setError("This election is currently closed.");
    if (myVote) return setError("You have already voted in this election.");
    if (!selected[election.id]) return setError("Please select a candidate before submitting.");
    if (!candidates.some(c=>c.id===selected[election.id])) return setError("Selected candidate is no longer available.");
    onVote({ id: crypto.randomUUID(), userId: user.id, electionId: election.id, candidateId: selected[election.id], createdAt: new Date().toISOString() });
    setMessage("Your vote has been recorded. Thank you for participating!");
  }

  return (
    <div className="dashboard">
      <div className="page-heading"><div><div className="form-kicker">VOTER PORTAL</div><h1>Hello, {user.name.split(" ")[0]} 👋</h1><p className="muted">Your voice matters. Review the candidates and make your choice.</p></div><span className="role-label">VOTER ACCOUNT</span></div>
      <div className="stats-grid user-stats">
        <Stat label="ELECTION" value={election?.active ? "Open" : "Closed"} detail={election?.title || "No election"} />
        <Stat label="TOTAL PARTICIPATION" value={totalVotes} detail="Votes recorded" />
        <Stat label="YOUR STATUS" value={myVote ? "Voted" : "Not voted"} detail={myVote ? "Thank you for participating" : "Your vote is pending"} />
      </div>
      <section className="panel">
        <div className="panel-title"><div><div className="form-kicker">CURRENT ELECTION</div><h2>{election?.title}</h2><p>{election?.description}</p></div><span className={election?.active ? "status-pill" : "status-pill closed"}>{election?.active ? "● OPEN" : "● CLOSED"}</span></div>
        {myVote ? <div className="voted-banner"><span>✓</span><div><b>Your vote has been submitted</b><small>Each account can vote only once in this election.</small></div></div> : null}
        {!election?.active && !myVote && <div className="notice-banner">This election is closed. You cannot submit a vote right now.</div>}
        <div className="candidate-grid">
          {candidates.map(c=><button type="button" key={c.id} disabled={!election?.active || !!myVote} onClick={()=>setSelected({...selected,[election.id]:c.id})} className={`candidate-choice ${selected[election?.id]===c.id?"selected":""}`}><span className="candidate-symbol">{c.symbol}</span><span className="candidate-name">{c.name}</span><span className="candidate-party">{c.party}</span><span className="candidate-bio">{c.bio || "Candidate for this election."}</span><span className="select-indicator">{selected[election?.id]===c.id ? "✓ Selected" : "Select candidate"}</span></button>)}
        </div>
        {!candidates.length && <p className="empty-state">No candidates are available yet.</p>}
        {error && <div className="error-msg">{error}</div>}
        {message && <div className="success-banner">{message}</div>}
        {!myVote && <button className="btn btn-primary submit-vote" onClick={castVote} disabled={!election?.active || !candidates.length}>Submit my vote →</button>}
      </section>
      <section className="panel section-gap">
        <div className="panel-title"><div><h2>Election participation</h2><p>Overall number of votes submitted.</p></div></div>
        <div className="participation"><strong>{totalVotes}</strong><span>total votes recorded</span></div>
      </section>
    </div>
  );
}

function Results({ candidates, votes, elections }) {
  const election = elections[0];
  const total = votes.filter(v=>v.electionId===election?.id).length;
  const rows = candidates.map(c=>({...c,count:votes.filter(v=>v.electionId===election?.id && v.candidateId===c.id).length})).sort((a,b)=>b.count-a.count);
  return <div className="dashboard"><div className="page-heading"><div><div className="form-kicker">ELECTION REPORT</div><h1>Election results</h1><p className="muted">{election?.title}</p></div><span className="count-label">{total} votes cast</span></div><section className="panel"><div className="panel-title"><div><h2>Candidate standings</h2><p>Vote totals for the current election.</p></div></div>{rows.map((c,i)=><div className="result-row" key={c.id}><div className="result-name"><span className="avatar">{c.symbol}</span><span><b>{c.name}</b><small>{c.party}</small></span></div><b>{c.count} <small>votes</small></b><div className="result-track"><span style={{width:`${total ? c.count/total*100 : 0}%`}} /></div><small>{total ? Math.round(c.count/total*100) : 0}%</small></div>)}{!rows.length&&<p className="empty-state">No candidates available.</p>}</section></div>;
}

export default function App() {
  const [user, setUser] = useState(()=>read(KEYS.current,null));
  const [users,setUsers] = useState(()=>read(KEYS.users,[]));
  const [candidates,setCandidates] = useState(()=>read(KEYS.candidates,initialCandidates));
  const [elections,setElections] = useState(()=>read(KEYS.elections,[]));
  const [votes,setVotes] = useState(()=>read(KEYS.votes,[]));
  const location = useLocation();

  useEffect(()=>{ seedData(); setUsers(read(KEYS.users,[])); setCandidates(read(KEYS.candidates,initialCandidates)); setElections(read(KEYS.elections,[])); setVotes(read(KEYS.votes,[])); },[]);
  useEffect(()=>{ if(user) write(KEYS.current,user); else localStorage.removeItem(KEYS.current); },[user]);

  function login(nextUser) { setUser(nextUser); }
  function logout() { setUser(null); }
  function castVote(vote) {
    const next=[...votes,vote];
    setVotes(next); write(KEYS.votes,next);
  }

  return (
    <Layout user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={user ? <Navigate to={user.role==="admin"?"/admin":"/dashboard"} replace/> : <Home/>}/>
        <Route path="/login" element={user ? <Navigate to={user.role==="admin"?"/admin":"/dashboard"} replace/> : <Auth mode="login" onAuth={login}/>}/>
        <Route path="/signup" element={user ? <Navigate to={user.role==="admin"?"/admin":"/dashboard"} replace/> : <Auth mode="signup" onAuth={login}/>}/>
        <Route path="/admin" element={<Protected user={user} role="admin"><Admin user={user} candidates={candidates} setCandidates={setCandidates} elections={elections} setElections={setElections} votes={votes} users={users}/></Protected>}/>
        <Route path="/dashboard" element={<Protected user={user} role="user"><UserDashboard user={user} candidates={candidates} elections={elections} votes={votes} onVote={castVote}/></Protected>}/>
        <Route path="/results" element={<Protected user={user}><Results candidates={candidates} votes={votes} elections={elections}/></Protected>}/>
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </Layout>
  );
}
