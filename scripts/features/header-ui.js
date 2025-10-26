import { wait } from "../utils/utils.js";

export function initHeaderDropdown() {
    const links = document.querySelectorAll('.header-link');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');

    dropdownMenus[0].classList.add('shown');
    const originalHeight = dropdownMenus[0].offsetHeight;
    dropdownMenus[0].classList.remove('shown');


    //mouse leave
    dropdownMenus.forEach(dropdownMenu => {
        dropdownMenu.addEventListener('mouseleave', async (event) => {
            if(dropdownMenu.getBoundingClientRect().top < event.clientY) {


                let duration = 30;
                for (let i = 0; i < duration; i++) {
                    await wait(1);
                    dropdownMenu.style.height = `${(1 - (i / duration)) * originalHeight}px`
                    dropdownMenu.style.bottom = `${0 - dropdownMenu.offsetHeight}px`;                
                }

                dropdownMenu.classList.remove('shown');
                dropdownMenu.classList.remove('animate-in');
            }
        })
    })

    links.forEach(link => {
        let id = link.querySelector('p').textContent;
        let correspondingDropdownMenu = document.getElementById(id);

        //mouse enter
        link.addEventListener('mouseenter', async () => {
            dropdownMenus.forEach(dropdownMenu => {
                if(dropdownMenu.classList.contains('shown') && dropdownMenu != correspondingDropdownMenu) {
                    dropdownMenu.classList.remove('shown');
                    dropdownMenu.classList.remove('animate-in');
                }
            })

            if(!correspondingDropdownMenu.classList.contains('shown')) {
                correspondingDropdownMenu.classList.add('shown');


                let duration = 30;
                for (let i = 0; i < duration; i++) {
                    await wait(1);
                    correspondingDropdownMenu.style.height = `${(i / duration) * originalHeight}px`
                    correspondingDropdownMenu.style.bottom = `${0 - correspondingDropdownMenu.offsetHeight}px`;
                }

                correspondingDropdownMenu.classList.add('animate-in');
            }
            
        })
    });
}