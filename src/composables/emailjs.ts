import { DEFAULTS } from "@/globals";
import emailjs from '@emailjs/browser/';

const gmnhEmailHandle = DEFAULTS.GMNH_EMAIL_HANDLE
const emailjsServiceId = DEFAULTS.EMAILJS_SERVICE_ID;
const emailjsTemplateId = DEFAULTS.EMAILJS_TEMPLATE_ID;
const emailjsUserId = DEFAULTS.EMAILJS_USER_ID;

export const emailTypeResponder= 'QuestionResponder';
export const emailTypeAnswered = 'QuestionAnswered';
export const emailTypeAsked = 'QuestionAsked';
export const emailTypeSignUp = 'UserSignUp';


export function sendEmail(userEmailAddress: string, emailType: string, questionLink: string) {
  /* Initialize message and send specified email using emailjs
     Input:
        emailAddress --> user's wallet id
        emailType --> type of email to send (tied to template)
        questionLink --> /question/ link
  */

  // TODO down the road: clean this up more
  if (emailType == 'QuestionResponder') {
    var templateParams = {
      from_email: gmnhEmailHandle,
      to_email: userEmailAddress,
      message: `You answered an open question! Check out your full response here anytime: ${questionLink}`
    };
  }
  else if (emailType == 'QuestionAsked') {
    var templateParams = {
      from_email: gmnhEmailHandle,
      to_email: userEmailAddress,
      message: `Your question was posted on GMNH! Check out your question here anytime: ${questionLink}`
    };
  }
  else if (emailType == 'QuestionAnswered') {
    var templateParams = {
      from_email: gmnhEmailHandle,
      to_email: userEmailAddress,
      message: `Your question was answered on GMNH! Check out your question here anytime: ${questionLink}`
    };
  }
  // emailType == UserSignUp
  else {
    var templateParams = {
      from_email: gmnhEmailHandle,
      to_email: userEmailAddress,
      message: `Thanks for joining GMNH! Be on the lookout for emails when you ask a question or answer one!`
    };
  }


  emailjs.send(emailjsServiceId, emailjsTemplateId, templateParams, emailjsUserId)
    .then(function (response) {
      console.log('SUCCESS!', response.status, response.text);
    }, function (error) {
      console.log('FAILED...', error);
    });


}
