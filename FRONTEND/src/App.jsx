import React from 'react';
import Footer from './footer.jsx';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import PrivateDashboard from './pages/PrivateDashboard.jsx';
import Calendar from './pages/Calendar.jsx';
import Magazzino from './pages/Magazzino.jsx';
import { clearTokens } from './auth';
import NuovoFoglioDiMarcia from './pages/NuovoFoglioDiMarcia.jsx';
import FogliMarcia from './pages/FogliMarcia.jsx';
import Personale from './pages/Personale.jsx';
import AdminMezzi from './pages/AdminMezzi.jsx';
import MezzoGestione from './pages/MezzoGestione.jsx';
import Mezzi from './pages/Mezzi.jsx';
import CinquePerMille from './pages/CinquePerMille.jsx';
import StrutturaOrganizzativa from './pages/StrutturaOrganizzativa.jsx';
import Storia from './pages/Storia.jsx';
import Corsi from './pages/Corsi.jsx';
import DiventareVolontario from './pages/DiventareVolontario.jsx';
import RichiedereServizio from './pages/RichiedereServizio.jsx';
import News from './pages/News.jsx';
import EventDetail from './pages/EventDetail.jsx';
import PrivateEventEditor from './pages/PrivateEventEditor.jsx';
import CreazionePostAttivita from './pages/CreazionePostAttivita.jsx';
import Galleria from './pages/Galleria.jsx';
import RicercaFogliMarcia from './pages/RicercaFogliMarcia.jsx';
import ReportFogliMarcia from './pages/ReportFogliMarcia.jsx';
import Privacy from './pages/Privacy.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import { listEvents } from './utils/eventsStore';

const App = () => {
    const location = useLocation();
    const isPrivate = location.pathname.startsWith('/private');
    const isLogin = location.pathname.startsWith('/login');
    const onLogout = () => {
        if (window.confirm('Sei sicuro di voler effettuare il logout?')) {
            clearTokens();
            window.location.href = '/login';
        }
    };

    React.useEffect(() => {
        const collapse = document.getElementById('navbarNav');
        if (!collapse) return;
        const handler = (e) => {
            const link = e.target.closest('a, button');
            if (!link) return;
            if (collapse.classList.contains('show')) {
                const toggler = document.querySelector('.navbar-toggler');
                if (toggler) toggler.click();
            }
        };
        collapse.addEventListener('click', handler);
        return () => collapse.removeEventListener('click', handler);
    }, [location.pathname]);

    React.useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [location.pathname]);

    // Global title updater to avoid stale titles across navigation
    React.useEffect(() => {
        const p = location.pathname;
        let title = "Croce d'Oro Sud Pontino";
        if (p === '/') title = "Home - Croce d'Oro Sud Pontino";
        else if (p.startsWith('/news') || p.startsWith('/eventi')) title = 'EVENTI';
        else if (p.startsWith('/galleria')) title = 'GALLERIA';
        else if (p.startsWith('/mezzi')) title = 'MEZZI';
        else if (p.startsWith('/5x1000')) title = '5 x mille';
        else if (p.startsWith('/struttura-organizzativa')) title = 'ASSOCIAZIONE';
        else if (p.startsWith('/storia')) title = 'STORIA';
        else if (p.startsWith('/corsi')) title = 'CORSI';
        else if (p.startsWith('/diventare-volontario')) title = 'DIVENTARE VOLONTARIO';
        else if (p.startsWith('/richiedere-servizio')) title = 'RICHIEDERE SERVIZIO';
        else if (p.startsWith('/privacy')) title = 'PRIVACY';
        else if (p.startsWith('/reset-password')) title = 'RESET PASSWORD';
        document.title = title;
    }, [location.pathname]);

    return (
        <div className="d-flex flex-column min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid">
                    {isPrivate ? (
                        <span className="navbar-brand d-flex align-items-center" role="img" aria-label="Croce d'Oro Sud Pontino - Area Privata">
                            <img
                                src="https://res.cloudinary.com/dkbahjqa6/image/upload/v1760208659/LOGO_CROCE_yzhmab.jpg"
                                alt="Croce d'Oro Sud Pontino logo"
                                className="me-2"
                            />
                            Area Privata
                        </span>
                    ) : (
                        <Link className="navbar-brand d-flex align-items-center" to="/">
                            <img
                                src="https://res.cloudinary.com/dkbahjqa6/image/upload/v1760208659/LOGO_CROCE_yzhmab.jpg"
                                alt="Croce d'Oro Sud Pontino logo"
                                className="me-2"
                            />
                            {"Croce d'Oro Sud Pontino"}
                        </Link>
                    )}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="nav navbar-nav ms-auto">
                            {isPrivate ? (
                                <>
                                    <li className="nav-item d-flex align-items-center ms-2">
                                        <button className="btn btn-danger" onClick={onLogout}>Logout</button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/">Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/news">Eventi</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/galleria">Galleria</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/mezzi">Mezzi</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/5x1000">5 x mille</Link>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            ASSOCIAZIONE
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li><Link className="dropdown-item" to="/storia">Storia</Link></li>
                                            <li><Link className="dropdown-item" to="/struttura-organizzativa">Struttura Organizzativa</Link></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/corsi">I Nostri Corsi</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/diventare-volontario">Diventa uno di noi</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/richiedere-servizio">Richiedi Servizio</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="flex-grow-1">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <section className="home-hero">
                                    <span className="visually-hidden" role="img" aria-label="Volontari della Croce d'Oro durante un'attività sul territorio"></span>
                                </section>

                                <div className="container-xxl mt-5">
                                <div className="row">
                                    <div className="col-lg-8 mb-4">
                                        <div className="ps-0 pe-4 pt-0 pb-5">
                                            <h1 className="display-4">Croce d'Oro Sud Pontino ONLUS</h1>
                                            <p className="lead">Organizzazione Non-Profit di Volontariato costituita per dotare del servizio di Protezione Civile nei Comuni di Sperlonga e Campodimele e le altre attività inerenti.</p>
                                            <hr className="my-4" />
                                            <h2>I Nostri Servizi</h2>
                                            <div className="row mt-4">
                                                <div className="col-md-6 mb-3">
                                                    <div className="d-flex align-items-start">
                                                        <span className="fs-2 me-3">🚨</span>
                                                        <div>
                                                            <h5>Servizio di emergenza in convenzione con ARES 118</h5>
                                                            <p>Operiamo 24 ore su 24 per garantire interventi tempestivi in caso di emergenza sanitaria.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <div className="d-flex align-items-start">
                                                        <span className="fs-2 me-3">🚑</span>
                                                        <div>
                                                            <h5>Trasporto e trasferimento di infermi</h5>
                                                            <p>Effettuiamo dimissioni, trasporti tra strutture sanitarie, ricoveri programmati e accompagnamenti per visite specialistiche o terapie, assicurando assistenza qualificata e mezzi idonei alle esigenze del paziente.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <div className="d-flex align-items-start">
                                                        <span className="fs-2 me-3">🎪</span>
                                                        <div>
                                                            <h5>Assistenza a manifestazioni/eventi</h5>
                                                            <p>Forniamo supporto sanitario con personale qualificato e mezzi attrezzati durante eventi pubblici e privati.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <div className="d-flex align-items-start">
                                                        <span className="fs-2 me-3">🤝</span>
                                                        <div>
                                                            <h5>Appartenenza all’ANPAS nazionale e regionale</h5>
                                                            <p>Facciamo orgogliosamente parte di ANPAS, l’Associazione Nazionale Pubbliche Assistenze, che riunisce realtà impegnate nel volontariato, nella solidarietà e nella protezione civile.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <h2 className="mb-0">Attività passate</h2>
                                                <Link className="btn btn-outline-primary btn-sm" to="/news">Prossimi eventi →</Link>
                                            </div>
                                            {
                                                (() => {
                                                    const now = new Date();
                                                    const todayKey = now.toISOString().slice(0,10);
                                                    const toTime = (d, t) => {
                                                        const [hh,mm] = (t || '00:00').split(':');
                                                        return new Date(`${d}T${hh.padStart(2,'0')}:${mm.padStart(2,'0')}:00`);
                                                    };
                                                    const past = listEvents()
                                                      .filter(e => e.status !== 'bozza' && e.date < todayKey)
                                                      .sort((a,b) => toTime(b.date,b.time) - toTime(a.date,a.time))
                                                      .slice(0,3);
                                                    if (past.length === 0) {
                                                        return <div className="text-muted">Ancora nessuna attività passata registrata.</div>
                                                    }
                                                    return (
                                                        <div className="row">
                                                            {past.map(ev => (
                                                                <div className="col-md-4" key={ev.id}>
                                                                    <div className="card h-100">
                                                                        {((Array.isArray(ev.images) && ev.images[0]) || ev.image) && (
                                                                            <img src={(Array.isArray(ev.images) && ev.images[0]) || ev.image} alt={ev.title} className="card-img-top" style={{ objectFit: 'cover', maxHeight: '160px' }} />
                                                                        )}
                                                                        <div className="card-body d-flex flex-column">
                                                                            <h5 className="card-title mb-1">{ev.title}</h5>
                                                                            <div className="text-muted small mb-2">{ev.date}{ev.time ? ` • ${ev.time}` : ''}</div>
                                                                            {ev.description && <p className="card-text flex-grow-1">{ev.description.length>120? ev.description.slice(0,120)+'…' : ev.description}</p>}
                                                                            <Link className="btn btn-outline-secondary mt-auto" to={`/eventi/${ev.id}`}>Dettagli</Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                })()
                                            }
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="card">
                                            <div className="card-body p-2" style={{ maxHeight: '600px', overflow: 'hidden' }}>
                                                <div className="ratio" style={{ '--bs-aspect-ratio': '125%', maxHeight: '600px' }}>
                                                    <iframe
                                                        src="https://www.instagram.com/crocedorosudpontino/embed"
                                                        title="Instagram Croce d'Oro Sud Pontino"
                                                        frameBorder="0"
                                                        scrolling="no"
                                                        style={{ width: '100%', height: '100%', border: 0 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card mt-3">
                                            <div className="card-body p-2" style={{ height: '140px' }}>
                                                <iframe
                                                    title="Facebook Croce d'Oro Sud Pontino"
                                                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fcrocedorosudpontino&tabs=&width=500&height=140&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false"
                                                    width="100%"
                                                    height="100%"
                                                    style={{ border: 0, overflow: 'hidden' }}
                                                    scrolling="no"
                                                    frameBorder="0"
                                                    allow="encrypted-media"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </>
                        }
                    />

                    <Route path="/mezzi" element={<Mezzi />} />
                    <Route path="/5x1000" element={<CinquePerMille />} />
                    <Route path="/struttura-organizzativa" element={<StrutturaOrganizzativa />} />
                    <Route path="/storia" element={<Storia />} />
                    <Route path="/corsi" element={<Corsi />} />
                    <Route path="/diventare-volontario" element={<DiventareVolontario />} />
                    <Route path="/richiedere-servizio" element={<RichiedereServizio />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/eventi/:id" element={<EventDetail />} />
                    <Route path="/galleria" element={<Galleria />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/private"
                        element={
                            <ProtectedRoute>
                                <PrivateDashboard />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="calendar" replace />} />
                        <Route path="calendar" element={<Calendar />} />
                        <Route path="magazzino" element={<Magazzino />} />
                        <Route path="fogli-marcia" element={<FogliMarcia />} />
                        <Route path="nuovo-foglio" element={<NuovoFoglioDiMarcia />} />
                        <Route path="fogli-marcia/ricerca" element={<RicercaFogliMarcia />} />
                        <Route path="fogli-marcia/report" element={<ReportFogliMarcia />} />
                        <Route path="tools/amministrazione/utenti" element={<ProtectedRoute roles={['admin']}><Personale /></ProtectedRoute>} />
                        <Route path="tools/eventi" element={<ProtectedRoute roles={['admin']}><PrivateEventEditor /></ProtectedRoute>} />
                        <Route path="tools/amministrazione/mezzi" element={<ProtectedRoute roles={['admin']}><AdminMezzi /></ProtectedRoute>} />
                        <Route path="tools/amministrazione/mezzi/:id" element={<ProtectedRoute roles={['admin']}><MezzoGestione /></ProtectedRoute>} />
                        <Route path="attivita/crea" element={<ProtectedRoute><CreazionePostAttivita /></ProtectedRoute>} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>

            {!isPrivate && !isLogin && <Footer />}
        </div>
    );
};

export default App;
