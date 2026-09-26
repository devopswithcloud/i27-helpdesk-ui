'use client';
export default function Navbar() {
  return (
    <nav className="nav-bar">
      <div className="nav-inner">
        {/* Brand */}
        <a className="brand" href="/">
          <span className="brand-i27">i27</span>
          <span className="brand-helpdesk">Helpdesk</span>
        </a>

        {/* Right side */}
        <div className="nav-right">
          <a href="/student/login" className="btn btn-outline">
            Student Login
          </a>

          <a href="/agent/login" className="btn btn-primary">
            Agent/Admin Login
          </a>
        </div>
      </div>

      {/* Inline styles copied 1:1 from EJS */}
      <style jsx>{`
        .nav-bar {
          background: #fff;
          border-bottom: 1px solid #E8EAED;
          font-family: 'Inter', sans-serif;
        }

        .nav-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Branding */
        .brand {
          text-decoration: none;
          font-weight: 700;
          font-size: 22px;
          letter-spacing: 0.2px;
        }

        .brand-i27 {
          color: #051C36;
        }

        .brand-helpdesk {
          color: #F15E22;
          margin-left: 4px;
        }

        /* Right section */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn {
          padding: 8px 16px;
          font-size: 14px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease-in-out;
        }

        .btn-outline {
          border: 1px solid #051C36;
          background-color: #fff;
          color: #051C36;
        }

        .btn-outline:hover {
          background-color: #F7F8FA;
          border-color: #051C36;
        }

        .btn-primary {
          background-color: #F15E22;
          color: #fff;
          border: 1px solid #F15E22;
        }

        .btn-primary:hover {
          background-color: #d94f16;
          border-color: #d94f16;
        }
      `}</style>
    </nav>
  );
}
