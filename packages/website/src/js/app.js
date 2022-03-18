import validator from 'validator';
//TODO: add captcha

function sanitizeFormValues() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const emailAddress = document.getElementById('emailAddress').value;
  const weddingDate = document.getElementById('weddingDate').value;
  const weddingTime = document.getElementById('weddingTime').value;
  const location = document.getElementById('location').value;
  const message = document.getElementById('message').value;

  return {
    firstName: validator.isLength(firstName, { min: 2, max: 64 }) ? validator.escape(firstName) : '',
    lastName: validator.isLength(lastName, { min: 2, max: 64 }) ? validator.escape(lastName) : '',
    emailAddress: validator.isEmail(emailAddress) ? validator.normalizeEmail(emailAddress) : '',
    weddingDate: validator.isISO8601(weddingDate, { strict: true }) ? weddingDate : '',
    weddingTime: validator.matches(weddingTime, /\d\d:\d\d/gm) ? weddingTime : '',
    location: validator.isLength(location, { min: 2, max: 64 }) ? validator.escape(location) : '',
    message: validator.escape(message),
  };
}

function initContactForm() {
  const firstNameElement = document.getElementById('firstName');
  firstNameElement.addEventListener('input', function (event) {
    if (firstNameElement.validity.tooLong) {
      firstNameElement.setCustomValidity('Bitte beschränke deine Eingabe auf maximal 64 Zeichen.');
    } else if (firstNameElement.validity.tooShort) {
      firstNameElement.setCustomValidity('Bitte erweitere deine Eingabe auf mindestens zwei Zeichen.');
    } else if (firstNameElement.validity.valueMissing) {
      firstNameElement.setCustomValidity('Bitte trage deinen Vornamen hier ein.');
    } else {
      firstNameElement.setCustomValidity('');
    }
  });

  const lastNameElement = document.getElementById('lastName');
  lastNameElement.addEventListener('input', function (event) {
    if (lastNameElement.validity.tooLong) {
      lastNameElement.setCustomValidity('Bitte beschränke deine Eingabe auf maximal 64 Zeichen.');
    } else if (lastNameElement.validity.tooShort) {
      lastNameElement.setCustomValidity('Bitte erweitere deine Eingabe auf mindestens zwei Zeichen.');
    } else if (lastNameElement.validity.valueMissing) {
      lastNameElement.setCustomValidity('Bitte trage deinen Nachnamen hier ein.');
    } else {
      lastNameElement.setCustomValidity('');
    }
  });

  const locationElement = document.getElementById('location');
  locationElement.addEventListener('input', function (event) {
    if (locationElement.validity.tooLong) {
      locationElement.setCustomValidity('Bitte beschränke deine Eingabe auf maximal 64 Zeichen.');
    } else if (locationElement.validity.tooShort) {
      locationElement.setCustomValidity('Bitte erweitere deine Eingabe auf mindestens zwei Zeichen.');
    } else if (locationElement.validity.valueMissing) {
      llocationlement.setCustomValidity('Bitte trage die Adresse des Stylingortes hier ein.');
    } else {
      locationElement.setCustomValidity('');
    }
  });

  const emailElement = document.getElementById('emailAddress');
  emailElement.addEventListener('input', function (event) {
    if (emailElement.validity.typeMismatch) {
      emailElement.setCustomValidity('Bitte trage hier deine E-Mail Adresse im richtigen Format ein.');
    } else if (emailElement.validity.valueMissing) {
      emailElement.setCustomValidity('Bitte trage deine E-Mail Adresse hier ein.');
    } else {
      emailElement.setCustomValidity('');
    }
  });

  contactForm.addEventListener('submit', evt => {
    evt.preventDefault();
    submitContactForm();
  });
}

function submitContactForm() {
  document.getElementById('contactFormSubmitButton').classList.add('is-loading');

  const sanitizedFormValues = sanitizeFormValues();
  sendCustomerRequest(
    sanitizedFormValues.firstName,
    sanitizedFormValues.lastName,
    sanitizedFormValues.emailAddress,
    sanitizedFormValues.weddingDate,
    sanitizedFormValues.weddingTime,
    sanitizedFormValues.message,
    sanitizedFormValues.location
  )
    .then(evt => {
      window.location.replace(`${location.protocol}//${location.host}/danke`);
    })
    .catch(e => {
      console.log(e);
      const submitButton = document.getElementById('contactFormSubmitButton');
      submitButton.classList.remove('is-loading');
      submitButton.disabled = true;
      document.getElementById('errorNotification').classList.remove('is-hidden');
    });
}

async function sendCustomerRequest(firstName, lastName, emailAddress, weddingDate, weddingTime, message, location) {
  const customerRequestMessage = `
  Nachname: ${lastName}
  Vorname: ${firstName}
  E-Mail Adresse: ${emailAddress}
  
  Tag der Hochzeit: ${new Date(weddingDate).toLocaleDateString('de')}
  Uhrzeit: ${weddingTime}
  Stylingort: ${location}

  Nachricht: 
  ${message}
  `;

  const customerRequest = {
    senderEmail: emailAddress,
    message: customerRequestMessage,
  };

  const apiHost = window.location.host === 'www.sarahbonzelet.de' ? 'api.sarahbonzelet.de' : 'api-uat.sarahbonzelet.de';

  const response = await fetch(`https://${apiHost}/contact`, {
    method: 'POST',
    mode: 'no-cors',
    cache: 'no-cache',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(customerRequest),
  });
  return response.text();
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  initContactForm();
}
