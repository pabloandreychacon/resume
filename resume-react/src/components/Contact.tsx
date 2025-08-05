import React, { useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { useThemeContextHook } from '../hooks/useThemeContextHook';

interface FormData {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const { theme } = useThemeContextHook();
  const [formData, setFormData] = useState<FormData>({
    from_name: '',
    from_email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Initialize EmailJS
      emailjs.init("L7o6hZUmFJQ_Jbqu0");

      // Send the email
      await emailjs.send("service_s481rtv", "template_771ecr6", {
        to_email: "pabloandreychacon@gmail.com",
        from_name: formData.from_name,
        from_email: formData.from_email,
        subject: formData.subject,
        message: `Subject: ${formData.subject}\nFrom: ${formData.from_email}\n\n${formData.message}`,
      });

      // Show success message
      setIsSuccess(true);
      setFormData({
        from_name: '',
        from_email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error("Email sending failed:", error);
      alert("Failed to send message. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className={`contact section ${theme}-mode`}>
      <div className="container section-title" data-aos="fade-up">
        <h2>Contact</h2>
      </div>
      <div className="container" data-aos="fade" data-aos-delay="100">
        <div className="row gy-4">
          <div className="col-lg-4">
            <div
              className="info-item d-flex"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <i className="bi bi-geo-alt flex-shrink-0"></i>
              <div>
                <h3>Address</h3>
                <p>Calle La Joaquina, San Rafael, Heredia, Costa Rica</p>
              </div>
            </div>
            <div
              className="info-item d-flex"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <i className="bi bi-telephone flex-shrink-0"></i>
              <div>
                <h3>Call Us</h3>
                <p>+(506) 86906111</p>
              </div>
            </div>
            <div
              className="info-item d-flex"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <i className="bi bi-envelope flex-shrink-0"></i>
              <div>
                <h3>Email</h3>
                <p>pabloandreychaconluna@hotmail.com</p>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <form id="contactForm" className="php-email-form" data-aos="fade-up" data-aos-delay="200" onSubmit={handleSubmit}>
              <div className="row gy-4">
                <div className="col-md-6">
                  <input
                    type="text"
                    name="from_name"
                    className="form-control"
                    placeholder="Your Name"
                    required
                    value={formData.from_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="email"
                    name="from_email"
                    className="form-control"
                    placeholder="Your Email"
                    required
                    value={formData.from_email}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    name="subject"
                    className="form-control"
                    placeholder="Subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-12">
                  <textarea
                    className="form-control"
                    name="message"
                    rows={6}
                    placeholder="Message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="col-md-12 text-center">
                  {!isLoading ? (
                    <button type="submit" id="submitBtn" className="btn btn-primary">
                      Send Message
                      <i className="bi bi-send ms-2"></i>
                    </button>
                  ) : (
                    <button className="btn btn-primary" type="button" disabled id="loadingBtn">
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Sending...
                    </button>
                  )}
                </div>
              </div>
            </form>
            {isSuccess && (
              <div id="formSuccess" className="alert alert-success mt-4">
                Thank you for your message! We'll get back to you shortly.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;