export function Footer() {
  return (
    <footer className="mt-auto border-b border-terminal-border bg-terminal-card py-8">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-terminal-muted">
        <p>&copy; {new Date().getFullYear()} Digital PM Adoption Study. All rights reserved.</p>
      </div>
    </footer>
  )
}
