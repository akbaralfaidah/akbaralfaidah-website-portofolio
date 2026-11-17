import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Monitor,
  Smartphone,
  FileSpreadsheet,
  ScanBarcode,
  Printer,
  MapPin,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Globe,
  Lock,
  Clock
} from 'lucide-react';
import TechLogoMarquee from './ui/TechLogoMarquee';
import { ParallaxLayer, ParallaxWatermark } from './ui/MotionPrimitives';
import { useTheme } from '../hooks/useTheme';
import { STUDIO_EASE } from '../lib/motion';

function ScrollWord({ word, progress, range, serif = false }) {
  const opacity = useTransform(progress, range, [0.22, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={serif ? 'font-serif italic font-normal text-accent' : undefined}
    >
      {word}{' '}
    </motion.span>
  );
}

function KineticStatement({ isEn }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end 45%']
  });

  const words = isEn
    ? [
        { text: 'From', serif: false },
        { text: 'first', serif: false },
        { text: 'sketch', serif: true },
        { text: 'to', serif: false },
        { text: 'everyday', serif: false },
        { text: 'team workflows,', serif: false },
        { text: 'every', serif: false },
        { text: 'system', serif: false },
        { text: 'is', serif: false },
        { text: 'built', serif: false },
        { text: 'to feel clear', serif: true },
        { text: 'from', serif: false },
        { text: 'day one.', serif: false }
      ]
    : [
        { text: 'Dari', serif: false },
        { text: 'sketsa awal,', serif: true },
        { text: 'alur kerja tim,', serif: false },
        { text: 'koneksi alat toko,', serif: false },
        { text: 'sampai', serif: false },
        { text: 'siap dipakai', serif: true },
        { text: 'lancar', serif: false },
        { text: 'setiap hari.', serif: false }
      ];

  return (
    <div ref={containerRef} className="py-10 sm:py-14 border-b border-line mb-14">
      <p className="font-display text-2xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-[-0.03em] leading-[1.2] text-ink max-w-4xl">
        {words.map((w, idx) => {
          const start = idx / words.length;
          const end = Math.min(1, start + 1.8 / words.length);
          return (
            <ScrollWord
              key={`${w.text}-${idx}`}
              word={w.text}
              serif={w.serif}
              progress={scrollYProgress}
              range={[start, end]}
            />
          );
        })}
      </p>
    </div>
  );
}

function VisualFlowPreview({ activeStep, isEn }) {
  const [deviceView, setDeviceView] = useState('desktop');
  const [roleView, setRoleView] = useState('pimpinan');
  const [exported, setExported] = useState(false);
  const [hardwareDevice, setHardwareDevice] = useState('printer');

  if (activeStep === 0) {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider font-semibold text-accent">
              {isEn ? 'Interactive UI Demo' : 'Simulasi Tampilan'}
            </p>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">
              {isEn ? 'Clear on Both Laptop & Phone' : 'Jelas di Layar Laptop Maupun HP'}
            </h3>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-full bg-mist border border-line">
            <button
              type="button"
              onClick={() => setDeviceView('desktop')}
              className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-all ${
                deviceView === 'desktop' ? 'bg-accent text-white shadow-sm' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Monitor size={13} aria-hidden="true" />
              <span>{isEn ? 'Laptop' : 'Laptop Kantor'}</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceView('mobile')}
              className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-all ${
                deviceView === 'mobile' ? 'bg-accent text-white shadow-sm' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Smartphone size={13} aria-hidden="true" />
              <span>{isEn ? 'Phone' : 'HP Lapangan'}</span>
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-sky-50 via-white to-blue-50/70 dark:from-[#080B14] dark:via-[#0D111C] dark:to-[#08121E] border border-line p-5 sm:p-6 flex items-center justify-center min-h-[230px]">
          <motion.div
            key={deviceView}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.24, ease: STUDIO_EASE }}
            className={`rounded-xl bg-white dark:bg-[#101522] border border-line shadow-lg p-4 transition-all ${
              deviceView === 'mobile' ? 'w-[225px]' : 'w-full'
            }`}
          >
            <div className="flex items-center justify-between border-b border-line pb-2.5 mb-3">
              <span className="font-display text-xs font-semibold text-ink">
                {deviceView === 'mobile' ? 'Kasir Harian' : 'Ringkasan Bisnis Hari Ini'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 font-mono text-[10px] font-semibold">
                {isEn ? 'Live Sync' : 'Tersinkron'}
              </span>
            </div>

            <div className={`grid gap-2.5 ${deviceView === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'}`}>
              <div className="p-3 rounded-lg bg-blue-50/80 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                <p className="text-[11px] text-ink-muted">{isEn ? 'Today Sales' : 'Omzet Hari Ini'}</p>
                <p className="font-display text-base font-bold text-ink mt-0.5">Rp 8.200.000</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.04] border border-line">
                <p className="text-[11px] text-ink-muted">{isEn ? 'Orders' : 'Transaksi Masuk'}</p>
                <p className="font-display text-base font-bold text-ink mt-0.5">42 Nota</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-ink-muted">{isEn ? 'Stock Status' : 'Stok Aman'}</p>
                  <p className="font-display text-sm font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                    100% Terpantau
                  </p>
                </div>
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" aria-hidden="true" />
              </div>
            </div>
          </motion.div>
        </div>

        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          {isEn
            ? 'Stays clean on small phone screens in the field and spacious on office monitors—staf can use it without extra training.'
            : 'Tombol besar dan angka penting langsung terlihat jelas—pegawai baru bisa langsung paham sejak hari pertama buka.'}
        </p>
      </div>
    );
  }

  if (activeStep === 1) {
    const roleInfo = {
      pimpinan: {
        badge: isEn ? 'Full Executive View' : 'Akses Penuh & Persetujuan',
        rows: [
          { name: 'Laporan Keuangan Q3', access: isEn ? 'View & Export PDF' : 'Lihat & Unduh PDF', ok: true },
          { name: 'Rekap Data Pegawai', access: isEn ? 'Verified · All Units' : 'Terbuka Semua Unit', ok: true }
        ]
      },
      admin: {
        badge: isEn ? 'Input, Edit & Recap' : 'Kelola Data & Cetak Excel',
        rows: [
          { name: 'Input Stok & Berkas Baru', access: isEn ? 'Editable' : 'Bisa Tambah / Edit', ok: true },
          { name: 'Ekspor Excel Otomatis', access: isEn ? '1-Click Ready' : '1 Klik Langsung Jadi', ok: true }
        ]
      },
      staf: {
        badge: isEn ? 'Focused Daily Tasks' : 'Khusus Input Tugas Harian',
        rows: [
          { name: 'Form Input Harian', access: isEn ? 'Allowed' : 'Akses Aktif', ok: true },
          { name: 'Data Keuangan Rahasia', access: isEn ? 'Restricted' : 'Terkunci Aman', ok: false }
        ]
      }
    }[roleView];

    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider font-semibold text-accent">
              {isEn ? 'Role & Report Control' : 'Pengaturan Akun & Laporan'}
            </p>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">
              {isEn ? 'Safe Access by Job Title' : 'Hak Akses Aman & Laporan Instan'}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/15 text-accent font-mono text-xs font-semibold border border-blue-200 dark:border-blue-500/30">
            <Lock size={12} aria-hidden="true" />
            <span>{roleInfo.badge}</span>
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'pimpinan', label: isEn ? 'Director View' : 'Sebagai Pimpinan' },
            { id: 'admin', label: isEn ? 'Admin View' : 'Sebagai Admin' },
            { id: 'staf', label: isEn ? 'Staff View' : 'Sebagai Staf' }
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRoleView(r.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                roleView === r.id
                  ? 'bg-accent text-white border-accent'
                  : 'bg-paper text-ink-muted border-line hover:text-ink'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="rounded-xl bg-slate-50/90 dark:bg-[#080B14] border border-line p-4 space-y-2.5">
          {roleInfo.rows.map((row) => (
            <div
              key={row.name}
              className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#101522] border border-line text-sm"
            >
              <span className="font-medium text-ink">{row.name}</span>
              <span
                className={`font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  row.ok
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                }`}
              >
                {row.access}
              </span>
            </div>
          ))}

          <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setExported((prev) => !prev)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ink text-on-ink hover:opacity-90 text-xs font-semibold transition-opacity"
            >
              <FileSpreadsheet size={14} aria-hidden="true" />
              <span>
                {exported
                  ? isEn
                    ? 'Excel & PDF Downloaded ✓'
                    : 'Laporan Excel & PDF Siap ✓'
                  : isEn
                  ? 'Try 1-Click Export Report'
                  : 'Coba Unduh Laporan Otomatis'}
              </span>
            </button>
            <span className="font-mono text-[11px] text-ink-muted">
              {isEn ? 'Zero manual copy-paste' : 'Nggak perlu rekap manual lagi'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (activeStep === 2) {
    const hardwareMap = {
      printer: {
        title: isEn ? 'Thermal Receipt Ready' : 'Cetak Struk Langsung dari HP',
        status: isEn ? 'Receipt Printed · Nota #1042' : 'Struk Tercetak · Nota #1042',
        detail: isEn
          ? 'Cashier completes checkout -> receipt prints via Bluetooth automatically, even when Wi-Fi drops.'
          : 'Kasir selesaikan belanja -> struk langsung keluar lewat printer Bluetooth meski sinyal lagi putus.'
      },
      barcode: {
        title: isEn ? 'Instant Item Scan' : 'Scan Barcode Barang Gudang',
        status: isEn ? 'Matched: Semen 50kg (Rp 68.000)' : 'Terdeteksi: Besi Beton 10mm',
        detail: isEn
          ? 'Point phone camera or handheld scanner -> price & remaining warehouse stock update instantly.'
          : 'Arahkan kamera HP atau scanner ke barang -> harga dan sisa stok gudang langsung ketemu dalam 1 detik.'
      },
      gps: {
        title: isEn ? '50m Attendance Lock' : 'Presensi Kunci Lokasi 50 Meter',
        status: isEn ? 'Inside Campus/Office · Check-In Valid' : 'Dalam Area Kantor · Absen Sah',
        detail: isEn
          ? 'Prevents fake check-ins outside the office radius—rekap kehadiran tim beres otomatis.'
          : 'Karyawan/mahasiswa tidak bisa nitip absen dari luar radius lokasi yang sudah ditentukan.'
      }
    }[hardwareDevice];

    return (
      <div className="space-y-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider font-semibold text-accent">
            {isEn ? 'Connected Field App' : 'Koneksi Perangkat Nyata'}
          </p>
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">
            {isEn ? 'Works Seamlessly with Your Tools' : 'Aplikasi HP Nyambung ke Alat & GPS'}
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'printer', icon: Printer, label: isEn ? 'Printer' : 'Printer Struk' },
            { id: 'barcode', icon: ScanBarcode, label: 'Barcode' },
            { id: 'gps', icon: MapPin, label: isEn ? 'GPS Lock' : 'Absen GPS' }
          ].map((btn) => {
            const Icon = btn.icon;
            const active = hardwareDevice === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => setHardwareDevice(btn.id)}
                className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                  active
                    ? 'bg-accent text-white border-accent shadow-sm'
                    : 'bg-paper text-ink-muted border-line hover:text-ink'
                }`}
              >
                <Icon size={17} aria-hidden="true" />
                <span className="text-xs font-medium">{btn.label}</span>
              </button>
            );
          })}
        </div>

        <motion.div
          key={hardwareDevice}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl bg-gradient-to-br from-emerald-50/80 via-white to-sky-50/70 dark:from-[#081214] dark:via-[#0D111C] dark:to-[#080B14] border border-line p-5 space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-display text-base font-semibold text-ink">{hardwareMap.title}</h4>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 font-mono text-xs font-semibold">
              {hardwareMap.status}
            </span>
          </div>
          <p className="text-sm text-ink-muted leading-relaxed">{hardwareMap.detail}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider font-semibold text-accent">
            {isEn ? 'Smart Automation & Online Launch' : 'AI Cerdas & Siap Online'}
          </p>
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">
            {isEn ? 'Cut Manual Typing, Launch Live Safely' : 'Kurangi Ketik Manual, Langsung Online'}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 font-mono text-xs font-semibold">
          <Globe size={12} aria-hidden="true" />
          <span>HTTPS 24/7</span>
        </span>
      </div>

      <div className="rounded-xl bg-slate-50/90 dark:bg-[#080B14] border border-line p-4 sm:p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <MessageSquare size={15} aria-hidden="true" />
          </div>
          <div className="rounded-xl rounded-tl-none bg-white dark:bg-[#101522] border border-line px-3.5 py-2.5 text-sm text-ink shadow-sm">
            &ldquo;
            {isEn
              ? 'Hey team, please finalize stock report for Depot Kayu tomorrow 2 PM, urgent!'
              : 'Mas tolong rapikan laporan stok masuk & jadwal kirim besok jam 14:00 ya, penting!'}
            &rdquo;
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-accent pl-11">
          <Sparkles size={13} aria-hidden="true" />
          <span>
            {isEn ? 'AI turns chat into a neat task card automatically:' : 'AI langsung ubah chat di atas jadi jadwal kerja rapi:'}
          </span>
        </div>

        <div className="ml-0 sm:ml-11 rounded-xl bg-white dark:bg-[#101522] border border-accent/40 p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-sm font-semibold text-ink">
              {isEn ? 'Finalize Stock & Shipping Report' : 'Rapikan Laporan Stok & Jadwal Kirim'}
            </p>
            <p className="font-mono text-xs text-ink-muted mt-0.5">
              {isEn ? 'Deadline: Tomorrow 14:00' : 'Batas Waktu: Besok, Jam 14:00 WIB'}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 font-mono text-[11px] font-semibold">
            {isEn ? 'Priority: Urgent' : 'Prioritas Penting'}
          </span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-ink-muted">
        {isEn
          ? 'Delivered live on your own domain (.com / .id) with SSL security ready for daily users.'
          : 'Sudah termasuk pengaturan domain (.com / .id) dan server agar website langsung aman diakses oleh pelanggan Anda.'}
      </p>
    </div>
  );
}

function ServiceArtwork({ id }) {
  if (id === 'web') {
    return (
      <div className="relative h-44 rounded-xl bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100/70 dark:from-[#0C1629] dark:to-[#0F1B33] border border-line overflow-hidden p-4 flex items-center justify-center">
        <ParallaxLayer yRange={[-16, 16]} className="w-full max-w-[260px]">
          <div className="rounded-lg bg-white/95 dark:bg-[#101626] border border-line shadow-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/20 text-accent font-mono text-[9px] font-semibold">
                portal.bisnisanda.id
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="h-9 rounded bg-blue-500/15 border border-blue-500/20 p-1.5 flex flex-col justify-center">
                <span className="h-1.5 w-8 rounded bg-accent/60 mb-1" />
                <span className="h-2 w-12 rounded bg-ink/70" />
              </div>
              <div className="h-9 rounded bg-emerald-500/15 border border-emerald-500/20 p-1.5 flex flex-col justify-center">
                <span className="h-1.5 w-8 rounded bg-emerald-500/60 mb-1" />
                <span className="h-2 w-10 rounded bg-emerald-700/70 dark:bg-emerald-300/80" />
              </div>
            </div>
            <div className="h-2.5 w-full rounded bg-slate-100 dark:bg-white/10" />
          </div>
        </ParallaxLayer>
      </div>
    );
  }

  if (id === 'mobile') {
    return (
      <div className="relative h-44 rounded-xl bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100/70 dark:from-[#0A1E1A] dark:to-[#0C1D24] border border-line overflow-hidden p-4 flex items-center justify-center gap-4">
        <ParallaxLayer yRange={[-16, 16]}>
          <div className="w-28 rounded-2xl bg-white/95 dark:bg-[#101626] border-2 border-slate-800/80 dark:border-slate-600 shadow-xl p-2.5 space-y-2">
            <div className="w-8 h-1 rounded-full bg-slate-300 mx-auto" />
            <div className="rounded-lg bg-emerald-500 text-white p-2 text-center">
              <p className="text-[9px] opacity-85">POS Total</p>
              <p className="font-display text-xs font-bold">Rp 1.580K</p>
            </div>
            <div className="flex items-center justify-between px-1">
              <ScanBarcode size={13} className="text-ink-muted" aria-hidden="true" />
              <Printer size={13} className="text-accent" aria-hidden="true" />
              <MapPin size={13} className="text-emerald-600" aria-hidden="true" />
            </div>
          </div>
        </ParallaxLayer>
      </div>
    );
  }

  return (
    <div className="relative h-44 rounded-xl bg-gradient-to-br from-amber-50 via-indigo-50/70 to-sky-100/70 dark:from-[#181629] dark:to-[#0E1828] border border-line overflow-hidden p-4 flex items-center justify-center">
      <ParallaxLayer yRange={[-16, 16]} className="w-full max-w-[260px] space-y-2">
        <div className="rounded-lg rounded-tl-none bg-white/95 dark:bg-[#101626] border border-line px-3 py-2 text-[11px] text-ink shadow-sm flex items-center gap-2">
          <MessageSquare size={12} className="text-emerald-500 shrink-0" aria-hidden="true" />
          <span className="truncate">&ldquo;Rekap order masuk besok...&rdquo;</span>
        </div>
        <div className="rounded-lg bg-accent text-white px-3 py-2 text-[11px] font-medium shadow-md flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles size={12} aria-hidden="true" />
            <span>Terjadwal Otomatis</span>
          </span>
          <span className="font-mono text-[10px] bg-white/20 px-1.5 rounded">AI</span>
        </div>
      </ParallaxLayer>
    </div>
  );
}

export default function Capabilities() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const prefersReduced = useReducedMotion();

  const pillars = t('capabilities.pillars', { returnObjects: true }) || [];
  const serviceItems = t('services.items', { returnObjects: true }) || [];
  const isEn = i18n.language === 'en';
  const isDark = theme === 'dark';

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="capabilities"
      className="relative py-20 sm:py-28 px-5 sm:px-6 bg-[#F1F5FA] dark:bg-[#080B12] text-ink border-b border-line overflow-x-clip"
    >
      {/* Subtle luminous radial glow & Parallax Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[420px] rounded-full blur-3xl opacity-75 dark:opacity-25"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(56,189,248,0.16) 0%, rgba(37,99,235,0.06) 50%, transparent 75%)'
        }}
      />
      <ParallaxWatermark text="WORKFLOW & SYSTEMS" direction={1} className="mb-2" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Scroll-Scrubbed Kinetic Serif Statement */}
        <KineticStatement isEn={isEn} />

        {/* Interactive Visual Product Simulator (Client-Friendly, Zero Tech Terminal Jargon) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-24">
          <ParallaxLayer
            yRange={[26, -26]}
            className="lg:col-span-5 border-y border-line"
          >
            <div role="tablist" aria-label="Alur pengerjaan sistem" className="divide-y divide-line">
              {Array.isArray(pillars) &&
                pillars.map((item, idx) => {
                  const isSelected = idx === activeStep;
                  return (
                    <button
                      key={item.step}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setActiveStep(idx)}
                      className={`group relative w-full text-left py-5 px-4 transition-all rounded-r-lg ${
                        isSelected
                          ? 'text-ink bg-white/95 dark:bg-white/[0.05] shadow-sm'
                          : 'text-ink-muted hover:text-ink hover:bg-white/60 dark:hover:bg-white/[0.02]'
                      }`}
                    >
                      {isSelected && (
                        <motion.span
                          layoutId="workbench-active-bar"
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                          className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full bg-accent"
                        />
                      )}
                      <div className="flex items-start gap-4">
                        <span
                          className={`font-mono text-xs font-semibold pt-1 ${
                            isSelected ? 'text-accent' : 'text-ink-muted'
                          }`}
                        >
                          {item.step}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display text-lg sm:text-xl font-semibold text-ink mb-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-ink-muted leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </ParallaxLayer>

          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <ParallaxLayer yRange={[-24, 24]}>
              <div className="rounded-2xl bg-white dark:bg-[#0D1017] border border-slate-200/90 dark:border-white/15 p-6 sm:p-8 shadow-[0_24px_60px_-16px_rgba(37,99,235,0.14),0_8px_24px_-10px_rgba(15,23,42,0.06)] dark:shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReduced ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: STUDIO_EASE }}
                  >
                    <VisualFlowPreview activeStep={activeStep} isEn={isEn} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </ParallaxLayer>
          </div>
        </div>

        {/* Visual Staggered Parallax Services Showcase (Replaces Plain Table) */}
        <div id="services" className="scroll-mt-24 pt-14 border-t border-line">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <ParallaxLayer yRange={[18, -18]}>
              <p className="font-mono text-xs uppercase tracking-[0.14em] font-semibold text-accent mb-2">
                {isEn ? '02 / Custom Services' : '02 / Pilihan Layanan'}
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.08] text-ink">
                {isEn ? (
                  <>
                    Systems Built{' '}
                    <span className="font-serif italic font-normal text-accent">Around You.</span>
                  </>
                ) : (
                  <>
                    Layanan Custom{' '}
                    <span className="font-serif italic font-normal text-accent">Sesuai Kebutuhan.</span>
                  </>
                )}
              </h2>
            </ParallaxLayer>

            <p className="text-sm sm:text-base text-ink-muted max-w-md leading-relaxed">
              {t('services.subheading')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {Array.isArray(serviceItems) &&
              serviceItems.map((service, idx) => {
                // Distinct staggered vertical scroll velocities across cards
                const cardY = idx === 1 ? [64, -64] : idx === 0 ? [34, -34] : [18, -18];
                return (
                  <ParallaxLayer key={service.id} yRange={cardY} className="flex">
                    <div className="w-full rounded-2xl bg-white/95 dark:bg-[#0D1017] border border-slate-200/90 dark:border-white/15 p-5 sm:p-6 flex flex-col justify-between shadow-[0_20px_50px_-18px_rgba(37,99,235,0.12)] hover:border-accent/50 hover:shadow-[0_24px_60px_-14px_rgba(37,99,235,0.2)] transition-all">
                      <div className="space-y-5">
                        <ServiceArtwork id={service.id} />

                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted font-semibold">
                            0{idx + 1}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/15 text-accent font-mono text-xs font-semibold">
                            <Clock size={11} aria-hidden="true" />
                            <span>{service.timeline}</span>
                          </span>
                        </div>

                        <div>
                          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink mb-2">
                            {service.title}
                          </h3>
                          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                            {service.desc}
                          </p>
                        </div>

                        <ul className="space-y-2 pt-3 border-t border-line">
                          {Array.isArray(service.deliverables) &&
                            service.deliverables.map((line) => (
                              <li key={line} className="flex items-start gap-2.5 text-sm text-ink-muted">
                                <CheckCircle2
                                  size={16}
                                  className="text-emerald-500 shrink-0 mt-0.5"
                                  aria-hidden="true"
                                />
                                <span>{line}</span>
                              </li>
                            ))}
                        </ul>
                      </div>

                      <div className="pt-6 mt-6 border-t border-line">
                        <button
                          type="button"
                          onClick={scrollToContact}
                          className="group w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors shadow-sm shadow-blue-600/20"
                        >
                          <span>{t('services.book_cta')}</span>
                          <ArrowRight
                            size={15}
                            className="transition-transform duration-200 group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </div>
                  </ParallaxLayer>
                );
              })}
          </div>
        </div>

        {/* Stack Strip */}
        <div className="pt-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              {t('capabilities.stack_eyebrow')}
            </span>
            <span className="font-mono text-xs text-ink-muted">Web · Mobile · AI · DevOps</span>
          </div>
          <TechLogoMarquee darkSurface={isDark} />
        </div>
      </div>
    </section>
  );
}
