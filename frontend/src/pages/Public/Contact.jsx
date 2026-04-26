import React, { useState } from 'react';
import {
  Phone, Mail, MapPin, Clock, Send, User, MessageSquare,
  Building, AlertTriangle, Globe
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: '', category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hallContacts = [
    { name: 'Shahid Moushiur Rahman Hall', type: 'Boys Hall', phone: '+880 421 714 221', email: 'smr.hall@just.edu.bd', location: 'West Campus, JUST', officeHours: '9:00 AM - 5:00 PM' },
    { name: 'Munshi Meherullah Hall', type: 'Boys Hall', phone: '+880 421 714 222', email: 'mm.hall@just.edu.bd', location: 'Central Campus, JUST', officeHours: '9:00 AM - 5:00 PM' },
    { name: 'Tapashi Rabeya Hall', type: 'Girls Hall', phone: '+880 421 714 223', email: 'tr.hall@just.edu.bd', location: 'South-West Campus, JUST', officeHours: '9:00 AM - 5:00 PM' },
    { name: 'Bir Protik Taramon Bibi Hall', type: 'Girls Hall', phone: '+880 421 714 224', email: 'bptb.hall@just.edu.bd', location: 'North Campus, JUST', officeHours: '9:00 AM - 5:00 PM' }
  ];

  const generalContacts = [
    { title: 'Hall Administration Office', icon: Building, contact: '+880 421 714 220', email: 'hall.admin@just.edu.bd', description: 'Main administration office for all hall-related matters' },
    { title: 'Emergency Services', icon: AlertTriangle, contact: '+880 421 714 000', email: 'emergency@just.edu.bd', description: '24/7 emergency contact for urgent situations' },
    { title: 'Technical Support', icon: Globe, contact: '+880 421 714 225', email: 'it.support@just.edu.bd', description: 'IT and technical support for hall facilities' }
  ];

  const officeHours = [
    { day: 'Saturday - Wednesday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Friday', hours: '9:00 AM - 1:00 PM' },
    { day: 'Thursday (Extended)', hours: '9:00 AM - 5:00 PM' },
    { day: 'Emergency', hours: '24/7 Available' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '', category: 'general' });
    setIsSubmitting(false);
  };

  const ContactCard = ({ contact, type = 'hall' }) => {
    const Icon = contact.icon || Building;
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-5 border border-gray-100 card-hover">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <div className="w-11 h-11 bg-primary rounded-lg flex items-center justify-center text-white">
              <Icon size={20} />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-primary mb-2 font-heading">{contact.title || contact.name}</h3>
            {type === 'hall' && (
              <div className="mb-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  contact.type === 'Boys Hall' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                }`}>{contact.type}</span>
              </div>
            )}
            <div className="space-y-1.5 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-secondary" />
                <span>{contact.contact || contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-secondary" />
                <span>{contact.email}</span>
              </div>
              {contact.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-secondary" />
                  <span>{contact.location}</span>
                </div>
              )}
              {contact.officeHours && (
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-secondary" />
                  <span>Office: {contact.officeHours}</span>
                </div>
              )}
            </div>
            {contact.description && (
              <p className="text-sm text-gray-400 mt-2">{contact.description}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-sm";

  return (
    <div className="min-h-screen bg-surface">
      {/* Banner */}
      <div className="page-banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-3">
            <Phone size={36} className="mr-3 text-accent" />
            <h1 className="text-3xl sm:text-4xl font-bold font-heading">Contact Us</h1>
          </div>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Get in touch with us for any hall-related inquiries, support, or assistance
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hall Contacts */}
        <div className="mb-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary mb-2 font-heading">Hall Contacts</h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">Contact information for all residential halls</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {hallContacts.map((hall, i) => <ContactCard key={i} contact={hall} type="hall" />)}
          </div>
        </div>

        {/* General Contacts */}
        <div className="mb-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary mb-2 font-heading">General Contacts</h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">Additional contact information for support services</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {generalContacts.map((c, i) => <ContactCard key={i} contact={c} type="general" />)}
          </div>
        </div>

        {/* Form + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm p-7 border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <MessageSquare size={22} className="text-secondary" />
              <h2 className="text-xl font-bold text-primary font-heading">Send us a Message</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className={inputClass} placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className={inputClass} placeholder="your.email@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className={inputClass}>
                  <option value="general">General Inquiry</option>
                  <option value="admission">Room Admission</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="complaint">Complaint</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} required className={inputClass} placeholder="Brief subject" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={4} className={`${inputClass} resize-none`} placeholder="Describe your inquiry..." />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-secondary py-2.5 px-6 rounded-lg font-semibold hover:bg-accent-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-secondary"></div> Sending...</>
                ) : (
                  <><Send size={16} /> Send Message</>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Office Hours */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={20} className="text-secondary" />
                <h2 className="text-lg font-bold text-primary font-heading">Office Hours</h2>
              </div>
              <div className="space-y-3">
                {officeHours.map((s, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-b-0">
                    <span className="font-medium text-gray-700 text-sm">{s.day}</span>
                    <span className="text-secondary font-semibold text-sm">{s.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-yellow-800">Emergency Notice</p>
                    <p className="text-xs text-yellow-700">For emergencies outside office hours, contact the emergency hotline.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} className="text-secondary" />
                <h2 className="text-lg font-bold text-primary font-heading">Location</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-primary text-sm mb-1">University Address</h3>
                  <p className="text-gray-600 text-sm">
                    Jashore University of Science and Technology<br />
                    University Avenue, Churamonkathi<br />
                    Jashore - 7408, Bangladesh
                  </p>
                </div>
              </div>
              <div className="mt-5 h-36 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MapPin size={36} className="mx-auto mb-1" />
                  <p className="text-xs">Interactive Map Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contact CTA */}
        <div className="bg-primary rounded-xl text-white p-7 text-center">
          <h2 className="text-xl font-bold mb-3 font-heading">Need Immediate Assistance?</h2>
          <p className="text-white/60 mb-5 max-w-2xl mx-auto text-sm">
            For urgent matters or emergencies, don't hesitate to contact us directly
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex flex-col items-center">
              <Phone size={26} className="mb-2 text-accent" />
              <div className="font-semibold text-sm mb-0.5">Emergency Hotline</div>
              <div className="text-white/70 text-lg font-bold">+880 421 714 000</div>
              <div className="text-white/40 text-xs">24/7 Available</div>
            </div>
            <div className="flex flex-col items-center">
              <Mail size={26} className="mb-2 text-accent" />
              <div className="font-semibold text-sm mb-0.5">Quick Response</div>
              <div className="text-white/70 text-sm">hall.admin@just.edu.bd</div>
              <div className="text-white/40 text-xs">Response within 24 hours</div>
            </div>
            <div className="flex flex-col items-center">
              <MapPin size={26} className="mb-2 text-accent" />
              <div className="font-semibold text-sm mb-0.5">Visit Us</div>
              <div className="text-white/70 text-sm">Hall Administration Office</div>
              <div className="text-white/40 text-xs">Sat-Wed: 9AM-5PM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
