/* ==========================================================================
   STACKLY — GRAPHIC DESIGNER PORTFOLIO
   AUTHENTICATION & FORM VALIDATION ENGINE (LOGIN, SIGNUP & CONTACT)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. PASSWORD SHOW / HIDE TOGGLE
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const input = btn.previousElementSibling || btn.parentElement.querySelector('input');
      const icon = btn.querySelector('i');
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
          }
        } else {
          input.type = 'password';
          if (icon) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
          }
        }
      }
    });
  });

  // 2. ROLE SELECTOR (ADMIN / USER)
  let selectedRole = 'user';
  const roleButtons = document.querySelectorAll('.role-btn');
  roleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedRole = btn.getAttribute('data-role');
    });
  });

  // HELPER FUNCTIONS FOR INLINE ERRORS
  function showError(inputEl, errorEl, message) {
    if (inputEl) inputEl.classList.add('is-invalid');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }

  function clearError(inputEl, errorEl) {
    if (inputEl) inputEl.classList.remove('is-invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function containsNonAlphabets(text) {
    return /[^a-zA-Z\s]/.test(text);
  }

  function containsNonNumbers(text) {
    return /[^0-9]/.test(text);
  }

  // --------------------------------------------------------------------------
  // 3. LOGIN FORM VALIDATION & REDIRECTION
  // --------------------------------------------------------------------------
  const loginForm = document.getElementById('login-page-form');
  if (loginForm) {
    const emailInput = document.getElementById('login-email');
    const emailError = document.getElementById('login-email-error');
    const passInput = document.getElementById('login-password');
    const passError = document.getElementById('login-password-error');

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        if (emailInput.value.trim() !== '' && validateEmail(emailInput.value.trim())) {
          clearError(emailInput, emailError);
        }
      });
    }

    if (passInput) {
      passInput.addEventListener('input', () => {
        if (passInput.value !== '') {
          clearError(passInput, passError);
        }
      });
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (!emailVal) {
        showError(emailInput, emailError, 'Email address is required.');
        isValid = false;
      } else if (!validateEmail(emailVal)) {
        showError(emailInput, emailError, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError(emailInput, emailError);
      }

      const passVal = passInput ? passInput.value : '';
      if (!passVal) {
        showError(passInput, passError, 'Password is required.');
        isValid = false;
      } else {
        clearError(passInput, passError);
      }

      if (isValid) {
        try {
          localStorage.setItem('userEmail', emailVal);
          localStorage.setItem('userRole', selectedRole.toUpperCase());
        } catch (err) {
          console.warn('LocalStorage unavailable:', err);
        }

        if (selectedRole === 'admin') {
          window.location.href = 'admin-dashboard.html';
        } else {
          window.location.href = 'user-dashboard.html';
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. SIGNUP FORM VALIDATION & REDIRECTION
  // --------------------------------------------------------------------------
  const signupForm = document.getElementById('signup-page-form');
  if (signupForm) {
    const userInput = document.getElementById('signup-username');
    const userError = document.getElementById('signup-username-error');

    const emailInput = document.getElementById('signup-email');
    const emailError = document.getElementById('signup-email-error');

    const phoneInput = document.getElementById('signup-phone');
    const phoneError = document.getElementById('signup-phone-error');

    const passInput = document.getElementById('signup-password');
    const passError = document.getElementById('signup-password-error');

    const confirmInput = document.getElementById('signup-confirm-password');
    const confirmError = document.getElementById('signup-confirm-error');

    const termsInput = document.getElementById('signup-terms');
    const termsError = document.getElementById('signup-terms-error');

    // Real-time Name Validation
    if (userInput) {
      userInput.addEventListener('input', () => {
        const val = userInput.value;
        if (!val.trim()) {
          showError(userInput, userError, 'Full name is required.');
        } else if (containsNonAlphabets(val)) {
          showError(userInput, userError, 'Name field should only accept alphabets.');
        } else {
          clearError(userInput, userError);
        }
      });
    }

    // Real-time Email Validation
    if (emailInput) {
      emailInput.addEventListener('input', () => {
        const val = emailInput.value.trim();
        if (!val) {
          showError(emailInput, emailError, 'Email address is required.');
        } else if (!validateEmail(val)) {
          showError(emailInput, emailError, 'Please enter a valid email address.');
        } else {
          clearError(emailInput, emailError);
        }
      });
    }

    // Real-time Phone Validation
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        const val = phoneInput.value;
        if (!val.trim()) {
          showError(phoneInput, phoneError, 'Phone number is required.');
        } else if (containsNonNumbers(val)) {
          showError(phoneInput, phoneError, 'Phone number field should only accept numbers.');
        } else if (val.trim().length < 10) {
          showError(phoneInput, phoneError, 'Phone number must be at least 10 digits.');
        } else {
          clearError(phoneInput, phoneError);
        }
      });
    }

    if (passInput) {
      passInput.addEventListener('input', () => {
        if (passInput.value !== '') clearError(passInput, passError);
        if (confirmInput && confirmInput.value !== '' && confirmInput.value === passInput.value) {
          clearError(confirmInput, confirmError);
        }
      });
    }

    if (confirmInput) {
      confirmInput.addEventListener('input', () => {
        if (confirmInput.value !== '' && confirmInput.value === passInput.value) {
          clearError(confirmInput, confirmError);
        }
      });
    }

    if (termsInput) {
      termsInput.addEventListener('change', () => {
        if (termsInput.checked) clearError(termsInput, termsError);
      });
    }

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Full Name Validation
      const userVal = userInput ? userInput.value : '';
      if (!userVal.trim()) {
        showError(userInput, userError, 'Full name is required.');
        isValid = false;
      } else if (containsNonAlphabets(userVal)) {
        showError(userInput, userError, 'Name field should only accept alphabets.');
        isValid = false;
      } else {
        clearError(userInput, userError);
      }

      // Email Validation
      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (!emailVal) {
        showError(emailInput, emailError, 'Email address is required.');
        isValid = false;
      } else if (!validateEmail(emailVal)) {
        showError(emailInput, emailError, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError(emailInput, emailError);
      }

      // Phone Validation
      const phoneVal = phoneInput ? phoneInput.value : '';
      if (!phoneVal.trim()) {
        showError(phoneInput, phoneError, 'Phone number is required.');
        isValid = false;
      } else if (containsNonNumbers(phoneVal)) {
        showError(phoneInput, phoneError, 'Phone number field should only accept numbers.');
        isValid = false;
      } else if (phoneVal.trim().length < 10) {
        showError(phoneInput, phoneError, 'Phone number must be at least 10 digits.');
        isValid = false;
      } else {
        clearError(phoneInput, phoneError);
      }

      // Password Validation
      const passVal = passInput ? passInput.value : '';
      if (!passVal) {
        showError(passInput, passError, 'Password is required.');
        isValid = false;
      } else if (passVal.length < 6) {
        showError(passInput, passError, 'Password must be at least 6 characters.');
        isValid = false;
      } else {
        clearError(passInput, passError);
      }

      // Confirm Password
      const confirmVal = confirmInput ? confirmInput.value : '';
      if (!confirmVal) {
        showError(confirmInput, confirmError, 'Please confirm your password.');
        isValid = false;
      } else if (confirmVal !== passVal) {
        showError(confirmInput, confirmError, 'Passwords do not match.');
        isValid = false;
      } else {
        clearError(confirmInput, confirmError);
      }

      // Terms Checkbox
      if (termsInput && !termsInput.checked) {
        showError(termsInput, termsError, 'You must accept the Privacy Policy & Terms.');
        isValid = false;
      } else {
        clearError(termsInput, termsError);
      }

      if (isValid) {
        window.location.href = 'login.html';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. CONTACT PAGE INQUIRY FORM VALIDATION & 404 REDIRECTION
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('page-contact-form');
  if (contactForm) {
    const nameInput = document.getElementById('contact-name');
    const nameError = document.getElementById('contact-name-error');

    const emailInput = document.getElementById('contact-email');
    const emailError = document.getElementById('contact-email-error');

    const phoneInput = document.getElementById('contact-phone');
    const phoneError = document.getElementById('contact-phone-error');

    const budgetInput = document.getElementById('contact-budget');
    const budgetError = document.getElementById('contact-budget-error');

    const detailsInput = document.getElementById('contact-details');
    const detailsError = document.getElementById('contact-details-error');

    // Real-time Name Validation
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        const val = nameInput.value;
        if (!val.trim()) {
          showError(nameInput, nameError, 'Full name is required.');
        } else if (containsNonAlphabets(val)) {
          showError(nameInput, nameError, 'Name field should only accept alphabets.');
        } else {
          clearError(nameInput, nameError);
        }
      });
    }

    // Real-time Email Validation
    if (emailInput) {
      emailInput.addEventListener('input', () => {
        const val = emailInput.value.trim();
        if (!val) {
          showError(emailInput, emailError, 'Email address is required.');
        } else if (!validateEmail(val)) {
          showError(emailInput, emailError, 'Please enter a valid email address.');
        } else {
          clearError(emailInput, emailError);
        }
      });
    }

    // Real-time Phone Validation
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        const val = phoneInput.value;
        if (!val.trim()) {
          showError(phoneInput, phoneError, 'Phone number is required.');
        } else if (containsNonNumbers(val)) {
          showError(phoneInput, phoneError, 'Phone number field should only accept numbers.');
        } else if (val.trim().length < 10) {
          showError(phoneInput, phoneError, 'Phone number must be at least 10 digits.');
        } else {
          clearError(phoneInput, phoneError);
        }
      });
    }

    if (budgetInput) {
      budgetInput.addEventListener('change', () => {
        if (budgetInput.value !== '') clearError(budgetInput, budgetError);
      });
    }

    if (detailsInput) {
      detailsInput.addEventListener('input', () => {
        if (detailsInput.value.trim().length >= 10) clearError(detailsInput, detailsError);
      });
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Name Validation
      const nameVal = nameInput ? nameInput.value : '';
      if (!nameVal.trim()) {
        showError(nameInput, nameError, 'Full name is required.');
        isValid = false;
      } else if (containsNonAlphabets(nameVal)) {
        showError(nameInput, nameError, 'Name field should only accept alphabets.');
        isValid = false;
      } else {
        clearError(nameInput, nameError);
      }

      // Email Validation
      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (!emailVal) {
        showError(emailInput, emailError, 'Email address is required.');
        isValid = false;
      } else if (!validateEmail(emailVal)) {
        showError(emailInput, emailError, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError(emailInput, emailError);
      }

      // Phone Validation
      const phoneVal = phoneInput ? phoneInput.value : '';
      if (!phoneVal.trim()) {
        showError(phoneError ? phoneInput : null, phoneError, 'Phone number is required.');
        isValid = false;
      } else if (containsNonNumbers(phoneVal)) {
        showError(phoneInput, phoneError, 'Phone number field should only accept numbers.');
        isValid = false;
      } else if (phoneVal.trim().length < 10) {
        showError(phoneInput, phoneError, 'Phone number must be at least 10 digits.');
        isValid = false;
      } else {
        clearError(phoneInput, phoneError);
      }

      // Budget Validation
      const budgetVal = budgetInput ? budgetInput.value : '';
      if (!budgetVal) {
        showError(budgetInput, budgetError, 'Please select an estimated budget tier.');
        isValid = false;
      } else {
        clearError(budgetInput, budgetError);
      }

      // Details Validation
      const detailsVal = detailsInput ? detailsInput.value.trim() : '';
      if (!detailsVal) {
        showError(detailsInput, detailsError, 'Project details are required.');
        isValid = false;
      } else if (detailsVal.length < 10) {
        showError(detailsInput, detailsError, 'Please enter at least 10 characters for project details.');
        isValid = false;
      } else {
        clearError(detailsInput, detailsError);
      }

      // Redirect to 404 page when all values are entered correctly
      if (isValid) {
        if (typeof window.saveScrollBefore404 === 'function') {
          window.saveScrollBefore404();
        }
        window.location.href = '404.html';
      }
    });
  }
});
