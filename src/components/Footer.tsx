"use client";

import { BookOpen, GithubIcon, LinkedinIcon, MastodonIcon } from "./icons";

const footerLinks = [
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "https://docs.ok8.sh" },
      { label: "GitHub", href: "https://github.com/waifulabs/infrastructure" },
      { label: "Kromgo", href: "https://github.com/kashalls/kromgo" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "GitHub", href: "https://github.com/kashalls", icon: GithubIcon },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/jordpjones/",
        icon: LinkedinIcon,
      },
      {
        label: "Mastodon",
        href: "https://mastodon.social/@kashall",
        icon: MastodonIcon,
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-card-border mt-16">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center text-white font-bold text-sm">
                W
              </div>
              <span className="font-semibold tracking-tight">Waifu Labs</span>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              A personal homelab project by{" "}
              <a
                href="https://github.com/kashalls"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Jordan Jones
              </a>
              . Built with open source, powered by curiosity.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                    >
                      {"icon" in link && link.icon && (
                        <link.icon className="w-4 h-4" />
                      )}
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Waifu Labs - Just a
            passion project.
          </p>
          <div className="flex items-center gap-2">
            <a
              href="https://docs.ok8.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted hover:text-foreground transition-colors hover:bg-white/5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Docs
            </a>
            <a
              href="https://github.com/waifulabs/infrastructure"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted hover:text-foreground transition-colors hover:bg-white/5"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              Source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
