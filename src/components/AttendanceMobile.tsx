import { useEffect, useRef, useState } from 'react';
import { CalendarCheck, Check, ChevronLeft, ChevronRight, Clock, GraduationCap, LayoutGrid, Search, Users, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AttendanceStatus } from '../types';
import { InstitutionBrand } from './InstitutionBrand';

type Screen = 'Attendance' | 'Students' | 'Reports' | 'Account';
const tabs = [['Attendance', CalendarCheck], ['Students', Users], ['Reports', LayoutGrid], ['Account', GraduationCap]] as const;
const statuses = [['present', 'Present', Check], ['absent', 'Absent', X], ['late', 'Late', Clock]] as const;
function localDate(d = new Date()) {
 return [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-');
}
export function AttendanceMobile({ onOpenPortal }: { onOpenPortal: () => void }) {
 const {students, faculty, currentUser, login, logout, dailyAttendanceHistory, markDailyAttendance} = useApp();
 const [view,setView] = useState<Screen>('Attendance');
 const [group,setGroup] = useState('All');
 const [date,setDate] = useState(localDate);
 const [query,setQuery] = useState('');
 const [sheet,setSheet] = useState<Record<string,AttendanceStatus>>({});
 const [notice,setNotice] = useState('');
 const [dirty,setDirty] = useState(false);
 const search = useRef<HTMLInputElement>(null);
 const heading = useRef<HTMLHeadingElement>(null);
 const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'teacher';
 const isStudent = currentUser?.role === 'student';
 useEffect(()=>{setSheet(dailyAttendanceHistory[date] || {});setDirty(false);},[date,dailyAttendanceHistory]);
 useEffect(()=>{
  const protect = (e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue='';}};
  window.addEventListener('beforeunload',protect);
  return ()=>window.removeEventListener('beforeunload',protect);
 },[dirty]);
 const roster = students.filter(s=>!isStudent || s.id===currentUser.id).filter(s=>group==='All'||s.group===group);
 const visible = roster.filter(s=>(s.name+' '+s.rollNo).toLowerCase().includes(query.toLowerCase()));
 const reportSheet = dailyAttendanceHistory[date] || {};
 const count = (status:AttendanceStatus, source=sheet)=>roster.filter(s=>source[s.id]===status).length;
 const marked = roster.filter(s=>sheet[s.id]).length;
 const recorded = roster.filter(s=>reportSheet[s.id]).length;
 const attending = count('present',reportSheet)+count('late',reportSheet);
 function navigate(screen:Screen){setView(screen);setQuery('');setNotice('');window.scrollTo({top:0});requestAnimationFrame(()=>heading.current?.focus({preventScroll:true}));}
 function mayDiscard(){return !dirty || window.confirm('Discard unsaved attendance changes?');}
 function changeDay(value:string){if(!value || value>localDate() || !mayDiscard())return;setDate(value);setNotice('');}
 function shiftDay(amount:number){const d=new Date(date+'T12:00:00');d.setDate(d.getDate()+amount);changeDay(localDate(d));}
 function mark(id:string,status:AttendanceStatus){setSheet(s=>({...s,[id]:status}));setDirty(true);setNotice('');}
 function startDemo(){
  if(!faculty.length){setNotice('No faculty record is available. Open the management portal from Account.');return;}
  const result=login('teacher',faculty[0].email,'teacher');
  setNotice(result.success?'Faculty demo opened. Records stay on this device.':result.message || 'Unable to open demo.');
 }
 function save(){if(!canEdit || !dirty){setNotice('Choose Present, Absent or Late for a student, then save.');return;}markDailyAttendance(date,sheet);setDirty(false);setNotice('Attendance saved on this device.');}
 function primaryAction(){
  if(view==='Account'){if(mayDiscard())onOpenPortal();}
  else if(view==='Students'){search.current?.focus();search.current?.scrollIntoView({block:'center'});}
  else if(view==='Reports' || isStudent)navigate(view==='Reports'?'Attendance':'Reports');
  else if(!currentUser)startDemo();else save();
 }
 const title={Attendance:'Daily attendance',Students:'Student register',Reports:'Attendance reports',Account:'Your account'}[view];
 const description={
  Attendance:isStudent?'Review your attendance to keep your preparation on track.':'For Kadiri faculty. Record attendance so no missed class goes unnoticed.',
  Students:'For faculty and students. Find a learner and review their attendance record.',
  Reports:'For faculty and students. Review saved attendance and spot missed classes early.',
  Account:'For Kadiri faculty and students. Manage your session and access the full portal.'
 }[view];
 const action=view==='Account'?'Open management portal':view==='Students'?'Find a student':view==='Reports'?'Open daily attendance':isStudent?'View attendance report':!currentUser?'Try faculty demo':'Save attendance';
 return <main className="ksc-app">
  <InstitutionBrand />
  <section className="ksc-content" aria-label={title}>
   <header className="ksc-intro"><h1 ref={heading} tabIndex={-1}>{title}</h1><p>{description}</p></header>
   <div className="ksc-action"><p>{view==='Attendance'?currentUser?marked+' of '+roster.length+' marked'+(dirty?' · Unsaved':marked?' · Saved':' · Not started'):'Demo records · Stored on this device':view==='Students'?roster.length+' students in this class':view==='Reports'?'Reports include saved records only':'Local demo · Cloud sync unavailable'}</p><button className="ksc-primary" onClick={primaryAction}>{action}</button></div>
   {notice && <p className="ksc-notice" role="status">{notice}</p>}
   {view!=='Account' && <div className="ksc-controls">
    {view!=='Students' && <div className="ksc-date"><button aria-label="Previous day" onClick={()=>shiftDay(-1)}><ChevronLeft size={20}/></button><label><span>Attendance date</span><input aria-label="Attendance date" type="date" value={date} max={localDate()} onChange={e=>changeDay(e.target.value)}/></label><button aria-label="Next day" disabled={date>=localDate()} onClick={()=>shiftDay(1)}><ChevronRight size={20}/></button></div>}
    <label className="ksc-field"><span>Class</span><select value={group} onChange={e=>setGroup(e.target.value)}><option value="All">All students</option><option>Group I</option><option>Group II</option></select></label>
   </div>}
   {view==='Attendance' && <><dl className="ksc-tally">{statuses.map(([status,label])=><div key={status}><dt>{label}</dt><dd>{count(status)}</dd></div>)}</dl><div className="ksc-section-heading"><h2>Roll call</h2>{canEdit && <button className="ksc-secondary" onClick={()=>{setSheet(s=>({...s,...Object.fromEntries(roster.map(st=>[st.id,'present']))}));setDirty(true);setNotice('All students in this class marked present. Review before saving.');}}>All present</button>}</div>{!currentUser && <p className="ksc-help">Choose Try faculty demo to mark this register.</p>}{isStudent && <p className="ksc-help">Your faculty manages these records.</p>}</>}
   {(view==='Attendance'||view==='Students') && <><label className="ksc-search"><Search size={20} aria-hidden="true"/><input ref={search} aria-label="Search students by name or roll number" placeholder="Name or roll number" value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="ksc-register">{visible.map(s=><article className="ksc-row" key={s.id}><div><h3>{s.name}</h3><p>{s.rollNo} · {s.group}</p></div>{view==='Students'?<p className="ksc-student-rate"><strong>{s.attendancePercentage}%</strong> attendance</p>:<div className="ksc-marks" role="group" aria-label={'Attendance for '+s.name}>{statuses.map(([status,label,Icon])=><button key={status} disabled={!canEdit} aria-label={s.name+': '+label} aria-pressed={sheet[s.id]===status} className={sheet[s.id]===status?'selected':''} onClick={()=>mark(s.id,status)}><Icon size={18} aria-hidden="true"/>{label}</button>)}</div>}</article>)}{!visible.length && <p className="ksc-empty">No students match. Try another name or choose All students.</p>}</div></>}
   {view==='Reports' && <><section className="ksc-report" aria-label="Saved attendance summary"><h2>{new Date(date+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</h2><p className="ksc-percentage">{recorded?Math.round(attending/recorded*100)+'%':'—'}</p><p>{recorded?attending+' attending out of '+recorded+' marked':'No saved attendance for this day.'}</p><p>{roster.length-recorded} unmarked · Late students count as attending.</p></section><h2 className="ksc-section-heading">Recent saved registers</h2><div className="ksc-history">{Object.keys(dailyAttendanceHistory).sort().reverse().slice(0,14).map(day=><button key={day} onClick={()=>changeDay(day)} aria-label={'View register for '+day}><span>{new Date(day+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span><span>{roster.filter(s=>dailyAttendanceHistory[day][s.id]).length} marked</span><ChevronRight size={20}/></button>)}{!Object.keys(dailyAttendanceHistory).length && <p>No saved registers yet. Open daily attendance to begin.</p>}</div></>}
   {view==='Account' && <><section className="ksc-account"><h2>{currentUser?.name || 'Welcome to Kadiri'}</h2><p>{currentUser?currentUser.role==='teacher'?'Faculty demo session':currentUser.role+' session':'You are viewing the attendance demo.'}</p></section><section className="ksc-account"><h2>Your records stay here</h2><p>This app stores attendance in this browser. Cloud backup and secure sign-in are not connected. Clearing browser data removes saved records.</p></section>{currentUser && <button className="ksc-secondary" onClick={()=>{if(mayDiscard()){logout();setSheet(dailyAttendanceHistory[date]||{});setDirty(false);setNotice('Signed out.');}}}>Sign out</button>}</>}
  </section>
  <nav className="ksc-nav" aria-label="Main navigation">{tabs.map(([name,Icon])=><button key={name} aria-current={view===name?'page':undefined} onClick={()=>navigate(name)}><Icon size={20} aria-hidden="true"/><span>{name}</span></button>)}</nav>
 </main>;
}
