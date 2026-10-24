/* ==========================================================================
   MoonWalkers FTC #38056 - Markdown Blog Renderer Manager
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Configure Marked options for standard markdown syntaxes
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            gfm: true,          // GitHub Flavored Markdown (tables, task lists)
            breaks: true,       // Convert line breaks to <br>
            headerIds: true,    // Automatic IDs for headings
            mangle: false
        });
    }

    // Initial load for active (non-archived) logs
    loadBlogPosts(false);
});

/**
 * Loads and renders blog posts from blog-list.json
 * @param {boolean} showArchived - Filter for active vs archived posts
 */
async function loadBlogPosts(showArchived = false) {
    const container = document.getElementById("blog-container");
    if (!container) return;

    // Update Filter Buttons UI
    const activeBtn = document.getElementById("filter-active");
    const archivedBtn = document.getElementById("filter-archived");

    if (activeBtn && archivedBtn) {
        activeBtn.className = !showArchived 
            ? "px-3 py-2 rounded-lg bg-cyberCyan/20 text-cyberCyan border border-cyberCyan/40 text-left font-bold" 
            : "px-3 py-2 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 text-left hover:text-white";
        archivedBtn.className = showArchived 
            ? "px-3 py-2 rounded-lg bg-cyberCyan/20 text-cyberCyan border border-cyberCyan/40 text-left font-bold" 
            : "px-3 py-2 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 text-left hover:text-white";
    }

    try {
        // 1. Fetch manifest index
        const manifestRes = await fetch("assets/blogs/blog-list.json");
        if (!manifestRes.ok) {
          throw new Error("Could not locate assets/blogs/blog-list.json");
        }

        const posts = await manifestRes.json();
        const targetPosts = posts.filter(p => Boolean(p.archived) === showArchived);

        container.innerHTML = "";

        if (targetPosts.length === 0) {
            container.innerHTML = `
                <div class="p-8 text-center text-slate-400 font-code text-xs border border-slate-800 rounded-2xl bg-slate-900/40">
                    No ${showArchived ? 'archived' : 'active'} log files found in <code>assets/blogs/blog-list.json</code>.
                </div>`;
            return;
        }

        // 2. Process each post and convert Markdown to HTML
        for (const post of targetPosts) {
            let markdownHtml = "";

            try {
                const mdRes = await fetch(`assets/blogs/${post.filename}`);
                if (mdRes.ok) {
                    const rawMarkdown = await mdRes.text();
                    markdownHtml = typeof marked !== 'undefined' 
                        ? marked.parse(rawMarkdown) 
                        : `<p>${rawMarkdown}</p>`;
                } else {
                    markdownHtml = `<p class="text-amber-400 font-code text-xs">Warning: File <code>assets/blogs/${post.filename}</code> could not be loaded.</p>`;
                }
            } catch (err) {
                markdownHtml = `<p class="text-red-400 font-code text-xs">Error parsing markdown content.</p>`;
            }

            // 3. Render Post Card
            const card = document.createElement("article");
            card.className = "glass-card p-6 sm:p-8 rounded-2xl border-slate-800 space-y-4 mb-6";
            card.innerHTML = `
                <div class="flex items-center justify-between text-xs font-code pb-2 border-b border-slate-800">
                    <span class="text-cyberCyan font-semibold flex items-center gap-2">
                        <i data-lucide="calendar" class="w-4 h-4"></i> ${post.date}
                    </span>
                    ${post.archived ? '<span class="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Archived</span>' : '<span class="bg-cyan-500/10 text-cyberCyan border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Active</span>'}
                </div>
                <h2 class="font-heading text-2xl font-bold text-white tracking-wide">${post.title}</h2>
                <div class="blog-content text-slate-300 text-sm leading-relaxed space-y-4 pt-2">
                    ${markdownHtml}
                </div>
            `;
            container.appendChild(card);
        }

        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

    } catch (error) {
        container.innerHTML = `
            <div class="p-6 border border-red-500/30 rounded-2xl bg-red-500/10 text-red-400 font-code text-xs">
                <strong class="block text-white mb-1">Manifest Fetch Error</strong>
                Ensure <code>assets/blogs/blog-list.json</code> exists and you are running via a local web server (e.g. VS Code Live Server).
            </div>`;
    }
}
