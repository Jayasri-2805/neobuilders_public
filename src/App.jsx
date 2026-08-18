import { useEffect, useMemo, useState } from 'react'
import './App.css'

const fallbackSite = {
  company: {
    name: 'Neo Builders',
    eyebrow: 'Construction intelligence, built in',
    phone: '+91 98765 43210',
    email: 'hello@neobuilders.in',
  },
  stats: [
    { value: '50+', label: 'Projects completed' },
    { value: '1M+', label: 'Sq. ft. built' },
    { value: '99.8%', label: 'On-time delivery' },
  ],
  modules: [
    {
      number: '01',
      icon: '↗',
      title: 'Material tracking',
      text: 'Know what arrived, what moved, and what your next pour needs before the site asks.',
    },
    {
      number: '02',
      icon: '▦',
      title: 'POs & inventory',
      text: 'Turn purchase orders into a live, accountable supply chain across every project.',
    },
    {
      number: '03',
      icon: '⌂',
      title: 'Site management',
      text: 'Bring plans, daily reports, tasks, and progress photos into one field-ready workspace.',
    },
    {
      number: '04',
      icon: '◌',
      title: 'People & partners',
      text: 'Coordinate subcontractors, labour, attendance, and payments without the spreadsheet maze.',
    },
  ],
  projects: [
    {
      type: 'Commercial',
      title: 'Aster Business Park',
      location: 'Bengaluru, Karnataka',
      details: '420,000 sq. ft. · 18 months',
      image:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1100&q=85',
    },
    {
      type: 'Residential',
      title: 'The Courtyard Residences',
      location: 'Pune, Maharashtra',
      details: '186,000 sq. ft. · 14 months',
      image:
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=85',
    },
    {
      type: 'Infrastructure',
      title: 'North Ring Road',
      location: 'Hyderabad, Telangana',
      details: '12.4 km · 22 months',
      image:
        'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1100&q=85',
    },
  ],
}

const navLinks = [
  ['Platform', '#platform'],
  ['Solutions', '#solutions'],
  ['Projects', '#projects'],
  ['About us', '#about'],
]

function getApiUrl(path) {
  return path
}

async function getSiteContent() {
  const response = await fetch(getApiUrl('/api/v1/public/website'), {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new Error(`Content API returned ${response.status}`)
  return response.json()
}

async function submitLead(payload) {
  const response = await fetch(getApiUrl('/api/v1/crm/leads'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(`Lead API returned ${response.status}`)
  return response.json().catch(() => ({}))
}

function ArrowIcon({ direction = 'up-right' }) {
  return <span className={`arrow-icon ${direction === 'right' ? 'arrow-right' : ''}`}>↗</span>
}

function Logo() {
  return (
    <a className="brand" href="#top" aria-label="Neo Builders home">
      <img className="brand-img" src="/src/assets/company-logo.jpg" alt="Company logo" onError={(e) => { e.currentTarget.style.display = 'none' }} />
      <span className="brand-text">neo<span>builders</span></span>
    </a>
  )
}

function DemoModal({ onClose }) {
  const [step, setStep] = useState(1)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: 'Developer',
    projectType: 'Commercial',
    projectSize: '',
    preferredDate: '',
  })

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))
  const canContinue =
    step === 1 ? form.name.trim() && form.email.trim() && form.company.trim() : form.projectSize.trim()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (step < 3) {
      if (canContinue) setStep(step + 1)
      return
    }
    setStatus('loading')
    setError('')
    try {
      const result = await submitLead({
        ...form,
        source: 'public-website',
        requestType: 'live-demo',
      })
      setStatus('success')
      setForm((current) => ({ ...current, confirmationId: result.id || `NB-${Date.now().toString().slice(-6)}` }))
    } catch {
      setStatus('error')
      setError('We couldn’t reach the booking service. Please try again or call our team directly.')
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="demo-title">
        <button className="modal-close" onClick={onClose} aria-label="Close demo form">×</button>
        {status === 'success' ? (
          <div className="success-state">
            <div className="success-icon">✓</div>
            <p className="eyebrow">You’re on the list</p>
            <h2 id="demo-title">Let’s build better.</h2>
            <p>Thanks, {form.name.split(' ')[0]}. Our team will reach out to schedule your walkthrough.</p>
            <span className="confirmation">Reference {form.confirmationId}</span>
            <button className="button button-dark" onClick={onClose}>Back to website <ArrowIcon direction="right" /></button>
          </div>
        ) : (
          <>
            <div className="modal-intro">
              <p className="eyebrow">Book a live demo</p>
              <h2 id="demo-title">See your next project in focus.</h2>
              <p>Tell us a little about your business and we’ll tailor a 30-minute walkthrough for your team.</p>
            </div>
            <div className="steps" aria-label={`Step ${step} of 3`}>
              {[1, 2, 3].map((item) => <span className={item <= step ? 'active' : ''} key={item}>{item}</span>)}
              <b>Step {step} of 3</b>
            </div>
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="form-grid">
                  <label>Full name<input required value={form.name} onChange={update('name')} placeholder="Your name" /></label>
                  <label>Work email<input required type="email" value={form.email} onChange={update('email')} placeholder="you@company.com" /></label>
                  <label>Company name<input required value={form.company} onChange={update('company')} placeholder="Company name" /></label>
                  <label>Phone number<input value={form.phone} onChange={update('phone')} placeholder="+91 00000 00000" /></label>
                </div>
              )}
              {step === 2 && (
                <div className="form-grid">
                  <label>Your role<select value={form.role} onChange={update('role')}><option>Developer</option><option>General contractor</option><option>Subcontractor</option><option>Architect / consultant</option></select></label>
                  <label>Project type<select value={form.projectType} onChange={update('projectType')}><option>Commercial</option><option>Residential</option><option>Infrastructure</option><option>Industrial</option></select></label>
                  <label className="full-field">Approx. project size<input required value={form.projectSize} onChange={update('projectSize')} placeholder="e.g. 250,000 sq. ft." /></label>
                </div>
              )}
              {step === 3 && (
                <div className="form-grid">
                  <label className="full-field">Preferred demo date<input required type="date" value={form.preferredDate} onChange={update('preferredDate')} /></label>
                  <p className="form-note full-field">Our implementation team typically hosts demos Monday–Friday, 10:00 AM to 6:00 PM IST.</p>
                </div>
              )}
              {error && <p className="form-error">{error}</p>}
              <div className="form-actions">
                {step > 1 && <button type="button" className="text-button" onClick={() => setStep(step - 1)}>← Back</button>}
                <button className="button button-dark" disabled={!canContinue || status === 'loading'}>{status === 'loading' ? 'Sending…' : step === 3 ? 'Request my demo' : 'Continue'} <ArrowIcon direction="right" /></button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

function App() {
  const [site, setSite] = useState(fallbackSite)
  const [apiState, setApiState] = useState('loading')
  const [modalOpen, setModalOpen] = useState(false)
  const [projectFilter, setProjectFilter] = useState('All')
  const [mobileNav, setMobileNav] = useState(false)

  useEffect(() => {
    let mounted = true
    getSiteContent()
      .then((data) => mounted && setSite((current) => ({ ...current, ...data })))
      .catch(() => mounted && setApiState('offline'))
      .finally(() => mounted && setApiState((current) => current === 'loading' ? 'live' : current))
    return () => { mounted = false }
  }, [])

  const projects = useMemo(() => projectFilter === 'All' ? site.projects : site.projects.filter((project) => project.type === projectFilter), [projectFilter, site.projects])

  return (
    <div className="site-shell" id="top">
      <header className="site-header">
        <div className="container header-inner">
          <Logo />
          <nav className={mobileNav ? 'mobile-open' : ''}>
            {navLinks.map(([label, href]) => <a href={href} key={href} onClick={() => setMobileNav(false)}>{label}</a>)}
            <a href="#contact" onClick={() => setMobileNav(false)}>Contact</a>
          </nav>
          <div className="header-actions">
            <a className="login-link" href="/neobuilderspanel/login">Client login <span>↗</span></a>
            <button className="button button-small" onClick={() => setModalOpen(true)}>Book a demo <ArrowIcon direction="right" /></button>
          </div>
          <button className="menu-button" aria-label="Toggle menu" onClick={() => setMobileNav(!mobileNav)}>{mobileNav ? '×' : '☰'}</button>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-grid container">
            <div className="hero-copy">
              <p className="eyebrow"><span className="live-dot" /> {site.company.eyebrow}</p>
              <h1>Build with <em>clarity.</em><br />Deliver with confidence.</h1>
              <p className="hero-lead">The connected operating system for modern construction teams. From first estimate to final handover, keep every moving part moving forward.</p>
              <div className="hero-actions">
                <button className="button button-dark" onClick={() => setModalOpen(true)}>Book a live demo <ArrowIcon direction="right" /></button>
                <a className="button button-quiet" href="#platform">Explore the platform <ArrowIcon /></a>
              </div>
              <div className="hero-proof"><div className="avatars"><span>AK</span><span>RM</span><span>SP</span></div><span>Trusted by 50+ construction teams</span></div>
            </div>
            <div className="hero-visual">
              <div className="visual-glow" />
              <div className="building-image" />
              <div className="blueprint-card">
                <span className="card-label">LIVE PROJECT PULSE</span>
                <div className="pulse-header"><strong>Aster Business Park</strong><span className="status-pill">On track</span></div>
                <div className="pulse-chart"><i /><i /><i /><i /><i /><i /><i /></div>
                <div className="pulse-footer"><span>Progress <b>78.4%</b></span><span>+12.8% <small>this month</small></span></div>
              </div>
              <div className="floating-note"><span className="note-check">✓</span><span><b>Concrete delivery</b><small>Arriving on schedule</small></span></div>
            </div>
          </div>
          <div className="hero-ticker"><div className="container ticker-inner"><span>ONE SYSTEM. EVERY SITE.</span><i /> <span>ONE SYSTEM. EVERY SITE.</span><i /> <span>ONE SYSTEM. EVERY SITE.</span><i /> <span>ONE SYSTEM. EVERY SITE.</span></div></div>
        </section>

        <section className="stats-section">
          <div className="container stats-grid">{site.stats.map((stat) => <div className="stat" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}<div className="stat statement"><span>Built for the people<br />who build everything.</span><ArrowIcon /></div></div>
        </section>

        <section className="platform-section section-pad" id="platform">
          <div className="container">
            <div className="section-heading split-heading"><div><p className="eyebrow">The Neo platform</p><h2>Less chasing.<br /><em>More building.</em></h2></div><p className="heading-copy">Construction is complex enough. Neo brings your project data, people, and decisions together so your team can focus on the work that matters.</p></div>
            <div className="module-grid" id="solutions">{site.modules.map((module) => <article className="module-card" key={module.number}><div className="module-top"><span className="module-number">{module.number}</span><span className="module-icon">{module.icon}</span></div><h3>{module.title}</h3><p>{module.text}</p><a href="#demo">Learn more <ArrowIcon direction="right" /></a></article>)}</div>
          </div>
        </section>

        <section className="dark-section projects-section section-pad" id="projects">
          <div className="container">
            <div className="section-heading split-heading dark-heading"><div><p className="eyebrow">Work that speaks</p><h2>Built in the real<br /><em>world.</em></h2></div><p className="heading-copy">A few of the ambitious projects made possible by better coordination, better visibility, and a team that never loses sight of the finish line.</p></div>
            <div className="filter-row">{['All', 'Commercial', 'Residential', 'Infrastructure'].map((filter) => <button className={projectFilter === filter ? 'active' : ''} onClick={() => setProjectFilter(filter)} key={filter}>{filter}</button>)}</div>
            <div className="projects-grid">{projects.map((project, index) => <article className={`project-card project-${index}`} key={project.title}><div className="project-image" style={{ backgroundImage: `url(${project.image})` }} /><div className="project-overlay"><span>{project.type}</span><h3>{project.title}</h3><p>{project.location}</p><small>{project.details}</small></div></article>)}</div>
            <div className="center-action"><a href="#contact" className="button button-light">View all projects <ArrowIcon direction="right" /></a></div>
          </div>
        </section>

        <section className="about-section section-pad" id="about">
          <div className="container about-grid">
            <div className="about-copy">
              <p className="eyebrow">About Neo Builders</p>
              <h2>Built from the field.<br /><em>Designed for impact.</em></h2>
              <p className="lead">We started on real job sites where timelines, teams and materials collide. Our tools are shaped by that reality — simple to use, relentlessly practical, and made to reduce the small frictions that cost big time.</p>
              <div className="about-values">
                <article className="value-card">
                  <strong>People first</strong>
                  <p>Tools that empower site teams and reduce rework.</p>
                </article>
                <article className="value-card">
                  <strong>Practical by design</strong>
                  <p>Features built around real workflows, not checkboxes.</p>
                </article>
                <article className="value-card">
                  <strong>Trusted delivery</strong>
                  <p>Visibility that helps projects finish on time and on budget.</p>
                </article>
              </div>
              <a className="underlined-link" href="#contact">Talk to our team <ArrowIcon direction="right" /></a>
            </div>
            <aside className="about-art">
              <img src="/src/assets/hero.png" alt="Team at work" />
              <div className="art-caption">EST. 2018 · INDIA</div>
            </aside>
          </div>
          <div className="container team-grid">
            <h3>Leadership &amp; team</h3>
            <div className="team-members">
              <div className="team-member"><img src="/src/assets/react.svg" alt="" /><b>Vikram Shah</b><small>Founder &amp; CEO</small></div>
              <div className="team-member"><img src="/src/assets/vite.svg" alt="" /><b>Rita Menon</b><small>Head of Delivery</small></div>
              <div className="team-member"><img src="/src/assets/hero.png" alt="" /><b>Ashok Patel</b><small>Head of Field Ops</small></div>
            </div>
          </div>
        </section>

        <section className="testimonial-section section-pad"><div className="container testimonial-grid"><div><p className="eyebrow">The word on site</p><div className="quote-mark">“</div><blockquote>Neo has given us the one thing every project manager wants: a clear view of what’s happening, before we have to ask.</blockquote><div className="quote-author"><span className="author-avatar">VS</span><span><b>Vikram Shah</b><small>Director, Shah & Sons Constructions</small></span></div></div><div className="quote-side"><span>01 / 03</span><div className="quote-lines"><i /><i /><i /></div><p>From procurement to progress, see the whole project at a glance.</p></div></div></section>

        <section className="cta-section" id="demo"><div className="container cta-inner"><div><p className="eyebrow">Ready when you are</p><h2>Make your next build<br /><em>your best one yet.</em></h2></div><button className="button button-light" onClick={() => setModalOpen(true)}>Start a conversation <ArrowIcon direction="right" /></button></div></section>
      </main>

      <footer className="site-footer" id="contact"><div className="container footer-top"><div className="footer-brand"><Logo /><p>Construction intelligence<br />for the real world.</p></div><div className="footer-links"><div><b>Explore</b><a href="#platform">Platform</a><a href="#projects">Projects</a><a href="#about">About us</a><a href="#demo">Book a demo</a></div><div><b>Connect</b><a href={`mailto:${site.company.email}`}>{site.company.email}</a><a href={`tel:${site.company.phone.replace(/\s/g, '')}`}>{site.company.phone}</a><a href="#contact">LinkedIn ↗</a><a href="#contact">Instagram ↗</a></div></div><div className="newsletter"><b>Stay in the loop</b><p>Construction insights, delivered occasionally.</p><form onSubmit={(event) => event.preventDefault()}><input aria-label="Email address" type="email" placeholder="Your email address" /><button aria-label="Subscribe">↗</button></form></div></div><div className="container footer-bottom"><span>© 2026 Neo Builders. All rights reserved.</span><span className={`api-status ${apiState}`}><i /> {apiState === 'offline' ? 'Using local preview data' : 'Platform connected'}</span><span><a href="#contact">Privacy</a> <a href="#contact">Terms</a></span></div></footer>
      {modalOpen && <DemoModal onClose={() => setModalOpen(false)} />}
    </div>
  )
}

export default App