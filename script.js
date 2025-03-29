async function processDownload() {
  const videoUrl = document.getElementById('videoUrl').value.trim();
  
  if (!videoUrl) {
    showError('Silakan masukkan URL video TikTok!');
    return;
  }
  
  try {
    Swal.fire({
      title: 'Sedang memproses...',
      html: 'Tunggu sebentar ya!',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    const response = await axios.get(
      `https://api.allorigins.win/get?url=${encodeURIComponent(
                        `https://api.im-rerezz.xyz/api/dl/tiktok?url=${encodeURIComponent(videoUrl)}`
                    )}`
    );
    
    const data = JSON.parse(response.data.contents);
    
    if (data.status && data.data) {
      Swal.close();
      showResult(data.data);
    } else {
      throw new Error(data.message || 'URL tidak valid');
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: error.message || 'Terjadi kesalahan',
      confirmButtonColor: 'var(--accent)',
      background: 'var(--dark)',
      color: 'white'
    });
  }
}

function showResult(data) {
  const resultHTML = `
                <div class="video-container mb-4">
                    <video class="w-100" controls poster="${data.coverUrl}">
                        <source src="${data.videoUrl}" type="video/mp4">
                    </video>
                </div>

                <div class="row g-3">
                    <div class="col-md-6">
                        <button 
                            onclick="handleDownload('${data.videoUrl}', 'video')"
                            class="btn btn-glow w-100 py-3"
                        >
                            <i class="fas fa-download me-2"></i>Download Video
                        </button>
                    </div>
                    <div class="col-md-6">
                        <button 
                            onclick="handleDownload('${data.musicUrl}', 'music')"
                            class="btn btn-glow w-100 py-3"
                            style="background: linear-gradient(135deg, #3b82f6, #60a5fa)"
                        >
                            <i class="fas fa-music me-2"></i>Download Musik
                        </button>
                    </div>
                </div>

                <div class="d-flex justify-content-center gap-3 mt-4">
                    <div class="stats-badge text-white">
                        <i class="fas fa-user me-2"></i>${data.author?.nickname || 'Unknown'}
                    </div>
                    <div class="stats-badge text-white">
                        <i class="fas fa-heart me-2"></i>${data.stats?.diggCount || 0} Likes
                    </div>
                </div>
            `;
  
  document.getElementById('result').innerHTML = resultHTML;
}

async function handleDownload(url, type) {
  try {
    const { isConfirmed } = await Swal.fire({
      title: 'Konfirmasi Download',
      text: `Anda yakin ingin mendownload ${type === 'video' ? 'video' : 'musik'} ini?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--accent)',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Download!',
      background: 'var(--dark)',
      color: 'white'
    });
    
    if (isConfirmed) {
      const link = document.createElement('a');
      link.href = url;
      link.download = `tiktok_${Date.now()}.${type === 'video' ? 'mp4' : 'mp3'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      Swal.fire({
        icon: 'success',
        title: 'Download Dimulai!',
        text: 'File akan segera terdownload',
        timer: 2000,
        showConfirmButton: false,
        background: 'var(--dark)',
        color: 'white'
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Download Gagal',
      text: 'Silakan coba lagi',
      confirmButtonColor: 'var(--accent)',
      background: 'var(--dark)',
      color: 'white'
    });
  }
}

function showError(message) {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    confirmButtonColor: 'var(--accent)',
    background: 'var(--dark)',
    color: 'white'
  });
}