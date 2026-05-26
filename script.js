/* ==========================================================================
   THE GOAT LIFE FARMS - INTERACTION SCRIPT
   High-End UI/UX Animation & Mechanics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Sticky Header scroll effects
    // ==========================================
    const navbar = document.getElementById('navbar');
    const scrollThreshold = 50;

    function handleScrollHeader() {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Initialize on load


    // ==========================================
    // 2. Active Link Scroll Spy
    // ==========================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    function scrollSpy() {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; // offset for navbar
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);


    // ==========================================
    // 3. Mobile Hamburger Menu Toggle
    // ==========================================
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinksContainer = document.getElementById('nav-links');

    if (mobileMenuToggle && navLinksContainer) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpened = mobileMenuToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
            
            // Toggle body scrolling to prevent background scroll when drawer is open
            if (isOpened) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu on link click
        const individualLinks = navLinksContainer.querySelectorAll('a');
        individualLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }


    // ==========================================
    // 4. Scroll Reveal Animations (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-up');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve once revealed to keep scrolling fast and light
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12, // Trigger when 12% of card is in viewport
        rootMargin: '0px 0px -50px 0px' // Offset trigger point slightly from bottom edge
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // ==========================================
    // 5. Inquiry Form Auto-Fill Mapping
    // ==========================================
    const breedInquireBtns = document.querySelectorAll('.btn-card-inquire');
    const breedSelectDropdown = document.getElementById('breed');
    const nameInputField = document.getElementById('name');

    breedInquireBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const chosenBreed = btn.getAttribute('data-breed');
            
            if (breedSelectDropdown) {
                breedSelectDropdown.value = chosenBreed;
            }

            // Smooth scroll to contact/inquiry section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                window.scrollTo({
                    top: contactSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }

            // Auto-focus name field for stellar UX conversion
            setTimeout(() => {
                if (nameInputField) {
                    nameInputField.focus();
                }
            }, 800);
        });
    });


    // ==========================================
    // 5b. Book Now Hero CTA — Opens Inquiry Modal
    // ==========================================
    const heroBookNowBtn = document.querySelector('.btn-hero-book-now');
    const bookNowModal = document.getElementById('book-now-modal');
    const bookNowModalClose = document.getElementById('book-now-modal-close');

    if (heroBookNowBtn && bookNowModal) {
        heroBookNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            bookNowModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Focus name field inside modal
            setTimeout(() => {
                const modalName = document.getElementById('modal-name');
                if (modalName) modalName.focus();
            }, 450);
        });

        // Close on X button
        if (bookNowModalClose) {
            bookNowModalClose.addEventListener('click', () => {
                bookNowModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close on backdrop click
        bookNowModal.addEventListener('click', (e) => {
            if (e.target === bookNowModal) {
                bookNowModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && bookNowModal.classList.contains('active')) {
                bookNowModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Modal Inquiry Form Submit
    const modalInquiryForm = document.getElementById('modalInquiryForm');
    if (modalInquiryForm) {
        modalInquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameVal = document.getElementById('modal-name').value;
            const phoneVal = document.getElementById('modal-phone').value;
            const breedVal = document.getElementById('modal-breed').value;
            const msgVal = document.getElementById('modal-message').value || 'None specified';

            if (!nameVal || !phoneVal || !breedVal) return;

            const ticketId = '#TGLF-' + Math.floor(1000 + Math.random() * 9000);
            const waMsg = `Hello Zeeshan, I just clicked BOOK NOW on your website!\n\n*Booking Summary*\n*Name*: ${nameVal}\n*Phone*: ${phoneVal}\n*Breed*: ${breedVal}\n*Message*: ${msgVal}\n\nTicket ID: ${ticketId}`;
            const waEncoded = encodeURIComponent(waMsg);

            // Close modal and open WhatsApp
            bookNowModal.classList.remove('active');
            document.body.style.overflow = '';
            window.open(`https://wa.me/917755982429?text=${waEncoded}`, '_blank');
        });
    }


    // ==========================================
    // 6. Interactive Gallery Lightbox System
    // ==========================================
    const galleryGrid = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentImgIndex = 0;
    let galleryItemsArray = [];

    if (galleryGrid && lightbox) {
        galleryItemsArray = Array.from(galleryGrid.querySelectorAll('.gallery-item'));

        galleryItemsArray.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentImgIndex = index;
                openLightbox(item);
            });
        });

        function openLightbox(item) {
            const imgSrc = item.getAttribute('data-src');
            const imgTitle = item.getAttribute('data-title');
            const imgDesc = item.getAttribute('data-desc');

            lightboxImg.setAttribute('src', imgSrc);
            lightboxImg.setAttribute('alt', imgTitle);
            lightboxTitle.textContent = imgTitle;
            lightboxDesc.textContent = imgDesc;

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop background scroll
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            // Reset src to avoid image flash next time
            setTimeout(() => {
                lightboxImg.setAttribute('src', '');
            }, 300);
        }

        function navigateLightbox(direction) {
            if (direction === 'next') {
                currentImgIndex = (currentImgIndex + 1) % galleryItemsArray.length;
            } else if (direction === 'prev') {
                currentImgIndex = (currentImgIndex - 1 + galleryItemsArray.length) % galleryItemsArray.length;
            }
            openLightbox(galleryItemsArray[currentImgIndex]);
        }

        // Close triggers
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            // Close if clicking outside the image and controls
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Navigation click events
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox('next');
        });
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox('prev');
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') navigateLightbox('next');
            if (e.key === 'ArrowLeft') navigateLightbox('prev');
        });
    }


    // ==========================================
    // 7. Scroll To Top Button
    // ==========================================
    const scrollTopBtn = document.getElementById('scroll-to-top');

    function toggleScrollTopBtn() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleScrollTopBtn);
    
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // ==========================================
    // 8. Contact/Inquiry Form Submit Handler
    // ==========================================
    const inquiryForm = document.getElementById('inquiryForm');
    const formSuccessBox = document.getElementById('form-success');
    const successBreedSpan = document.getElementById('success-breed');

    if (inquiryForm && formSuccessBox) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop default submit reload

            // Extract data
            const nameVal = document.getElementById('name').value;
            const phoneVal = document.getElementById('phone').value;
            const breedVal = document.getElementById('breed').value;
            const msgVal = document.getElementById('message').value || 'None specified';

            // Simple validation check
            if (!nameVal || !phoneVal || !breedVal) return;

            // Set confirmation details
            if (successBreedSpan) {
                successBreedSpan.textContent = breedVal;
            }

            // Populate receipt details
            const ticketId = '#TGLF-' + Math.floor(1000 + Math.random() * 9000);
            const logTime = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

            document.getElementById('receipt-name').textContent = nameVal;
            document.getElementById('receipt-phone').textContent = phoneVal;
            document.getElementById('receipt-breed').textContent = breedVal;
            document.getElementById('receipt-message').textContent = msgVal;
            document.getElementById('receipt-time').textContent = logTime;
            document.getElementById('receipt-ticket-id').textContent = ticketId;

            // WhatsApp link encoding
            const waMsg = `Hello Zeeshan, I have submitted an inquiry on your website.\n\n*Inquiry Summary*\n*Name*: ${nameVal}\n*Phone*: ${phoneVal}\n*Breed*: ${breedVal}\n*Message*: ${msgVal}\n\nTicket ID: ${ticketId}`;
            const waEncoded = encodeURIComponent(waMsg);
            document.getElementById('receipt-whatsapp-link').setAttribute('href', `https://wa.me/917755982429?text=${waEncoded}`);

            // Hide form and show success state
            inquiryForm.style.display = 'none';
            formSuccessBox.style.display = 'flex';

            // Show the receipt summary block below
            const receiptBox = document.getElementById('inquiry-result-receipt');
            if (receiptBox) {
                receiptBox.style.display = 'block';
                // Trigger reveal visibility
                setTimeout(() => {
                    receiptBox.classList.add('visible');
                    // Scroll smoothly to receipt
                    window.scrollTo({
                        top: receiptBox.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }, 150);
            }

            // Optional: simulate form dispatch console log
            console.log('Premium Lead Dispatched:', {
                leadName: nameVal,
                leadPhone: phoneVal,
                selectedBreed: breedVal,
                message: msgVal,
                ticket: ticketId,
                timestamp: logTime
            });
        });
    }

    // ==========================================
    // 9. Interactive QR Code Zoom / Modal System
    // ==========================================
    const qrTriggers = document.querySelectorAll('.clickable-qr-trigger, .qr-container');
    const lightboxElement = document.getElementById('lightbox');
    const lightboxImageElement = document.getElementById('lightbox-img');
    const lightboxTitleElement = document.getElementById('lightbox-title');
    const lightboxDescElement = document.getElementById('lightbox-desc');

    if (qrTriggers && lightboxElement && lightboxImageElement) {
        qrTriggers.forEach(trigger => {
            trigger.style.cursor = 'pointer';
            // Add visual zoom icon if not already present
            if (!trigger.querySelector('.qr-zoom-overlay') && !trigger.classList.contains('clickable-qr-trigger')) {
                const overlay = document.createElement('div');
                overlay.className = 'qr-zoom-overlay';
                overlay.innerHTML = '<i class="ph ph-magnifying-glass-plus"></i>';
                trigger.style.position = 'relative';
                trigger.appendChild(overlay);
                trigger.classList.add('clickable-qr-trigger');
            }

            trigger.addEventListener('click', () => {
                const qrImg = trigger.querySelector('.qr-image');
                if (qrImg) {
                    const imgSrc = qrImg.getAttribute('src');
                    lightboxImageElement.setAttribute('src', imgSrc);
                    lightboxImageElement.setAttribute('alt', 'UPI Payment QR Code');
                    if (lightboxTitleElement) lightboxTitleElement.textContent = 'UPI Scan & Pay';
                    if (lightboxDescElement) lightboxDescElement.textContent = 'A/C: KHWAJA MEHMOOD ZEESHAN - Secure deposit instant selection';
                    
                    lightboxElement.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }
});
