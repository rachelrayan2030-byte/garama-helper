document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // ========== NAVIGATION ==========
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
        sidebar.classList.remove('open');
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(item.dataset.section);
        });
    });

    toolCards.forEach(card => {
        card.addEventListener('click', () => showSection(card.dataset.goto));
    });

    menuToggle?.addEventListener('click', () => sidebar.classList.toggle('open'));

    // ========== TOAST ==========
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

    // ========== HELPERS ==========
    function isValidUsername(u) {
        return /^[a-zA-Z0-9._]{1,30}$/.test(u);
    }

    function parseSocialLink(url) {
        try {
            const u = new URL(url.trim());
            const host = u.hostname.replace('www.', '');
            const path = u.pathname.replace(/\/$/, '');

            // Instagram
            if (host.includes('instagram.com')) {
                if (path.match(/^\/p\//) || path.match(/^\/reel\//) || path.match(/^\/tv\//)) {
                    const shortcode = path.split('/')[2];
                    return { platform: 'instagram', type: path.includes('/reel/') ? 'reel' : 'post', shortcode, url };
                }
                if (path.match(/^\/stories\//)) {
                    return { platform: 'instagram', type: 'story', url };
                }
                const username = path.split('/').filter(Boolean)[0];
                if (username && !['p', 'reel', 'tv', 'stories', 'explore'].includes(username)) {
                    return { platform: 'instagram', type: 'profile', username, url };
                }
            }

            // TikTok
            if (host.includes('tiktok.com')) {
                if (path.match(/^\/@[\w.-]+\/video\//)) {
                    const parts = path.split('/');
                    return { platform: 'tiktok', type: 'video', username: parts[1].replace('@', ''), videoId: parts[3], url };
                }
                if (path.startsWith('/@')) {
                    const username = path.split('/')[1].replace('@', '');
                    return { platform: 'tiktok', type: 'profile', username, url };
                }
            }

            return null;
        } catch {
            return null;
        }
    }

    // ========== INSTAGRAM LOOKUP ==========
    const igUsername = document.getElementById('igUsername');
    const igSearchBtn = document.getElementById('igSearchBtn');
    const igResults = document.getElementById('igResults');
    const igEmpty = document.getElementById('igEmpty');
    const igLoading = document.getElementById('igLoading');

    async function searchInstagram() {
        const username = igUsername.value.trim().replace(/^@/, '');
        if (!username) return showToast('Introduce un nombre de usuario', 'error');
        if (!isValidUsername(username)) return showToast('Formato de usuario no válido', 'error');

        igEmpty.classList.add('hidden');
        igResults.classList.add('hidden');
        igLoading.classList.remove('hidden');
        igSearchBtn.disabled = true;

        await new Promise(r => setTimeout(r, 700));

        igLoading.classList.add('hidden');
        igResults.classList.remove('hidden');
        igSearchBtn.disabled = false;

        igResults.innerHTML = `
            <div class="profile-card">
                <div class="profile-header">
                    <div style="width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#E00000,#FF2525);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;">${username.charAt(0).toUpperCase()}</div>
                    <div class="profile-info">
                        <h2>${username}</h2>
                        <div class="username">@${username}</div>
                        <div class="bio">Datos en tiempo real no disponibles sin API oficial.</div>
                    </div>
                </div>
                <div class="profile-actions" style="margin-bottom:20px">
                    <a href="https://www.instagram.com/${username}/" target="_blank" rel="noopener" class="btn-secondary">Abrir en Instagram</a>
                </div>
                <div class="notice-box">
                    <strong>Estado de la integración</strong><br><br>
                    La Instagram Graph API oficial solo permite consultar cuentas sobre las que tienes permisos (Business/Creator).
                    Esta herramienta está preparada para conectar con un backend (Cloudflare Workers) cuando dispongas de las credenciales oficiales.
                </div>
            </div>`;
        showToast('Perfil preparado', 'info');
    }

    igSearchBtn?.addEventListener('click', searchInstagram);
    igUsername?.addEventListener('keydown', e => e.key === 'Enter' && searchInstagram());

    // ========== TIKTOK LOOKUP ==========
    const ttUsername = document.getElementById('ttUsername');
    const ttSearchBtn = document.getElementById('ttSearchBtn');
    const ttResults = document.getElementById('ttResults');
    const ttEmpty = document.getElementById('ttEmpty');
    const ttLoading = document.getElementById('ttLoading');

    async function searchTikTok() {
        const username = ttUsername.value.trim().replace(/^@/, '');
        if (!username) return showToast('Introduce un nombre de usuario', 'error');
        if (!isValidUsername(username)) return showToast('Formato de usuario no válido', 'error');

        ttEmpty.classList.add('hidden');
        ttResults.classList.add('hidden');
        ttLoading.classList.remove('hidden');
        ttSearchBtn.disabled = true;

        await new Promise(r => setTimeout(r, 700));

        ttLoading.classList.add('hidden');
        ttResults.classList.remove('hidden');
        ttSearchBtn.disabled = false;

        ttResults.innerHTML = `
            <div class="profile-card">
                <div class="profile-header">
                    <div style="width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#E00000,#FF2525);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;">${username.charAt(0).toUpperCase()}</div>
                    <div class="profile-info">
                        <h2>${username}</h2>
                        <div class="username">@${username}</div>
                        <div class="bio">Datos en tiempo real no disponibles sin API oficial.</div>
                    </div>
                </div>
                <div class="profile-actions" style="margin-bottom:20px">
                    <a href="https://www.tiktok.com/@${username}" target="_blank" rel="noopener" class="btn-secondary">Abrir en TikTok</a>
                </div>
                <div class="notice-box">
                    <strong>Estado de la integración</strong><br><br>
                    La Display API y Research API de TikTok requieren autorización. Esta herramienta está lista para conectar con Cloudflare Workers + credenciales oficiales.
                </div>
            </div>`;
        showToast('Perfil preparado', 'info');
    }

    ttSearchBtn?.addEventListener('click', searchTikTok);
    ttUsername?.addEventListener('keydown', e => e.key === 'Enter' && searchTikTok());

    // ========== IG PROFILE ANALYZER ==========
    document.getElementById('igAnalyzerBtn')?.addEventListener('click', () => {
        const user = document.getElementById('igAnalyzerUser').value.trim().replace(/^@/, '');
        if (!user) return showToast('Introduce un usuario', 'error');

        const results = document.getElementById('igAnalyzerResults');
        const empty = document.getElementById('igAnalyzerEmpty');
        empty.classList.add('hidden');
        results.classList.remove('hidden');

        results.innerHTML = `
            <div class="profile-card">
                <h3 style="margin-bottom:16px;font-family:'Space Grotesk'">Análisis de @${user}</h3>
                <div class="notice-box">
                    <strong>Modo preparado para API oficial</strong><br><br>
                    Esta herramienta está diseñada para analizar perfiles sobre los que tengas autorización mediante la Instagram Graph API (Business Discovery o cuentas propias).<br><br>
                    <strong>Datos que podrá mostrar cuando se conecte:</strong>
                    <ul style="margin:12px 0 0 20px;line-height:1.8">
                        <li>Biografía y nombre público</li>
                        <li>Contadores de seguidores / seguidos / publicaciones</li>
                        <li>Últimas publicaciones y métricas básicas</li>
                        <li>Estado de verificación</li>
                    </ul><br>
                    <a href="https://www.instagram.com/${user}/" target="_blank" rel="noopener" class="btn-secondary">Abrir perfil</a>
                </div>
            </div>`;
        showToast('Analizador listo', 'info');
    });

    // ========== TT PROFILE ANALYZER ==========
    document.getElementById('ttAnalyzerBtn')?.addEventListener('click', () => {
        const user = document.getElementById('ttAnalyzerUser').value.trim().replace(/^@/, '');
        if (!user) return showToast('Introduce un usuario', 'error');

        const results = document.getElementById('ttAnalyzerResults');
        const empty = document.getElementById('ttAnalyzerEmpty');
        empty.classList.add('hidden');
        results.classList.remove('hidden');

        results.innerHTML = `
            <div class="profile-card">
                <h3 style="margin-bottom:16px;font-family:'Space Grotesk'">Análisis de @${user}</h3>
                <div class="notice-box">
                    <strong>Modo preparado para API oficial</strong><br><br>
                    Esta herramienta está lista para la Display API / Research API de TikTok.<br><br>
                    <strong>Datos previstos cuando se active:</strong>
                    <ul style="margin:12px 0 0 20px;line-height:1.8">
                        <li>Información básica del perfil</li>
                        <li>Contadores públicos (seguidores, likes, vídeos)</li>
                        <li>Listado de vídeos públicos recientes</li>
                    </ul><br>
                    <a href="https://www.tiktok.com/@${user}" target="_blank" rel="noopener" class="btn-secondary">Abrir perfil</a>
                </div>
            </div>`;
        showToast('Analizador listo', 'info');
    });

    // ========== USERNAME CHECKER ==========
    document.getElementById('usernameBtn')?.addEventListener('click', () => {
        const raw = document.getElementById('usernameInput').value.trim().replace(/^@/, '');
        if (!raw) return showToast('Introduce un nombre de usuario', 'error');

        const results = document.getElementById('usernameResults');
        const empty = document.getElementById('usernameEmpty');
        empty.classList.add('hidden');
        results.classList.remove('hidden');

        const valid = isValidUsername(raw);
        const lengthOk = raw.length >= 1 && raw.length <= 30;

        results.innerHTML = `
            <div class="profile-card">
                <h3 style="margin-bottom:20px;font-family:'Space Grotesk'">Resultado para "${raw}"</h3>

                <div style="display:grid;gap:12px;margin-bottom:24px">
                    <div style="display:flex;justify-content:space-between;padding:14px 18px;background:var(--bg-secondary);border-radius:12px;border:1px solid var(--border)">
                        <span>Formato válido</span>
                        <span style="color:${valid ? '#00c853' : 'var(--neon)'};font-weight:600">${valid ? 'Sí' : 'No'}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:14px 18px;background:var(--bg-secondary);border-radius:12px;border:1px solid var(--border)">
                        <span>Longitud</span>
                        <span>${raw.length} caracteres ${lengthOk ? '✓' : '✗'}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:14px 18px;background:var(--bg-secondary);border-radius:12px;border:1px solid var(--border)">
                        <span>Caracteres permitidos</span>
                        <span style="color:${valid ? '#00c853' : 'var(--neon)'}">${valid ? 'Correctos' : 'Contiene caracteres no válidos'}</span>
                    </div>
                </div>

                <div style="display:flex;flex-direction:column;gap:12px">
                    <a href="https://www.instagram.com/${raw}/" target="_blank" rel="noopener" class="btn-secondary" style="justify-content:center">
                        <i data-lucide="instagram"></i> Comprobar en Instagram
                    </a>
                    <a href="https://www.tiktok.com/@${raw}" target="_blank" rel="noopener" class="btn-secondary" style="justify-content:center">
                        <i data-lucide="music-2"></i> Comprobar en TikTok
                    </a>
                </div>

                <div class="notice-box" style="margin-top:20px">
                    Esta herramienta valida el formato del username y genera enlaces directos. La disponibilidad real solo se puede confirmar abriendo los perfiles (no se realiza scraping).
                </div>
            </div>`;
        lucide.createIcons();
        showToast('Comprobación completada', 'success');
    });

    // ========== LINK ANALYZER ==========
    document.getElementById('linkBtn')?.addEventListener('click', () => {
        const input = document.getElementById('linkInput').value.trim();
        if (!input) return showToast('Pega un enlace', 'error');

        const parsed = parseSocialLink(input);
        const results = document.getElementById('linkResults');
        const empty = document.getElementById('linkEmpty');
        empty.classList.add('hidden');
        results.classList.remove('hidden');

        if (!parsed) {
            results.innerHTML = `
                <div class="profile-card">
                    <div class="notice-box">
                        <strong>Enlace no reconocido</strong><br><br>
                        Solo se admiten enlaces de Instagram y TikTok (perfiles, posts, reels o vídeos).
                    </div>
                </div>`;
            return showToast('Enlace no válido', 'error');
        }

        let details = '';
        if (parsed.type === 'profile') {
            details = `
                <div class="stat-box"><div class="number">Perfil</div><div class="label">Tipo</div></div>
                <div class="stat-box"><div class="number">@${parsed.username}</div><div class="label">Usuario</div></div>
                <div class="stat-box"><div class="number">${parsed.platform === 'instagram' ? 'Instagram' : 'TikTok'}</div><div class="label">Plataforma</div></div>`;
        } else if (parsed.type === 'post' || parsed.type === 'reel') {
            details = `
                <div class="stat-box"><div class="number">${parsed.type === 'reel' ? 'Reel' : 'Post'}</div><div class="label">Tipo</div></div>
                <div class="stat-box"><div class="number">${parsed.shortcode || '—'}</div><div class="label">Shortcode</div></div>
                <div class="stat-box"><div class="number">Instagram</div><div class="label">Plataforma</div></div>`;
        } else if (parsed.type === 'video') {
            details = `
                <div class="stat-box"><div class="number">Vídeo</div><div class="label">Tipo</div></div>
                <div class="stat-box"><div class="number">@${parsed.username}</div><div class="label">Usuario</div></div>
                <div class="stat-box"><div class="number">TikTok</div><div class="label">Plataforma</div></div>`;
        } else {
            details = `
                <div class="stat-box"><div class="number">${parsed.type}</div><div class="label">Tipo</div></div>
                <div class="stat-box"><div class="number">${parsed.platform}</div><div class="label">Plataforma</div></div>`;
        }

        results.innerHTML = `
            <div class="profile-card">
                <h3 style="margin-bottom:20px;font-family:'Space Grotesk'">Análisis del enlace</h3>
                <div class="profile-stats">${details}</div>
                <div class="profile-actions">
                    <a href="${parsed.url}" target="_blank" rel="noopener" class="btn-secondary">Abrir enlace original</a>
                    ${parsed.username ? `<a href="${parsed.platform === 'instagram' ? 'https://www.instagram.com/' + parsed.username : 'https://www.tiktok.com/@' + parsed.username}" target="_blank" rel="noopener" class="btn-secondary">Ver perfil</a>` : ''}
                </div>
                <div class="notice-box" style="margin-top:20px">
                    Análisis realizado localmente en tu navegador. No se envía información a ningún servidor.
                </div>
            </div>`;
        showToast('Enlace analizado', 'success');
    });

    // ========== SOCIAL SEARCH ==========
    const socialQuery = document.getElementById('socialQuery');
    const socialSearchBtn = document.getElementById('socialSearchBtn');
    const socialResults = document.getElementById('socialResults');
    const socialEmpty = document.getElementById('socialEmpty');
    const socialLoading = document.getElementById('socialLoading');

    async function socialSearch() {
        const query = socialQuery.value.trim();
        if (!query) return showToast('Introduce un término de búsqueda', 'error');

        socialEmpty.classList.add('hidden');
        socialResults.classList.add('hidden');
        socialLoading.classList.remove('hidden');
        socialSearchBtn.disabled = true;

        await new Promise(r => setTimeout(r, 600));

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
                    Genera enlaces directos a perfiles públicos. No se realiza scraping ni se almacenan datos.
                </div>
            </div>`;
        lucide.createIcons();
        showToast('Búsqueda completada', 'success');
    }

    socialSearchBtn?.addEventListener('click', socialSearch);
    socialQuery?.addEventListener('keydown', e => e.key === 'Enter' && socialSearch());
});
