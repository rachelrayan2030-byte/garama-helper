document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const toolCards = document.querySelectorAll('.tool-card');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    function showSection(id) {
        sections.forEach(s => s.classList.remove('active'));
        navItems.forEach(n => n.classList.remove('active'));

        const section = document.getElementById(id);
        const nav = document.querySelector(`[data-section="${id}"]`);

        if (section) section.classList.add('active');
        if (nav) nav.classList.add('active');

        // Close mobile sidebar
        sidebar.classList.remove('open');
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(item.dataset.section);
        });
    });

    toolCards.forEach(card => {
        card.addEventListener('click', () => {
            showSection(card.dataset.goto);
        });
    });

    menuToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Toast system
    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // ========== INSTAGRAM LOOKUP ==========
    const igUsername = document.getElementById('igUsername');
    const igSearchBtn = document.getElementById('igSearchBtn');
    const igResults = document.getElementById('igResults');
    const igEmpty = document.getElementById('igEmpty');
    const igLoading = document.getElementById('igLoading');

    async function searchInstagram() {
        const username = igUsername.value.trim().replace(/^@/, '');
        if (!username) {
            showToast('Introduce un nombre de usuario', 'error');
            return;
        }

        igEmpty.classList.add('hidden');
        igResults.classList.add('hidden');
        igLoading.classList.remove('hidden');
        igSearchBtn.disabled = true;

        // Simulate network delay for UX
        await new Promise(r => setTimeout(r, 900));

        // Honest limitation: No official public Instagram API available for this use case on static hosting
        igLoading.classList.add('hidden');
        igResults.classList.remove('hidden');
        igSearchBtn.disabled = false;

        igResults.innerHTML = `
            <div class="profile-card">
                <div class="profile-header">
                    <div style="width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#E00000,#FF2525);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;">
                        ${username.charAt(0).toUpperCase()}
                    </div>
                    <div class="profile-info">
                        <h2>${username}</h2>
                        <div class="username">@${username}</div>
                        <div class="bio">Información pública no disponible desde este entorno.</div>
                    </div>
                </div>

                <div class="notice-box">
                    <strong>Limitación técnica</strong><br><br>
                    Instagram no ofrece una API pública gratuita que permita consultar perfiles arbitrarios desde una página estática (GitHub Pages).<br><br>
                    Para implementar esta función de forma real y legal se necesita:
                    <ul style="margin:12px 0 0 20px;line-height:1.7">
                        <li>Un backend propio (Node.js, Python, etc.)</li>
                        <li>Acceso a la API oficial de Meta (con revisión y permisos)</li>
                        <li>O un servicio de terceros autorizado</li>
                    </ul>
                    <br>
                    Puedes abrir el perfil manualmente:
                    <br><br>
                    <a href="https://www.instagram.com/${username}/" target="_blank" rel="noopener" class="btn-secondary">
                        Abrir perfil en Instagram
                    </a>
                </div>
            </div>
        `;

        showToast('Consulta realizada (limitación de API)', 'info');
    }

    igSearchBtn.addEventListener('click', searchInstagram);
    igUsername.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') searchInstagram();
    });

    // ========== TIKTOK LOOKUP ==========
    const ttUsername = document.getElementById('ttUsername');
    const ttSearchBtn = document.getElementById('ttSearchBtn');
    const ttResults = document.getElementById('ttResults');
    const ttEmpty = document.getElementById('ttEmpty');
    const ttLoading = document.getElementById('ttLoading');

    async function searchTikTok() {
        const username = ttUsername.value.trim().replace(/^@/, '');
        if (!username) {
            showToast('Introduce un nombre de usuario', 'error');
            return;
        }

        ttEmpty.classList.add('hidden');
        ttResults.classList.add('hidden');
        ttLoading.classList.remove('hidden');
        ttSearchBtn.disabled = true;

        await new Promise(r => setTimeout(r, 900));

        ttLoading.classList.add('hidden');
        ttResults.classList.remove('hidden');
        ttSearchBtn.disabled = false;

        ttResults.innerHTML = `
            <div class="profile-card">
                <div class="profile-header">
                    <div style="width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#E00000,#FF2525);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;">
                        ${username.charAt(0).toUpperCase()}
                    </div>
                    <div class="profile-info">
                        <h2>${username}</h2>
                        <div class="username">@${username}</div>
                        <div class="bio">Información pública no disponible desde este entorno.</div>
                    </div>
                </div>

                <div class="notice-box">
                    <strong>Limitación técnica</strong><br><br>
                    TikTok tampoco ofrece una API pública gratuita usable desde GitHub Pages para consultas arbitrarias de perfiles.<br><br>
                    Para una implementación real se requiere backend + API oficial o servicio autorizado.
                    <br><br>
                    <a href="https://www.tiktok.com/@${username}" target="_blank" rel="noopener" class="btn-secondary">
                        Abrir perfil en TikTok
                    </a>
                </div>
            </div>
        `;

        showToast('Consulta realizada (limitación de API)', 'info');
    }

    ttSearchBtn.addEventListener('click', searchTikTok);
    ttUsername.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') searchTikTok();
    });

    // ========== SOCIAL SEARCH ==========
    const socialQuery = document.getElementById('socialQuery');
    const socialSearchBtn = document.getElementById('socialSearchBtn');
    const socialResults = document.getElementById('socialResults');
    const socialEmpty = document.getElementById('socialEmpty');
    const socialLoading = document.getElementById('socialLoading');

    async function socialSearch() {
        const query = socialQuery.value.trim();
        if (!query) {
            showToast('Introduce un término de búsqueda', 'error');
            return;
        }

        socialEmpty.classList.add('hidden');
        socialResults.classList.add('hidden');
        socialLoading.classList.remove('hidden');
        socialSearchBtn.disabled = true;

        await new Promise(r => setTimeout(r, 800));

        socialLoading.classList.add('hidden');
        socialResults.classList.remove('hidden');
        socialSearchBtn.disabled = false;

        const clean = query.replace(/^@/, '');

        socialResults.innerHTML = `
            <div class="profile-card">
                <h3 style="margin-bottom:20px;font-family:'Space Grotesk'">Resultados para "${query}"</h3>

                <div style="display:flex;flex-direction:column;gap:16px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px;background:var(--bg-secondary);border-radius:12px;border:1px solid var(--border);">
                        <div style="display:flex;align-items:center;gap:14px;">
                            <i data-lucide="instagram" style="color:var(--neon)"></i>
                            <div>
                                <div style="font-weight:600">Instagram</div>
                                <div style="font-size:0.85rem;color:var(--text-secondary)">@${clean}</div>
                            </div>
                        </div>
                        <a href="https://www.instagram.com/${clean}/" target="_blank" rel="noopener" class="btn-secondary">Ver perfil</a>
                    </div>

                    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px;background:var(--bg-secondary);border-radius:12px;border:1px solid var(--border);">
                        <div style="display:flex;align-items:center;gap:14px;">
                            <i data-lucide="music-2" style="color:var(--neon)"></i>
                            <div>
                                <div style="font-weight:600">TikTok</div>
                                <div style="font-size:0.85rem;color:var(--text-secondary)">@${clean}</div>
                            </div>
                        </div>
                        <a href="https://www.tiktok.com/@${clean}" target="_blank" rel="noopener" class="btn-secondary">Ver perfil</a>
                    </div>
                </div>

                <div class="notice-box" style="margin-top:20px">
                    Esta búsqueda genera enlaces directos a los perfiles. No se realiza scraping ni se almacenan datos.
                </div>
            </div>
        `;

        lucide.createIcons();
        showToast('Búsqueda completada', 'success');
    }

    socialSearchBtn.addEventListener('click', socialSearch);
    socialQuery.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') socialSearch();
    });
});
