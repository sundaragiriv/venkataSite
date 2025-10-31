import { useState } from "react";
import { FadeIn } from "../components/FadeIn";
import MotionCard from "../components/MotionCard";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    requestType: ""
  });

  const requestTypeOptions = [
    "General Inquiry",
    "Resume Request", 
    "Strategy Consultation",
    "Speaking Engagement",
    "Project Assessment",
    "Technical Advisory"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = formData.requestType === "Resume Request" 
      ? "Resume Request - " + formData.subject
      : formData.subject;
    
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nRequest Type: ${formData.requestType}\n\nMessage:\n${formData.message}`;

    const mailtoLink = `mailto:sundaragiriv@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="container max-w-wrap py-12 bg-black min-h-screen">
      <div className="max-w-5xl mx-auto relative z-10">
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6 text-primary font-sans">Get In Touch</h1>
            <p className="text-secondary font-medium text-lg">
              Ready to discuss your SAP transformation or AI integration?
            </p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form - Takes 2/3 width */}
          <div className="lg:col-span-2">
            <FadeIn>
              <MotionCard className="p-8 card-glow hover-lift">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-dark-card border border-dark-tertiary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors text-primary placeholder-muted"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-dark-card border border-dark-tertiary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors text-primary placeholder-muted"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-primary mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-dark-card border border-dark-tertiary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors text-primary placeholder-muted"
                        placeholder="Your company"
                      />
                    </div>

                    <div>
                      <label htmlFor="requestType" className="block text-sm font-medium text-primary mb-2">
                        Request Type
                      </label>
                      <select
                        id="requestType"
                        name="requestType"
                        value={formData.requestType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-dark-card border border-dark-tertiary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors text-primary"
                      >
                        <option value="">Select type</option>
                        {requestTypeOptions.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-primary mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark-card border border-dark-tertiary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors text-primary placeholder-muted"
                      placeholder="Brief subject"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-primary mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark-card border border-dark-tertiary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors resize-none text-primary placeholder-muted"
                      placeholder="Tell me about your project or how I can help..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-gradient py-4 font-semibold hover-lift"
                  >
                    send message
                  </button>
                </form>
              </MotionCard>
            </FadeIn>
          </div>

          {/* Sidebar - Takes 1/3 width */}
          <div className="space-y-6">
            {/* Contact Info */}
            <FadeIn>
              <MotionCard className="p-6 card-glow hover-lift">
                <h3 className="font-semibold mb-4 text-primary font-sans">Contact Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="text-lg">📧</div>
                    <div>
                      <div className="text-sm font-medium text-primary">Email</div>
                      <div className="text-xs text-secondary">sundaragiriv@gmail.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-lg">💼</div>
                    <div>
                      <div className="text-sm font-medium text-primary">LinkedIn</div>
                      <a href="https://www.linkedin.com/in/sundaragiri" target="_blank" rel="noopener noreferrer" 
                         className="text-xs text-accent hover:text-primary transition">
                        /in/sundaragiri
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-lg">⚡</div>
                    <div>
                      <div className="text-sm font-medium text-primary">Response</div>
                      <div className="text-xs text-secondary">Within 24 hours</div>
                    </div>
                  </div>
                </div>
              </MotionCard>
            </FadeIn>

            {/* Stats */}
            <FadeIn>
              <MotionCard className="p-6 card-glow border border-accent/20">
                <h3 className="font-semibold mb-4 text-primary font-sans">Why Work With Me</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Experience</span>
                    <span className="text-accent font-bold">22+ Years</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Revenue Impact</span>
                    <span className="text-accent font-bold">$50M+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Fortune 500</span>
                    <span className="text-accent font-bold">15+ Clients</span>
                  </div>
                </div>
              </MotionCard>
            </FadeIn>

            {/* Quick Links */}
            <FadeIn>
              <MotionCard className="p-6 card-glow hover-lift">
                <h3 className="font-semibold mb-4 text-primary font-sans">Quick Links</h3>
                <div className="space-y-2">
                  <a href="/blueprints" className="block text-sm text-secondary hover:text-accent transition">
                    → View Blueprints
                  </a>
                  <a href="/signals" className="block text-sm text-secondary hover:text-accent transition">
                    → Latest Signals
                  </a>
                  <a href="/ai" className="block text-sm text-secondary hover:text-accent transition">
                    → AI Lab
                  </a>
                  <a href="/about" className="block text-sm text-secondary hover:text-accent transition">
                    → About Me
                  </a>
                </div>
              </MotionCard>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}