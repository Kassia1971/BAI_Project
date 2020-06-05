export const sendMail = user => {
  const template_params = {
    "from_name": "BAI Project Mailer",
    "to_name": user,
  }

  const service_id = "default_service";
  const template_id = "template_OeKEW4cC";

  emailjs.send(service_id, template_id, template_params);
}
