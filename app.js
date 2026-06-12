const isiAplikasi = `
    <input type="file" id="file_restore" accept=".json" style="display:none" onchange="restoreData(event)">

    <header class="topbar no-print">
        <div class="brand">
            <div class="logo-icon"><i class="fas fa-layer-group"></i></div>
            <div>
                <h1>Aplikasi Budaya Kerja ASN</h1>
                <p>Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu</p>
            </div>
        </div>
        <div class="toolbar-btn">
            <button class="btn btn-outline" onclick="backupData()" title="Simpan data saat ini ke file"><i class="fas fa-download"></i> Simpan Data</button>
            <button class="btn btn-outline" onclick="triggerRestore()" title="Muat data dari file backup"><i class="fas fa-upload"></i> Restore Data</button>
            <div class="divider"></div>
            <button class="btn btn-danger" onclick="resetFormulir()"><i class="fas fa-sync-alt"></i> Reset Baru</button>
            <button class="btn btn-primary" onclick="window.print()"><i class="fas fa-print"></i> Cetak PDF</button>
        </div>
    </header>

    <main class="container">
        <div class="paper">
            
            <div class="kop-surat">
                <h2>PEMERINTAH KABUPATEN LUWU</h2>
                <h3>LAPORAN PELAKSANAAN SURAT EDARAN MENDAGRI TENTANG TRANSFORMASI BUDAYA KERJA ASN</h3>
                <p>NOMOR : 800.1.5/3349/SJ</p>
            </div>

            <div class="meta-dashboard no-print">
                <div class="meta-field">
                    <label>SKPD / Unit Kerja (Terkunci)</label>
                    <div class="paten-skpd"><i class="fas fa-lock"></i> Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu</div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="meta-field">
                        <label>Pilih Bulan</label>
                        <select id="meta_bulan" class="input-select">
                            <option value="Januari">Januari</option><option value="Februari">Februari</option>
                            <option value="Maret">Maret</option><option value="April">April</option>
                            <option value="Mei">Mei</option><option value="Juni" selected>Juni</option>
                            <option value="Juli">Juli</option><option value="Agustus">Agustus</option>
                            <option value="September">September</option><option value="Oktober">Oktober</option>
                            <option value="November">November</option><option value="Desember">Desember</option>
                        </select>
                    </div>
                    <div class="meta-field">
                        <label>Pilih Tahun</label>
                        <select id="meta_tahun" class="input-select">
                            <option value="2024">2024</option><option value="2025">2025</option>
                            <option value="2026" selected>2026</option><option value="2027">2027</option>
                            <option value="2028">2028</option><option value="2029">2029</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="print-identitas-box" style="display: none;">
                <table style="width: 100%; border: none; border-collapse: collapse;">
                    <tr>
                        <td style="width: 160px; border: none; padding: 3px 0;">SKPD / Unit Kerja</td>
                        <td style="border: none; padding: 3px 0;">: <strong>Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu</strong></td>
                    </tr>
                    <tr>
                        <td style="border: none; padding: 3px 0;">Periode Laporan</td>
                        <td style="border: none; padding: 3px 0;">: <span id="lbl_print_periode"></span></td>
                    </tr>
                </table>
            </div>

            <table class="data-table">
                <thead>
                    <tr>
                        <th class="col-no">NO</th>
                        <th class="col-aspek">ASPEK PELAKSANAAN</th>
                        <th class="col-ket">KETERANGAN / REALISASI</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="row-group"><td class="col-no">1</td><td colspan="2">Penyesuaian Tugas Kedinasan</td></tr>
                    <tr><td class="col-no">a</td><td>Penerapan WFO dan WFH</td><td class="col-ket" data-id="1a"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_1a" value="Dilaksanakan"> Dilaksanakan</label><label class="ctrl-label"><input type="radio" name="val_1a" value="Belum dilaksanakan"> Belum dilaksanakan</label></div></td></tr>
                    <tr><td class="col-no">b</td><td>Pola WFH (1 hari kerja/minggu)</td><td class="col-ket" data-id="1b"><div class="checkbox-group"><label class="ctrl-label"><input type="checkbox" id="val_1b_jumat" value="Jumat"> Hari: Jumat</label><label class="ctrl-label">Lainnya: <input type="text" id="val_1b_lain" class="input-inline" style="width:130px;"></label></div></td></tr>
                    <tr><td class="col-no">c</td><td>Komposisi ASN WFH : WFO</td><td class="col-ket" data-id="1c"><input type="text" id="val_1c" class="input-inline" placeholder="Misal: 50% : 50%"></td></tr>

                    <tr class="row-group"><td class="col-no">2</td><td colspan="2">Penguatan Layanan Digital</td></tr>
                    <tr><td class="col-no">a</td><td>e-office</td><td class="col-ket" data-id="2a"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_2a" value="Sudah"> Sudah</label><label class="ctrl-label"><input type="radio" name="val_2a" value="Belum"> Belum</label></div></td></tr>
                    <tr><td class="col-no">b</td><td>Tanda tangan elektronik</td><td class="col-ket" data-id="2b"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_2b" value="Sudah"> Sudah</label><label class="ctrl-label"><input type="radio" name="val_2b" value="Belum"> Belum</label></div></td></tr>
                    <tr><td class="col-no">c</td><td>Absensi elektronik</td><td class="col-ket" data-id="2c"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_2c" value="Sudah"> Sudah</label><label class="ctrl-label"><input type="radio" name="val_2c" value="Belum"> Belum</label></div></td></tr>
                    <tr><td class="col-no">d</td><td>SIMPEG</td><td class="col-ket" data-id="2d"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_2d" value="Sudah"> Sudah</label><label class="ctrl-label"><input type="radio" name="val_2d" value="Belum"> Belum</label></div></td></tr>
                    <tr><td class="col-no">e</td><td>SPBE</td><td class="col-ket" data-id="2e"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_2e" value="Sudah"> Sudah</label><label class="ctrl-label"><input type="radio" name="val_2e" value="Belum"> Belum</label></div></td></tr>
                    <tr><td class="col-no">f</td><td>Infrastruktur pendukung</td><td class="col-ket" data-id="2f"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_2f" value="Memadai"> Memadai</label><label class="ctrl-label"><input type="radio" name="val_2f" value="Terbatas"> Terbatas</label></div></td></tr>

                    <tr class="row-group"><td class="col-no">3</td><td colspan="2">Pengendalian dan Pengawasan</td></tr>
                    <tr><td class="col-no">a</td><td>Skema mekanisme pengendalian</td><td class="col-ket" data-id="3a"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_3a" value="Ada"> Ada</label><label class="ctrl-label"><input type="radio" name="val_3a" value="Dalam penyusunan"> Dalam penyusunan</label></div></td></tr>
                    <tr><td class="col-no">b</td><td>Skema mekanisme pengawasan</td><td class="col-ket" data-id="3b"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_3b" value="Ada"> Ada</label><label class="ctrl-label"><input type="radio" name="val_3b" value="Dalam penyusunan"> Dalam penyusunan</label></div></td></tr>

                    <tr class="row-group"><td class="col-no">4</td><td colspan="2">Unit Pelayanan Publik</td></tr>
                    <tr><td class="col-no">a</td><td>Unit pelayanan langsung tetap WFO</td><td class="col-ket" data-id="4a"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_4a" value="Ya"> Ya</label><label class="ctrl-label"><input type="radio" name="val_4a" value="Tidak"> Tidak</label></div></td></tr>
                    <tr><td class="col-no">b</td><td>Unit pendukung WFH selektif</td><td class="col-ket" data-id="4b"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_4b" value="Ya"> Ya</label><label class="ctrl-label"><input type="radio" name="val_4b" value="Tidak"> Tidak</label></div></td></tr>
                    <tr><td class="col-no">c</td><td>Target kinerja ASN tercapai</td><td class="col-ket" data-id="4c"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_4c" value="Tercapai"> Tercapai</label><label class="ctrl-label"><input type="radio" name="val_4c" value="Tidak tercapai"> Tidak tercapai</label></div></td></tr>
                    <tr><td class="col-no">d</td><td>Kualitas pelayanan publik</td><td class="col-ket" data-id="4d"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_4d" value="Meningkat"> Meningkat</label><label class="ctrl-label"><input type="radio" name="val_4d" value="Tetap"> Tetap</label><label class="ctrl-label"><input type="radio" name="val_4d" value="Menurun"> Menurun</label></div></td></tr>

                    <tr class="row-group"><td class="col-no">5</td><td colspan="2">Rapat, Bimtek, Seminar, dll</td></tr>
                    <tr><td class="col-no">a</td><td>Dilaksanakan secara hybrid/daring</td><td class="col-ket" data-id="5a"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_5a" value="Ya"> Ya</label><label class="ctrl-label"><input type="radio" name="val_5a" value="Tidak"> Tidak</label></div></td></tr>
                    <tr><td class="col-no">b</td><td>Pemanfaatan TIK</td><td class="col-ket" data-id="5b"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_5b" value="Maksimal"> Maksimal</label><label class="ctrl-label"><input type="radio" name="val_5b" value="Terbatas"> Terbatas</label></div></td></tr>

                    <tr class="row-group"><td class="col-no">6</td><td colspan="2">Pembatasan Perjalanan Dinas</td></tr>
                    <tr><td class="col-no">a</td><td>Perjalanan dinas dalam negeri</td><td class="col-ket" data-id="6a">Target: 50% &nbsp;|&nbsp; Realisasi: <input type="text" id="val_6a" class="input-inline" style="width:60px;"> %</td></tr>
                    <tr><td class="col-no">b</td><td>Perjalanan dinas luar negeri</td><td class="col-ket" data-id="6b">Target: 50% &nbsp;|&nbsp; Realisasi: <input type="text" id="val_6b" class="input-inline" style="width:60px;"> %</td></tr>
                    <tr><td class="col-no">c</td><td>Pengurangan frekuensi</td><td class="col-ket" data-id="6c"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_6c" value="Ya"> Ya</label><label class="ctrl-label"><input type="radio" name="val_6c" value="Tidak"> Tidak</label></div></td></tr>
                    <tr><td class="col-no">d</td><td>Pengurangan jumlah rombongan</td><td class="col-ket" data-id="6d"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_6d" value="Ya"> Ya</label><label class="ctrl-label"><input type="radio" name="val_6d" value="Tidak"> Tidak</label></div></td></tr>

                    <tr class="row-group"><td class="col-no">7</td><td colspan="2">Penggunaan Kendaraan Dinas</td></tr>
                    <tr><td class="col-no">a</td><td>Pembatasan kendaraan dinas</td><td class="col-ket" data-id="7a">Target: 50% &nbsp;|&nbsp; Realisasi: <input type="text" id="val_7a" class="input-inline" style="width:60px;"> %</td></tr>
                    <tr><td class="col-no">b</td><td>Penggunaan kendaraan listrik</td><td class="col-ket" data-id="7b"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_7b" value="Ya"> Ya</label><label class="ctrl-label"><input type="radio" name="val_7b" value="Tidak"> Tidak</label></div></td></tr>
                    <tr><td class="col-no">c</td><td>Penggunaan transportasi umum</td><td class="col-ket" data-id="7c"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_7c" value="Ya"> Ya</label><label class="ctrl-label"><input type="radio" name="val_7c" value="Tidak"> Tidak</label></div></td></tr>
                    <tr><td class="col-no">d</td><td>Penggunaan sepeda/transportasi non-fosil</td><td class="col-ket" data-id="7d"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_7d" value="Ya"> Ya</label><label class="ctrl-label"><input type="radio" name="val_7d" value="Tidak"> Tidak</label></div></td></tr>

                    <tr class="row-group"><td class="col-no">8</td><td colspan="2">Efisiensi Energi di Lingkungan Kerja</td></tr>
                    <tr><td class="col-no">a</td><td>ASN WFH mematikan perangkat elektronik</td><td class="col-ket" data-id="8a"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_8a" value="Dipatuhi"> Dipatuhi</label><label class="ctrl-label"><input type="radio" name="val_8a" value="Belum optimal"> Belum optimal</label></div></td></tr>
                    <tr><td class="col-no">b</td><td>Kondisi ruangan kantor aman</td><td class="col-ket" data-id="8b"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_8b" value="Ya"> Ya</label><label class="ctrl-label"><input type="radio" name="val_8b" value="Tidak"> Tidak</label></div></td></tr>

                    <tr class="row-group"><td class="col-no">9</td><td colspan="2">Pengecualian WFH (Tetap WFO) 50%:50%</td></tr>
                    <tr><td class="col-no">-</td><td>Sesuai daftar ketentuan SE Mendagri</td><td class="col-ket" data-id="9"><input type="text" id="val_9" class="input-inline" style="width: 100%;" placeholder="Apakah dilaksankan atau tidak dilaksanakan..."></td></tr>

                    <tr class="row-group"><td class="col-no">10</td><td colspan="2">Penghitungan Penghematan Anggaran</td></tr>
                    <tr>
                        <td class="col-no">-</td>
                        <td colspan="2" style="padding: 0 14px;">
                            <table class="sub-table">
                                <tr><td style="width: 44%;">a. Penghematan listrik</td><td data-id="10a">Rp. <input type="text" id="val_10a" class="input-inline" style="width:180px;" oninput="formatCurrency(this); hitungAnggaran()"></td></tr>
                                <tr><td>b. Penghematan BBM</td><td data-id="10b">Rp. <input type="text" id="val_10b" class="input-inline" style="width:180px;" oninput="formatCurrency(this); hitungAnggaran()"></td></tr>
                                <tr><td>c. Penghematan air</td><td data-id="10c">Rp. <input type="text" id="val_10c" class="input-inline" style="width:180px;" oninput="formatCurrency(this); hitungAnggaran()"></td></tr>
                                <tr><td>d. Penghematan telepon</td><td data-id="10d">Rp. <input type="text" id="val_10d" class="input-inline" style="width:180px;" oninput="formatCurrency(this); hitungAnggaran()"></td></tr>
                                <tr><td>e. Penghematan operasional pegawai</td><td data-id="10e">Rp. <input type="text" id="val_10e" class="input-inline" style="width:180px;" oninput="formatCurrency(this); hitungAnggaran()"></td></tr>
                                <tr><td>f. Lainnya: <input type="text" id="val_10f_ket" class="input-inline" style="width:120px;" placeholder="Uraian..."></td><td data-id="10f">Rp. <input type="text" id="val_10f" class="input-inline" style="width:180px;" oninput="formatCurrency(this); hitungAnggaran()"></td></tr>
                                <tr style="font-weight: 700;"><td style="color:#0f172a;">g. Total Penghematan Anggaran</td><td>Rp. <span id="lbl_total_10" style="padding-bottom:2px;">0</span></td></tr>
                            </table>
                        </td>
                    </tr>

                    <tr class="row-group"><td class="col-no">11</td><td colspan="2">Pemanfaatan Hasil Penghematan</td></tr>
                    <tr>
                        <td class="col-no">-</td>
                        <td colspan="2" style="padding: 0 14px;">
                            <table class="sub-table">
                                <tr>
									<td style="width: 44%; vertical-align: top; padding-top: 8px;">a. Program prioritas daerah</td>
									<td data-id="11a" style="padding: 6px 0;">
										<div style="margin-bottom: 6px;">
											Rp. <input type="text" id="val_11a" class="input-inline" style="width:180px;" oninput="formatCurrency(this)">
										</div>
										<div class="prog-bawah-box" style="font-size: 11px; color: #475569; display: flex; align-items: flex-start; gap: 4px;">
											<span style="white-space: nowrap; padding-top: 2px;">Program:</span>
											<textarea id="val_11a_ket" class="input-inline" rows="1" style="width: 85%; resize: none; overflow: hidden; padding: 2px 0; min-height: 20px; line-height: 1.5;" placeholder="Tulis nama program prioritas daerah di sini..." oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px'"></textarea>
										</div>
									</td>
								</tr>
                                <tr><td>b. Peningkatan kualitas pelayanan publik</td><td data-id="11b">Rp. <input type="text" id="val_11b" class="input-inline" style="width:180px;" oninput="formatCurrency(this)"></td></tr>
                                <tr><td>c. Optimalisasi belanja produktif lainnya</td><td data-id="11c">Rp. <input type="text" id="val_11c" class="input-inline" style="width:180px;" oninput="formatCurrency(this)"></td></tr>
                            </table>
                        </td>
                    </tr>

                    <tr class="row-group"><td class="col-no">12</td><td colspan="2">Hari Bebas Kendaraan Bermotor (Car Free Day)</td></tr>
                    <tr><td class="col-no">a</td><td>Dilaksanakan</td><td class="col-ket" data-id="12a"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_12a" value="Ya"> Ya</label><label class="ctrl-label"><input type="radio" name="val_12a" value="Tidak"> Tidak</label></div></td></tr>
                    <tr><td class="col-no">b</td><td>Ruas jalan yang digunakan</td><td class="col-ket" data-id="12b"><input type="text" id="val_12b" class="input-inline" style="width: 100%;"></td></tr>
                    <tr><td class="col-no">c</td><td>Frekuensi</td><td class="col-ket" data-id="12c"><input type="number" id="val_12c" class="input-inline" style="width: 60px;"> kali/minggu</td></tr>
                    <tr><td class="col-no">d</td><td>Durasi</td><td class="col-ket" data-id="12d"><input type="number" id="val_12d" class="input-inline" style="width: 60px;"> jam</td></tr>
                    <tr><td class="col-no">e</td><td>Penambahan jumlah hari/durasi/cakupan</td><td class="col-ket" data-id="12e"><div class="radio-group"><label class="ctrl-label"><input type="radio" name="val_12e" value="Ya"> Ya</label><label class="ctrl-label"><input type="radio" name="val_12e" value="Tidak"> Tidak</label></div></td></tr>

                    <tr class="row-group"><td class="col-no">13</td><td>Kendala Pelaksanaan Kerja Bulanan</td><td class="col-ket" data-id="13"><textarea id="val_13" rows="3" placeholder="Tuliskan kendala teknis atau operasional instansi di sini..."></textarea></td></tr>
                    <tr class="row-group"><td class="col-no">14</td><td>Tindak Lanjut / Rekomendasi Solusi</td><td class="col-ket" data-id="14"><textarea id="val_14" rows="3" placeholder="Tuliskan rencana aksi pemecahan masalah untuk bulan berikutnya..."></textarea></td></tr>

                </tbody>
            </table>

            <div class="ttd-section">
                <div class="ttd-box">
                    <div style="display: grid; grid-template-columns: max-content max-content; gap: 8px 12px; justify-content: center; align-items: center; margin-bottom: 15px; font-size: 13px;">
                        <div style="text-align: right; white-space: nowrap;">Di laporkan di</div>
                        <div style="text-align: left;">
                            <input type="text" id="ttd_tempat" class="input-inline" style="width: 240px; text-align: left;">
                        </div>
                        <div style="text-align: right; white-space: nowrap;">Pada Tanggal,</div>
                        <div style="text-align: left; display: flex; gap: 6px;">
                            <select id="ttd_tgl_hari" class="input-inline ttd-dropdown" style="width: 55px; text-align: center; cursor: pointer;">
                            </select>
                            <select id="ttd_tgl_bln" class="input-inline ttd-dropdown" style="width: 110px; text-align: center; cursor: pointer;">
                                <option value=""></option>
                                <option value="Januari">Januari</option><option value="Februari">Februari</option>
                                <option value="Maret">Maret</option><option value="April">April</option>
                                <option value="Mei">Mei</option><option value="Juni">Juni</option>
                                <option value="Juli">Juli</option><option value="Agustus">Agustus</option>
                                <option value="September">September</option><option value="Oktober">Oktober</option>
                                <option value="November">November</option><option value="Desember">Desember</option>
                            </select>
                            <select id="ttd_tgl_thn" class="input-inline ttd-dropdown" style="width: 75px; text-align: center; cursor: pointer;">
                            </select>
                        </div>
                    </div>

                    <div class="no-print" style="margin-bottom: 12px;">
                        <select id="pilih_pejabat" class="input-select" onchange="gantiPejabatTtd()" style="padding: 6px 10px; font-size: 12px; width: 100%;">
                            <option value="kadis">Kepala Dinas (Definitif)</option>
                            <option value="plh">Plh. Kepala Dinas</option>
                        </select>
                    </div>

                    <div style="font-weight: 700; line-height: 1.4; margin-bottom: 15px;">
                        <span id="lbl_ttd_jabatan">Kepala Dinas</span>
                    </div>

                    <div class="ttd-space"></div>

                    <div style="text-align: center;">
                        <input type="text" id="ttd_nama" class="ttd-nama-underline" value="Drs. MUHAMMAD RUDI, M.Si">
                        <br>
                        <span style="font-family: inherit;">
                            <input type="text" id="ttd_nip" class="input-inline ttd-nip" style="width:210px; text-align:center; font-weight: normal; text-decoration: none;" value="NIP.19740411 199302 1 002">
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </main>
`;

document.getElementById('ruang-rahasia').innerHTML = isiAplikasi;

let hariHtml = '<option value=""></option>';
for(let i=1; i<=31; i++) hariHtml += '<option value="'+i+'">'+i+'</option>';
document.getElementById('ttd_tgl_hari').innerHTML = hariHtml;

let thnHtml = '';
let thnS = new Date().getFullYear();
for(let i=thnS-2; i<=thnS+3; i++) {
    let sel = (i === thnS) ? "selected" : "";
    thnHtml += '<option value="'+i+'" '+sel+'>'+i+'</option>';
}
document.getElementById('ttd_tgl_thn').innerHTML = thnHtml;

if(typeof window.onload === 'function') {
    window.onload();
}