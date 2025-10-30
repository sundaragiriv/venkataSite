import { useState } from "react";
import { FadeIn } from "../components/FadeIn";
import MotionCard from "../components/MotionCard";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    subject: "",
    message: "",
    requestTypes: [] as string[],

    budget: "",
    timeline: ""
  });

  const requestTypeOptions = [
    "General Inquiry",
    "Resume Request",
    "Strategy Consultation",
    "Speaking Engagement",
    "Partnership Opportunity",
    "Project Assessment",
    "Training & Workshops",
    "Technical Advisory"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = formData.requestTypes.includes("Resume Request") 
      ? "Resume Request - " + formData.subject
      : formData.subject;
    
    const body = `Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company}
Role: ${formData.role}

Request Types:
${formData.requestTypes.length > 0 ? formData.requestTypes.map(type => `• ${type}`).join('\n') : 'Not specified'}

Project Budget: ${formData.budget || 'Not specified'}
Timeline: ${formData.timeline || 'Not specified'}

Message:
${formData.message}`;

    const mailtoLink = `mailto:sundaragiriv@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRequestTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      requestTypes: prev.requestTypes.includes(type)
        ? prev.requestTypes.filter(item => item !== type)
        : [...prev.requestTypes, type]
    }));
  };

  return (
    <section className="container max-w-wrap py-12">
      <div className="max-w-2xl mx-auto">
        <FadeIn>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Get In Touch</h1>
            <p className="text-slate-600">
              Ready to discuss your SAP transformation or AI integration? Let's connect and explore how we can accelerate your digital journey.
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <MotionCard className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="your.email@company.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Your company name"
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-2">
                    Your Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., CTO, IT Director, Project Manager"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Request Type (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {requestTypeOptions.map(type => (
                    <label key={type} className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.requestTypes.includes(type)}
                        onChange={() => handleRequestTypeChange(type)}
                        className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700 leading-tight">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-slate-700 mb-2">
                  Project Timeline
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select timeline</option>
                  <option value="immediate">Immediate (under 1 month)</option>
                  <option value="short">Short-term (1-3 months)</option>
                  <option value="medium">Medium-term (3-6 months)</option>
                  <option value="long">Long-term (6+ months)</option>
                  <option value="planning">Planning phase</option>
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-2">
                  Project Budget Range
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select budget range</option>
                  <option value="under-50k">Under $50K</option>
                  <option value="50k-100k">$50K - $100K</option>
                  <option value="100k-250k">$100K - $250K</option>
                  <option value="250k-500k">$250K - $500K</option>
                  <option value="500k-1m">$500K - $1M</option>
                  <option value="over-1m">Over $1M</option>
                  <option value="discuss">Prefer to discuss</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Brief subject line"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Tell me about your project, goals, or how I can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Send Message
              </button>
            </form>
          </MotionCard>
        </FadeIn>

        <FadeIn>
          <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
            <MotionCard className="p-6">
              <div className="text-2xl mb-2">📧</div>
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-sm text-slate-600">sundaragiriv@gmail.com</p>
            </MotionCard>
            
            <MotionCard className="p-6">
              <div className="text-2xl mb-2">💼</div>
              <h3 className="font-semibold mb-1">LinkedIn</h3>
              <a href="https://www.linkedin.com/in/sundaragiri" target="_blank" rel="noopener noreferrer" 
                 className="text-sm text-blue-600 hover:text-blue-700">
                Connect with me
              </a>
            </MotionCard>
            
            <MotionCard className="p-6">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold mb-1">Response Time</h3>
              <p className="text-sm text-slate-600">Within 24 hours</p>
            </MotionCard>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}