document.addEventListener('DOMContentLoaded', () => {
    // Simulasi Database Game yang lebih banyak agar efek scroll terlihat
    const steamGamesDatabase = [
        { title: "Cyberpunk 2077", genre: "RPG / Open World", fps: "60 FPS", img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/e9047d8ec47ae3d94bb8b464fb0fc9e9972b4ac7/header.jpg?t=1784714077" },
        { title: "Elden Ring", genre: "Action / Souls-like", fps: "60 FPS", img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg?t=1790290043" },
        { title: "Forza Horizon 5", genre: "Racing / Sports", fps: "120 FPS", img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1551360/header.jpg?t=1725556275" },
        { title: "Witcher 3: Wild Hunt", genre: "RPG / Story", fps: "60 FPS", img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg?t=1740478142" },
        { title: "Grand Theft Auto V", genre: "Action / Open World", fps: "60 FPS", img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg?t=1722882170" },
        { title: "Red Dead Redemption 2", genre: "Action / Adventure", fps: "60 FPS", img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg?t=1721241074" },
        { title: "Hades II", genre: "Roguelike / Action", fps: "144 FPS", img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1145350/header.jpg?t=1738774780" },
        { title: "Monster Hunter World", genre: "Action / Co-op", fps: "60 FPS", img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/582010/header.jpg?t=1687313835" },
        { title: "Baldur's Gate 3", genre: "RPG / Strategy", fps: "60 FPS", img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg?t=1725556336" },
        { title: "Hollow Knight", genre: "Metroidvania / Indie", fps: "120 FPS", img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg?t=1667004455" },
        { title: "Terraria", genre: "Sandbox / Survival", fps: "144 FPS", img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg?t=1719582121" },
        { title: "Stardew Valley", genre: "Simulation / RPG", fps: "120 FPS", img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg?t=1711030043" }
    ];

    const gamesGrid = document.getElementById('gamesGrid');
    const searchInput = document.getElementById('gameSearch');
    const loadingIndicator = document.getElementById('loadingIndicator');

    let displayedCount = 0;
    const batchSize = 4; // Jumlah game yang dimuat setiap kali scroll mencapai bawah
    let isSearching = false;

    // Fungsi Render Game ke Grid
    function renderGames(gamesArray, append = false) {
        if (!append) {
            gamesGrid.innerHTML = '';
        }

        gamesArray.forEach(game => {
            const card = document.createElement('div');
            card.classList.add('game-card');
            card.setAttribute('data-title', game.title);
            card.innerHTML = `
                <div class="card-img" style="background-image: url('${game.img}');">
                    <span class="fps-tag">${game.fps}</span>
                </div>
                <div class="card-body">
                    <h3>${game.title}</h3>
                    <p>${game.genre}</p>
                    <button class="btn-play"><i class="fa-solid fa-gamepad"></i> Play Now</button>
                </div>
            `;
            gamesGrid.appendChild(card);
        });

        initPlayButtons();
    }

    // Fungsi Tambah Batch Game Berikutnya
    function loadMoreGames() {
        if (isSearching) return; // Jangan load tambahan saat mode pencarian aktif

        if (displayedCount >= steamGamesDatabase.length) {
            loadingIndicator.querySelector('p').textContent = "Semua game telah dimuat.";
            loadingIndicator.querySelector('.spinner-small').style.display = 'none';
            return;
        }

        setTimeout(() => {
            const nextBatch = steamGamesDatabase.slice(displayedCount, displayedCount + batchSize);
            renderGames(nextBatch, true);
            displayedCount += batchSize;
        }, 600); // Simulasi jeda loading singkat
    }

    // Menggunakan IntersectionObserver (Lebih akurat mendeteksi scroll sampai bawah)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadMoreGames();
            }
        });
    }, {
        root: null,
        rootMargin: '100px', // Mulai load 100px sebelum elemen indikator terlihat
        threshold: 0.1
    });

    observer.observe(loadingIndicator);

    // Fitur Search / Pencarian Real-time
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            isSearching = false;
            gamesGrid.innerHTML = '';
            displayedCount = 0;
            loadMoreGames(); // Reset ke awal
            loadingIndicator.style.display = 'flex';
        } else {
            isSearching = true;
            loadingIndicator.style.display = 'none'; // Sembunyikan indikator saat mencari
            const filtered = steamGamesDatabase.filter(game => 
                game.title.toLowerCase().includes(searchTerm) || 
                game.genre.toLowerCase().includes(searchTerm)
            );
            renderGames(filtered, false);
        }
    });

    // Simulasi Launching Game (Modal Play)
    const streamModal = document.getElementById('streamModal');
    const closeModal = document.querySelector('.close-modal');
    const loadingStatus = document.getElementById('loadingStatus');

    function initPlayButtons() {
        document.querySelectorAll('.btn-play, .hero-cta .btn-primary').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true)); // Hindari duplikasi event
        });

        document.querySelectorAll('.btn-play, .hero-cta .btn-primary').forEach(btn => {
            btn.addEventListener('click', () => {
                streamModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                setTimeout(() => {
                    loadingStatus.textContent = "Mengalokasikan GPU Rig (RTX 4080)...";
                }, 1500);

                setTimeout(() => {
                    loadingStatus.textContent = "Sinkronisasi Cloud Save data...";
                }, 3000);

                setTimeout(() => {
                    loadingStatus.innerHTML = "<span style='color: #45f3ff;'>Ready! Memulai Game...</span>";
                }, 4500);
            });
        });
    }

    closeModal.addEventListener('click', () => {
        streamModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        loadingStatus.textContent = "Mengoptimalkan Latensi (12ms)";
    });

    window.addEventListener('click', (e) => {
        if (e.target === streamModal) {
            streamModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            loadingStatus.textContent = "Mengoptimalkan Latensi (12ms)";
        }
    });
});