/* ========================================================= */
/* --- FILE: script.js --- */
/* --- LOGIKA MULTIPLE UPLOAD, AUTO COMPRESS, BACKUP/RESTORE --- */
/* ========================================================= */

// Storage utama dengan penanganan struktur Array gambar (Multiple Upload)
let storageBukti = JSON.parse(localStorage.getItem('db_bukti_v3')) || {};

// FUNGSI CERDAS: Mengkompres gambar agar Storage/Memory tidak penuh (Max Width 800px)
function compressImage(base64Str, maxWidth = 800) {
    return new Promise((resolve) => {
        let img = new Image();
        img.src = base64Str;
        img.onload = () => {
            let canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxWidth) {
                    width *= maxWidth / height;
                    height = maxWidth;
                }
            }
            canvas.width = width;
            canvas.height = height;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.6)); // Kualitas 60% cerdas
        };
    });
}

function pasangModulBuktiDinamis() {
    document.querySelectorAll('[data-id]').forEach(cell => {
        const uid = cell.getAttribute('data-id');
        if (!uid) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'bukti-container';
        wrapper.innerHTML = `
            <div style="margin-top: 6px;" class="no-print">
                <button type="button" class="btn-trigger-bukti" id="trig_${uid}" onclick="bukaTutupPanelBukti('${uid}')">
                    <i class="fas fa-paperclip"></i> Bukti Pendukung
                </button>
            </div>
            
            <div class="panel-bukti no-print" id="panel_${uid}">
                <div class="panel-grid">
                    <!-- Penambahan atribut 'multiple' agar bisa pilih banyak gambar sekaligus -->
                    <label class="upload-zone">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <span>Upload Foto</span>
                        <input type="file" accept="image/*" multiple onchange="prosesUnggahGambar(event, '${uid}')">
                    </label>
                    <div class="link-zone">
                        <input type="text" id="url_${uid}" placeholder="Atau Tempel Tautan Google Drive..." oninput="prosesKetikLink('${uid}')">
                    </div>
                </div>
                <div class="mode-selector">
                    <button type="button" class="m-btn active" id="m_img_${uid}" onclick="setOpsiCetak('${uid}', 'img')">Cetak Foto</button>
                    <button type="button" class="m-btn" id="m_link_${uid}" onclick="setOpsiCetak('${uid}', 'link')">Cetak Link</button>
                </div>
                
                <span id="wlnk_${uid}" class="w-link"></span>
                <div id="gallery_web_${uid}" class="gallery-web"></div>
            </div>
            
            <div class="print-render-container" id="p_render_${uid}"></div>
        `;
        cell.appendChild(wrapper);
    });
}

function bukaTutupPanelBukti(uid) {
    document.getElementById(`panel_${uid}`).classList.toggle('open');
}

function setOpsiCetak(uid, mode) {
    document.getElementById(`m_img_${uid}`).classList.remove('active');
    document.getElementById(`m_link_${uid}`).classList.remove('active');
    document.getElementById(`m_${mode}_${uid}`).classList.add('active');

    if(!storageBukti[uid]) storageBukti[uid] = { mode: 'img', images: [], link: '' };
    storageBukti[uid].mode = mode;

    sinkronisasiKertasCetak(uid);
    simpanKeLocalStorage();
}

async function prosesUnggahGambar(event, uid) {
    const files = event.target.files;
    if(!files.length) return;

    if(!storageBukti[uid]) storageBukti[uid] = { mode: 'img', images: [], link: '' };
    if(!storageBukti[uid].images) storageBukti[uid].images = []; // Standarisasi array

    for(let i=0; i<files.length; i++) {
        let file = files[i];
        let reader = new FileReader();
        reader.onload = async function(e) {
            try {
                // Gunakan auto compress untuk menghemat local storage
                let compressed = await compressImage(e.target.result);
                storageBukti[uid].images.push(compressed);
                
                // Render ulang setelah semua selesai di proses
                if(i === files.length - 1) {
                    renderGalleryWeb(uid);
                    sinkronisasiKertasCetak(uid);
                    simpanKeLocalStorage();
                }
            } catch(err) {
                alert("Memori browser penuh! Gunakan fitur Backup Data lalu bersihkan cache.");
            }
        };
        reader.readAsDataURL(file);
    }
}

function hapusGambar(uid, index) {
    if(storageBukti[uid] && storageBukti[uid].images) {
        storageBukti[uid].images.splice(index, 1);
        renderGalleryWeb(uid);
        sinkronisasiKertasCetak(uid);
        simpanKeLocalStorage();
    }
}

function renderGalleryWeb(uid) {
    const container = document.getElementById(`gallery_web_${uid}`);
    container.innerHTML = '';
    const trigBtn = document.getElementById(`trig_${uid}`);
    
    if(storageBukti[uid] && storageBukti[uid].images && storageBukti[uid].images.length > 0) {
        storageBukti[uid].images.forEach((b64, idx) => {
            container.innerHTML += `
                <div class="thumb-box">
                    <img src="${b64}">
                    <button type="button" class="btn-hapus-img" onclick="hapusGambar('${uid}', ${idx})"><i class="fas fa-times"></i></button>
                </div>
            `;
        });
        trigBtn.classList.add('has-data');
    } else {
        if(!storageBukti[uid].link) trigBtn.classList.remove('has-data');
    }
}

function prosesKetikLink(uid) {
    const valueLink = document.getElementById(`url_${uid}`).value;
    if(!storageBukti[uid]) storageBukti[uid] = { mode: 'img', images: [], link: '' };
    storageBukti[uid].link = valueLink;

    const previewLink = document.getElementById(`wlnk_${uid}`);
    if(valueLink.trim().length > 0) {
        previewLink.innerText = "Link Terpasang: " + valueLink;
        previewLink.style.display = 'block';
        document.getElementById(`trig_${uid}`).classList.add('has-data');
    } else {
        previewLink.style.display = 'none';
        if(!storageBukti[uid].images || storageBukti[uid].images.length === 0) {
            document.getElementById(`trig_${uid}`).classList.remove('has-data');
        }
    }

    sinkronisasiKertasCetak(uid);
    simpanKeLocalStorage();
}

function sinkronisasiKertasCetak(uid) {
    const data = storageBukti[uid];
    const renderBox = document.getElementById(`p_render_${uid}`);
    renderBox.innerHTML = '';
    
    if(!data || ((!data.images || data.images.length === 0) && !data.link)) {
        renderBox.classList.remove('active-proof');
        return;
    }

    renderBox.classList.add('active-proof');
    const opsiCetak = data.mode || 'img';

    let htmlContent = "";

    if(opsiCetak === 'img') {
        if(data.images && data.images.length > 0) {
            htmlContent += `<span style="font-size:8.5pt; font-weight:bold; font-style:italic; color:#444;">Dokumen Bukti Lampiran:</span>`;
            htmlContent += `<div class="gallery-print">`;
            data.images.forEach(img => { htmlContent += `<img src="${img}" class="p-img">`; });
            htmlContent += `</div>`;
        } else if(data.link) {
            htmlContent = `<span style="font-size:8.5pt; font-weight:bold; font-style:italic; color:#444;">Tautan Lampiran (Google Drive):</span><br><span class="p-link">${data.link}</span>`;
        }
    } else { // Opsi Link
        if(data.link) {
            htmlContent = `<span style="font-size:8.5pt; font-weight:bold; font-style:italic; color:#444;">Tautan Lampiran (Google Drive):</span><br><span class="p-link">${data.link}</span>`;
        } else if(data.images && data.images.length > 0) {
            htmlContent += `<span style="font-size:8.5pt; font-weight:bold; font-style:italic; color:#444;">Dokumen Bukti Lampiran:</span>`;
            htmlContent += `<div class="gallery-print">`;
            data.images.forEach(img => { htmlContent += `<img src="${img}" class="p-img">`; });
            htmlContent += `</div>`;
        }
    }
    renderBox.innerHTML = htmlContent;
}

// --- LOGIKA BACKUP & RESTORE CERDAS ---

function backupData() {
    // Kumpulkan isi localStorage
    const dataJSON = JSON.stringify(localStorage);
    const blob = new Blob([dataJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Buat tag link download fiktif
    const a = document.createElement('a');
    const tgl = document.getElementById('meta_bulan').value + '_' + document.getElementById('meta_tahun').value;
    a.href = url;
    a.download = `Backup_Laporan_Luwu_${tgl}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function triggerRestore() {
    document.getElementById('file_restore').click();
}

function restoreData(event) {
    const file = event.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.clear();
            for(let key in data) {
                localStorage.setItem(key, data[key]);
            }
            alert("Berhasil direstore! Halaman akan dimuat ulang untuk menampilkan data.");
            window.location.reload();
        } catch(err) {
            alert("Gagal restore. File JSON tidak valid atau rusak!");
        }
    };
    reader.readAsText(file);
}

// --- FUNGSI STANDAR FORM ---

const semuaFormInput = document.querySelectorAll('input:not([type="file"]), textarea, select');

function hitungAnggaran() {
    const ids = ['val_10a', 'val_10b', 'val_10c', 'val_10d', 'val_10e', 'val_10f'];
    let total = 0;
    ids.forEach(id => {
        let angka = parseFloat(document.getElementById(id).value) || 0;
        total += angka;
    });
    document.getElementById('lbl_total_10').innerText = total.toLocaleString('id-ID');
}

function simpanKeLocalStorage() {
    semuaFormInput.forEach(el => {
        if(el.type === 'radio' || el.type === 'checkbox') {
            if(el.checked) localStorage.setItem(el.id || el.name + '_' + el.value, true);
            else localStorage.removeItem(el.id || el.name + '_' + el.value);
        } else {
            localStorage.setItem(el.id, el.value);
        }
    });
    localStorage.setItem('db_bukti_v3', JSON.stringify(storageBukti));
    
    const bln = document.getElementById('meta_bulan').value;
    const thn = document.getElementById('meta_tahun').value;
    document.getElementById('lbl_print_periode').innerText = bln.toUpperCase() + " " + thn;
}

function muatDataLocalStorage() {
    semuaFormInput.forEach(el => {
        if(el.type === 'radio' || el.type === 'checkbox') {
            if(localStorage.getItem(el.id || el.name + '_' + el.value)) el.checked = true;
        } else {
            const savedVal = localStorage.getItem(el.id);
            if(savedVal) el.value = savedVal;
        }
    });

    for(let uid in storageBukti) {
        const data = storageBukti[uid];
        if(data.link) {
            document.getElementById(`url_${uid}`).value = data.link;
            document.getElementById(`wlnk_${uid}`).innerText = "Link Terpasang: " + data.link;
            document.getElementById(`wlnk_${uid}`).style.display = 'block';
        }
        if(data.mode) {
            document.getElementById(`m_img_${uid}`).classList.remove('active');
            document.getElementById(`m_link_${uid}`).classList.remove('active');
            const targetBtn = document.getElementById(`m_${data.mode}_${uid}`);
            if(targetBtn) targetBtn.classList.add('active');
        }
        renderGalleryWeb(uid);
        sinkronisasiKertasCetak(uid);
    }
    
    hitungAnggaran();
    document.getElementById('lbl_print_periode').innerText = document.getElementById('meta_bulan').value.toUpperCase() + " " + document.getElementById('meta_tahun').value;
}

function resetFormulir() {
    if(confirm("Apakah Bos yakin ingin mereset formulir laporan? Pastikan sudah melakukan 'Backup Data' terlebih dahulu!")) {
        localStorage.clear();
        window.location.reload();
    }
}

// Fungsi Penyesuaian Nama & NIP Otomatis dari Dropdown
        function gantiPejabatTtd() {
    const pilihan = document.getElementById('pilih_pejabat').value;
    const lblJabatan = document.getElementById('lbl_ttd_jabatan');
    const txtNama = document.getElementById('ttd_nama');
    const txtNip = document.getElementById('ttd_nip');

    if (pilihan === 'kadis') {
        lblJabatan.innerHTML = "Kepala Dinas Penanaman Modal dan<br>Pelayanan Terpadu Satu Pintu";
        txtNama.value = "Drs. MUHAMMAD RUDI, M.Si";
        txtNip.value = "NIP.19740411 199302 1 002";
    } else if (pilihan === 'plh') {
        lblJabatan.innerHTML = "Plh. Kepala Dinas Penanaman Modal dan<br>Pelayanan Terpadu Satu Pintu";
        txtNama.value = "KASNAR, SE. M.Si";
        txtNip.value = "NIP.19700405 200212 1 007";
    }
    
    if (typeof simpanKeLocalStorage === "function") {
        simpanKeLocalStorage();
    }
}

window.onload = () => {
    pasangModulBuktiDinamis();
    muatDataLocalStorage();

    semuaFormInput.forEach(el => {
        el.addEventListener('input', simpanKeLocalStorage);
        el.addEventListener('change', simpanKeLocalStorage);
    });
};
