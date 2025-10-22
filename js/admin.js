let token = localStorage.getItem('accessToken');
if(!token){
    window.location.replace('../candidate.html');
    console.log("Error : User not identified")
}
let role = localStorage.getItem('role');
if(role != 1){
    window.location.replace('../candidate.html');
    console.log("Error : User not admin")
}
let btnLogOut = document.getElementById("btnLogOut");
btnLogOut.addEventListener("click", () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    window.location.replace('../candidate.html');
});
function showSection(sectionId) {
    const sections = ['ads', 'users', 'companies', 'applications'];

    sections.forEach(id => {
        const section = document.getElementById(id);
        if (id === sectionId) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}
window.onload = function() {
    showSection('ads');
};

function openModal(modalId, title, data = null) {
    const modal = document.getElementById(modalId);
    const titleEl = modal.querySelector('h2');
    const form = modal.querySelector('form');

    titleEl.textContent = title;

    if (data) {
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input){ input.value = data[key];}
        });
    } else {
        form.reset();
        let dateApplication = form.querySelector(`[name="date_application"]`)
        if(dateApplication){
            dateApplication.value = new Date().toISOString().substring(0, 10);
        }
    }

    modal.style.display = 'flex';
}
document.querySelector('#ads button').addEventListener('click', () => {
    openModal('modal-ads', 'Add Advertisement');
    populateCompanySelect();
});
document.querySelector('#users button').addEventListener('click', () => {
    openModal('modal-users', 'Add User');
    populateCompanySelect();
});
document.querySelector('#companies button').addEventListener('click', () => {
    openModal('modal-companies', 'Add Company');
});
document.querySelector('#applications button').addEventListener('click', () => {
    openModal('modal-applications', 'Add Application');
    populateAdSelect()
});


async function confirmDelete(type, id) {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
        await deleteEntity(type, id);
        location.reload();
    }
}
async function addEntity(type, data) {
    if(type == "ads"){
        const title = data.title;
        const short_description = data.short_description;
        const full_description = data.full_description;
        const salary = data.salary;
        const position_type = data.position_type;
        const location = data.location;
        const schedule = data.schedule;
        const experience = data.experience.toLowerCase();
        const company = data.company_id_select;
        console.log(data)
        return await addAd(title,short_description,full_description,salary,position_type,location,schedule,experience,company);
    }else if(type == "users"){
        const first_name = data.first_name;
        const last_name = data.last_name;
        const email = data.email;
        const phone = data.phone;
        const password = data.password;
        const type = data.type_people;
        if(type == 1){
            data.skills = null;
            data.company_id_select = null;
        }
        else if(type == 2){
            data.skills = null;
            if(data.company_id_select == undefined){
                throw new Error("Error: company required")
            }
            const company = data.company_id_select;
        }else if(type == 3){
            data.company_id_select = null;
            if(data.skills == undefined){
                throw new Error("Error: skills required")
            }
            data.skills = data.skills.split(',');
        }
        const skills = data.skills;
        const company_id = data.company_id_select;
        return await addUser(first_name,last_name,email,password,phone,skills,type,company_id);
    }else if(type == "companies"){
        const name = data.name;
        const address = data.address;
        const description = data.description;
        return await addCompany(name,address,description);
    }else if(type == "applications"){
        const first_name = data.first_name;
        const last_name = data.last_name;
        const email = data.email;
        const ad_id = data.ad_id;
        const message = data.message;
        return await addApplication(email,first_name,last_name, ad_id,message);
    }
}

async function editEntity(type, data) {
    if(type == "ads"){
        const id = data.id;
        const title = data.title;
        const short_description = data.short_description;
        const full_description = data.full_description;
        const salary = data.salary;
        const position_type = data.position_type;
        const location = data.location;
        const schedule = data.schedule;
        const experience = data.experience;
        const company = data.company_id_select;
        return await updateAd(id,title,short_description,full_description,salary,position_type,location,schedule,experience,company);
    }else if(type == "users"){
        const id = data.id;
        const first_name = data.first_name;
        const last_name = data.last_name;
        const email = data.email;
        const phone = data.phone;
        const password = data.password;
        const type = data.type_people;
        if(type == 1){
            data.skills = null;
            data.update_company_id_select = null;
        }
        else if(type == 2){
            data.skills = null;
            if(data.update_company_id_select == undefined){
                throw new Error("Error: company required")
            }
            const company = data.update_company_id_select;
        }else if(type == 3){
            data.update_company_id_select = null;
            if(data.skills == undefined){
                throw new Error("Error: skills required")
            }
            data.skills = data.skills.split(',');
        }
        const skills = data.skills;
        const company_id = data.update_company_id_select;
        if(data.password  !== data.old_password && data.password.replace(/\\s+/g, '') != ""){
            await updateUserPassword(id,password);
        }
            return await updateUser(id,first_name,last_name,email,phone,skills,type,company_id);
    }else if(type == "companies"){
        const id = data.id;
        const name = data.name;
        const address = data.address;
        const description = data.description;
        return await updateCompany(id, name, address, description);
    }else if(type == "applications"){
        const id = data.id;
        const first_name = data.first_name;
        const last_name = data.last_name;
        const email = data.email;
        const ad_id = data.ad_id;
        const message = data.message;
        return await updateApplication(id,first_name,last_name,email,ad_id,message);
    }
}

async function deleteEntity(type, id) {
    if(type == "ads"){
        return await deleteAd(id);
    }
    else if(type == "users"){
        return await deleteUser(id);
    }
    else if(type == "companies"){
        return await deleteCompany(id);
    }
    else if(type == "applications"){
        return await deleteApplication(id);
    }
}
document.getElementById('form-ads').onsubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    await addEntity('ads',data);
    closeModal('modal-ads');
    location.reload();
};

document.getElementById('form-users').onsubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    await addEntity('users', data);
    closeModal('modal-users');
    location.reload();


};
document.getElementById('form-companies').onsubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    await addEntity('companies', data);
    closeModal('modal-companies');
    location.reload();
};
document.getElementById('form-applications').onsubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    await addEntity('applications', data);
    closeModal('modal-applications');
    location.reload();
};
function today(){
    return new Date().toISOString().substring(0, 10);
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', e => {
        const modalId = e.target.getAttribute('data-close');
        closeModal(modalId);
    });
});

window.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

async function populateCompanySelect() {
    const interval = setInterval(async () => {
        const select = document.getElementById("company_id_select");
        const selectUser = document.getElementById("user_company_id_select");

        if (select) {
            clearInterval(interval);

            try {
                const companies = await getAllCompanies();

                select.innerHTML = `<option value="">-- Select a company --</option>`;

                companies.forEach(company => {
                    const option = document.createElement("option");
                    option.value = company.id;
                    option.textContent = company.name;
                    const option2 = document.createElement("option");
                    option2.value = company.id;
                    option2.textContent = company.name;
                    select.appendChild(option);
                    selectUser.appendChild(option2);
                });

            } catch (error) {
                console.error("Error populate select :", error);
            }
        }
    }, 300);
}

async function populateCompanySelectUpdate(id) {
    const interval = setInterval(async () => {
        const select = document.getElementById("company_id_select");
        const select2 = document.getElementById("update_company_id_select");


        if (select) {
            clearInterval(interval);

            try {
                const companies = await getAllCompanies();
                select.innerHTML = `<option value="">-- Select a company --</option>`;
                select2.innerHTML = `<option value="">-- Select a company --</option>`;

                companies.forEach(company => {
                    const option = document.createElement("option");
                    option.value = company.id;
                    option.textContent = company.name;

                    const option2 = document.createElement("option");
                    option2.value = company.id;
                    option2.textContent = company.name;
                    if(company.id == id){
                        option.selected = true;
                        option2.selected = true;
                    }

                    select.appendChild(option);
                    select2.appendChild(option2);
                });
            } catch (error) {
                console.error("Error populate select :", error);
            }
        }
    }, 300);
}

async function populateAdSelect() {
    const interval = setInterval(async () => {
        const select = document.getElementById("ad_id_select");
        if (select) {
            clearInterval(interval);

            try {
                const ads = await getAllAds();

                select.innerHTML = `<option value="">-- Select an advertisement --</option>`;

                ads.forEach(ad => {
                    const option = document.createElement("option");
                    option.value = ad.id;
                    option.textContent = ad.title +'-'+ad.company;
                    select.appendChild(option);
                });

            } catch (error) {
                console.error("Error populate select :", error);
            }
        }
    }, 300);
}
async function populateAdSelectUpdate(id) {
    const interval = setInterval(async () => {
        const select = document.getElementById("ad_id_select2");
        if (select) {
            clearInterval(interval);

            try {
                const ads = await getAllAds();
                ads.forEach(ad => {

                    const option = document.createElement("option");
                    option.value = ad.id;
                    option.textContent = ad.title +'-'+ad.company;
                    if(ad.id == id){
                        option.selected = true;
                    }
                    select.appendChild(option);
                });

            } catch (error) {
                console.error("Error populate select :", error);
            }
        }
    }, 300);
}
async function getAllAds() {
    try {
        const res = await fetch(`http://localhost:3000/ads`, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        });
        const data = await res.json();
        return data.ads;
    } catch (error) {
        console.error('Error:', error);
    }
}
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
async function getByAdCompanyId(id) {
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

async function addAd(title,short_description,full_description,salary,position_type,location,schedule,experience,company_id) {
    try {

        const res = await fetch(`http://localhost:3000/ads/admin/`, {
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
        const res = await fetch(`http://localhost:3000/ads/admin/${id}`, {
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

async function getAllUsers() {
    try {
        const res = await fetch(`http://localhost:3000/users`, {
            method: 'GET',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
        });
        const data = await res.json();
        return data.users;
    } catch (error) {
        console.error('Error:', error);
    }
}
async function getByUserId(id) {
    try {
        const res = await fetch(`http://localhost:3000/users/${id}`, {
            method: 'GET',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
async function addUser(first_name,last_name,email,password,phone,skills,type,company_id) {
    try {
        const res = await fetch(`http://localhost:3000/users/`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                first_name,
                last_name,
                email,
                phone,
                password,
                skills,
                type,
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

async function updateUser(id,first_name,last_name,email,phone,skills,type,company) {
    try {
        const res = await fetch(`http://localhost:3000/users/${id}`, {
            method: 'PATCH',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
            body: JSON.stringify({
                first_name,
                last_name,
                email,
                phone,
                skills,
                type,
                company
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

async function updateUserPassword(id,password) {
    try {
        const res = await fetch(`http://localhost:3000/users/password/${id}`, {
            method: 'PATCH',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
            body: JSON.stringify({
                password
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


async function deleteUser(id) {
    try {
        const res = await fetch(`http://localhost:3000/users/${id}`, {
            method: 'DELETE',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getAllCompanies() {
    try {
        const res = await fetch(`http://localhost:3000/companies`, {
            method: 'GET',
            headers: {"Content-Type": "application/json",},
        });
        const data = await res.json();
        return data.companies;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getByCompanyId(id) {
    try {
        const res = await fetch(`http://localhost:3000/companies/${id}`, {
            method: 'GET',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function addCompany(name,address,description) {
    try {
        const res = await fetch(`http://localhost:3000/companies/`, {
            method: 'POST',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
            body: JSON.stringify({
                name,
                address,
                description
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
async function updateCompany(id,name,address,description) {
    try {
        const res = await fetch(`http://localhost:3000/companies/${id}`, {
            method: 'PATCH',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
            body: JSON.stringify({
                name,
                address,
                description
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

async function deleteCompany(id) {
    try {
        const res = await fetch(`http://localhost:3000/companies/${id}`, {
            method: 'DELETE',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getAllApplications() {
    try {
        const res = await fetch(`http://localhost:3000/job_applications`, {
            method: 'GET',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`,},
        });
        const data = await res.json();
        return data.applications;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getByApplicationId(id) {
    try {
        const res = await fetch(`http://localhost:3000/job_applications/${id}`, {
            method: 'GET',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
async function addApplication(email,first_name,last_name,ad_id,message) {
    try {
        const res = await fetch(`http://localhost:3000/job_applications/`, {
            method: 'POST',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
            body: JSON.stringify({
                "email":email,
                "first_name":first_name,
                "last_name":last_name,
                "ad_id":ad_id,
                "message":message
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

async function updateApplication(id,first_name,last_name,email,ad_id,message) {
    try {
        const res = await fetch(`http://localhost:3000/job_applications/admin/${id}`, {
            method: 'PATCH',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
            body: JSON.stringify({
                first_name,
                last_name,
                email,
                ad_id,
                message
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

async function deleteApplication(id) {
    try {
        const res = await fetch(`http://localhost:3000/job_applications/${id}`, {
            method: 'DELETE',
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

(async () => {
    let allAds = await getAllAds();
    let allUsers = await getAllUsers();
    let allCompanies = await getAllCompanies();
    let allApplications = await getAllApplications();
    const adTableBody = document.getElementById('ads-table-body');
    const userTableBody = document.getElementById('users-table-body');
    const CompanyTableBody = document.getElementById('companies-table-body');
    const applicationTableBody = document.getElementById('applications-table-body');

    allAds.forEach(ad => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${ad.title}</td>
        <td>${ad.short_description}</td>
        <td>${ad.salary}</td>
        <td>${ad.position_type}</td>
        <td>${ad.location}</td>
        <td>${ad.experience}</td>
        <td>${ad.company}</td>
        <td><button class="btn-edit">Edit</button><button class="btn-del">Delete</button></td>`
        adTableBody.append(row);
        row.querySelector('.btn-edit').addEventListener('click', () => {
            openModal('modal-ads', 'Edit Advertisement', ad);
            populateCompanySelectUpdate(ad.company_id);
            const form = document.getElementById('form-ads');
            form.onsubmit = async (e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(form).entries());
                data.id = ad.id;
                await editEntity('ads', data);
                closeModal('modal-ads');
                location.reload()
                };
        });
        row.querySelector('.btn-del').addEventListener('click', () => confirmDelete('ads', ad.id));
    })

    allUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${user.first_name}</td>
        <td>${user.last_name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.type_people}</td>
        <td>${user.skills}</td>
        <td>${user.company_id}</td>
        <td><button class="btn-edit">Edit</button><button class="btn-del">Delete</button></td>`
        userTableBody.appendChild(row);
        row.querySelector('.btn-edit').addEventListener('click', () => {
            openModal('modal-users-update', 'Edit User', user);
            populateCompanySelectUpdate(user.company_id);
            const form = document.getElementById('form-users-update');
            form.onsubmit = async (e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(form).entries());
                data.id = user.id;
                data.old_password = user.password;
                await editEntity('users', data);
                closeModal('modal-users-update');
                location.reload();
            };
        });
        row.querySelector('.btn-del').addEventListener('click', () => confirmDelete('users', user.id));
    })

    allCompanies.forEach(company => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${company.name}</td>
        <td>${company.address}</td>
        <td>${company.description}</td>
        <td><button class="btn-edit">Edit</button><button class="btn-del">Delete</button></td>`
        CompanyTableBody.appendChild(row);
        row.querySelector('.btn-edit').addEventListener('click', () => {
            openModal('modal-companies', 'Edit Companies', company);

            const form = document.getElementById('form-companies');
            form.onsubmit = async (e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(form).entries());
                data.id = company.id;
                await editEntity('companies', data);
                closeModal('modal-companies');
                location.reload();
            };
        });
        row.querySelector('.btn-del').addEventListener('click', () => confirmDelete('companies', company.id));
    })

    allApplications.forEach(app => {
        app.date_application = app.date_application.substring(0,10);
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${app.email}</td>
        <td>${app.Advertisement} - ${app.from}</td>
        <td>${app.date_application}</td>
        <td>${app.message}</td>
        <td><button class="btn-edit">Edit</button><button class="btn-del">Delete</button></td>`
    applicationTableBody.appendChild(row);
        row.querySelector('.btn-edit').addEventListener('click', () => {
            openModal('modal-applications-update', 'Edit Application', app);
            populateAdSelectUpdate(app.ad_id);
            const form = document.getElementById('form-applications-update');
            form.onsubmit = async (e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(form).entries());
                data.id = app.id;
                await editEntity('applications', data);
                closeModal('modal-applications-update');
                location.reload();
            };
        });
        row.querySelector('.btn-del').addEventListener('click', () => confirmDelete('applications', app.id));
    })
})();