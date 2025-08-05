import emailjs from '@emailjs/browser';

// Configuración de EmailJS
const EMAILJS_SERVICE_ID = 'service_s481rtv';
const EMAILJS_TEMPLATE_ID = 'template_771ecr6';
const EMAILJS_PUBLIC_KEY = 'L7o6hZUmFJQ_Jbqu0';

// Inicializar EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// Funciones helper para EmailJS
export const emailjsHelpers = {
  // Enviar ticket de soporte
  async sendSupportTicket(ticketData: {
    from_name: string;
    from_email: string;
    order_number?: string;
    issue_type: string;
    subject: string;
    message: string;
  }) {
    try {
      const templateParams = {
        to_email: "pabloandreychacon@gmail.com",
        from_name: ticketData.from_name,
        from_email: ticketData.from_email,
        subject: `Support Ticket: ${ticketData.issue_type} - ${ticketData.subject}`,
        message: `Subject: ${ticketData.subject}\nFrom: ${ticketData.from_email}\nOrder Number: ${ticketData.order_number || 'N/A'}\nIssue Type: ${ticketData.issue_type}\n\n${ticketData.message}`
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      return { success: true, response };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  },

  // Enviar formulario de contacto
  async sendContactForm(contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    try {
      const templateParams = {
        to_email: "pabloandreychacon@gmail.com",
        from_name: contactData.name,
        from_email: contactData.email,
        subject: `Contact Form: ${contactData.subject}`,
        message: `Name: ${contactData.name}\nEmail: ${contactData.email}\nSubject: ${contactData.subject}\n\n${contactData.message}`
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      return { success: true, response };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  },

  // Enviar email de confirmación de orden
  async sendOrderConfirmation(orderData: {
    to_email: string;
    from_email: string;
    message: string;
  }) {
    try {
      const templateParams = {
        to_email: orderData.to_email,
        from_email: orderData.from_email,
        message: orderData.message
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      return { success: true, response };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }
};

// Export function for direct use
export const sendEmail = async (emailData: {
  to_email: string;
  from_email: string;
  message: string;
}) => {
  return emailjsHelpers.sendOrderConfirmation(emailData);
}; 