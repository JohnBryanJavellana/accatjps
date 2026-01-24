class Wizard {
    constructor(element, options={}) {

        if (element instanceof HTMLElement) {
            this.wizard = element;
        } else {
            this.wizard = document.querySelector(element);
        }

        this.validate = options.validate ?? false;
        this.buttons = options.buttons ?? false;
        this.progress = options.progress ?? false;

        this.initOptions();
        this.initEventListener();
    }

    //Init Options
    initOptions() {
        this.selectedIndex = 0;
        this.progressBar = this.progress ? this.wizard.querySelector('.card-footer .progress-bar') : null;
        this.pageCounter = this.wizard.querySelector('.card-footer .counter');
        this.navItems = this.wizard.querySelectorAll('ul li.nav-item a');
        this.tabPans = this.wizard.querySelectorAll('.tab-content .tab-pane');
        this.initButtons();

        //Show first selected tab
        this.showTabSelectedTab();
    }

    //Init Buttons
    initButtons() {
        if (this.buttons) {
            this.prevBtn = this.wizard.querySelector('.card-footer .row .col-8 .previous-wizard');
            this.nextBtn = this.wizard.querySelector('.card-footer .row .col-8 .next-wizard');
            this.finishBtn = this.wizard.querySelector('.card-footer .row .col-8 .finish');
        } else {
            this.prevBtn = this.wizard.querySelector('.card-footer .row .col-8 .previous-wizard');
            this.nextBtn = this.wizard.querySelector('.card-footer .row .col-8 .next-wizard');
            this.finishBtn = this.wizard.querySelector('.card-footer .row .col-8 .finish');
        }
    }

    //Init all button event listener
    initEventListener() {
        const self = this;

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', function (e) {
                e.preventDefault();
                if (self.selectedIndex > 0) {
                    self.selectedIndex--;
                    self.showTabSelectedTab();
                }
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', function (e) {
                e.preventDefault();
                if (self.selectedIndex < self.navItems.length - 1 && self.validateForm()) {
                    self.selectedIndex++;
                    self.showTabSelectedTab();
                }
            });
        }

        this.navItems.forEach(function (element, index) {
            element.addEventListener('click', function () {
                self.selectedIndex = index;
                if (self.validateForm()) {
                    self.showTabSelectedTab();
                }
            });
        });

    }

    //Show tab which is selected
    showTabSelectedTab() {
        new bootstrap.Tab(this.navItems[this.selectedIndex]).show();
        if (this.progressBar) {
            this.progressBar.style.width = ((this.selectedIndex + 1) / this.navItems.length * 100).toString() + '%';
        }
        this.changeBtnStyle();

        this.pageCounter.innerHTML = `Page ${this.selectedIndex + 1} of ${this.navItems.length}`;
    }

    //Change button style enable to disable and vice-versa
    changeBtnStyle() {
        this.nextBtn.classList.remove('disabled');
        this.nextBtn.classList.remove('sr-only');
        this.prevBtn.classList.remove('disabled');
        this.finishBtn.classList.add('sr-only');

        if (this.selectedIndex === 0) {
            this.prevBtn.classList.add('disabled');
        } else if (this.selectedIndex === this.navItems.length - 1) {
            this.nextBtn.classList.add('disabled');
            this.nextBtn.classList.add('sr-only');
            this.finishBtn.classList.remove('sr-only');
        }
    }

    //If form validate is true then validate a form
    validateForm() {
        if (this.validate) {
            const form = this.tabPans[this.selectedIndex].querySelector('form');
            if (form) {
                form.classList.add('was-validated');
                return form.checkValidity();
            }
        }
        return true;
    }
}