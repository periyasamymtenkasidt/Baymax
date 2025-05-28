import React, { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your submit logic here (API call, etc)
    setSubmitted(true);
  };

  return (
    <section className="bg-white text-red-700 px-6 py-12 max-w-4xl mx-auto rounded-lg my-10 shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
      {submitted ? (
        <p className="text-center text-green-600">Thank you for contacting us!</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full border border-red-300 rounded px-3 py-2"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full border border-red-300 rounded px-3 py-2"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="4"
            className="w-full border border-red-300 rounded px-3 py-2 resize-none"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition w-full"
          >
            Send Message
          </button>
        </form>
      )}
    </section>
  );
};

export default ContactSection;
