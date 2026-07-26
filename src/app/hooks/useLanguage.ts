import { useState, useEffect, createContext, useContext } from 'react';

type Language = 'id' | 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  id: {
    // Navigation
    'nav.dashboard': 'Beranda',
    'nav.payment': 'Bayar',
    'nav.discipline': 'Kedisiplinan',
    'nav.achievement': 'Prestasi',
    'nav.album': 'Album',
    'nav.personal': 'Profil',
    'nav.chat': 'Chat',
    'nav.notifications': 'Notifikasi',
    'nav.settings': 'Pengaturan',
    
    // Common
    'common.back': 'Kembali',
    'common.next': 'Lanjutkan',
    'common.cancel': 'Batal',
    'common.save': 'Simpan',
    'common.delete': 'Hapus',
    'common.edit': 'Edit',
    'common.view_all': 'Lihat Semua',
    'common.loading': 'Memuat...',
    'common.success': 'Berhasil',
    'common.error': 'Terjadi kesalahan',
    'common.required': 'Wajib diisi',
    
    // Server Selection
    'server.title': 'Pilih Server Pondok',
    'server.description': 'Pilih server pondok pesantren atau buat server baru',
    'server.main_server': 'Pondok Almunawwarah',
    'server.main_description': 'Server Utama - Rekomendasi',
    'server.select_main': 'Pilih Server Utama',
    'server.other_servers': 'Server Pondok Lain',
    'server.tutorial': 'Tutorial',
    'server.language': 'Bahasa',
    'server.create_new': 'Buat Server Baru',
    'server.new_description': 'Buat server baru untuk pondok pesantren Anda',
    
    // Login Options
    'login.title': 'Pilih Metode Akses',
    'login.guardian_login': 'Login Wali Santri',
    'login.guardian_login_desc': 'Masuk dengan akun wali yang sudah terdaftar',
    'login.guardian_login_button': 'Masuk dengan Akun Wali',
    'login.create_account': 'Buat Akun Wali',
    'login.create_account_desc': 'Daftar sebagai wali santri baru',
    'login.create_account_button': 'Buat Akun Wali Baru',
    'login.admin_login': 'Masuk sebagai Admin',
    'login.admin_login_desc': 'Kelola data santri dan sistem pondok',
    'login.admin_login_button': 'Masuk sebagai Admin',
    
    // Guardian Account Creation
    'guardian.create_title': 'Buat Akun Wali',
    'guardian.child_data': 'Data Anak (Santri)',
    'guardian.child_data_desc': 'Tambahkan data anak yang mondok di pesantren',
    'guardian.child_name': 'Nama Anak',
    'guardian.child_class': 'Kelas',
    'guardian.child_room': 'Kamar',
    'guardian.child_region': 'Daerah Asal',
    'guardian.add_child': 'Tambah Anak',
    'guardian.contact_admin': 'Hubungi Admin Data',
    'guardian.name_not_found': 'Nama tidak ditemukan dalam daftar santri',
    'guardian.guardian_data': 'Data Wali Santri',
    'guardian.guardian_data_desc': 'Masukkan informasi data diri wali',
    'guardian.full_name': 'Nama Lengkap Wali',
    'guardian.phone': 'Nomor HP',
    'guardian.pin': 'PIN (6 digit)',
    'guardian.confirm_pin': 'Konfirmasi PIN',
    'guardian.birth_date': 'Tanggal Lahir',
    
    // Payment
    'payment.emoney_balance': 'Saldo E-Money',
    'payment.send_money': 'Kirim Uang',
    'payment.spp_bills': 'Tagihan SPP',
    'payment.view_all_spp': 'Lihat Semua SPP',
    'payment.transaction_history': 'Riwayat Transaksi',
    'payment.view_all_transactions': 'Lihat Semua Transaksi',
    'payment.paid': 'Lunas',
    'payment.unpaid': 'Belum Bayar',
    'payment.pay_now': 'Bayar Sekarang',
    
    // Language Selection
    'language.title': 'Pilih Bahasa',
    'language.description': 'Atur bahasa tampilan aplikasi',
    'language.settings_title': 'Pengaturan Bahasa',
    'language.settings_desc': 'Pilih bahasa yang sesuai untuk pengalaman yang lebih baik',
    'language.note': 'Perubahan bahasa akan diterapkan pada seluruh aplikasi',
    'language.apply': 'Terapkan & Kembali',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.payment': 'Payment',
    'nav.discipline': 'Discipline',
    'nav.achievement': 'Achievement',
    'nav.album': 'Album',
    'nav.personal': 'Profile',
    'nav.chat': 'Chat',
    'nav.notifications': 'Notifications',
    'nav.settings': 'Settings',
    
    // Common
    'common.back': 'Back',
    'common.next': 'Next',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view_all': 'View All',
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'An error occurred',
    'common.required': 'Required',
    
    // Server Selection
    'server.title': 'Select Pesantren Server',
    'server.description': 'Choose pesantren server or create new server',
    'server.main_server': 'Pondok Almunawwarah',
    'server.main_description': 'Main Server - Recommended',
    'server.select_main': 'Select Main Server',
    'server.other_servers': 'Other Pesantren Servers',
    'server.tutorial': 'Tutorial',
    'server.language': 'Language',
    'server.create_new': 'Create New Server',
    'server.new_description': 'Create new server for your pesantren',
    
    // Login Options
    'login.title': 'Choose Access Method',
    'login.guardian_login': 'Guardian Login',
    'login.guardian_login_desc': 'Sign in with existing guardian account',
    'login.guardian_login_button': 'Sign in as Guardian',
    'login.create_account': 'Create Guardian Account',
    'login.create_account_desc': 'Register as new guardian',
    'login.create_account_button': 'Create New Guardian Account',
    'login.admin_login': 'Sign in as Admin',
    'login.admin_login_desc': 'Manage student data and pesantren system',
    'login.admin_login_button': 'Sign in as Admin',
    
    // Guardian Account Creation
    'guardian.create_title': 'Create Guardian Account',
    'guardian.child_data': 'Student Data',
    'guardian.child_data_desc': 'Add your child\'s data who studies at pesantren',
    'guardian.child_name': 'Child Name',
    'guardian.child_class': 'Class',
    'guardian.child_room': 'Room',
    'guardian.child_region': 'Origin Region',
    'guardian.add_child': 'Add Child',
    'guardian.contact_admin': 'Contact Data Admin',
    'guardian.name_not_found': 'Name not found in student list',
    'guardian.guardian_data': 'Guardian Data',
    'guardian.guardian_data_desc': 'Enter guardian personal information',
    'guardian.full_name': 'Guardian Full Name',
    'guardian.phone': 'Phone Number',
    'guardian.pin': 'PIN (6 digits)',
    'guardian.confirm_pin': 'Confirm PIN',
    'guardian.birth_date': 'Birth Date',
    
    // Payment
    'payment.emoney_balance': 'E-Money Balance',
    'payment.send_money': 'Send Money',
    'payment.spp_bills': 'SPP Bills',
    'payment.view_all_spp': 'View All SPP',
    'payment.transaction_history': 'Transaction History',
    'payment.view_all_transactions': 'View All Transactions',
    'payment.paid': 'Paid',
    'payment.unpaid': 'Unpaid',
    'payment.pay_now': 'Pay Now',
    
    // Language Selection
    'language.title': 'Select Language',
    'language.description': 'Set application display language',
    'language.settings_title': 'Language Settings',
    'language.settings_desc': 'Choose appropriate language for better experience',
    'language.note': 'Language changes will be applied to entire application',
    'language.apply': 'Apply & Back',
  },
  ar: {
    // Navigation
    'nav.dashboard': 'الرئيسية',
    'nav.payment': 'الدفع',
    'nav.discipline': 'الانضباط',
    'nav.achievement': 'الإنجازات',
    'nav.album': 'الألبوم',
    'nav.personal': 'الملف الشخصي',
    'nav.chat': 'المحادثة',
    'nav.notifications': 'الإشعارات',
    'nav.settings': 'الإعدادات',
    
    // Common
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view_all': 'عرض الكل',
    'common.loading': 'جارٍ التحميل...',
    'common.success': 'نجح',
    'common.error': 'حدث خطأ',
    'common.required': 'مطلوب',
    
    // Server Selection
    'server.title': 'اختر خادم المعهد',
    'server.description': 'اختر خادم المعهد أو أنشئ خادماً جديداً',
    'server.main_server': 'معهد المنورة',
    'server.main_description': 'الخادم الرئيسي - موصى به',
    'server.select_main': 'اختر الخادم الرئيسي',
    'server.other_servers': 'خوادم المعاهد الأخرى',
    'server.tutorial': 'دليل التعليمات',
    'server.language': 'اللغة',
    'server.create_new': 'إنشاء خادم جديد',
    'server.new_description': 'أنشئ خادماً جديداً لمعهدك',
    
    // Login Options
    'login.title': 'اختر طريقة الدخول',
    'login.guardian_login': 'دخول ولي الأمر',
    'login.guardian_login_desc': 'الدخول بحساب ولي أمر موجود',
    'login.guardian_login_button': 'الدخول كولي أمر',
    'login.create_account': 'إنشاء حساب ولي أمر',
    'login.create_account_desc': 'التسجيل كولي أمر جديد',
    'login.create_account_button': 'إنشاء حساب ولي أمر جديد',
    'login.admin_login': 'الدخول كمدير',
    'login.admin_login_desc': 'إدارة بيانات الطلاب ونظام المعهد',
    'login.admin_login_button': 'الدخول كمدير',
    
    // Guardian Account Creation
    'guardian.create_title': 'إنشاء حساب ولي الأمر',
    'guardian.child_data': 'بيانات الطالب',
    'guardian.child_data_desc': 'أضف بيانات طفلك الذي يدرس في المعهد',
    'guardian.child_name': 'اسم الطفل',
    'guardian.child_class': 'الصف',
    'guardian.child_room': 'الغرفة',
    'guardian.child_region': 'المنطقة الأصلية',
    'guardian.add_child': 'إضافة طفل',
    'guardian.contact_admin': 'الاتصال بمدير البيانات',
    'guardian.name_not_found': 'الاسم غير موجود في قائمة الطلاب',
    'guardian.guardian_data': 'بيانات ولي الأمر',
    'guardian.guardian_data_desc': 'أدخل المعلومات الشخصية لولي الأمر',
    'guardian.full_name': 'الاسم الكامل لولي الأمر',
    'guardian.phone': 'رقم الهاتف',
    'guardian.pin': 'الرقم السري (6 أرقام)',
    'guardian.confirm_pin': 'تأكيد الرقم السري',
    'guardian.birth_date': 'تاريخ الميلاد',
    
    // Payment
    'payment.emoney_balance': 'رصيد المحفظة الإلكترونية',
    'payment.send_money': 'إرسال الأموال',
    'payment.spp_bills': 'فواتير الرسوم الدراسية',
    'payment.view_all_spp': 'عرض جميع الرسوم',
    'payment.transaction_history': 'تاريخ المعاملات',
    'payment.view_all_transactions': 'عرض جميع المعاملات',
    'payment.paid': 'مدفوع',
    'payment.unpaid': 'غير مدفوع',
    'payment.pay_now': 'ادفع الآن',
    
    // Language Selection
    'language.title': 'اختر اللغة',
    'language.description': 'تعيين لغة عرض التطبيق',
    'language.settings_title': 'إعدادات اللغة',
    'language.settings_desc': 'اختر اللغة المناسبة لتجربة أفضل',
    'language.note': 'ستطبق تغييرات اللغة على التطبيق بأكمله',
    'language.apply': 'تطبيق والعودة',
  }
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useLanguageSetup() {
  const [language, setLanguageState] = useState<Language>('id');

  useEffect(() => {
    const saved = window.localStorage.getItem('app-language');
    if (saved && ['id', 'en', 'ar'].includes(saved)) {
      setLanguageState(saved as Language);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    window.localStorage.setItem('app-language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return { language, setLanguage, t };
}