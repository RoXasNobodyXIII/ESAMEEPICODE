import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer id="footer" className="custom-footer mt-5">
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <h4 className="footer-title">Contatti</h4>
                        <div className="footer-contact">
                            <div className="d-flex align-items-start mb-2">
                                <span className="me-2 mt-1"><i className="bi bi-geo-alt-fill" style={{ color: '#FECA00' }}></i></span>
                                <div className="footer-text">
                                    <div className="d-flex align-items-center">
                                        <strong>Indirizzo:</strong>
                                        <a href="https://maps.app.goo.gl/gTqLr23TqAAKiPnA7" target="_blank" rel="noopener noreferrer" className="ms-2" aria-label="Vedi su Google Maps">
                                            <i className="bi bi-map" style={{ color: '#FECA00' }}></i>
                                        </a>
                                    </div>
                                    <div>Via Roma, 60</div>
                                    <div>Sperlonga, Italy</div>
                                </div>
                            </div>
                            <div className="d-flex align-items-start mb-2">
                                <span className="me-2 mt-1"><i className="bi bi-telephone-fill" style={{ color: '#FECA00' }}></i></span>
                                <div className="footer-text d-flex flex-column">
                                    <strong className="mb-1">Telefono</strong>
                                    <a href="tel:+393663283199" style={{ color: '#FECA00' }}>366 328 3199</a>
                                </div>
                            </div>
                            <div className="d-flex align-items-start">
                                <span className="me-2 mt-1"><i className="bi bi-envelope-fill" style={{ color: '#FECA00' }}></i></span>
                                <div className="footer-text d-flex flex-column">
                                    <strong className="mb-1">Email</strong>
                                    <a href="mailto:crocedorosudpontino@virgilio.it" style={{ color: '#FECA00' }}>crocedorosudpontino@virgilio.it</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <h4 className="footer-title">Orari</h4>
                        <div className="footer-contact">
                            <div className="d-flex align-items-start mb-2 footer-text">
                                <div>
                                    <div><strong>Disponibili 24/7</strong></div>
                                </div>
                            </div>
                            <div className="footer-text mb-1">I nostri social</div>
                        </div>
                        <div className="footer-social d-flex flex-row flex-nowrap justify-content-start mt-2">
                            <a href="https://www.facebook.com/crocedorosudpontino" target="_blank" rel="noopener noreferrer" className="social-icon facebook" aria-label="Facebook">
                                <i className="bi bi-facebook" aria-hidden="true"></i>
                            </a>
                            <a href="https://www.instagram.com/crocedorosudpontino/" target="_blank" rel="noopener noreferrer" className="social-icon instagram" aria-label="Instagram">
                                <i className="bi bi-instagram" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <h4 className="footer-title">Link utili</h4>
                        <ul className="list-unstyled footer-text mb-0">
                            <li className="mb-2 d-flex align-items-center">
                                <span className="me-2"><i className="bi bi-box-arrow-in-right" style={{ color: '#FECA00' }}></i></span>
                                <Link to="/login">Area Riservata</Link>
                            </li>
                            <li className="d-flex align-items-center">
                                <span className="me-2"><i className="bi bi-shield-lock" style={{ color: '#FECA00' }}></i></span>
                                <Link to="/privacy">Privacy</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container-fluid py-3">
                    <div className="row align-items-center gy-2">
                        <div className="col-md-4 d-flex justify-content-start">
                            <div className="d-flex align-items-center footer-logos">
                                <img src="https://res.cloudinary.com/dkbahjqa6/image/upload/v1761074530/ANPASLAZIO_rhk1xj.png" alt="ANPAS Lazio" className="footer-logo" loading="lazy" />
                                <img src="https://res.cloudinary.com/dkbahjqa6/image/upload/v1761074409/ComuneSperlonga_u1qxfb.png" alt="Comune di Sperlonga" className="footer-logo" loading="lazy" />
                                <img src="https://res.cloudinary.com/dkbahjqa6/image/upload/v1761074505/ComuneCampodimele_fraupn.png" alt="Comune di Campodimele" className="footer-logo" loading="lazy" />
                            </div>
                        </div>
                        <div className="col-md-4 text-center">
                            <p className="mb-0">&copy; {new Date().getFullYear()} Croce d'Oro Sud Pontino ONLUS. Tutti i diritti riservati.</p>
                        </div>
                        <div className="col-md-4"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

