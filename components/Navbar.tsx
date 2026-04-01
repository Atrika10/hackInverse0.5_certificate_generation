import Link from "next/link";

export default function Navbar() {
  return (
    <header
      style={{
        background: "#d4d0c8",
        borderBottom: "2px solid #808080",
        fontFamily: "'Tahoma', 'MS Sans Serif', Arial, sans-serif",
        fontSize: "11px",
      }}
    >
      {/* Menu bar */}
      <div
        style={{
          maxWidth: "100%",
          padding: "2px 6px",
          display: "flex",
          alignItems: "center",
          gap: "0px",
          borderBottom: "1px solid #a0998c",
        }}
      >
        {/* App icon + name */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginRight: "16px" }}>
          <WindowIcon />
          <span style={{ fontWeight: "bold", fontSize: "11px", color: "#000080" }}>
            HackInverse Certificate Portal
          </span>
        </div>

        {/* Menu items */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0px" }}>
          <MenuLink href="/" label="File" />
          <MenuLink href="/" label="Home" />
          <MenuLink href="#how-it-works" label="Help" />
        </nav>
      </div>

      {/* Toolbar */}
      <div
        style={{
          padding: "2px 6px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "#d4d0c8",
        }}
      >
        <ToolbarBtn label="◄ Back" />
        <ToolbarBtn label="► Forward" />
        <div style={{ width: "1px", height: "22px", background: "#808080", margin: "0 4px" }} />
        <Link href="/" style={{ textDecoration: "none" }}>
          <ToolbarBtn label="🏠 Home" />
        </Link>
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "2px inset",
            borderTop: "2px solid #808080",
            borderLeft: "2px solid #808080",
            borderRight: "2px solid #fff",
            borderBottom: "2px solid #fff",
            background: "#fff",
            padding: "1px 6px",
            minWidth: "260px",
            fontSize: "11px",
            color: "#000",
          }}
        >
          <span style={{ color: "#808080", marginRight: "4px" }}>Address:</span>
          <span>http://hackinverse.local/certificate</span>
        </div>
        <ToolbarBtn label="Go" />
      </div>
    </header>
  );
}

function MenuLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        padding: "2px 8px",
        textDecoration: "none",
        color: "#000",
        fontSize: "11px",
        fontFamily: "'Tahoma', 'MS Sans Serif', Arial, sans-serif",
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLElement).style.background = "#000080";
        (e.target as HTMLElement).style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLElement).style.background = "transparent";
        (e.target as HTMLElement).style.color = "#000";
      }}
    >
      {label}
    </Link>
  );
}

function ToolbarBtn({ label }: { label: string }) {
  return (
    <button
      style={{
        background: "#d4d0c8",
        border: "none",
        borderTop: "2px solid transparent",
        borderLeft: "2px solid transparent",
        borderRight: "2px solid transparent",
        borderBottom: "2px solid transparent",
        fontFamily: "'Tahoma', 'MS Sans Serif', Arial, sans-serif",
        fontSize: "11px",
        padding: "2px 8px",
        cursor: "pointer",
        color: "#000",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderTop = "2px solid #fff";
        el.style.borderLeft = "2px solid #fff";
        el.style.borderRight = "2px solid #808080";
        el.style.borderBottom = "2px solid #808080";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderTop = "2px solid transparent";
        el.style.borderLeft = "2px solid transparent";
        el.style.borderRight = "2px solid transparent";
        el.style.borderBottom = "2px solid transparent";
      }}
    >
      {label}
    </button>
  );
}

function WindowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="0" y="0" width="7" height="7" fill="#f00" />
      <rect x="9" y="0" width="7" height="7" fill="#0f0" />
      <rect x="0" y="9" width="7" height="7" fill="#00f" />
      <rect x="9" y="9" width="7" height="7" fill="#ff0" />
    </svg>
  );
}
