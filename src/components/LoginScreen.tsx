import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { InstitutionBrand } from './InstitutionBrand';

export const LoginScreen: React.FC = () => {
 const { login, faculty, students } = useApp();
 const [role,setRole] = useState<Role>('teacher');
 const [identifier,setIdentifier] = useState(faculty[0]?.email || '');
 const [password,setPassword] = useState('teacher');
 const [error,setError] = useState('');
 function choose(value:Role){
  setRole(value);setError('');
  setIdentifier(value==='admin'?'admin@kadirisc.in':value==='teacher'?faculty[0]?.email || '':students[0]?.rollNo || '');
  setPassword(value==='admin'?'admin':value==='teacher'?'teacher':'student');
 }
 function submit(e:React.FormEvent){e.preventDefault();const result=login(role,identifier,password);if(!result.success)setError(result.message || 'Check your details and try again.');}
 return <main className="ksc-login">
  <InstitutionBrand />
  <div className="ksc-content">
   <header className="ksc-intro"><h1>Open your demo portal</h1><p>For faculty, coordinators and students. Manage attendance and learning records in one place.</p></header>
   <p className="ksc-login-note">Demo access only. These details do not provide secure authentication.</p>
   <form onSubmit={submit}>
    <label className="ksc-field"><span>Your role</span><select value={role} onChange={e=>choose(e.target.value as Role)}><option value="teacher">Faculty</option><option value="admin">Coordinator</option><option value="student">Student</option></select></label>
    <label className="ksc-field"><span>{role==='student'?'Roll number':'Email or faculty ID'}</span><input required value={identifier} onChange={e=>setIdentifier(e.target.value)} autoComplete="username"/></label>
    <label className="ksc-field"><span>Demo password</span><input required type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password"/></label>
    {error && <p role="alert" className="ksc-notice">{error}</p>}
    <button type="submit" className="ksc-primary">Open {role==='teacher'?'faculty':role==='admin'?'coordinator':'student'} demo</button>
   </form>
   <p className="ksc-login-note">Records stay in this browser. Choose a role, then open the demo to continue.</p>
  </div>
 </main>;
};
