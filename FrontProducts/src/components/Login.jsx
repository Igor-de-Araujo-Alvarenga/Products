import { useState } from 'react';
import { api } from '../services/api';

export function Login({ onLoginSuccess }) {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!credentials.email || !credentials.password) {
            setError('Please enter both email and password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.authentication({
                Email: credentials.email,
                Password: credentials.password
            });

            if (onLoginSuccess) {
                onLoginSuccess(true);
            }

        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Authentication failed - Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>🔐 Login</h1>
                    <p style={styles.subtitle}>Access the Product Management System</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label} htmlFor="email">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            style={styles.input}
                            disabled={loading}
                            autoComplete="email"
                            autoFocus
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label} htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            style={styles.input}
                            disabled={loading}
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div style={styles.errorBox}>
                            <span style={styles.errorIcon}>⚠️</span>
                            <span style={styles.errorText}>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        style={loading ? styles.buttonDisabled : styles.button}
                        disabled={loading}
                    >
                        {loading ? (
                            <span style={styles.loadingSpinner}>
                                <span style={styles.spinner}></span>
                                Authenticating...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.demoText}>
                        Demo credentials:<br />
                        Email: test@gmail.com<br />
                        Password: dummypassword
                    </p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '1rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    card: {
        background: 'white',
        borderRadius: '1rem',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '1.875rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '0.5rem',
    },
    subtitle: {
        fontSize: '0.875rem',
        color: '#64748b',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#1e293b',
    },
    input: {
        padding: '0.75rem',
        border: '1px solid #e2e8f0',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        transition: 'all 0.2s',
        outline: 'none',
        fontFamily: 'inherit',
        backgroundColor: 'white',
        color: 'black'
    },
    button: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '0.75rem',
        border: 'none',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginTop: '0.5rem',
    },
    buttonDisabled: {
        background: '#cbd5e1',
        color: 'white',
        padding: '0.75rem',
        border: 'none',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'not-allowed',
        marginTop: '0.5rem',
    },
    errorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem',
        background: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '0.5rem',
        color: '#991b1b',
    },
    errorIcon: {
        fontSize: '1.125rem',
    },
    errorText: {
        fontSize: '0.875rem',
    },
    loadingSpinner: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
    },
    spinner: {
        display: 'inline-block',
        width: '16px',
        height: '16px',
        border: '2px solid white',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 0.6s linear infinite',
    },
    footer: {
        marginTop: '1.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #e2e8f0',
        textAlign: 'center',
    },
    demoText: {
        fontSize: '0.75rem',
        color: '#64748b',
        lineHeight: '1.5',
    },
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);