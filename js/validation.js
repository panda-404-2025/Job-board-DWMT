const form = document.getElementById('form')

const lastname_input = document.getElementById('lastname-input')
const firstname_input = document.getElementById('firstname-input')
const email_input = document.getElementById('email-input')

const phone_input = document.getElementById('phone-input')

const company_input = document.getElementById('company-input')

const password_input = document.getElementById('password-input')

const repeat_password_input = document.getElementById('repeat-password-input')

const error_message = document.getElementById('error-message')


form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    let errors = []
    if (lastname_input){
        let type = document.querySelector("input[name='type-people']:checked").value;
        if(type === "Candidate" ){
            type = 3;
        }else if(type === "Company" ){
            type = 2;
        }else{
            errors.push('Please select a role');
        }
        let company_id = document.getElementById("companySelect").value;
        if(type == 2){
            skills = null;
        }else if(type == 3){
            company_id = null;
        }
        errors = await getSignupFormErrors(lastname_input.value, firstname_input.value, email_input.value, password_input.value, repeat_password_input.value,phone_input.value)
        if (errors.length>0){
            e.preventDefault();
            error_message.innerText = errors.join(". ")
        }
        else{
            await register(firstname_input.value,lastname_input.value,email_input.value,phone_input.value,password_input.value,skills,type,parseInt(company_id))
            await login(email_input.value,password_input.value)
        }

    }
    else {
        errors = getLoginFormErrors(email_input.value, password_input.value)
        if (errors.length>0){
            e.preventDefault();
            error_message.innerText = errors.join(". ");
            throw new Error(errors.join(". "));
        }
        login(email_input.value, password_input.value)
    }  
})

async function register(first_name,last_name,email,phone,password,skills,type,company){
    try {
        const res = await fetch(`http://localhost:3000/users/`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "first_name":first_name,
                "last_name":last_name,
                "email":email,
                "phone":phone,
                "password":password,
                "skills":skills,
                "type":type,
                "company_id":company
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
async function getAllEmails(){
    try {
        const res = await fetch(`http://localhost:3000/users/email`);
        if (!res.ok) {
            throw new Error(`Erreur HTTP: ${res.status}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
async function login(email,password){
    const res = await fetch(`http://localhost:3000/`,{
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "email": email , "password": password }),
    }).then(
        response => response.json()
            .then(data => {
                console.log(data)
                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('first_name', data.user.first_name);
                    localStorage.setItem('last_name', data.user.last_name);
                    localStorage.setItem('email', data.user.email);
                    localStorage.setItem('phone', data.user.phone);
                    localStorage.setItem('accessToken',data.accessToken);
                    localStorage.setItem('role', JSON.stringify(data.user.type_people));
                    if(data.user.type_people === 1){
                        window.location.replace('../admin.html');
                    }
                    else if(data.user.type_people === 2){
                        localStorage.setItem('company_id',data.user.company_id);
                        window.location.replace('../company.html');
                    }
                    else if (data.user.type_people === 3){
                        window.location.replace('../candidate.html');
                    }
                }
            ).catch((error) => {
                console.error('Error:', error);
            }))
}

async function getSignupFormErrors(lastname, firstname, email, password, repeatPassword,phone,type,skills,company_id){
    let errors = []
    let allEmails = await getAllEmails();
    if(lastname === '' || lastname == null){
        errors.push('Lastname is required')
        lastname_input.parentElement.classList.add('incorrect')
    }

    if(firstname === '' || firstname == null){
        errors.push('Firstname is required')
        firstname_input.parentElement.classList.add('incorrect')
    }

    if(email === '' || email == null){
        errors.push('Email is required')
        email_input.parentElement.classList.add('incorrect')
    }
    const exists = allEmails.emails.some(e => e.email === email);
    if(exists){
        errors.push('Email already registered')
        email_input.parentElement.classList.add('incorrect')
    }

    if(password === '' || password == null){
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
    }

    if(password.length<8){
        errors.push('Password must have at least 8 characters')
        password_input.parentElement.classList.add('incorrect')
    }

    if(password !== repeatPassword){
        errors.push('Password does not match repeated password')
        password_input.parentElement.classList.add('incorrect')
        repeat_password_input.parentElement.classList.add('incorrect')
    }
    if(phone === '' || phone == null){
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
    }

    return errors;
}

function getLoginFormErrors(email, password){
    let errors = []

    if(email === '' || email == null){
        errors.push('Email is required')
        email_input.parentElement.classList.add('incorrect')
    }

    if(password === '' || password == null){
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
    }

    return errors;
}

const allInputs = [lastname_input, firstname_input, email_input, password_input, repeat_password_input].filter(input => input!= null)

allInputs.forEach(input => {
    input.addEventListener('input', ()=>{
        if(input.parentElement.classList.contains('incorrect')){
            input.parentElement.classList.remove('incorrect')
            error_message.innerText = ''
        }
    })
})

const candidateRadio = document.getElementById('candidate');
const companyRadio   = document.getElementById('company');
const skillsRow      = document.getElementById('skillsRow');

function updateSkillsVisibility() {
    const selected = document.querySelector('input[name="type-people"]:checked');
    const isCandidate = selected && selected.value === "Candidate";
    skillsRow.hidden = !isCandidate;
}

document.querySelectorAll('input[name="type-people"]').forEach(radio => {
  radio.addEventListener('change', updateSkillsVisibility);
});

updateSkillsVisibility();

const skillsInput  = document.getElementById('skillsInput');
const chipsWrap    = document.getElementById('skillsChips');
const skillsHidden = document.getElementById('skillsHidden');

let skills = [];

function renderChips() {
    chipsWrap.innerHTML = '';
    skills.forEach((s, i) => {
        const chip = document.createElement('span');
        chip.className = 'chip-skill';
        chip.innerHTML = `${escapeHtml(s)} <button type="button" class="chip-x" aria-label="remove">×</button>`;
        chip.querySelector('.chip-x').addEventListener('click', () => {
        skills.splice(i, 1);
        renderChips();
        syncHidden();
        });
        chipsWrap.appendChild(chip);
    });
}

function syncHidden() {
    skillsHidden.value = JSON.stringify(skills);
}

function addSkill(raw) {
    const s = (raw || '').trim();
    if (!s) return;
    if (skills.includes(s)) return;
    skills.push(s);
    renderChips();
    syncHidden();
}

function commitInput() {
    addSkill(skillsInput.value);
    skillsInput.value = '';
}

skillsInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        commitInput();
    }
});

skillsInput?.addEventListener('blur', commitInput);

document.getElementById('form')?.addEventListener('submit', () => {
    if (!skillsRow.hidden) commitInput();
});

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));
}

(function () {
    const _skillsRow  = (typeof skillsRow !== 'undefined' && skillsRow) ? skillsRow : document.getElementById('skillsRow');
    const companyRow  = document.getElementById('companyRow');
    const companySel  = document.getElementById('companySelect');
    const form        = document.getElementById('form');

    function updateRoleBlocks() {
        const picked = document.querySelector('input[name="type-people"]:checked');
        const role = picked ? picked.value : 'Candidate';
        const isCandidate = role === 'Candidate';

        _skillsRow?.toggleAttribute('hidden', !isCandidate);
        companyRow?.toggleAttribute('hidden', isCandidate);

        if (!isCandidate) loadCompaniesOnce();
    }

    document.querySelectorAll('input[name="type-people"]').forEach(r => {
        r.addEventListener('change', updateRoleBlocks);
    });

    updateRoleBlocks();

    let companiesLoaded = false;
    async function loadCompaniesOnce() {
        if (companiesLoaded) return;
        try {
        // 真实接口
        const resp = await fetch('http://localhost:3000/companies', {
            method:"GET",
            headers:{"Content-Type": "application/json",}
        });

        if (!resp.ok) throw new Error('Failed to load companies');
        const list = await resp.json();
        const companies =list.companies;

        companySel.innerHTML = '<option value="" selected disabled>Choose your company…</option>';
        companies.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            companySel.appendChild(opt);
        });
        companiesLoaded = true;
        } catch (err) {
        console.error(err);
        companySel.innerHTML = '<option value="">(Failed to load companies)</option>';
        }
    }

  // —— 表单提交兜底校验：Company 必须选公司 —— 
    form?.addEventListener('submit', (e) => {
    const picked = document.querySelector('input[name="type-people"]:checked');
        if (picked?.value === 'Company' && !companySel.value) {
        e.preventDefault();
        alert('Please choose your company.');
        companySel.focus();
        }
    });
})();

    
