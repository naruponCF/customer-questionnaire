import type { QuestionnaireSubmission, UserRecord } from "../types";

export function renderAdminLogin(error?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Login — Cloudflare Questionnaire</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;display:flex;justify-content:center;align-items:center;min-height:100vh;}
    .login-card{background:#fff;border-radius:12px;padding:2rem;box-shadow:0 2px 10px rgba(0,0,0,0.1);width:350px;}
    .login-card h1{font-size:1.3rem;color:#F38020;text-align:center;margin-bottom:1.5rem;}
    .field{margin-bottom:1rem;}
    .field label{display:block;font-weight:600;font-size:0.85rem;margin-bottom:0.25rem;}
    .field input{width:100%;padding:0.6rem 0.75rem;border:1px solid #ddd;border-radius:6px;font-size:0.9rem;}
    .field input:focus{outline:none;border-color:#F38020;box-shadow:0 0 0 2px rgba(243,128,32,0.15);}
    .btn{width:100%;padding:0.75rem;background:#F38020;color:#fff;border:none;border-radius:8px;font-size:1rem;font-weight:700;cursor:pointer;}
    .btn:hover{background:#e06d1a;}
    .error{color:#721c24;background:#f8d7da;border:1px solid #f5c6cb;border-radius:6px;padding:0.75rem;margin-bottom:1rem;font-size:0.85rem;text-align:center;}
    .back{text-align:center;margin-top:1rem;}
    .back a{color:#999;font-size:0.85rem;text-decoration:none;}
  </style>
</head>
<body>
  <div class="login-card">
    <h1>🔐 Admin Login</h1>
    ${error ? `<div class="error">${error}</div>` : ""}
    <form method="POST" action="/admin/login">
      <div class="field"><label>Username</label><input type="text" name="username" required autofocus></div>
      <div class="field"><label>Password</label><input type="password" name="password" required></div>
      <button type="submit" class="btn">Login</button>
    </form>
    <div class="back"><a href="/">← Back to Questionnaire</a></div>
  </div>
</body>
</html>`;
}

function esc(s: string | undefined): string {
  return (s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

export function renderAdminDashboard(
  submissions: QuestionnaireSubmission[],
  users: UserRecord[],
  role: string,
  username: string,
  distributor: string | undefined,
  csrfToken: string,
): string {
  const isAdmin = role === "superadmin";
  const visibleSubs = isAdmin ? submissions : submissions.filter(s => s.distributor === distributor);

  const tableRows = visibleSubs.map(s => `<tr data-id="${s.id}">
    <td>${new Date(s.submittedAt).toLocaleString()}</td>
    <td>${esc(s.general.companyName) || "—"}</td>
    <td>${esc(s.general.country) || "—"}</td>
    <td>${esc(s.general.contractTerm) || "—"}</td>
    <td>${esc(s.general.currentVendor) || "—"}</td>
    <td>${isAdmin
      ? `<select class="distributor-select" data-id="${s.id}"><option value=""${!s.distributor?" selected":""}>— Unassigned —</option><option value="SoftDebut"${s.distributor==="SoftDebut"?" selected":""}>SoftDebut</option><option value="Nforce"${s.distributor==="Nforce"?" selected":""}>Nforce</option></select>`
      : `<span class="badge ${s.distributor==="SoftDebut"?"badge-soft":"badge-nforce"}">${esc(s.distributor)||"Unassigned"}</span>`}
    </td>
    <td class="actions"><button class="view-btn" data-id="${s.id}">View</button><button class="editlink-btn" data-id="${s.id}">Edit Link</button>${isAdmin?`<button class="delete-btn" data-id="${s.id}">Delete</button>`:""}</td>
  </tr>`).join("");

  // For non-superadmin, only show their own row
  const visibleUsers = isAdmin ? users : users.filter(u => u.username === username);

  const userRows = visibleUsers.map(u => `<tr data-username="${esc(u.username)}">
    <td>${esc(u.username)}</td>
    <td><span class="badge ${u.role==="superadmin"?"badge-admin":"badge-user"}">${u.role}</span></td>
    <td>${esc(u.distributor) || "—"}</td>
    <td class="actions">
      <button class="pw-btn" data-username="${esc(u.username)}">Reset Password</button>
      ${isAdmin && (u.role!=="superadmin"||users.filter(x=>x.role==="superadmin").length>1) ? `<button class="rmuser-btn" data-username="${esc(u.username)}">Remove</button>` : ""}
    </td>
  </tr>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard — Cloudflare Questionnaire</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;color:#1e1e1e;}
    .topbar{background:#F38020;color:#fff;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center;}
    .topbar h1{font-size:1.2rem;}
    .topbar .user-info{font-size:0.85rem;opacity:0.95;}
    .topbar a{color:#fff;text-decoration:none;font-size:0.85rem;margin-left:1rem;}
    .tabs{display:flex;gap:0;max-width:1200px;margin:1.5rem auto 0;padding:0 1.5rem;}
    .tab{padding:0.75rem 1.5rem;background:#e0e0e0;border:none;cursor:pointer;font-size:0.9rem;font-weight:600;border-radius:8px 8px 0 0;}
    .tab.active{background:#fff;color:#F38020;}
    .tab-content{display:none;max-width:1200px;margin:0 auto;padding:1.5rem;}
    .tab-content.active{display:block;}
    .stats{display:flex;gap:1rem;margin-bottom:1.5rem;}
    .stat-card{background:#fff;border-radius:10px;padding:1rem 1.5rem;box-shadow:0 1px 3px rgba(0,0,0,0.08);flex:1;text-align:center;}
    .stat-card .num{font-size:2rem;font-weight:800;color:#F38020;}
    .stat-card .lbl{font-size:0.8rem;color:#888;margin-top:0.25rem;}
    .table-wrap{background:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);overflow:hidden;}
    table{width:100%;border-collapse:collapse;}
    th{background:#f9f9f9;padding:0.75rem 1rem;text-align:left;font-size:0.8rem;font-weight:700;color:#666;text-transform:uppercase;border-bottom:2px solid #eee;}
    td{padding:0.65rem 1rem;font-size:0.85rem;border-bottom:1px solid #f0f0f0;}
    tr:hover{background:#fafafa;}
    .actions{display:flex;gap:0.5rem;}
    .view-btn,.delete-btn,.pw-btn,.rmuser-btn,.editlink-btn{padding:0.3rem 0.7rem;border:none;border-radius:5px;font-size:0.8rem;cursor:pointer;font-weight:600;}
    .view-btn{background:#F38020;color:#fff;} .view-btn:hover{background:#e06d1a;}
    .delete-btn{background:#e74c3c;color:#fff;} .delete-btn:hover{background:#c0392b;}
    .pw-btn{background:#3498db;color:#fff;} .pw-btn:hover{background:#2980b9;}
    .rmuser-btn{background:#e74c3c;color:#fff;} .rmuser-btn:hover{background:#c0392b;}
    .editlink-btn{background:#27ae60;color:#fff;} .editlink-btn:hover{background:#229954;}
    .distributor-select{padding:0.25rem 0.5rem;border:1px solid #ddd;border-radius:4px;font-size:0.8rem;}
    .badge{padding:0.2rem 0.6rem;border-radius:10px;font-size:0.75rem;font-weight:600;}
    .badge-soft{background:#e8f5e9;color:#2e7d32;} .badge-nforce{background:#e3f2fd;color:#1565c0;}
    .badge-admin{background:#fff3cd;color:#856404;} .badge-user{background:#e3f2fd;color:#1565c0;}
    .modal-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;justify-content:center;align-items:flex-start;padding:2rem 1rem;overflow-y:auto;}
    .modal-overlay.active{display:flex;}
    .modal{background:#fff;border-radius:12px;max-width:800px;width:100%;padding:2rem;box-shadow:0 4px 20px rgba(0,0,0,0.15);}
    .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;border-bottom:2px solid #F38020;padding-bottom:0.75rem;}
    .modal-header h2{font-size:1.2rem;color:#F38020;}
    .modal-close{background:none;border:none;font-size:1.5rem;cursor:pointer;color:#999;}
    .modal-section{margin-bottom:1.5rem;}
    .modal-section h3{font-size:0.95rem;color:#333;margin-bottom:0.5rem;border-left:3px solid #F38020;padding-left:0.5rem;}
    .modal-section .kv{display:grid;grid-template-columns:200px 1fr;gap:0.25rem 1rem;font-size:0.85rem;}
    .modal-section .kv .k{color:#888;font-weight:600;} .modal-section .kv .v{color:#333;}
    .empty{text-align:center;padding:3rem;color:#999;}
    .filter-bar{margin-bottom:1rem;display:flex;gap:1rem;align-items:center;}
    .filter-bar input{padding:0.4rem 0.75rem;border:1px solid #ddd;border-radius:6px;font-size:0.85rem;}
    .add-user-form{background:#fff;border-radius:12px;padding:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,0.08);margin-bottom:1.5rem;}
    .add-user-form h3{font-size:1rem;color:#F38020;margin-bottom:1rem;}
    .add-user-form .field-row{display:grid;grid-template-columns:1fr 1fr 1fr 1fr auto;gap:0.75rem;align-items:end;}
    .add-user-form label{display:block;font-size:0.8rem;font-weight:600;margin-bottom:0.25rem;}
    .add-user-form input,.add-user-form select{width:100%;padding:0.5rem;border:1px solid #ddd;border-radius:6px;font-size:0.85rem;}
    .add-user-form button{padding:0.5rem 1.2rem;background:#F38020;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:0.85rem;white-space:nowrap;}
    .add-user-form button:hover{background:#e06d1a;}
    @media(max-width:700px){.add-user-form .field-row{grid-template-columns:1fr;}}
    .toast{position:fixed;bottom:2rem;right:2rem;background:#333;color:#fff;padding:0.75rem 1.5rem;border-radius:8px;font-size:0.85rem;display:none;z-index:2000;}
    .toast.show{display:block;} .toast.success{background:#2e7d32;} .toast.error{background:#c0392b;}
    .pw-modal-body input{width:100%;padding:0.5rem;border:1px solid #ddd;border-radius:6px;font-size:0.9rem;margin-bottom:0.75rem;}
    .pw-modal-body button{padding:0.5rem 1rem;background:#3498db;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:600;}
  </style>
</head>
<body>
  <div class="topbar">
    <h1>📋 Questionnaire Admin Dashboard</h1>
    <div class="user-info">Logged in as <strong>${esc(username)}</strong> (${esc(role)})${distributor?` · ${esc(distributor)}`:""}<a href="/admin/logout">Logout</a></div>
  </div>

  <div class="tabs">
    <button class="tab active" onclick="switchTab('submissions')">Submissions</button>
    <button class="tab" onclick="switchTab('users')">User Management</button>
  </div>

  <!-- Submissions tab -->
  <div class="tab-content active" id="tab-submissions">
    ${isAdmin ? `<div class="stats">
      <div class="stat-card"><div class="num">${visibleSubs.length}</div><div class="lbl">Total Submissions</div></div>
      <div class="stat-card"><div class="num">${visibleSubs.filter(s=>s.distributor==="SoftDebut").length}</div><div class="lbl">SoftDebut</div></div>
      <div class="stat-card"><div class="num">${visibleSubs.filter(s=>s.distributor==="Nforce").length}</div><div class="lbl">Nforce</div></div>
      <div class="stat-card"><div class="num">${visibleSubs.filter(s=>!s.distributor).length}</div><div class="lbl">Unassigned</div></div>
    </div>` : `<div class="stats">
      <div class="stat-card"><div class="num">${visibleSubs.length}</div><div class="lbl">Total Submissions</div></div>
    </div>`}
    <div class="filter-bar"><input type="text" id="searchBox" placeholder="🔍 Search company name..." onkeyup="filterTable()"></div>
    <div class="table-wrap">
      <table id="subsTable"><thead><tr><th>Submitted At</th><th>Company</th><th>Country</th><th>Contract Term</th><th>Current Vendor</th><th>Distributor</th><th>Actions</th></tr></thead>
      <tbody>${tableRows || '<tr><td colspan="7" class="empty">No submissions found.</td></tr>'}</tbody></table>
    </div>
  </div>

  ${isAdmin ? `
  <!-- User management tab -->
  <div class="tab-content" id="tab-users">
    <div class="add-user-form">
      <h3>➕ Add New User</h3>
      <div class="field-row">
        <div><label>Username</label><input type="text" id="newUsername" placeholder="username"></div>
        <div><label>Password</label><input type="password" id="newPassword" placeholder="password"></div>
        <div><label>Role</label><select id="newRole"><option value="user">User</option><option value="superadmin">Superadmin</option></select></div>
        <div><label>Distributor (if user)</label><select id="newDistributor"><option value="">— None —</option><option value="SoftDebut">SoftDebut</option><option value="Nforce">Nforce</option></select></div>
        <div><button onclick="addUser()">Add User</button></div>
      </div>
    </div>
    <div class="table-wrap">
      <table id="usersTable"><thead><tr><th>Username</th><th>Role</th><th>Distributor</th><th>Actions</th></tr></thead>
      <tbody>${userRows}</tbody></table>
    </div>
  </div>` : ""}

  <div class="modal-overlay" id="modalOverlay">
    <div class="modal" id="modalContent">
      <div class="modal-header"><h2 id="modalTitle">Submission Details</h2><button class="modal-close" onclick="closeModal()">&times;</button></div>
      <div id="modalBody"></div>
    </div>
  </div>

  <div class="modal-overlay" id="pwModalOverlay">
    <div class="modal" style="max-width:400px;">
      <div class="modal-header"><h2>🔑 Reset Password</h2><button class="modal-close" onclick="closePwModal()">&times;</button></div>
      <div class="pw-modal-body">
        <p style="font-size:0.85rem;margin-bottom:0.75rem;">Resetting password for: <strong id="pwUsername"></strong></p>
        <input type="password" id="pwNew" placeholder="New password">
        <button onclick="resetPassword()">Confirm Reset</button>
      </div>
    </div>
  </div>

  <div class="toast" id="toast"></div>

  <script>
    const CSRF = "${csrfToken}";
    const ROLE = "${role}";
    const allSubs = ${JSON.stringify(visibleSubs)};
    let pwResetTarget = "";

    function esc(s){const d=document.createElement('div');d.textContent=s||'';return d.innerHTML;}
    function switchTab(name){
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById('tab-'+name).classList.add('active');
    }
    function filterTable(){
      const q=document.getElementById('searchBox').value.toLowerCase();
      document.querySelectorAll('#subsTable tbody tr').forEach(row=>{
        const c=row.cells[1]?.textContent.toLowerCase()||'';
        row.style.display=c.includes(q)?'':'none';
      });
    }
    function showToast(msg,type){const t=document.getElementById('toast');t.textContent=msg;t.className='toast show '+(type||'');setTimeout(()=>t.className='toast',3000);}
    function closeModal(){document.getElementById('modalOverlay').classList.remove('active');}
    function closePwModal(){document.getElementById('pwModalOverlay').classList.remove('active');}

    document.querySelectorAll('.view-btn').forEach(btn=>btn.addEventListener('click',()=>{
      const sub=allSubs.find(s=>s.id===btn.dataset.id);if(!sub)return;
      document.getElementById('modalTitle').textContent='📋 '+(sub.general.companyName||'Unknown');
      function rs(title,obj){if(!obj)return'';const rows=Object.entries(obj).map(([k,v])=>{if(!v)return'';return'<div class="k">'+k.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase())+'</div><div class="v">'+esc(v)+'</div>';}).join('');return'<div class="modal-section"><h3>'+title+'</h3><div class="kv">'+rows+'</div></div>';}
      document.getElementById('modalBody').innerHTML='<div class="modal-section"><div class="kv"><div class="k">Submission ID</div><div class="v">'+esc(sub.id)+'</div><div class="k">Submitted At</div><div class="v">'+new Date(sub.submittedAt).toLocaleString()+'</div><div class="k">Distributor</div><div class="v">'+esc(sub.distributor||'Unassigned')+'</div></div></div>'+rs('General',sub.general)+rs('Application Services',sub.appServices)+rs('Zero Trust',sub.zeroTrust)+rs('Developer Platform',sub.developer)+rs('Additional',sub.additional);
      document.getElementById('modalOverlay').classList.add('active');
    }));

    document.querySelectorAll('.delete-btn').forEach(btn=>btn.addEventListener('click',async()=>{
      if(!confirm('Delete this submission? This cannot be undone.'))return;
      try{const r=await fetch('/admin/api/delete/'+btn.dataset.id,{method:'DELETE',headers:{'X-CSRF-Token':CSRF}});
      if(r.ok){showToast('Submission deleted','success');btn.closest('tr').remove();}else showToast('Delete failed','error');
      }catch{showToast('Delete failed','error');}
    }));

    document.querySelectorAll('.editlink-btn').forEach(btn=>btn.addEventListener('click',()=>{
      const link=window.location.origin+'/edit/'+btn.dataset.id;
      navigator.clipboard.writeText(link).then(()=>{
        showToast('Edit link copied to clipboard!','success');
      }).catch(()=>{
        prompt('Copy this edit link:',link);
      });
    }));

    document.querySelectorAll('.distributor-select').forEach(sel=>sel.addEventListener('change',async()=>{
      try{const r=await fetch('/admin/api/assign-distributor',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':CSRF},body:JSON.stringify({id:sel.dataset.id,distributor:sel.value})});
      if(r.ok)showToast('Distributor updated to '+(sel.value||'Unassigned'),'success');else showToast('Update failed','error');
      }catch{showToast('Update failed','error');}
    }));

    async function addUser(){
      const u=document.getElementById('newUsername').value.trim();
      const p=document.getElementById('newPassword').value;
      const r=document.getElementById('newRole').value;
      const d=document.getElementById('newDistributor').value;
      if(!u||!p){showToast('Username and password required','error');return;}
      try{
        const resp=await fetch('/admin/api/users/add',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':CSRF},body:JSON.stringify({username:u,password:p,role:r,distributor:d})});
        const data=await resp.json();
        if(data.success){showToast('User added','success');setTimeout(()=>location.reload(),1000);}
        else showToast(data.error||'Failed to add user','error');
      }catch{showToast('Failed to add user','error');}
    }

    document.querySelectorAll('.rmuser-btn').forEach(btn=>btn.addEventListener('click',async()=>{
      if(!confirm('Remove user '+btn.dataset.username+'?'))return;
      try{
        const resp=await fetch('/admin/api/users/remove',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':CSRF},body:JSON.stringify({username:btn.dataset.username})});
        const data=await resp.json();
        if(data.success){showToast('User removed','success');btn.closest('tr').remove();}else showToast(data.error||'Failed','error');
      }catch{showToast('Failed','error');}
    }));

    document.querySelectorAll('.pw-btn').forEach(btn=>btn.addEventListener('click',()=>{
      pwResetTarget=btn.dataset.username;
      document.getElementById('pwUsername').textContent=pwResetTarget;
      document.getElementById('pwNew').value='';
      document.getElementById('pwModalOverlay').classList.add('active');
    }));

    async function resetPassword(){
      const pw=document.getElementById('pwNew').value;
      if(!pw){showToast('Password required','error');return;}
      try{
        const resp=await fetch('/admin/api/users/password',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':CSRF},body:JSON.stringify({username:pwResetTarget,newPassword:pw})});
        const data=await resp.json();
        if(data.success){showToast('Password reset','success');closePwModal();}else showToast(data.error||'Failed','error');
      }catch{showToast('Failed','error');}
    }

    document.getElementById('modalOverlay').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal();});
    document.getElementById('pwModalOverlay').addEventListener('click',e=>{if(e.target===e.currentTarget)closePwModal();});
  </script>
</body>
</html>`;
}
