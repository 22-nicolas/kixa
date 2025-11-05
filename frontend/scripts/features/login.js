import { getRequiredFields } from "../utils/frontend.js";
import { isDescandentOf } from "../utils/utils.js";

export async function initLoginPopup() {
    const loginPopup = document.querySelector('.login-popup');
    const defaultLoginDiv = document.querySelector('.default');
    

    //toggle visibility
    const accountBTN = document.querySelector('.account-btn');
    let controller = new AbortController();
    const register = document.querySelector('.register');
    accountBTN.addEventListener('click', () => {
        if (loginPopup.style.display == 'block') {
            hide();
        } else {
            register.style.display = 'none'
            defaultLoginDiv.style.display = 'block'
            loginPopup.style.display = 'block';
            //if user clicks outside the login popup => close/hide
            document.addEventListener('mousedown', (event) => {
                if (!isDescandentOf(event.target, loginPopup)) {
                    hide();
                }
            }, { signal: controller.signal });
        }
    });

    function hide() {
        loginPopup.style.display = 'none';
        disconnect();
    }

    function disconnect() {
        controller.abort();
        controller = new AbortController();
    }

    initRegister(register, defaultLoginDiv);

    initSumbitBTN();

    initPasswordInputs();

    initNumDropdown();
}

async function initRegister(register, defaultLoginDiv) {
    const registerBTN = document.querySelector('.register-btn');
    registerBTN.addEventListener('click', () => {
        register.style.display = 'block';
        defaultLoginDiv.style.display = 'none';
    });

    let inputs = Array.from(document.querySelectorAll('.login-popup input'));
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type == "checkbox") {
            inputs.splice(i, 1);
        }
    }

    const required_fields = await getRequiredFields();

    inputs.forEach((input) => {
        if (required_fields.includes(input.id)) {
            input.parentElement.querySelectorAll('label').forEach((child) => {
                if (child.getAttribute("for") == input.id) {
                    let info = child
                    info.textContent = info.textContent + " *"
                    return
                }
            });
        }
    })
}

async function initSumbitBTN() {
    const btn = document.querySelector('.sumbit-register-btn');
    let inputs = Array.from(document.querySelectorAll('.login-popup input'));
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type == "checkbox") {
            inputs.splice(i, 1);
        }
    }
    const required_fields = await getRequiredFields();
    btn.addEventListener('click', async () => {
        
    });
}

function initPasswordInputs() {
    const hidePasswordBTNs = document.querySelectorAll('.password img, .repeat-password img');
    hidePasswordBTNs.forEach((btn) => {
        btn.addEventListener('click', () => {
            let input = btn.parentElement.querySelector('input')
            if (input.type == "password") {
                input.type = "text"
                btn.src = "imgs/closed_eye.png"
            } else {
                input.type = "password"
                btn.src = "imgs/open_eye.png"
            }
        });
    })
}

function initNumDropdown() {
    sortNumDropdown();
    const prefixes = document.querySelectorAll('.country')
    prefixes.forEach(prefix => prefix.addEventListener('click', () => {
        const dropdownInput = document.querySelector('.country-dropdown-input');
        dropdownInput.checked = false
        changeNumPrefix(prefix)
        
    }));
}

function changeNumPrefix(prefix) {
    const img1 = document.getElementById('current-img');
    const img2 = prefix.querySelector('img');
    const src1 = img1.src;
    const src2 = img2.src;
    
    const p1 = document.getElementById('current-prefix');
    const p2 = prefix.querySelector('p');
    const prefix1 = p1.textContent;
    const prefix2 = p2.textContent;
    
    img1.src = src2;
    p1.textContent = prefix2;
    img2.src = src1;
    p2.textContent = prefix1;

    sortNumDropdown();
}

function sortNumDropdown() {
    const dropdown = document.querySelector('.country-dropdown')
    const countries = Array.from(dropdown.querySelectorAll('.country'));

    countries.sort((a, b) => a.querySelector('img').src.localeCompare(b.querySelector('img').src));
    
    dropdown.innerHTML = ""
    countries.forEach(country => dropdown.appendChild(country));
}