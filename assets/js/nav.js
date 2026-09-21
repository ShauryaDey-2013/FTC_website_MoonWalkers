/* ==========================================================================
   Dynamic Navigation Manager - MoonWalkers FTC #38056
   ========================================================================== */

const navLinks = [
    { name: "Home", href: "index.html" },
    { name: "Our FLL Story", href: "journey.html" },
    { name: "Meet The Team", href: "team.html" },
    { name: "Trophies", href: "achievements.html" },
    { name: "Engineering Blogs", href: "blog.html" },
    { name: "Outreach", href: "connect.html" },
    { name: "About Us", href: "about.html" },
    { name: "Sponsor Us", href: "sponsors.html", isCta: true }
];

document.addEventListener("DOMContentLoaded", () => {
    renderNavigation();
});

function renderNavigation() {
    const desktopNav = document.getElementById("desktop-nav");
    const mobileNav = document.getElementById("mobile-nav-links");
    
    if (!desktopNav || !mobileNav) return;

    // Detect current page filename (e.g., "about.html" or "index.html")
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    let desktopHtml = "";
    let mobileHtml = "";

    navLinks.forEach(link => {
        const isActive = currentPath === link.href;

        // Render Call-to-Action button vs Standard Nav Link
        if (link.isCta) {
            desktopHtml += `
                <a href="${link.href}" class="bg-cyberCyan text-black px-4 py-2 rounded-lg font-extrabold hover:bg-cyan-300 transition">
                    ${link.name}
                </a>`;
            mobileHtml += `
                <a href="${link.href}" class="bg-cyberCyan text-black text-center py-2.5 rounded-lg font-extrabold block">
                    ${link.name}
                </a>`;
        } else {
            const activeDesktopClasses = isActive 
                ? "text-cyberCyan border-b-2 border-cyberCyan pb-1" 
                : "text-slate-300 hover:text-cyberCyan transition-colors";
            
            const activeMobileClasses = isActive 
                ? "text-cyberCyan font-bold" 
                : "text-slate-300 hover:text-cyberCyan";

            desktopHtml += `<a href="${link.href}" class="${activeDesktopClasses}">${link.name}</a>`;
            mobileHtml += `<a href="${link.href}" class="${activeMobileClasses}">${link.name}</a>`;
        }
    });

    desktopNav.innerHTML = desktopHtml;
    mobileNav.innerHTML = mobileHtml;

    // Setup Mobile Menu Toggle Switch
    const mobileBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
    }
}