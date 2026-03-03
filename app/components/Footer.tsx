export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background-secondary py-8">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-foreground-secondary">
        <p>&copy; {new Date().getFullYear()} Digital PM Adoption Study. All rights reserved.</p>
      </div>
    </footer>
  )
}
