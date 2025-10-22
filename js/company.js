/* -----------------------------
   Data fetching
------------------------------*/
const BASE_URL = 'http://localhost:3000';
const token = window.localStorage.getItem('accessToken');
const company_id = window.localStorage.getItem('company_id');

const role = window.localStorage.getItem('role');

if(!token){
    window.location.replace('../candidate.html');
    console.log("Error : User not identified")
}

if(role != 2){
    console.log("Error : User not Company");
    window.location.replace('../candidate.html');
}

function mustOk(res) {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}

function showMsg(msg) {
  alert(msg);
}

async function fetchApplications(jobId) {
  if (!jobId) throw new Error('jobId required');
  const res = await fetch(`${BASE_URL}/job_applications/ad/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  mustOk(res)
  return await res.json()
}

/* -----------------------------
   你提供的新增/更新/删除职位函数
------------------------------*/
async function getByAdId(id) {
    try {
        const res = await fetch(`http://localhost:3000/ads/${id}`, {
            method: 'GET',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getAdByCompanyId(id){
  try {
        const res = await fetch(`http://localhost:3000/ads/company/${id}`, {
            method: 'GET',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getAppByAdId(id) {
    try {
        const res = await fetch(`http://localhost:3000/job_applications/ad/${id}`, {
            method: 'GET',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function addAd(title,short_description,full_description,salary,position_type,location,schedule,experience,company_id) {
    try {
        const res = await fetch(`http://localhost:3000/ads/`, {
            method: 'POST',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
            body: JSON.stringify({
                title,
                short_description,
                full_description,
                salary,
                position_type,
                location,
                schedule,
                experience,
                company_id
            })
        });
        if (!res.ok) {
            throw new Error(`Erreur HTTP: ${res.status}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateAd(id,title,short_description,full_description,salary,position_type,location,schedule,experience,company_id) {
    try {
        const res = await fetch(`http://localhost:3000/ads/${id}`, {
            method: 'PATCH',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
            body: JSON.stringify({
                title,
                short_description,
                full_description,
                salary,
                position_type,
                location,
                schedule,
                experience,
                company_id
            })
        });
        
        if (!res.ok) {
            throw new Error(`Erreur HTTP: ${res.status}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteAd(id) {
    try {
        const res = await fetch(`http://localhost:3000/ads/${id}`, {
            method: 'DELETE',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

/* -----------------------------
   Utilities
------------------------------*/
function statusClass(status) {
  const s = (status || '').toLowerCase()
  if (s.includes('review')) return 'review'
  if (s.includes('accept')) return 'accepted'
  if (s.includes('reject')) return 'rejected'
  return 'applied'
}

function el(html) {
  const t = document.createElement('template')
  t.innerHTML = html.trim()
  return t.content.firstElementChild
}

function fmtDate(d) {
  try {
    const dt = new Date(d)
    return dt.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return d }
}

/* -----------------------------
   Render
------------------------------*/
async function render(data) {
    const ads = data.ads;
    const container = document.getElementById('jobsContainer');
    container.innerHTML = '';

    for (const ad of ads) {
        console.log(ad);

        const jobBanner = document.createElement('section');
        jobBanner.className = 'job-banner';

        const bannerInner = document.createElement('div');
        const title = document.createElement('h3');
        title.className = 'job-title';
        title.textContent = ad.title;

        const meta = document.createElement('div');
        meta.className = 'job-meta';

        meta.append(
            el(`<div class="chip">
            <img class="chip__icon" src="../images/explore_nearby_24dp_F3F3F3_FILL1_wght400_GRAD0_opsz24.svg" alt="">
            <span>${ad.location}</span>
          </div>`),
            el(`<div class="chip">
            <img class="chip__icon" src="../images/add_home_work_24dp_F3F3F3_FILL1_wght400_GRAD0_opsz24.svg" alt="">
            <span>${ad.schedule}</span>
          </div>`),
            el(`<div class="chip">
            <img class="chip__icon" src="../images/work_24dp_F3F3F3_FILL1_wght400_GRAD0_opsz24.svg" alt="">
            <span>${ad.position_type}</span>
          </div>`)
        );

        bannerInner.append(title, meta);

        const appsCount = document.createElement('div');
        appsCount.className = 'apps-count';
        appsCount.textContent = 'Chargement...';

        jobBanner.append(bannerInner, appsCount);

        const applications = await getAppByAdId(ad.id);
        console.log(applications);

        appsCount.textContent = `${applications.application.length} Application${applications.application.length > 1 ? 's' : ''}`;

        const list = document.createElement('section');
        list.className = 'list';
        list.setAttribute('aria-label', 'Applicants list');

        applications.application.forEach(app => {
            const card = el(`
        <article class="card" data-id="${app.id}">
          <div class="mainline">
            <div class="sub">${app.email} · Applied ${fmtDate(app.date_application)}</div>
          </div>
          <div class="actions">
            <button class="btn_primary" data-profile="open" type="button">View Profile</button>
          </div>
        </article>
      `);
            card.querySelector('[data-profile="open"]').addEventListener('click', () => openProfile(app));
            list.append(card);
        });

        const separator = document.createElement('br');

        container.append(jobBanner, separator, list);
    }
}

/* -----------------------------
   Modal
------------------------------*/
function openProfile(app) {
  const modal = document.getElementById('profileModal')
  document.getElementById('modalName').textContent = app.name

  const skills = (app.profile?.skills || [])
    .map(s => `<span class="chip" style="margin-right:8px">${s}</span>`)
    .join(' ')

  document.getElementById('modalBody').innerHTML = `
    <div style="display:grid; gap:10px">
      <div><strong>Email:</strong> ${app.email}</div>
      ${app.first_name ? `<div><strong>First Name:</strong> ${app.first_name}</div>` : ''}
      ${app.last_name ? `<div><strong>Last Name:</strong> ${app.last_name}</div>` : ''}
      ${app.message ? `<div><strong>Message:</strong> ${app.message}</div>` : ''}
    </div>
  `
  modal.showModal()
}

function closeModal() {
  document.getElementById('profileModal').close()
}

/* -----------------------------
   Boot
------------------------------*/
document.getElementById('closeModalBtn')?.addEventListener('click', closeModal)
document.getElementById('backBtn')?.addEventListener('click', e => { e.preventDefault(); history.back() })

;(async function init() {
  try {
    const data = await getAdByCompanyId(company_id)
    render(data)
  } catch (err) {
    console.error(err)
    document.getElementById('list').innerHTML =
      `<div class="card"><div class="mainline"><div class="name">Failed to load applications</div>
        <div class="sub">Please try again later.</div></div></div>`
  }
})()

// Company Profile

document.addEventListener('DOMContentLoaded', () => {
  const logout  = document.getElementById('logout');
  logout.addEventListener('click', ()=> {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        localStorage.removeItem('company_id');
        window.location.replace('../candidate.html');
  })
});


// 添加Manage Jobs 和 Post Job

(function(){
  const openPostBtn   = document.getElementById('openPostJob');
  const openManageBtn = document.getElementById('openManageJobs');

  const postDlg   = document.getElementById('postJobModal');
  const postForm  = document.getElementById('postJobForm');
  const postClose = document.getElementById('postJobClose');
  const postCancel= document.getElementById('postJobCancel');

  const manageDlg    = document.getElementById('manageJobsModal');
  const manageList   = document.getElementById('manageJobsList');
  const manageClose  = document.getElementById('manageJobsClose');
  const manageRefresh= document.getElementById('manageJobsRefresh');

  // 后端 API（仅保留列表接口）
  const API = {
    listMine: (id) => `http://localhost:3000/ads/company/${id}`
  };

  // 更稳的 dialog 显示/隐藏（兼容没有 showModal 的环境）
  function show(dlg){
    if (!dlg) return;
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
  }
  function hide(dlg){
    if (!dlg) return;
    if (typeof dlg.close === 'function') dlg.close();
    else dlg.removeAttribute('open');
  }

  // ========== Post Job ==========
  openPostBtn?.addEventListener('click', (e)=>{ e.preventDefault(); show(postDlg); });
  postClose?.addEventListener('click', ()=> hide(postDlg));
  postCancel?.addEventListener('click', ()=> hide(postDlg));

  postForm?.addEventListener('submit', async (e)=>{
    e.preventDefault();

    // 使用 addAd(...)（按你函数参数顺序传入）
    const title = document.getElementById('pj_title').value.trim();
    const short_description = document.getElementById('pj_short').value.trim();
    const full_description = document.getElementById('pj_full').value.trim();
    const salary = document.getElementById('pj_salary').value.trim();
    const position_type = document.getElementById('pj_type').value;
    const location = document.getElementById('pj_location').value.trim();
    const schedule = document.getElementById('pj_schedule').value.trim();
    const experience = document.getElementById('pj_experience').value.trim();
    const company_id = window.localStorage.getItem('company_id'); // 无需可置 null



    try{
      await addAd(
        title, short_description, full_description, salary,
        position_type, location, schedule, experience, company_id
      );
      hide(postDlg);
      if (manageDlg?.open) await loadJobs();
      alert('Job created.');
      postForm.reset();
      window.location.reload()
    }catch(err){
      console.error(err);
      alert('Failed to create job.');
    }
  });

  // ========== Manage Jobs ==========
  openManageBtn?.addEventListener('click', async (e)=>{
    e.preventDefault();
    show(manageDlg);
    await loadJobs();
  });
  manageClose?.addEventListener('click', ()=> hide(manageDlg));
  manageRefresh?.addEventListener('click', ()=> loadJobs());

  async function loadJobs(){
    if (!manageList) return;
    manageList.innerHTML = '<div class="card"><div>Loading…</div></div>';
    try{
      const res = await fetch(API.listMine(company_id), { headers: { Authorization: `Bearer ${token}` }});
      if(!res.ok) throw new Error('List failed');
      const rows = await res.json();
      const lesjobs = rows.ads || rows;

      if (!Array.isArray(lesjobs) || lesjobs.length === 0) {
        manageList.innerHTML = '<div class="card"><div>No jobs yet.</div></div>';
        return;
      }

      manageList.innerHTML = '';
      lesjobs.forEach(job=>{
        const card = document.createElement('div');
        card.className = 'card';
        // 同时渲染 Edit 和 Delete 两个按钮
        card.innerHTML = `
          <div>
            <div class="name" style="font-weight:600">${escapeHtml(job.title || '')}</div>
            <div class="meta">${escapeHtml(job.working_address || job.location || '')}
              · ${escapeHtml(job.position_type || job.type || '')}
              ${job.schedule ? ` · ${escapeHtml(job.schedule)}` : ''}
            </div>
          </div>
          <div class="actions" style="display:flex; gap:8px">
            <button class="btn" data-edit="${job.id}">Edit</button>
            <button class="btn" data-del="${job.id}">Delete</button>
          </div>
        `;

        // 绑定 Edit：打开编辑弹窗并预填
        card.querySelector('[data-edit]')?.addEventListener('click', () => openEdit(job));

        // 绑定 Delete：调用 deleteAd 并刷新
        card.querySelector('[data-del]')?.addEventListener('click', async () => {
          if (!confirm('Delete this job?')) return;
          try{
            await deleteAd(job.id);
            await loadJobs();
          }catch(err){
            console.error(err);
            alert('Failed to delete.');
          }
        });

        manageList.appendChild(card);
      });

    }catch(err){
      console.error(err);
      manageList.innerHTML = '<div class="card"><div>Failed to load.</div></div>';
    }
  }

  // 暴露给外部（编辑保存后刷新列表要用）
  window.loadJobs = loadJobs;

  // 简单转义，避免标题等被当作 HTML 注入
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
})();

// ===== Edit Job support =====
const editDlg   = document.getElementById('editJobModal');
const editForm  = document.getElementById('editJobForm');
const ejId      = document.getElementById('ej_id');
const ejTitle   = document.getElementById('ej_title');
const ejLoc     = document.getElementById('ej_location');
const ejSalary  = document.getElementById('ej_salary');
const ejType    = document.getElementById('ej_type');
const ejShort   = document.getElementById('ej_short');
const ejFull    = document.getElementById('ej_full');
const ejSched   = document.getElementById('ej_schedule');
const ejExperience = document.getElementById('ej_experience');

function openEdit(job){
  ejId.value    = job.id;
  ejTitle.value = job.title || '';
  ejLoc.value   = job.working_address || job.location || '';
  ejSalary.value= job.wages || job.salary || '';
  ejType.value  = job.position_type || job.type || 'CDI';
  ejShort.value = job.short_desc || job.short_description || '';
  ejFull.value  = job.description || job.full_description || '';
  ejSched.value = job.schedule || '';
  ejExperience.value = job.experience || '';

  editDlg.showModal();
}

window.openEdit = openEdit;

document.getElementById('editJobClose')?.addEventListener('click', ()=> editDlg.close());
document.getElementById('editJobCancel')?.addEventListener('click', ()=> editDlg.close());

// 保存修改（使用你提供的 updateAd）
editForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const id = ejId.value;

  // 与后端字段按你的 updateAd 参数顺序传入
  const title = ejTitle.value.trim();
  const short_description = ejShort.value.trim();
  const full_description = ejFull.value.trim();
  const salary = ejSalary.value.trim();
  const position_type = ejType.value;
  const location = ejLoc.value.trim();
  const schedule = ejSched.value.trim();
  const experience = ejExperience.value.trim();

  try{
    await updateAd(
      id, title, short_description, full_description, salary,
      position_type, location, schedule, experience
    );
    editDlg.close();
    if (typeof window.loadJobs === 'function') {
      await window.loadJobs(); // 重新加载管理列表
    }
    alert('Job updated.');
  }catch(err){
    console.error(err);
    alert('Failed to update job.');
  }
});