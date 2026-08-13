/**
 * AppLayout — GOV.UK Design System shell
 * Header: black bar + crown logo + service name
 * Navigation: govuk-header__navigation horizontal bar
 * Footer: govuk-footer with OGL licence text
 */
import { Box } from '@mui/material';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const gds = {
  black: '#0b0c0c',
  white: '#ffffff',
  yellow: '#fd0',
  blue: '#1d70b8',
  grey1: '#f3f2f1',
  grey2: '#dee0e2',
  borderGrey: '#b1b4b6'
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const commonNav = [
    { label: 'Home', to: '/' },
    { label: 'Accounts', to: '/accounts' },
    { label: 'Cards', to: '/cards' },
    { label: 'Transactions', to: '/transactions' },
    { label: 'Reports', to: '/reports' },
    { label: 'Batch Reports', to: '/batch-reports' }
  ];
  const adminNav = [
    { label: 'Admin', to: '/admin' },
    { label: 'Add Customer', to: '/customers/add' }
  ];
  const items = user?.role === 'A' ? [...commonNav, ...adminNav] : commonNav;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* ── GOV.UK Header ────────────────────────────────────────────── */}
      <header
        style={{
          background: gds.black,
          borderBottom: `10px solid ${gds.blue}`,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200
        }}
      >
        <Box
          sx={{
            maxWidth: 1280,
            mx: 'auto',
            px: { xs: 3, md: 4 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: '10px'
          }}
        >
          {/* Crown + service name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Simplified crown SVG */}
            <svg
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 132 97"
              height="32"
              width="44"
              fill={gds.white}
            >
              <path d="M25 30.2c3.5 1.5 7.7-.2 9.1-3.7 1.5-3.5-.2-7.7-3.7-9.1-3.5-1.5-7.7.2-9.1 3.7-1.4 3.5.3 7.6 3.7 9.1zm-17.2 0c3.5 1.5 7.7-.2 9.1-3.7 1.5-3.5-.2-7.7-3.7-9.1-3.5-1.5-7.7.2-9.1 3.7-1.4 3.5.3 7.6 3.7 9.1zM109 30.2c3.5 1.5 7.7-.2 9.1-3.7 1.5-3.5-.2-7.7-3.7-9.1-3.5-1.5-7.7.2-9.1 3.7-1.4 3.5.3 7.6 3.7 9.1zm17.2 0c3.5 1.5 7.7-.2 9.1-3.7 1.5-3.5-.2-7.7-3.7-9.1-3.5-1.5-7.7.2-9.1 3.7-1.4 3.5.3 7.6 3.7 9.1zM66 0C29.5 0 0 14.8 0 33.1v63.6h132V33.1C132 14.8 102.5 0 66 0zm0 88.8c-17.7 0-32-6.3-32-14V42.8h64v32c0 7.6-14.3 14-32 14z" />
            </svg>

            <NavLink
              to="/"
              style={{
                color: gds.white,
                textDecoration: 'none',
                fontFamily: '"GDS Transport", Arial, sans-serif',
                fontWeight: 700,
                fontSize: 18,
                lineHeight: '1.3'
              }}
            >
              AWS CardDemo
              <span
                style={{
                  display: 'block',
                  fontWeight: 400,
                  fontSize: 16
                }}
              >
                Modernisation
              </span>
            </NavLink>
          </Box>

          {/* User info + sign out */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span
              style={{
                color: gds.white,
                fontFamily: '"GDS Transport", Arial, sans-serif',
                fontSize: 16
              }}
            >
              {user?.firstName} {user?.lastName}&nbsp;
              <span style={{ color: gds.grey2 }}>
                ({user?.role === 'A' ? 'Admin' : 'User'})
              </span>
            </span>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              style={{
                background: 'transparent',
                border: `1px solid ${gds.white}`,
                color: gds.white,
                cursor: 'pointer',
                padding: '4px 12px',
                fontFamily: '"GDS Transport", Arial, sans-serif',
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 0
              }}
            >
              Sign out
            </button>
          </Box>
        </Box>

        {/* Navigation bar */}
        <Box
          sx={{
            background: gds.black,
            borderTop: `1px solid ${gds.grey2}`,
            overflowX: 'auto'
          }}
        >
          <Box
            component="nav"
            aria-label="Service navigation"
            sx={{
              maxWidth: 1280,
              mx: 'auto',
              px: { xs: 3, md: 4 },
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px'
            }}
          >
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '12px 16px',
                  color: isActive ? gds.black : gds.white,
                  background: isActive ? gds.white : 'transparent',
                  textDecoration: 'none',
                  fontFamily: '"GDS Transport", Arial, sans-serif',
                  fontWeight: isActive ? 700 : 400,
                  fontSize: 16,
                  lineHeight: '1.3',
                  borderBottom: isActive ? `4px solid ${gds.yellow}` : '4px solid transparent',
                  whiteSpace: 'nowrap'
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </Box>
        </Box>
      </header>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <Box
        component="main"
        id="main-content"
        sx={{
          flexGrow: 1,
          maxWidth: 1280,
          width: '100%',
          mx: 'auto',
          px: { xs: 3, md: 4 },
          pt: '130px',   // clears fixed header (black bar ~58px + nav ~44px + 28 breathing room)
          pb: 6
        }}
      >
        <Outlet />
      </Box>

      {/* ── GOV.UK Footer ────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: `1px solid ${gds.borderGrey}`,
          background: gds.grey1,
          padding: '25px 0'
        }}
      >
        <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 3, md: 4 } }}>
          <p
            style={{
              fontFamily: '"GDS Transport", Arial, sans-serif',
              fontSize: 16,
              lineHeight: '1.6',
              color: gds.black,
              margin: 0
            }}
          >
            © Crown copyright — AWS CardDemo is a modernisation demonstration.&nbsp;
            <a
              href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
              style={{ color: gds.black }}
            >
              Open Government Licence v3.0
            </a>
          </p>
        </Box>
      </footer>
    </Box>
  );
}
