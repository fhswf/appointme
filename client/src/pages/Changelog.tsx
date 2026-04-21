import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import AppNavbar from '../components/AppNavbar';
import Footer from '../components/Footer';
import { markdownComponents } from '../components/MarkdownComponents';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Loader2 } from 'lucide-react';

const REPO = 'fhswf/appointme';
const BRANCH = 'prod';

const PACKAGES: { name: string; label: string }[] = [
    { name: 'client',     label: 'Client'     },
    { name: 'backend',    label: 'Backend'    },
    { name: 'mcp-server', label: 'MCP Server' },
    { name: 'common',     label: 'Common'     },
];

const changelogUrl = (pkg: string) => {
    return `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${pkg}/CHANGELOG.md`;
};

/** Returns true for release-candidate versions like 1.2.3-rc.1 */
const isReleaseCandidate = (version: string) => /-rc\.\d+$/.test(version);

interface CategoryEntry {
    name: string;
    items: string[];
}

interface Release {
    /** Stable unique key, e.g. "Client@1.38.1" */
    id: string;
    version: string;
    package: string;
    date: string;
    url: string;
    categories: CategoryEntry[];
    ts: number;
}

/** A group of one-or-more releases that share the same calendar date */
interface ReleaseGroup {
    date: string;
    ts: number;
    releases: Release[];
}

// Map semantic-release section names → Antigravity names
const SECTION_MAP: Record<string, string> = {
    'bug fixes': 'Fixes',
    'features': 'Improvements',
    'performance improvements': 'Improvements',
    'reverts': 'Fixes',
    'dependencies': 'Patches',
    'chores': 'Patches',
};

const normalizeSectionName = (raw: string): string => {
    const key = raw.toLowerCase().trim();
    return SECTION_MAP[key] ?? raw;
};

const parsePackageChangelog = (text: string, pkgLabel: string): Release[] => {
    const lines = text.split('\n');
    const releases: Release[] = [];
    let current: Release | null = null;
    let currentCat: CategoryEntry | null = null;

    for (const line of lines) {
        // Matches "## client [1.38.1](url) (2026-02-09)" or "# backend [1.43.0](url) (2026-02-09)"
        const versionMatch = /^##?\s+(?:[a-z-]+\s+)?\[([^\]]+)\]\(([^)]*)\)\s+\(([^)]+)\)/i.exec(line);
        if (versionMatch) {
            const version = versionMatch[1];
            const url     = versionMatch[2];
            const date    = versionMatch[3];

            // Skip release candidates entirely
            if (isReleaseCandidate(version)) {
                current = null;
                currentCat = null;
                continue;
            }

            current = {
                id: `${pkgLabel}@${version}`,
                version,
                package: pkgLabel,
                date,
                url,
                categories: [],
                ts: new Date(date).getTime(),
            };
            releases.push(current);
            currentCat = null;
            continue;
        }

        // Section header: ### Bug Fixes / ### Features / ### Dependencies
        const secMatch = /^###\s+(.+)/.exec(line);
        if (secMatch && current) {
            const secName = normalizeSectionName(secMatch[1]);
            currentCat = current.categories.find(c => c.name === secName) ?? null;
            if (!currentCat) {
                currentCat = { name: secName, items: [] };
                current.categories.push(currentCat);
            }
            continue;
        }

        if (currentCat && line.trim() !== '') {
            currentCat.items.push(line);
        }
    }
    return releases;
};

/** Filter out empty releases (only Dependencies section with no real items) */
const hasUserFacingContent = (release: Release): boolean =>
    release.categories.some(
        cat => cat.name !== 'Patches' || cat.items.some(l => l.trim().startsWith('*'))
    );

/**
 * Merge and sort releases newest-first, then group by date so all packages
 * released on the same day appear as one timeline entry.
 */
const groupByDate = (allReleases: Release[][]): ReleaseGroup[] => {
    const flat = allReleases.flat().filter(hasUserFacingContent);
    flat.sort((a, b) => b.ts - a.ts);

    const map = new Map<string, ReleaseGroup>();
    for (const release of flat) {
        const existing = map.get(release.date);
        if (existing) {
            existing.releases.push(release);
        } else {
            map.set(release.date, { date: release.date, ts: release.ts, releases: [release] });
        }
    }

    return [...map.values()].sort((a, b) => b.ts - a.ts);
};

// ─── Component ───────────────────────────────────────────────────────────────

const PKG_BADGE: Record<string, string> = {
    'Client':     'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300/30',
    'Backend':    'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300/30',
    'MCP Server': 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-300/30',
    'Common':     'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-300/30',
};

const categoryIcon = (name: string) => {
    if (name === 'Improvements') return '✨';
    if (name === 'Fixes') return '🐛';
    if (name === 'Patches') return '🔧';
    return '📝';
};

const Changelog: React.FC = () => {
    const { t } = useTranslation();
    const [groups, setGroups] = useState<ReleaseGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const results = await Promise.all(
                    PACKAGES.map(async (pkg) => {
                        let res = await fetch(changelogUrl(pkg.name));
                        if (!res.ok) {
                            res = await fetch(changelogUrl(pkg.name).replace(`/${BRANCH}/`, '/main/'));
                        }
                        if (!res.ok) return [];
                        const text = await res.text();
                        return parsePackageChangelog(text, pkg.label);
                    })
                );
                setGroups(groupByDate(results));
                setLoading(false);
            } catch (err) {
                console.error('Failed to load changelogs:', err);
                setError(true);
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppNavbar />
            <main className="container mx-auto p-4 md:p-8 flex-grow max-w-4xl">
                {/* Page header */}
                <div className="mb-10 text-center sm:text-left border-b border-border pb-6">
                    <h1 className="text-4xl font-bold mb-2 tracking-tight">
                        {t('Changelog')}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        {t("See what's new and what has been fixed.")}
                    </p>
                    {/* Package legend */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {PACKAGES.map(pkg => (
                            <span
                                key={pkg.label}
                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${PKG_BADGE[pkg.label] ?? ''}`}
                            >
                                {pkg.label}
                            </span>
                        ))}
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                )}

                {!loading && error && (
                    <div className="text-center py-10 text-destructive">
                        {t('Failed to load changelog data.')}
                    </div>
                )}

                {!loading && !error && (
                    <div className="space-y-14 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {groups.map((group) => (
                            <div key={group.date} className="relative pl-0 sm:pl-8">
                                {/* Timeline line + dot */}
                                <div className="hidden sm:block absolute left-0 top-2 bottom-[-3.5rem] w-px bg-border" />
                                <div className="hidden sm:block absolute left-[-5px] top-2.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />

                                {/* Date header */}
                                <time
                                    dateTime={group.date}
                                    className="block text-sm font-semibold text-muted-foreground mb-4 tracking-wide uppercase"
                                >
                                    {new Date(group.date).toLocaleDateString(undefined, {
                                        year: 'numeric', month: 'long', day: 'numeric',
                                    })}
                                </time>

                                {/* Releases for this date */}
                                <div className="space-y-6">
                                    {group.releases.map((release) => (
                                        <div key={release.id} className="rounded-2xl border bg-card shadow-sm overflow-hidden">
                                            {/* Release title bar */}
                                            <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b bg-muted/20">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${PKG_BADGE[release.package] ?? ''}`}
                                                >
                                                    {release.package}
                                                </span>
                                                <h2 className="text-lg font-bold tracking-tight">
                                                    {release.url ? (
                                                        <a
                                                            href={release.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="hover:text-primary transition-colors"
                                                        >
                                                            v{release.version}
                                                        </a>
                                                    ) : (
                                                        `v${release.version}`
                                                    )}
                                                </h2>
                                            </div>

                                            {/* Categories as accordions */}
                                            <div className="divide-y">
                                                {release.categories.map((category) => (
                                                    <details
                                                        key={`${release.id}-${category.name}`}
                                                        className="group [&_summary::-webkit-details-marker]:hidden"
                                                        open={category.name === 'Improvements' || category.name === 'Fixes'}
                                                    >
                                                        <summary className="flex cursor-pointer items-center justify-between px-5 py-3 font-medium text-sm hover:bg-muted/40 transition-colors select-none">
                                                            <div className="flex items-center gap-2">
                                                                <span>{categoryIcon(category.name)}</span>
                                                                <span>{category.name}</span>
                                                                <span className="bg-primary/10 text-primary text-xs font-bold px-1.5 py-0.5 rounded-full tabular-nums">
                                                                    {category.items.filter(x => x.trim().startsWith('*')).length}
                                                                </span>
                                                            </div>
                                                            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180 flex-shrink-0" />
                                                        </summary>
                                                        <div className="px-5 pb-4 pt-1 bg-muted/5">
                                                            <div className="prose prose-sm dark:prose-invert max-w-none prose-a:text-primary hover:prose-a:text-primary/80 prose-li:my-0.5">
                                                                <ReactMarkdown components={markdownComponents}>
                                                                    {category.items.join('\n')}
                                                                </ReactMarkdown>
                                                            </div>
                                                        </div>
                                                    </details>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Changelog;
