// ===== SENA TIKTOK =====

const APIS = [
    'https://api.fikmydomainsz.xyz/download/tiktok?url=',
    'https://api.fikmydomainsz.xyz/download/tiktok-v2?url=',
    'https://api-faa.my.id/faa/tiktok?url='
];

// DOM
const urlInput = document.getElementById('urlInput');
const downloadBtn = document.getElementById('downloadBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorText = document.getElementById('errorText');
const result = document.getElementById('result');
const videoThumb = document.getElementById('videoThumb');
const videoTitle = document.getElementById('videoTitle');
const videoAuthor = document.getElementById('videoAuthor');
const videoLikes = document.getElementById('videoLikes');
const videoComments = document.getElementById('videoComments');
const downloadVideo = document.getElementById('downloadVideo');

// Contoh URL
document.querySelectorAll('.example').forEach(el => {
    el.addEventListener('click', () => {
        urlInput.value = el.dataset.url;
    });
});

// Download
downloadBtn.addEventListener('click', process);

// Enter
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') process();
});

async function process() {
    const url = urlInput.value.trim();
    
    if (!url) return showError('URL tidak boleh kosong');
    if (!url.includes('tiktok.com')) return showError('URL harus dari TikTok');
    
    hideError();
    hideResult();
    showLoading();
    
    for (let i = 0; i < APIS.length; i++) {
        try {
            const data = await tryAPI(APIS[i], url);
            if (data) {
                showResult(data);
                autoDownload(data);
                hideLoading();
                return;
            }
        } catch (e) {
            // lanjut
        }
    }
    
    hideLoading();
    showError('Layanan sibuk, coba lagi');
}

async function tryAPI(api, url) {
    const res = await fetch(api + encodeURIComponent(url));
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.status === true ? (data.result || data.data) : null;
}

function autoDownload(data) {
    const videoData = data.video || data;
    const videoUrl = videoData.video_url || videoData.video || videoData.play;
    if (videoUrl) {
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = `tiktok_${Date.now()}.mp4`;
        a.click();
    }
}

function showResult(data) {
    const v = data.video || data;
    
    videoThumb.src = v.thumbnail || v.cover || 'https://via.placeholder.com/100';
    videoTitle.textContent = v.title || v.desc || 'TikTok Video';
    videoAuthor.textContent = v.author || v.nickname || '@tiktok';
    videoLikes.textContent = formatNumber(v.likes || v.digg_count || 0);
    videoComments.textContent = formatNumber(v.comments || v.comment_count || 0);
    
    if (v.video_url || v.video || v.play) {
        downloadVideo.href = v.video_url || v.video || v.play;
    }
    
    result.style.display = 'block';
}

function formatNumber(n) {
    if (!n) return '0';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return n.toString();
}

function showLoading() {
    loading.style.display = 'block';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(msg) {
    errorText.textContent = msg;
    error.style.display = 'flex';
}

function hideError() {
    error.style.display = 'none';
}

function hideResult() {
    result.style.display = 'none';
}

hideError();
hideResult();