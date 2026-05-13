/* ===========================
   Prime Tech System - Script
   =========================== */

document.addEventListener('DOMContentLoaded', function () {

    // Inicializar AOS - Animate on Scroll
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100,
        disable: 'mobile'
    });

    // Ano atual no rodapé
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Navbar scroll
    const navbar = document.getElementById('mainNav');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Back to top
    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Scroll suave para links da navbar e fechar menu mobile
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link, a[href^="#"]');
    const navCollapse = document.getElementById('navbarNav');
    const bsCollapse = navCollapse ? new bootstrap.Collapse(navCollapse, { toggle: false }) : null;

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });

                    // Fechar menu mobile se estiver aberto
                    if (navCollapse && navCollapse.classList.contains('show')) {
                        bsCollapse.hide();
                    }
                }
            }
        });
    });

    // Active link na navbar conforme scroll
    const sections = document.querySelectorAll('section[id], header[id]');
    const navItems = document.querySelectorAll('.navbar-nav .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#' + current) {
                item.classList.add('active');
            }
        });
    });

    // Máscara de telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            if (value.length > 6) {
                value = value.replace(/(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/(\d{2})(\d{0,5}).*/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/(\d{0,2})/, '($1');
            }
            e.target.value = value;
        });
    }

    // Formulário de contato - envia para WhatsApp
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const assunto = document.getElementById('assunto').value;
            const mensagem = document.getElementById('mensagem').value.trim();

            if (!nome || !email || !assunto || !mensagem) {
                showStatus('Por favor, preencha todos os campos obrigatórios.', 'danger');
                return;
            }

            // Monta mensagem para WhatsApp
            let texto = `*Nova mensagem do site*%0A%0A`;
            texto += `*Nome:* ${nome}%0A`;
            texto += `*E-mail:* ${email}%0A`;
            if (telefone) texto += `*Telefone:* ${telefone}%0A`;
            texto += `*Assunto:* ${assunto}%0A%0A`;
            texto += `*Mensagem:*%0A${mensagem}`;

            const whatsappURL = `https://wa.me/5591988899669?text=${texto}`;

            showStatus('Redirecionando para o WhatsApp...', 'success');

            setTimeout(() => {
                window.open(whatsappURL, '_blank');
                contactForm.reset();
                setTimeout(() => { formStatus.innerHTML = ''; }, 3000);
            }, 800);
        });
    }

    function showStatus(message, type) {
        formStatus.innerHTML = `
            <div class="alert alert-${type} d-flex align-items-center" role="alert">
                <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'} me-2"></i>
                <div>${message}</div>
            </div>
        `;
    }

    // Animação de contador nas estatísticas (opcional)
    const counters = document.querySelectorAll('.stats-row h3');
    const observerOptions = { threshold: 0.5 };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('counted');
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
});
