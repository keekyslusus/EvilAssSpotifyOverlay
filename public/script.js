const widgetContainer = document.getElementById('widget-container');
let currentTrackId = null;
let isWidgetVisible = false;

async function getNowPlaying() {
    try {
        const response = await fetch('/api/now-playing');

        if (response.status === 204) {
            if (isWidgetVisible) {
                clearWidget();
            }
            return;
        }

        if (response.status === 401) {
            showLoginMessage();
            return;
        }

        const track = await response.json();
        handleTrackUpdate(track);

    } catch (error) {
        console.error("error fetching now playing:", error);
    }
}

function handleTrackUpdate(track) {
    if (!track.isPlaying) {
        if (isWidgetVisible) {
            clearWidget();
        }
        return;
    }

    if (track.id !== currentTrackId) {
        updateTrackInfo(track);
        currentTrackId = track.id;
        isWidgetVisible = true;
    } else if (!isWidgetVisible) {
        showWidget(track);
        isWidgetVisible = true;
    }
}

function updateTrackInfo(track) {
    const oldTrackInfo = widgetContainer.querySelector('.track-info');
    if (oldTrackInfo) {
        oldTrackInfo.classList.add('exit');
        oldTrackInfo.addEventListener('animationend', () => oldTrackInfo.remove(), { once: true });
    }
    showWidget(track);
}

function showWidget(track) {
    const newTrackInfo = document.createElement('div');
    newTrackInfo.classList.add('track-info', 'enter');
    const trackName = document.createElement('span');
    trackName.classList.add('track-name');
    trackName.textContent = track.name;
    const artistName = document.createElement('span');
    artistName.classList.add('artist-name');
    artistName.textContent = track.artist;
    newTrackInfo.appendChild(trackName);
    newTrackInfo.appendChild(artistName);
    newTrackInfo.addEventListener('animationend', () => {
        newTrackInfo.classList.remove('enter');
    }, { once: true });
    widgetContainer.appendChild(newTrackInfo);
}

function clearWidget() {
    const currentTrack = widgetContainer.querySelector('.track-info:not(.exit)');
    if (currentTrack) {
        currentTrack.offsetHeight;
        
        currentTrack.classList.add('exit');
        
        const cleanup = () => {
            currentTrack.remove();
            isWidgetVisible = false;
            currentTrackId = null;
        };
        
        currentTrack.addEventListener('animationend', cleanup, { once: true });
        
        setTimeout(() => {
            if (currentTrack.parentNode) {
                cleanup();
            }
        }, 800); // 0.7s animation + 0.1s buffer
        
    } else {
        isWidgetVisible = false;
        currentTrackId = null;
    }
}

function showLoginMessage() {
    widgetContainer.innerHTML = `
        <div class="track-info">
            <span class="track-name" style="font-size: 16px;">please login to spotify</span>
            <span class="artist-name" style="font-size: 12px;">open http://127.0.0.1:8888/login in a browser</span>
        </div>
    `;
}

document.body.classList.add('loaded');
getNowPlaying();
setInterval(getNowPlaying, 2000);