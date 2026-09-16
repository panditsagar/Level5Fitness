// Main JavaScript
document.addEventListener('DOMContentLoaded', () => {
  console.log('Level 5 Fitness initialized.');

  // Interactive Before/After Image Comparison Slider
  const sliders = document.querySelectorAll('.ba-slider-container');

  sliders.forEach(slider => {
    const rangeInput = slider.querySelector('.ba-range-input');
    const afterLayer = slider.querySelector('.ba-after-layer');
    const handle = slider.querySelector('.ba-handle');

    if (rangeInput && afterLayer && handle) {
      const updateSlider = (val) => {
        afterLayer.style.clipPath = `inset(0 0 0 ${val}%)`;
        handle.style.left = `${val}%`;
      };

      // Native range drag event
      rangeInput.addEventListener('input', (e) => {
        updateSlider(e.target.value);
      });

      // Initialize default position
      updateSlider(rangeInput.value || 50);
    }
  });

  // Interactive Section 8 Checklist Cards Toggle
  const whoCards = document.querySelectorAll('.who-checklist-card');
  whoCards.forEach(card => {
    const checkbox = card.querySelector('.who-checkbox');
    if (checkbox) {
      const updateState = () => {
        if (checkbox.checked) {
          card.classList.add('is-active');
        } else {
          card.classList.remove('is-active');
        }
      };

      checkbox.addEventListener('change', updateState);
      updateState();
    }
  });

  // Registration popup form
  const registrationModal = document.getElementById('registrationModal');
  const registrationForm = document.getElementById('registrationForm');
  const ctaButtons = document.querySelectorAll(
    '.btn-hero-cta[href="#register"]'
  );
  const closeButtons = document.querySelectorAll('[data-modal-close]');
  const leadName = document.getElementById('leadName');
  const leadEmail = document.getElementById('leadEmail');
  const leadPhone = document.getElementById('leadPhone');
  const submitMessage = document.getElementById('registrationSubmitMessage');
  let previouslyFocusedElement = null;

  const setFieldError = (input, message) => {
    if (!input) return;

    const field = input.closest('.form-field');
    const error = field ? field.querySelector('.field-error') : null;

    if (field) {
      field.classList.toggle('is-invalid', Boolean(message));
    }

    input.setAttribute('aria-invalid', message ? 'true' : 'false');

    if (error) {
      input.setAttribute('aria-describedby', error.id);
      error.textContent = message;
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  const validatePhone = (phone) => {
    const trimmedPhone = phone.trim();
    const digitsOnly = trimmedPhone.replace(/\D/g, '');

    return (
      /^\+?[\d\s()-]+$/.test(trimmedPhone) &&
      digitsOnly.length >= 10 &&
      digitsOnly.length <= 15
    );
  };

  const sanitizePhoneInput = (phone) => phone.replace(/[^\d\s()+-]/g, '');

  const openRegistrationModal = () => {
    if (!registrationModal) return;

    previouslyFocusedElement = document.activeElement;
    registrationModal.classList.add('is-open');
    registrationModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    if (leadName) {
      leadName.focus();
    }
  };

  const closeRegistrationModal = () => {
    if (!registrationModal) return;

    registrationModal.classList.remove('is-open');
    registrationModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
      previouslyFocusedElement.focus();
    }
  };

  const validateRegistrationForm = () => {
    let firstInvalidInput = null;

    const nameValue = leadName ? leadName.value.trim() : '';
    const emailValue = leadEmail ? leadEmail.value.trim() : '';
    const phoneValue = leadPhone ? leadPhone.value.trim() : '';

    if (!nameValue) {
      setFieldError(leadName, 'Please enter your name.');
      firstInvalidInput = firstInvalidInput || leadName;
    } else if (nameValue.length < 2) {
      setFieldError(leadName, 'Name must be at least 2 characters.');
      firstInvalidInput = firstInvalidInput || leadName;
    } else {
      setFieldError(leadName, '');
    }

    if (!emailValue) {
      setFieldError(leadEmail, 'Please enter your email address.');
      firstInvalidInput = firstInvalidInput || leadEmail;
    } else if (!validateEmail(emailValue)) {
      setFieldError(leadEmail, 'Please enter a valid email address.');
      firstInvalidInput = firstInvalidInput || leadEmail;
    } else {
      setFieldError(leadEmail, '');
    }

    if (!phoneValue) {
      setFieldError(leadPhone, 'Please enter your phone number.');
      firstInvalidInput = firstInvalidInput || leadPhone;
    } else if (!validatePhone(phoneValue)) {
      setFieldError(leadPhone, 'Please enter a valid phone number.');
      firstInvalidInput = firstInvalidInput || leadPhone;
    } else {
      setFieldError(leadPhone, '');
    }

    if (firstInvalidInput) {
      firstInvalidInput.focus();
      return false;
    }

    return true;
  };

  const setSubmitMessage = (message, isSuccess = false) => {
    if (!submitMessage) return;

    submitMessage.textContent = message;
    submitMessage.classList.toggle('is-success', isSuccess);
  };

  const setSubmitState = (isSubmitting) => {
    if (!registrationForm) return;

    const submitButton = registrationForm.querySelector('.registration-submit');
    const submitButtonText = submitButton ? submitButton.querySelector('span') : null;

    if (submitButton) {
      submitButton.disabled = isSubmitting;
    }

    if (submitButtonText) {
      submitButtonText.textContent = isSubmitting
        ? 'Submitting...'
        : 'Reserve My Free Seat';
    }
  };

  ctaButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      openRegistrationModal();
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', closeRegistrationModal);
  });

  if (registrationForm) {
    [leadName, leadEmail, leadPhone].forEach(input => {
      if (!input) return;

      input.addEventListener('input', () => {
        if (input === leadPhone) {
          const sanitizedPhone = sanitizePhoneInput(input.value);

          if (input.value !== sanitizedPhone) {
            input.value = sanitizedPhone;
          }
        }

        setFieldError(input, '');
        setSubmitMessage('');
      });
    });

    registrationForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      setSubmitMessage('');

      if (!validateRegistrationForm()) {
        return;
      }

      setSubmitState(true);

      try {
        const response = await fetch(registrationForm.action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: leadName.value.trim(),
            email: leadEmail.value.trim(),
            phone: leadPhone.value.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error('Form submission failed.');
        }

        setSubmitMessage('Registration submitted successfully.', true);
        window.location.href = 'step2.html';
      } catch (error) {
        setSubmitMessage(
          'Something went wrong. Please try again in a moment.'
        );
        setSubmitState(false);
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      registrationModal &&
      registrationModal.classList.contains('is-open')
    ) {
      closeRegistrationModal();
    }
  });
});
