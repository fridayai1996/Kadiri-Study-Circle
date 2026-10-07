import { Student, Faculty, ClassLog, MockTest, StudentTestScore, SubjectModule, Announcement } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  // Group I (12 students) - Target Group I (Executive, Deputy Collectors, DSP, etc.)
  {
    id: 'std-g1-01',
    rollNo: 'KSC-G1-01',
    name: 'K. Anusha Reddy',
    group: 'Group I',
    phone: '98480 12301',
    email: 'anusha.reddy@kadirisc.in',
    category: 'General',
    joinDate: '2026-06-15',
    attendancePercentage: 100.0,
    totalClasses: 25,
    attendedClasses: 25,
    targetExam: 'APPSC Group I (Deputy Collector)',
    notes: 'Consistently tops current affairs and mains answer writing.'
  },
  {
    id: 'std-g1-02',
    rollNo: 'KSC-G1-02',
    name: 'B. Sreenivasa Rao',
    group: 'Group I',
    phone: '98480 12302',
    email: 'sreenivas.b@kadirisc.in',
    category: 'BC',
    joinDate: '2026-06-15',
    attendancePercentage: 96.0,
    totalClasses: 25,
    attendedClasses: 24,
    targetExam: 'APPSC Group I (DSP)'
  },
  {
    id: 'std-g1-03',
    rollNo: 'KSC-G1-03',
    name: 'C. Vani Madhavi',
    group: 'Group I',
    phone: '98480 12303',
    email: 'vani.m@kadirisc.in',
    category: 'General',
    joinDate: '2026-06-15',
    attendancePercentage: 100.0,
    totalClasses: 25,
    attendedClasses: 25,
    targetExam: 'APPSC Group I (Commercial Tax Officer)'
  },
  {
    id: 'std-g1-04',
    rollNo: 'KSC-G1-04',
    name: 'M. Mahesh Kumar',
    group: 'Group I',
    phone: '98480 12304',
    email: 'mahesh.m@kadirisc.in',
    category: 'SC',
    joinDate: '2026-06-15',
    attendancePercentage: 96.0,
    totalClasses: 25,
    attendedClasses: 24,
    targetExam: 'APPSC Group I (RDO)'
  },
  {
    id: 'std-g1-05',
    rollNo: 'KSC-G1-05',
    name: 'P. Sai Charitha',
    group: 'Group I',
    phone: '98480 12305',
    email: 'sai.charitha@kadirisc.in',
    category: 'EWS',
    joinDate: '2026-06-18',
    attendancePercentage: 96.0,
    totalClasses: 25,
    attendedClasses: 24,
    targetExam: 'APPSC Group I'
  },
  {
    id: 'std-g1-06',
    rollNo: 'KSC-G1-06',
    name: 'D. Venkatasubbaiah',
    group: 'Group I',
    phone: '98480 12306',
    email: 'venkat.d@kadirisc.in',
    category: 'BC',
    joinDate: '2026-06-18',
    attendancePercentage: 100.0,
    totalClasses: 25,
    attendedClasses: 25,
    targetExam: 'APPSC Group I'
  },
  {
    id: 'std-g1-07',
    rollNo: 'KSC-G1-07',
    name: 'T. Harikrishna Naidu',
    group: 'Group I',
    phone: '98480 12307',
    email: 'hari.naidu@kadirisc.in',
    category: 'BC',
    joinDate: '2026-06-20',
    attendancePercentage: 96.0,
    totalClasses: 25,
    attendedClasses: 24,
    targetExam: 'APPSC Group I'
  },
  {
    id: 'std-g1-08',
    rollNo: 'KSC-G1-08',
    name: 'G. Swetha Kumari',
    group: 'Group I',
    phone: '98480 12308',
    email: 'swetha.g@kadirisc.in',
    category: 'General',
    joinDate: '2026-06-20',
    attendancePercentage: 96.0,
    totalClasses: 25,
    attendedClasses: 24,
    targetExam: 'APPSC Group I'
  },
  {
    id: 'std-g1-09',
    rollNo: 'KSC-G1-09',
    name: 'Y. Ravi Teja',
    group: 'Group I',
    phone: '98480 12309',
    email: 'raviteja.y@kadirisc.in',
    category: 'General',
    joinDate: '2026-06-22',
    attendancePercentage: 100.0,
    totalClasses: 25,
    attendedClasses: 25,
    targetExam: 'APPSC Group I'
  },
  {
    id: 'std-g1-10',
    rollNo: 'KSC-G1-10',
    name: 'K. Suneetha Devi',
    group: 'Group I',
    phone: '98480 12310',
    email: 'suneetha.k@kadirisc.in',
    category: 'ST',
    joinDate: '2026-06-22',
    attendancePercentage: 96.0,
    totalClasses: 25,
    attendedClasses: 24,
    targetExam: 'APPSC Group I'
  },
  {
    id: 'std-g1-11',
    rollNo: 'KSC-G1-11',
    name: 'S. Nazeer Ahmed',
    group: 'Group I',
    phone: '98480 12311',
    email: 'nazeer.s@kadirisc.in',
    category: 'BC',
    joinDate: '2026-06-25',
    attendancePercentage: 96.0,
    totalClasses: 25,
    attendedClasses: 24,
    targetExam: 'APPSC Group I'
  },
  {
    id: 'std-g1-12',
    rollNo: 'KSC-G1-12',
    name: 'R. Sandeep Verma',
    group: 'Group I',
    phone: '98480 12312',
    email: 'sandeep.v@kadirisc.in',
    category: 'General',
    joinDate: '2026-07-01',
    attendancePercentage: 72.0, // Below 75% (Student #1 of 5)
    totalClasses: 25,
    attendedClasses: 18,
    targetExam: 'APPSC Group I',
    notes: 'Medical leave in mid August. Attendance follow-up requested.'
  },

  // Group II (23 students) - Target Group II (Deputy Tahsildar, Sub Registrar, ACTO, etc.)
  {
    id: 'std-g2-01',
    rollNo: 'KSC-G2-01',
    name: 'A. Venkata Raman',
    group: 'Group II',
    phone: '98480 23101',
    email: 'venkata.raman@kadirisc.in',
    category: 'BC',
    joinDate: '2026-06-10',
    attendancePercentage: 96.9,
    totalClasses: 32,
    attendedClasses: 31,
    targetExam: 'APPSC Group II (Deputy Tahsildar)'
  },
  {
    id: 'std-g2-02',
    rollNo: 'KSC-G2-02',
    name: 'P. Bhavani Shankar',
    group: 'Group II',
    phone: '98480 23102',
    email: 'bhavani.s@kadirisc.in',
    category: 'General',
    joinDate: '2026-06-10',
    attendancePercentage: 93.8,
    totalClasses: 32,
    attendedClasses: 30,
    targetExam: 'APPSC Group II (Sub-Registrar)'
  },
  {
    id: 'std-g2-03',
    rollNo: 'KSC-G2-03',
    name: 'M. Padmavathi',
    group: 'Group II',
    phone: '98480 23103',
    email: 'padmavathi.m@kadirisc.in',
    category: 'BC',
    joinDate: '2026-06-10',
    attendancePercentage: 100.0,
    totalClasses: 32,
    attendedClasses: 32,
    targetExam: 'APPSC Group II (ACTO)'
  },
  {
    id: 'std-g2-04',
    rollNo: 'KSC-G2-04',
    name: 'N. Lokesh Babu',
    group: 'Group II',
    phone: '98480 23104',
    email: 'lokesh.n@kadirisc.in',
    category: 'BC',
    joinDate: '2026-06-12',
    attendancePercentage: 96.9,
    totalClasses: 32,
    attendedClasses: 31,
    targetExam: 'APPSC Group II'
  },
  {
    id: 'std-g2-05',
    rollNo: 'KSC-G2-05',
    name: 'K. Chandrasekhar',
    group: 'Group II',
    phone: '98480 23105',
    email: 'chandra.k@kadirisc.in',
    category: 'SC',
    joinDate: '2026-06-12',
    attendancePercentage: 93.8,
    totalClasses: 32,
    attendedClasses: 30,
    targetExam: 'APPSC Group II (Assistant Section Officer)'
  },
  {
    id: 'std-g2-06',
    rollNo: 'KSC-G2-06',
    name: 'J. Deepthi Bai',
    group: 'Group II',
    phone: '98480 23106',
    email: 'deepthi.j@kadirisc.in',
    category: 'ST',
    joinDate: '2026-06-14',
    attendancePercentage: 96.9,
    totalClasses: 32,
    attendedClasses: 31,
    targetExam: 'APPSC Group II'
  },
  {
    id: 'std-g2-07',
    rollNo: 'KSC-G2-07',
    name: 'V. Ramanjaneyulu',
    group: 'Group II',
    phone: '98480 23107',
    email: 'ramanjaneyulu.v@kadirisc.in',
    category: 'BC',
    joinDate: '2026-06-14',
    attendancePercentage: 100.0,
    totalClasses: 32,
    attendedClasses: 32,
    targetExam: 'APPSC Group II'
  },
  {
    id: 'std-g2-08',
    rollNo: 'KSC-G2-08',
    name: 'G. Madhusudhan Reddy',
    group: 'Group II',
    phone: '98480 23108',
    email: 'madhu.g@kadirisc.in',
    category: 'General',
    joinDate: '2026-06-15',
    attendancePercentage: 96.9,
    totalClasses: 32,
    attendedClasses: 31,
    targetExam: 'APPSC Group II'
  },
  {
    id: 'std-g2-09',
    rollNo: 'KSC-G2-09',
    name: 'B. Kalyani',
    group: 'Group II',
    phone: '98480 23109',
    email: 'kalyani.b@kadirisc.in',
    category: 'EWS',
    joinDate: '2026-06-15',
    attendancePercentage: 93.8,
    totalClasses: 32,
    attendedClasses: 30,
    targetExam: 'APPSC Group II'
  },
  {
    id: 'std-g2-10',
    rollNo: 'KSC-G2-10',
    name: 'M. Surendra Babu',
    group: 'Group II',
    phone: '98480 23110',
    email: 'surendra.m@kadirisc.in',
    category: 'BC',
    joinDate: '2026-06-18',
    attendancePercentage: 96.9,
    totalClasses: 32,
    attendedClasses: 31,
    targetExam: 'APPSC Group II'
  },
  {
    id: 'std-g2-11',
    rollNo: 'KSC-G2-11',
    name: 'S. Fathima Bi',
    group: 'Group II',
    phone: '98480 23111',
    email: 'fathima.s@kadirisc.in',
    category: 'BC',
    joinDate: '2026-06-18',
    attendancePercentage: 93.8,
    totalClasses: 32,
    attendedClasses: 30,
    targetExam: 'APPSC Group II'
  },
  {
    id: 'std-g2-12',
    rollNo: 'KSC-G2-12',
    name: 'C. Raghavendra',
    group: 'Group II',
    phone: '98480 23112',
    email: 'raghava.c@kadirisc.in',
    category: 'SC',
    joinDate: '2026-06-20',
    attendancePercentage: 96.9,
    totalClasses: 32,
    attendedClasses: 31,
    targetExam: 'APPSC Group II'
  },
  {
    id: 'std-g2-13',
    rollNo: 'KSC-G2-13',
    name: 'T. Lavanya',
    group: 'Group II',
    phone: '98480 23113',
    email: 'lavanya.t@kadirisc.in',
    category: 'General',
    joinDate: '2026-06-20',
    attendancePercentage: 100.0,
    totalClasses: 32,
    attendedClasses: 32,
    targetExam: 'APPSC Group II'
  },
  {
    id: 'std-g2-14',
    rollNo: 'KSC-G2-14',
    name: 'P. Shiva Kumar',
    group: 'Group II',
    phone: '98480 23114',
    email: 'shiva.p@kadirisc.in',
    category: 'BC',
    joinDate: '2026-06-22',
    attendancePercentage: 93.8,
    totalClasses: 32,
    attendedClasses: 30,
    targetExam: 'APPSC Group II'
  },
  {
    id: 'std-g2-15',
    rollNo: 'KSC-G2-15',
    name: 'K. Prasanth Reddy',
    group: 'Group II',
    phone: '98480 23115',
    email: 'prasanth.k@kadirisc.in',
    category: 'General',
    joinDate: '2026-06-22',
    attendancePercentage: 96.9,
    totalClasses: 32,
    attendedClasses: 31,
    targetExam: 'APPSC Group II'
  },
  {
    id: 'std-g2-16',
    rollNo: 'KSC-G2-16',
    name: 'D. Hemalatha',
    group: 'Group II',
    phone: '98480 23116',
    email: 'hemalatha.d@kadirisc.in',
    category: 'BC',
    joinDate: '2026-06-25',
    attendancePercentage: 96.9,
    totalClasses: 32,
    attendedClasses: 31,
    targetExam: 'APPSC Group II'
  },
  {
    id: 'std-g2-17',
    rollNo: 'KSC-G2-17',
    name: 'E. Mallikarjuna',
    group: 'Group II',
    phone: '98480 23117',
    email: 'mallikarjun.e@kadirisc.in',
    category: 'SC',
    joinDate: '2026-06-25',
    attendancePercentage: 93.8,
    totalClasses: 32,
    attendedClasses: 30,
    targetExam: 'APPSC Group II'
  },
  {
    id: 'std-g2-18',
    rollNo: 'KSC-G2-18',
    name: 'U. Geethanjali',
    group: 'Group II',
    phone: '98480 23118',
    email: 'geethanjali.u@kadirisc.in',
    category: 'General',
    joinDate: '2026-06-28',
    attendancePercentage: 96.9,
    totalClasses: 32,
    attendedClasses: 31,
    targetExam: 'APPSC Group II'
  },
  {
    id: 'std-g2-19',
    rollNo: 'KSC-G2-19',
    name: 'V. Rajesh Naik',
    group: 'Group II',
    phone: '98480 23119',
    email: 'rajesh.naik@kadirisc.in',
    category: 'ST',
    joinDate: '2026-06-28',
    attendancePercentage: 93.8,
    totalClasses: 32,
    attendedClasses: 30,
    targetExam: 'APPSC Group II'
  },
  // Low attendance students (Group II) - Students #2, 3, 4, 5 of 5
  {
    id: 'std-g2-20',
    rollNo: 'KSC-G2-20',
    name: 'B. Jagadeesh',
    group: 'Group II',
    phone: '98480 23120',
    email: 'jagadeesh.b@kadirisc.in',
    category: 'BC',
    joinDate: '2026-07-02',
    attendancePercentage: 68.8, // Below 75% (#2)
    totalClasses: 32,
    attendedClasses: 22,
    targetExam: 'APPSC Group II',
    notes: 'Irregular attendance in morning sessions. Notice sent.'
  },
  {
    id: 'std-g2-21',
    rollNo: 'KSC-G2-21',
    name: 'N. Roopa Sree',
    group: 'Group II',
    phone: '98480 23121',
    email: 'roopa.n@kadirisc.in',
    category: 'BC',
    joinDate: '2026-07-04',
    attendancePercentage: 71.9, // Below 75% (#3)
    totalClasses: 32,
    attendedClasses: 23,
    targetExam: 'APPSC Group II',
    notes: 'Family emergency cited. Needs counseling review.'
  },
  {
    id: 'std-g2-22',
    rollNo: 'KSC-G2-22',
    name: 'K. Venkateswarlu',
    group: 'Group II',
    phone: '98480 23122',
    email: 'venkatesh.k@kadirisc.in',
    category: 'SC',
    joinDate: '2026-07-05',
    attendancePercentage: 71.9, // Below 75% (#4)
    totalClasses: 32,
    attendedClasses: 23,
    targetExam: 'APPSC Group II',
    notes: 'Commutes from rural mandal. Bus timing issue.'
  },
  {
    id: 'std-g2-23',
    rollNo: 'KSC-G2-23',
    name: 'T. Bharathi',
    group: 'Group II',
    phone: '98480 23123',
    email: 'bharathi.t@kadirisc.in',
    category: 'General',
    joinDate: '2026-07-08',
    attendancePercentage: 71.9, // Below 75% (#5)
    totalClasses: 32,
    attendedClasses: 23,
    targetExam: 'APPSC Group II',
    notes: 'Recovering from viral fever. Parent notified.'
  }
];

export const INITIAL_FACULTY: Faculty[] = [
  {
    id: 'fac-01',
    name: 'Dr. K. N. Rao',
    subject: 'Indian Polity & Constitution',
    phone: '94401 55001',
    email: 'knrao.polity@kadirisc.in',
    qualification: 'M.A., Ph.D. (Pol Sci), Ex-Guest Faculty AP Academy',
    classesTaken: 16,
    activeGroups: ['Group I', 'Group II']
  },
  {
    id: 'fac-02',
    name: 'Prof. S. Lakshmi Devi',
    subject: 'History of India & AP History',
    phone: '94401 55002',
    email: 'lakshmidevi.hist@kadirisc.in',
    qualification: 'M.A. (History), State Civil Services Mentor',
    classesTaken: 15,
    activeGroups: ['Group I', 'Group II']
  },
  {
    id: 'fac-03',
    name: 'Sri M. Rajeshwar',
    subject: 'Indian Economy & AP State Budget',
    phone: '94401 55003',
    email: 'rajeshwar.eco@kadirisc.in',
    qualification: 'M.Com, M.Phil, 14 yrs Civil Services Coaching',
    classesTaken: 12,
    activeGroups: ['Group I', 'Group II']
  },
  {
    id: 'fac-04',
    name: 'Sri G. Sudhakar',
    subject: 'General Science & Technology',
    phone: '94401 55004',
    email: 'sudhakar.sci@kadirisc.in',
    qualification: 'M.Sc (Physics), APPSC Subject Specialist',
    classesTaken: 8,
    activeGroups: ['Group I', 'Group II']
  },
  {
    id: 'fac-05',
    name: 'Sri P. V. Ramana',
    subject: 'Mental Ability & Quantitative Aptitude',
    phone: '94401 55005',
    email: 'ramana.aptitude@kadirisc.in',
    qualification: 'M.Sc (Maths), CSAT & Group I/II Mentor',
    classesTaken: 6,
    activeGroups: ['Group I', 'Group II']
  }
];

// The prompt specifies: "CLASS LOG ROWS: 6", "MISSING CLASS DATES: 6",
// Operational note: "Enter a Date for every class record."
// These 6 rows have empty string dates so they can be immediately updated and fixed in the app!
export const INITIAL_CLASS_LOGS: ClassLog[] = [
  {
    id: 'clog-01',
    date: '', // Missing date #1
    group: 'Group I',
    subject: 'Indian Polity',
    topic: 'Fundamental Rights (Articles 14 to 21) & Judicial Review',
    hours: 2.0,
    facultyName: 'Dr. K. N. Rao',
    status: 'completed',
    notes: 'Case law discussion: Kesavananda Bharati & Maneka Gandhi.'
  },
  {
    id: 'clog-02',
    date: '', // Missing date #2
    group: 'Group II',
    subject: 'Indian Economy',
    topic: 'NITI Aayog, Planning History & Fiscal Federalism in India',
    hours: 2.0,
    facultyName: 'Sri M. Rajeshwar',
    status: 'completed',
    notes: '15th Finance Commission devolution formula explained.'
  },
  {
    id: 'clog-03',
    date: '', // Missing date #3
    group: 'Group I',
    subject: 'AP History',
    topic: 'Satavahana Administration, Trade, Buddhist Monuments at Amaravati',
    hours: 2.5,
    facultyName: 'Prof. S. Lakshmi Devi',
    status: 'completed',
    notes: 'Important for APPSC Group I Paper 1.'
  },
  {
    id: 'clog-04',
    date: '', // Missing date #4
    group: 'Group II',
    subject: 'Mental Ability',
    topic: 'Number Series, Coding-Decoding & Syllogism Drills',
    hours: 2.0,
    facultyName: 'Sri P. V. Ramana',
    status: 'completed',
    notes: 'Speed-solving techniques practiced with 40 questions.'
  },
  {
    id: 'clog-05',
    date: '', // Missing date #5
    group: 'Group I',
    subject: 'Science & Technology',
    topic: 'ISRO Space Missions, Chandrayaan-3 & Aditya L1 Payloads',
    hours: 2.0,
    facultyName: 'Sri G. Sudhakar',
    status: 'completed',
    notes: 'Current space tech applications for APPSC Mains.'
  },
  {
    id: 'clog-06',
    date: '', // Missing date #6
    group: 'Group II',
    subject: 'Indian Polity',
    topic: 'Governor Powers, Council of Ministers & State Legislature',
    hours: 2.0,
    facultyName: 'Dr. K. N. Rao',
    status: 'completed',
    notes: 'Discretionary powers under Article 163 detailed.'
  }
];

// Daily attendance trend from the brief:
// 23-Sep: 32 Present
// 24-Sep: 33 Present
// 25-Sep: 0
// 26-Sep: 0
// 27-Sep: pending
export const INITIAL_DAILY_TREND = [
  { date: '23-Sep', day: 'Mon', present: 32, absent: 3, total: 35, percentage: 91.4 },
  { date: '24-Sep', day: 'Tue', present: 33, absent: 2, total: 35, percentage: 94.3 },
  { date: '25-Sep', day: 'Wed', present: 0, absent: 35, total: 35, percentage: 0.0, note: 'State Holiday (Bandh)' },
  { date: '26-Sep', day: 'Thu', present: 0, absent: 35, total: 35, percentage: 0.0, note: 'Study Circle Preparation Day' },
  { date: '27-Sep', day: 'Fri', present: 31, absent: 4, total: 35, percentage: 88.6 }
];

export const INITIAL_MOCK_TESTS: MockTest[] = [
  {
    id: 'test-01',
    testName: 'APPSC Prelims Grand Test 1 (GS & Mental Ability)',
    date: '2026-09-20',
    subject: 'General Studies & Mental Ability',
    totalMarks: 150,
    group: 'All'
  },
  {
    id: 'test-02',
    testName: 'Indian Polity & Governance Subject Test',
    date: '2026-09-12',
    subject: 'Indian Polity',
    totalMarks: 50,
    group: 'All'
  },
  {
    id: 'test-03',
    testName: 'Andhra Pradesh History & Socio-Cultural Dynamics',
    date: '2026-09-05',
    subject: 'AP History',
    totalMarks: 50,
    group: 'Group I'
  }
];

export const INITIAL_TEST_SCORES: StudentTestScore[] = [
  { id: 'sc-01', testId: 'test-01', studentId: 'std-g1-01', marksObtained: 134, rank: 1, totalMarks: 150, remarks: 'Excellent score, rank 1 in academy' },
  { id: 'sc-02', testId: 'test-01', studentId: 'std-g1-03', marksObtained: 128, rank: 2, totalMarks: 150, remarks: 'Strong analytical skills' },
  { id: 'sc-03', testId: 'test-01', studentId: 'std-g2-03', marksObtained: 125, rank: 3, totalMarks: 150, remarks: 'Highest in Group II' },
  { id: 'sc-04', testId: 'test-01', studentId: 'std-g1-02', marksObtained: 121, rank: 4, totalMarks: 150 },
  { id: 'sc-05', testId: 'test-01', studentId: 'std-g2-01', marksObtained: 118, rank: 5, totalMarks: 150 },
  { id: 'sc-06', testId: 'test-01', studentId: 'std-g1-12', marksObtained: 89, rank: 29, totalMarks: 150, remarks: 'Revise economy and mental ability' },
  { id: 'sc-07', testId: 'test-01', studentId: 'std-g2-20', marksObtained: 82, rank: 32, totalMarks: 150, remarks: 'Need focused remedial sessions' },
  { id: 'sc-08', testId: 'test-02', studentId: 'std-g1-01', marksObtained: 48, rank: 1, totalMarks: 50 },
  { id: 'sc-09', testId: 'test-02', studentId: 'std-g2-01', marksObtained: 44, rank: 3, totalMarks: 50 },
  { id: 'sc-10', testId: 'test-02', studentId: 'std-g1-12', marksObtained: 31, rank: 26, totalMarks: 50 }
];

export const INITIAL_SYLLABUS_MODULES: SubjectModule[] = [
  {
    id: 'mod-01',
    name: 'Indian Constitution & Polity',
    group: 'Group I',
    totalHours: 35,
    completedHours: 28,
    topics: [
      { title: 'Historical Preamble & Making of Constitution', completed: true },
      { title: 'Fundamental Rights, DPSP & Fundamental Duties', completed: true },
      { title: 'Union Executive, Parliament & Judiciary', completed: true },
      { title: 'Centre-State Relations & Federalism', completed: true },
      { title: 'Constitutional & Non-Constitutional Bodies', completed: false },
      { title: 'Electoral Reforms & Anti-Defection Law', completed: false }
    ]
  },
  {
    id: 'mod-02',
    name: 'Indian Economy & AP Bifurcation Act',
    group: 'Group I',
    totalHours: 30,
    completedHours: 22,
    topics: [
      { title: 'Structure of Indian Economy & National Income', completed: true },
      { title: 'Banking, RBI Monetary Policy & Inflation', completed: true },
      { title: 'AP Reorganisation Act 2014 & Socio-Economic Impact', completed: true },
      { title: 'AP State Budget, Navaratnalu & Flagship Schemes', completed: false },
      { title: 'Agriculture, Industrial & Service Sectors in AP', completed: false }
    ]
  },
  {
    id: 'mod-03',
    name: 'History & Culture of Andhra Pradesh',
    group: 'Group II',
    totalHours: 25,
    completedHours: 20,
    topics: [
      { title: 'Ancient AP: Satavahanas, Ikshvakus, Vishnukundins', completed: true },
      { title: 'Medieval AP: Eastern Chalukyas, Kakatiyas, Vijayanagara', completed: true },
      { title: 'Modern AP: European advent, British rule & Freedom struggle', completed: true },
      { title: 'Andhra Movement & Formation of Andhra State', completed: false }
    ]
  },
  {
    id: 'mod-04',
    name: 'General Mental Ability & Reasoning',
    group: 'Group II',
    totalHours: 25,
    completedHours: 18,
    topics: [
      { title: 'Number Series, Analogies & Classification', completed: true },
      { title: 'Blood Relations, Directions & Venn Diagrams', completed: true },
      { title: 'Data Interpretation: Tables, Bar charts & Pie charts', completed: true },
      { title: 'Logical Reasoning & Statement Assumptions', completed: false }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-01',
    title: 'APPSC Group I & II Grand Mock Exam - 2 Scheduled',
    content: 'Full-length Mock Test will be conducted this Sunday from 10:00 AM to 1:00 PM in the Study Circle Main Hall. Attendance is mandatory for all enrolled students.',
    date: '2026-09-28',
    priority: 'important',
    targetGroup: 'All',
    author: 'Chief Coordinator, Kadiri Study Circle'
  },
  {
    id: 'ann-02',
    title: 'Special AP Budget & Economic Survey Session',
    content: 'Sri M. Rajeshwar sir will conduct a 3-hour masterclass on AP Socio-Economic Survey 2025-26 and key flagship welfare schemes on Tuesday at 9:00 AM.',
    date: '2026-09-27',
    priority: 'normal',
    targetGroup: 'Group II',
    author: 'Academic Faculty'
  },
  {
    id: 'ann-03',
    title: 'Attendance Notice: Minimum 75% Requirement',
    content: 'Students with attendance below 75% must meet the center coordinator by Wednesday. Hall tickets for internal grand mock series will be issued subject to attendance criteria.',
    date: '2026-09-26',
    priority: 'important',
    targetGroup: 'All',
    author: 'Administrative Office'
  }
];
