import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
    const [email, setEmail] = useState('');

    return (
        <footer style={{ paddingTop: '4rem', paddingBottom: 0, background: 'var(--color-primary)' }}>
            <div className="padd-container">
                {/* Main Footer Grid */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    gap: '3rem',
                }}>
                    {/* Brand Column */}
                    <div style={{ maxWidth: '20rem' }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <img
                                alt="Annapurna logo"
                                style={{ height: '3rem' }}
                                src="/FoodieFiesta_files/logo-hvC0bAJS.svg"
                            />
                            <div>
                                <span style={{
                                    display: 'block',
                                    fontWeight: 800,
                                    fontSize: '1.75rem',
                                    position: 'relative',
                                    top: '4px',
                                    left: '4px',
                                    letterSpacing: '-0.02em',
                                }}>Annapurna</span>
                                <span style={{
                                    display: 'block',
                                    fontWeight: 800,
                                    fontSize: '0.7rem',
                                    position: 'relative',
                                    left: '6px',
                                    letterSpacing: '9px',
                                    textTransform: 'uppercase',
                                    color: 'var(--color-solid)',
                                }}></span>
                            </div>
                        </Link>
                        <p style={{ marginTop: '1.25rem', fontSize: '0.875rem' }}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            Lorem Ipsum has been the industry's standard dummy text
                        </p>
                        {/* Social icons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.75rem' }}>
                            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    style={{ color: 'var(--color-gray-500)', transition: 'color 0.2s' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-solid)')}
                                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-gray-500)')}
                                >
                                    <Icon size={22} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 style={{ color: 'var(--color-textColor)' }}>COMPANY</h4>
                        <ul style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                            {['About', 'Careers', 'Press', 'Blog', 'Partners'].map(item => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        style={{ color: 'var(--color-gray-50)', transition: 'color 0.2s' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-solid)')}
                                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-gray-50)')}
                                    >{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 style={{ color: 'var(--color-textColor)' }}>SUPPORT</h4>
                        <ul style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                            {['Help Center', 'Safety Information', 'Cancellation Options', 'Contact Us', 'Accessibility'].map(item => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        style={{ color: 'var(--color-gray-50)', transition: 'color 0.2s' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-solid)')}
                                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-gray-50)')}
                                    >{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div style={{ maxWidth: '20rem' }}>
                        <h4 style={{ color: 'var(--color-textColor)' }}>STAY UPDATED</h4>
                        <p style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
                            Subscribe to our newsletter for inspiration and special offers.
                        </p>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid rgba(107,114,128,0.3)',
                            paddingLeft: '1rem',
                            gap: '0.5rem',
                            backgroundColor: 'rgba(220,88,62,0.07)',
                            height: '46px',
                            borderRadius: '9999px',
                            overflow: 'hidden',
                            maxWidth: '28rem',
                            width: '100%',
                            marginTop: '1.5rem',
                        }}>
                            <input
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                style={{
                                    flex: 1,
                                    height: '100%',
                                    background: 'transparent',
                                    outline: 'none',
                                    fontSize: '0.875rem',
                                    color: 'var(--color-gray-500)',
                                }}
                            />
                            <button className="btn-solid" style={{ borderRadius: '9999px', padding: '0.5rem 0.875rem', marginRight: '2px', fontSize: '0.875rem' }}>
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Divider & Bottom Bar */}
                <hr style={{ borderColor: 'var(--color-gray-300)', marginTop: '2rem' }} />
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 0',
                }}>
                    <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                        <p>© {new Date().getFullYear()} <a href="/" style={{ color: 'inherit' }}>Annapurna</a>. All rights reserved.</p>
                        <ul style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem' }}>
                            {['Privacy', 'Terms', 'Sitemap'].map(item => (
                                <li key={item}><a href="#" style={{ color: 'var(--color-gray-50)' }}>{item}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
