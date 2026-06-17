document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const textSelectors = [
                ".badge",
                ".pill-badge",
                ".hero-title",
                ".hero-subtitle",
                ".feature-text strong",
                ".feature-text span",
                ".partners-section p",
                ".section-title",
                ".section-desc",
                ".benefits-list li",
                ".floating-badge",
                ".text-box h4",
                ".text-box p",
                ".main-title",
                ".subtitle",
                ".seguro-card h3",
                ".seguro-card p",
                ".stat-info strong",
                ".stat-info span",
                ".user-info h3",
                ".quote",
                ".footer-desc",
                ".footer-title",
                ".contact-list li",
                ".contact-list a",
                ".footer-bottom p",
                ".footer-bottom-links a",
                ".btn-submit-glass"
            ].join(", ");

            const cardSelectors = [
                ".feature-item",
                ".auto-feature-card",
                ".seguro-card",
                ".stats-bottom-bar",
                ".testimonial-stack-container",
                ".footer-form-glass"
            ].join(", ");

            document.querySelectorAll("section, footer").forEach(section => {
                const textElements = section.querySelectorAll(textSelectors);
                const cardElements = section.querySelectorAll(cardSelectors);

                if (textElements.length) {
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: section,
                            start: "top 80%",
                            end: "top 35%",
                            toggleActions: "play none none reverse"
                        }
                    }).from(textElements, {
                        y: 36,
                        autoAlpha: 0,
                        duration: 0.9,
                        ease: "power3.out",
                        stagger: 0.08
                    });
                }

                if (cardElements.length) {
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: section,
                            start: "top 78%",
                            end: "top 35%",
                            toggleActions: "play none none none"
                        }
                    }).from(cardElements, {
                        y: 42,
                        autoAlpha: 0,
                        duration: 0.85,
                        ease: "power3.out",
                        stagger: 0.1,
                        onComplete: () => {
                            gsap.set(cardElements, { clearProps: "transform,opacity,visibility" });
                        }
                    });
                }
            });
        }
    }

    // 1. Efeito de Header Fixo / Troca de Cor ao rolar a página
    const header = document.querySelector(".header");
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.style.background = "#06103c";
            header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
            header.style.padding = "15px 8%";
            header.style.transition = "all 0.4s ease";
        } else {
            header.style.background = "radial-gradient(circle at top, #0d297a 0%, #06103c 100%)";
            header.style.boxShadow = "none";
            header.style.padding = "25px 8%";
        }
    });

    // 2. Comportamento Ativo dos Links de Navegação
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            navLinks.forEach(item => item.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // 3. Log de clique nos CTAs (Pronto para integrar pixel de rastreio ou redirecionamento)
    const ctaButtons = document.querySelectorAll(".btn-primary, .btn-outline-nav, .whatsapp-float");
    
    ctaButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            // Caso queira adicionar uma animação ou validação antes de abrir o link externo:
            console.log("Usuário clicou em um gatilho de conversão via WhatsApp.");
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.testimo-card');
    const paginationContainer = document.querySelector('.testimo-pagination');
    
    if(cards.length === 0) return;

    let activeIndex = 0;
    const totalCards = cards.length;
    const visibleBehind = 2; // Quantas cartas mostrar empilhadas no fundo

    // Gerar as bolinhas de navegação
    cards.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('testimo-dot');
        if(idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => navigate(idx));
        paginationContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.testimo-dot');

    // Função para atualizar as posições das cartas
    function updateCards() {
        cards.forEach((card, index) => {
            // Lógica mágica traduzida do React para calcular a ordem de exibição
            const displayOrder = (index - activeIndex + totalCards) % totalCards;

            if (displayOrder === 0) {
                // Carta Ativa (Frente)
                card.style.transform = `scale(1) translateY(0) translateX(${dragOffset}px)`;
                card.style.opacity = '1';
                card.style.zIndex = totalCards;
            } else if (displayOrder <= visibleBehind) {
                // Cartas no fundo (Escalonadas)
                const scale = 1 - (0.05 * displayOrder); // Diminui 5% cada nível
                const translateY = 20 * displayOrder;    // Desce 20px cada nível
                card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
                card.style.opacity = 1 - (0.3 * displayOrder);
                card.style.zIndex = totalCards - displayOrder;
            } else {
                // Cartas ocultas
                card.style.transform = 'scale(0)';
                card.style.opacity = '0';
                card.style.zIndex = '0';
            }
        });

        // Atualizar bolinhas
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === activeIndex);
        });
    }

    function navigate(newIndex) {
        activeIndex = (newIndex + totalCards) % totalCards;
        dragOffset = 0;
        updateCards();
    }

    // --- Lógica de Arrasto (Drag/Swipe) ---
    let isDragging = false;
    let startX = 0;
    let dragOffset = 0;

    function dragStart(e) {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        cards[activeIndex].classList.add('is-dragging');
    }

    function dragMove(e) {
        if (!isDragging) return;
        const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        dragOffset = currentX - startX;
        updateCards(); // Atualiza em tempo real enquanto arrasta
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        cards[activeIndex].classList.remove('is-dragging');
        
        // Se arrastou mais de 50px, muda de carta
        if (Math.abs(dragOffset) > 50) {
            navigate(activeIndex + (dragOffset < 0 ? 1 : -1));
        } else {
            // Se não arrastou o suficiente, volta a carta ativa pro centro
            dragOffset = 0;
            updateCards();
        }
    }

    // Adicionar eventos apenas na carta ativa
    cards.forEach((card, index) => {
        card.addEventListener('mousedown', (e) => { if(index === activeIndex) dragStart(e); });
        card.addEventListener('touchstart', (e) => { if(index === activeIndex) dragStart(e); }, {passive: true});
    });

    window.addEventListener('mousemove', dragMove);
    window.addEventListener('touchmove', dragMove, {passive: true});
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);

    // Inicialização
    updateCards();
});

document.addEventListener("DOMContentLoaded", () => {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        const fields = form.querySelectorAll('input, select, textarea');
        const whatsappNumber = '5547996152011';

        // 1. Carrega os dados salvos anteriormente no navegador
        fields.forEach(field => {
            const savedValue = localStorage.getItem(`contactForm_${field.id}`);
            if (savedValue) {
                field.value = savedValue;
            }
        });

        // 2. Salva as informações permanentemente em tempo real enquanto o usuário digita
        fields.forEach(field => {
            field.addEventListener('input', () => {
                localStorage.setItem(`contactForm_${field.id}`, field.value);
            });
        });

        // 3. Opcional: Limpa a memória quando o formulário for finalmente enviado
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome = document.querySelector('#nome').value.trim();
            const email = document.querySelector('#email').value.trim();
            const telefone = document.querySelector('#telefone').value.trim();
            const tipoCotacao = document.querySelector('#tipo_cotacao');
            const tipoCotacaoTexto = tipoCotacao.options[tipoCotacao.selectedIndex].text.trim();
            const tipoSeguro = document.querySelector('#tipo_seguro');
            const tipoSeguroTexto = tipoSeguro.options[tipoSeguro.selectedIndex].text.trim();
            const mensagem = document.querySelector('#mensagem').value.trim();

            const whatsappMessage = [
                'Ola! Vim pelo site e gostaria de solicitar uma cotação de seguro.',
                '',
                `Seu nome completo: ${nome}`,
                `Seu melhor e-mail: ${email}`,
                `Seu telefone/WhatsApp: ${telefone || 'Nao informado'}`,
                `Tipo de seguro? ${tipoCotacaoTexto}`,
                `Qual seguro voce procura? ${tipoSeguroTexto}`,
                `Como podemos ajudar? ${mensagem}`
            ].join('\n');

            window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');

            fields.forEach(field => {
                localStorage.removeItem(`contactForm_${field.id}`);
            });
        });
    });
