import Amplify from '@aws-amplify/core';
import API, { graphqlOperation } from '@aws-amplify/api';
import validator from 'validator';
import config from '../../aws-exports';
import { createCustomerRequest } from './graphql/mutations';
Amplify.configure(config);

//TODO: add captcha

function sanitizeFormValues() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const emailAddress = document.getElementById('emailAddress').value;
  const weddingDate = document.getElementById('weddingDate').value;
  const weddingTime = document.getElementById('weddingTime').value;
  const message = document.getElementById('message').value;

  return {
    firstName: validator.isLength(firstName, { min: 2, max: 64 }) ? validator.escape(firstName) : '',
    lastName: validator.isLength(lastName, { min: 2, max: 64 }) ? validator.escape(lastName) : '',
    emailAddress: validator.isEmail(emailAddress) ? validator.normalizeEmail(emailAddress) : '',
    weddingDate: validator.isISO8601(weddingDate, { strict: true }) ? weddingDate : '',
    weddingTime: validator.matches(weddingTime, /\d\d:\d\d/gm) ? weddingTime : '',
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
  const sanitizedFormValues = sanitizeFormValues();
  sendCustomerRequest(
    sanitizedFormValues.firstName,
    sanitizedFormValues.lastName,
    sanitizedFormValues.emailAddress,
    sanitizedFormValues.weddingDate,
    sanitizedFormValues.weddingTime,
    sanitizedFormValues.message
  ).then(evt => {
    console.log(evt);
  });
}

async function sendCustomerRequest(firstName, lastName, emailAddress, weddingDate, weddingTime, message) {
  const customerRequest = {
    name: `${firstName} ${lastName}`,
    email: emailAddress,
    message: message,
    weddingDate: weddingDate,
    weddingTime: weddingTime,
  };
  return await API.graphql(graphqlOperation(createCustomerRequest, { input: customerRequest }));
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  initContactForm();
}
