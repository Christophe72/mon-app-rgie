import Link from "next/link";

function NavCard({
  href,
  icon,
  label,
  desc,
  color,
  badge,
  badgeColor,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  color: string;
  badge: string;
  badgeColor: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 bg-gray-900 border rounded-xl px-4 py-4 transition-colors ${color}`}
    >
      <div className="w-11 h-11 rounded-xl bg-gray-800 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-gray-500 text-xs truncate">{desc}</p>
      </div>
      <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-md ${badgeColor}`}>
        {badge}
      </span>
    </Link>
  );
}

const tools = [
  {
    href: "/calculs/intensite",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-amber-400">
        <path d="M13 2L4.09 12.97H11L10 22l8.91-10.97H13L13 2z" />
      </svg>
    ),
    label: "Calcul d'intensité",
    desc: "P = U × I · Mono & Triphasé",
    color: "border-amber-500/30 hover:border-amber-500/60",
    badge: "P · U · I",
    badgeColor: "bg-amber-500/10 text-amber-400",
  },
];

const chantiers = [
  {
    href: "/chantiers",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-orange-400" strokeWidth={2}>
        <path d="M2 17h20M12 3v3M5.2 10A7 7 0 0 1 19 10H5.2z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 10v7M20 10v7" strokeLinecap="round" />
      </svg>
    ),
    label: "Chantiers",
    desc: "Gestion · Support · Contraintes · Difficulté",
    color: "border-orange-700/30 hover:border-orange-600/60",
    badge: "CRUD",
    badgeColor: "bg-orange-900/40 text-orange-400",
  },
];

const diagnostics = [
  {
    href: "/diagnostic",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-red-400" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
      </svg>
    ),
    label: "Recherche de panne",
    desc: "Diagnostic guidé · Questions Oui/Non",
    color: "border-red-700/30 hover:border-red-600/60",
    badge: "Guidé",
    badgeColor: "bg-red-900/40 text-red-400",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="px-5 pt-10 pb-6">
        <h1 className="text-2xl font-black tracking-tight">
          Assistant <span className="text-blue-400">RGIE</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Outils terrain pour électriciens — Belgique
        </p>
      </header>

      <main className="flex-1 px-4 pb-8 max-w-md mx-auto w-full space-y-6">
        <section>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">
            Calculateurs
          </p>
          <div className="space-y-3">
            {tools.map((t) => (
              <NavCard key={t.href} {...t} />
            ))}
          </div>
        </section>

        <section>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">
            Diagnostic
          </p>
          <div className="space-y-3">
            {diagnostics.map((t) => (
              <NavCard key={t.href} {...t} />
            ))}
          </div>
        </section>

        <section>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">
            Chantiers
          </p>
          <div className="space-y-3">
            {chantiers.map((t) => (
              <NavCard key={t.href} {...t} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
