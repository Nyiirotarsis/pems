
"use client";

import { useEffect } from 'react';

export default function AlbumShowPage() {
  useEffect(() => {
    const loginScreen=document.getElementById('loginScreen') as HTMLElement;
    const dashboard=document.getElementById('dashboard') as HTMLElement;
    const dashboardTitle=document.getElementById('dashboardTitle') as HTMLElement;
    const dashboardDesc=document.getElementById('dashboardDesc') as HTMLElement;
    const menu=document.getElementById('menu') as HTMLElement;
    const contentArea=document.getElementById('contentArea') as HTMLElement;
    const userInfo=document.getElementById('userInfo') as HTMLElement;

    const organizationThemes: Record<string, { color: string }> = {};

    const roleData: Record<string, any> = {
      SuperAdmin:{
        title:'Super Admin Dashboard',
        desc:'Full control for Pacific Events IT Admin. Create portals, manage sub-admins, editors, and clients.',
        menu:['Create Client Portal','Manage Editors','System Reports','Cloud Storage Overview','Settings']
      },
      Editor:{
        title:'Editors Dashboard',
        desc:'Media Team access to upload, edit, and publish event content.',
        menu:['Upload Media','Tag & Categorize','Assignments','Pending Approvals','Publish Highlights']
      },
      SubAdmin:{
        title:'Sub Admin (Organization Admin)',
        desc:'Client organization administrator with access to their portal and internal members.',
        menu:['Manage Organization Media','Add/View Staff Users','Approve Access','Customize Theme','View Reports','Settings']
      },
      Client:{
        title:'Client Personnel Portal',
        desc:'View and download organization event recordings, photos, and highlights.',
        menu:['My Events','Downloads','Support']
      }
    }

    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.onclick=()=>{
            const role=(document.getElementById('roleSelect') as HTMLSelectElement).value;
            const username=(document.getElementById('username') as HTMLInputElement).value||'User';
            userInfo.textContent=username+' — '+role;
            showDashboard(role,username);
        }
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick=()=>{
            dashboard.classList.add('hidden');
            loginScreen.classList.remove('hidden');
            userInfo.textContent='';
            document.documentElement.style.setProperty('--accent','#0b63d6');
        }
    }

    function showDashboard(role: string, username: string){
      const data=roleData[role];
      if(!data)return;
      loginScreen.classList.add('hidden');
      dashboard.classList.remove('hidden');
      dashboardTitle.textContent=data.title;
      dashboardDesc.textContent=data.desc;
      menu.innerHTML='';
      data.menu.forEach((m: string)=>{
        const li=document.createElement('li');
        li.textContent=m;
        li.onclick=()=>showContent(role,m,username);
        menu.appendChild(li);
      });
      contentArea.innerHTML=`<p>Select an option to continue as <strong>${role}</strong>.</p>`;
      if(role==='SubAdmin'&& organizationThemes[username]){
        applyTheme(username);
      }
    }

    function showContent(role: string, menuItem: string, username: string){
      if(menuItem==='Settings'){
        contentArea.innerHTML=`<h3>Settings</h3>
        <p>Manage global configurations, user logs, statistics, themes, and subscriptions.</p>
        <ul>
          <li><strong>Theme Manager:</strong> Update or reset theme options across roles.</li>
          <li><strong>User Management:</strong> Add, edit, or deactivate user accounts.</li>
          <li><strong>Log Statistics:</strong> View user activities and system logs.</li>
          <li><strong>Subscription:</strong> Manage payment plans and active organization subscriptions.</li>
        </ul>`;
      }
      else if(role==='SubAdmin'&&menuItem==='Customize Theme'){
        contentArea.innerHTML=`<h3>${menuItem}</h3><p>Adjust your organization's portal theme and logo for branding consistency.</p>
        <label>Primary Color:</label><input type='color' id='themeColor' value='${organizationThemes[username]?.color||'#0b63d6'}' />
        <label>Upload Logo:</label><input type='file' id='logoUpload' accept='image/*' />
        <button class='btn' id='applyThemeBtn'>Apply Theme</button>
        <div class='note' style='margin-top:10px;'>Changes will only affect your organization portal.</div>`;
        const applyThemeBtn = document.getElementById('applyThemeBtn');
        if (applyThemeBtn) {
            applyThemeBtn.onclick=()=>{
              const color=(document.getElementById('themeColor') as HTMLInputElement).value;
              organizationThemes[username]={color};
              applyTheme(username);
              alert('Theme updated for your organization portal!');
            }
        }
      } else if(role==='Editor'&&menuItem==='Upload Media'){
        contentArea.innerHTML=`<h3>${menuItem}</h3>
        <p>Upload or organize media for assigned productions. Choose between uploading a new production or updating an existing one.</p>
        <div style='margin-bottom:10px;'>
          <label>Select Action:</label>
          <select id='uploadAction'>
            <option value='new'>Create New Production Folder</option>
            <option value='existing'>Upload to Existing Production Folder</option>
          </select>
        </div>
        <div id='productionForm'></div>`;

        const uploadAction = document.getElementById('uploadAction') as HTMLSelectElement;
        if (uploadAction) {
            uploadAction.onchange=function(){
              const choice=this.value;
              const form=document.getElementById('productionForm') as HTMLElement;
              if(choice==='new'){
                form.innerHTML=`
                  <label>Production Title/Theme:</label><input type='text' id='prodTitle' placeholder='e.g., Annual General Meeting 2025' />
                  <label>Conference or Workshop Date:</label><input type='date' id='prodDate' />
                  <label>Category:</label>
                  <select id='prodCategory'>
                    <option>Conference</option>
                    <option>Wedding</option>
                    <option>Burial Ceremony</option>
                    <option>Workshop</option>
                    <option>Meeting</option>
                    <option>Other</option>
                  </select>
                  <label>Tags (Select applicable):</label>
                  <select id='prodTags' multiple>
                    <option>Conference</option>
                    <option>Wedding</option>
                    <option>Burial Ceremony</option>
                    <option>Workshop</option>
                    <option>Meeting</option>
                    <option>Other</option>
                  </select>
                  <label>Upload Files:</label><input type='file' id='newFiles' multiple />
                  <button class='btn'>Create Folder & Upload</button>
                `;
              }else{
                form.innerHTML=`
                  <label>Select Existing Folder:</label>
                  <select id='existingFolder'>
                    <option>AGM 2024</option>
                    <option>Trade Fair 2025</option>
                  </select>
                  <label>Category:</label>
                  <select id='updateCategory'>
                    <option>Conference</option>
                    <option>Wedding</option>
                    <option>Burial Ceremony</option>
                    <option>Workshop</option>
                    <option>Meeting</option>
                    <option>Other</option>
                  </select>
                  <label>Tags (Select applicable):</label>
                  <select id='updateTags' multiple>
                    <option>Conference</option>
                    <option>Wedding</option>
                    <option>Burial Ceremony</option>
                    <option>Workshop</option>
                    <option>Meeting</option>
                    <option>Other</option>
                  </select>
                  <label>Choose Files:</label><input type='file' id='updateFiles' multiple />
                  <button class='btn'>Upload to Folder</button>
                `;
              }
            }
            uploadAction.dispatchEvent(new Event('change'));
        }
      } else if(role==='Editor'&&menuItem==='Assignments'){
        contentArea.innerHTML=`<h3>Assignments</h3>
        <p>View and manage your assigned projects, productions, and event coverage tasks.</p>
        <ul>
          <li><strong>Conference Coverage:</strong> Trade Fair 2025 — Due 15th Oct 2025</li>
          <li><strong>Wedding Production:</strong> Nakabugu Wedding — Due 22nd Oct 2025</li>
          <li><strong>Workshop Recording:</strong> ICT Skills Upgrade — Due 1st Nov 2025</li>
        </ul>`;
      } else {
        contentArea.innerHTML=`<h3>${menuItem}</h3><p>Feature coming soon.</p>`;
      }
    }

    function applyTheme(username: string){
      const theme=organizationThemes[username];
      if(theme){
        document.documentElement.style.setProperty('--accent',theme.color);
      }
    }
  }, []);

  return (
    <>
      <style>{`
        :root{--bg:#f6f7fb;--card:#ffffff;--accent:#0b63d6;--muted:#666}
        html,body{height:100%;margin:0;font-family:Inter,system-ui,Segoe UI,Roboto,'Helvetica Neue',Arial}
        body{background:var(--bg);color:#111}
        header{background:linear-gradient(90deg,#052a63 0%, #0b63d6 100%);color:#fff;padding:18px 28px;display:flex;align-items:center;justify-content:space-between}
        header h1{font-size:18px;margin:0}
        .container{max-width:1100px;margin:22px auto;padding:0 18px}
        .card{background:var(--card);border-radius:10px;padding:14px;box-shadow:0 6px 18px rgba(11,99,214,0.06)}
        .btn{background:var(--accent);color:#fff;border:none;padding:8px 12px;border-radius:8px;cursor:pointer}
        .btn.secondary{background:#e9eefb;color:#052a63}
        .note{font-size:13px;color:var(--muted)}
        .hidden{display:none!important}
        .grid{display:grid;grid-template-columns:260px 1fr;gap:18px}
        .client-list{list-style:none;padding:0;margin:0}
        .client-list li{padding:8px;border-radius:8px;cursor:pointer}
        .client-list li.active{background:rgba(11,99,214,0.08)}
        input[type=text],input[type=password],input[type=color],select,input[type=date]{padding:8px;border-radius:8px;border:1px solid #e2e7f0;width:100%;margin-bottom:10px;box-sizing: border-box;}
      `}</style>
      <header>
        <h1>Album Show — Cloud-Based Digital Media Platform</h1>
        <div id="userInfo" className="note"></div>
      </header>

      <div className="container">
        <div id="loginScreen" className="card" style={{maxWidth: '400px', margin: 'auto', marginTop: '80px', textAlign: 'center'}}>
          <h2>Sign In</h2>
          <p className="note">Select your role to simulate platform access</p>
          <select id="roleSelect">
            <option value="SuperAdmin">Super Admin (Pacific IT)</option>
            <option value="Editor">Editor (Media Team)</option>
            <option value="SubAdmin">Sub Admin (Client Organization)</option>
            <option value="Client">Client Personnel</option>
          </select>
          <input type="text" id="username" placeholder="Username" />
          <input type="password" id="password" placeholder="Password" />
          <button className="btn" id="loginBtn">Login</button>
        </div>

        <div id="dashboard" className="hidden">
          <div className="card" style={{marginBottom: '16px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h2 id="dashboardTitle"></h2>
              <button className="btn secondary" id="logoutBtn">Logout</button>
            </div>
            <p className="note" id="dashboardDesc"></p>
          </div>

          <div className="grid">
            <aside id="sidebar" className="card">
              <h3>Navigation</h3>
              <ul className="client-list" id="menu"></ul>
            </aside>

            <main id="mainArea" className="card">
              <div id="contentArea">
                <p>Welcome to Album Show. Select a menu option to continue.</p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
