import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
  Building,
  AlertTriangle,
  Facebook,
  Twitter,
  Instagram,
  Globe
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hall contact information
  const hallContacts = [
    {
      name: 'Shahid Moushiur Rahman Hall',
      type: 'Boys Hall',
      phone: '+880 421 714 221',
      email: 'smr.hall@just.edu.bd',
      Provost: '',
      location: 'West Campus, JUST',
      officeHours: '9:00 AM - 5:00 PM'
    },
    {
      name: 'Munshi Meherullah Hall',
      type: 'Boys Hall',
      phone: '+880 421 714 222',
      email: 'mm.hall@just.edu.bd',
      Provost: '',
      location: 'Central Campus, JUST',
      officeHours: '9:00 AM - 5:00 PM'
    },
    {
      name: 'Tapashi Rabeya Hall',
      type: 'Girls Hall',
      phone: '+880 421 714 223',
      email: 'tr.hall@just.edu.bd',
      Provost: '',
      location: 'South-West Campus, JUST',
      officeHours: '9:00 AM - 5:00 PM'
    },
    {
      name: 'Bir Protik Taramon Bibi Hall',
      type: 'Girls Hall',
      phone: '+880 421 714 224',
      email: 'bptb.hall@just.edu.bd',
      Provost: '',
      location: 'North Campus, JUST',
      officeHours: '9:00 AM - 5:00 PM'
    }
  ];

  // General contacts
  const generalContacts = [
    {
      title: 'Hall Administration Office',
      icon: Building,
      contact: '+880 421 714 220',
      email: 'hall.admin@just.edu.bd',
      description: 'Main administration office for all hall-related matters'
    },
    {
      title: 'Emergency Services',
      icon: AlertTriangle,
      contact: '+880 421 714 000',
      email: 'emergency@just.edu.bd',
      description: '24/7 emergency contact for urgent situations'
    },
    {
      title: 'Technical Support',
      icon: Globe,
      contact: '+880 421 714 225',
      email: 'it.support@just.edu.bd',
      description: 'IT and technical support for hall facilities'
    }
  ];

  // Office hours
  const officeHours = [
    { day: 'Saturday - Wednesday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Friday', hours: '9:00 AM - 1:00 PM' },
    { day: 'Thursday (Extended)', hours: '9:00 AM - 5:00 PM' },
    { day: 'Emergency', hours: '24/7 Available' }
  ];

  // Social media links
  const socialLinks = [
    { platform: 'Facebook', icon: Facebook, url: 'https://facebook.com/just.edu.bd', color: 'hover:text-blue-600' },
    { platform: 'Twitter', icon: Twitter, url: 'https://twitter.com/just.edu', color: 'hover:text-blue-400' },
    { platform: 'Instagram', icon: Instagram, url: 'https://instagram.com/just.edu', color: 'hover:text-pink-600' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
    setIsSubmitting(false);
  };

  const ContactCard = ({ contact, type = 'hall' }) => {
    const Icon = contact.icon || Building;
    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-[#19aaba] to-[#158c99] rounded-lg flex items-center justify-center text-white">
              <Icon size={24} />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{contact.title || contact.name}</h3>

            {type === 'hall' && (
              <div className="mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  contact.type === 'Boys Hall' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                }`}>
                  {contact.type}
                </span>
              </div>
            )}

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-[#19aaba]" />
                <span>{contact.contact || contact.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[#19aaba]" />
                <span>{contact.email}</span>
              </div>

              {contact.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#19aaba]" />
                  <span>{contact.location}</span>
                </div>
              )}

              {contact.superintendent && (
                <div className="flex items-center gap-2">
                  <User size={16} className="text-[#19aaba]" />
                  <span>Superintendent: {contact.superintendent}</span>
                </div>
              )}

              {contact.officeHours && (
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#19aaba]" />
                  <span>Office Hours: {contact.officeHours}</span>
                </div>
              )}
            </div>

            {contact.description && (
              <p className="text-sm text-gray-500 mt-3">{contact.description}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#19aaba] via-[#158c99] to-[#116d77] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Phone size={48} className="mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
            </div>
            <p className="text-xl md:text-2xl text-cyan-100 max-w-3xl mx-auto">
              Get in touch with us for any hall-related inquiries, support, or assistance
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hall Contacts Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Hall Contacts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Contact information for all residential halls at Jashore University of Science and Technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hallContacts.map((hall, index) => (
              <ContactCard key={index} contact={hall} type="hall" />
            ))}
          </div>
        </div>

        {/* General Contacts Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">General Contacts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Additional contact information for administration and support services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {generalContacts.map((contact, index) => (
              <ContactCard key={index} contact={contact} type="general" />
            ))}
          </div>
        </div>

        {/* Contact Form and Office Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare size={24} className="text-[#19aaba]" />
              <h2 className="text-2xl font-bold text-gray-800">Send us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent outline-none"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent outline-none"
                >
                  <option value="general">General Inquiry</option>
                  <option value="admission">Room Admission</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="complaint">Complaint</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent outline-none"
                  placeholder="Brief subject of your message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent outline-none resize-none"
                  placeholder="Please describe your inquiry in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white py-3 px-6 rounded-lg font-semibold hover:from-[#158c99] hover:to-[#116d77] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Office Hours and Location */}
          <div className="space-y-6">
            {/* Office Hours */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock size={24} className="text-[#19aaba]" />
                <h2 className="text-2xl font-bold text-gray-800">Office Hours</h2>
              </div>

              <div className="space-y-4">
                {officeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium text-gray-800">{schedule.day}</span>
                    <span className="text-[#19aaba] font-semibold">{schedule.hours}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Emergency Notice</p>
                    <p className="text-sm text-yellow-700">
                      For emergencies outside office hours, please contact the emergency hotline immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <MapPin size={24} className="text-[#19aaba]" />
                <h2 className="text-2xl font-bold text-gray-800">Location</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">University Address</h3>
                  <p className="text-gray-600">
                    Jashore University of Science and Technology<br />
                    University Avenue, Churamonkathi<br />
                    Jashore - 7408, Bangladesh
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Hall Administration Building</h3>
                  <p className="text-gray-600">
                    Located at the center of the university campus<br />
                    Adjacent to the main administrative block
                  </p>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-6 h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin size={48} className="mx-auto mb-2" />
                  <p className="text-sm">Interactive Map</p>
                  <p className="text-xs">Coming Soon</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Globe size={24} className="text-[#19aaba]" />
                <h2 className="text-2xl font-bold text-gray-800">Connect With Us</h2>
              </div>

              <p className="text-gray-600 mb-4">
                Follow us on social media for updates and announcements
              </p>

              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 transition-colors duration-300 ${social.color}`}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contact Actions */}
        <div className="bg-gradient-to-r from-[#19aaba] to-[#158c99] rounded-xl text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Immediate Assistance?</h2>
          <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
            For urgent matters or emergencies, don't hesitate to contact us directly
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <Phone size={32} className="mb-3" />
              <div className="font-semibold text-lg mb-1">Emergency Hotline</div>
              <div className="text-cyan-100 text-xl font-bold">+880 421 714 000</div>
              <div className="text-cyan-200 text-sm">24/7 Available</div>
            </div>

            <div className="flex flex-col items-center">
              <Mail size={32} className="mb-3" />
              <div className="font-semibold text-lg mb-1">Quick Response</div>
              <div className="text-cyan-100">hall.admin@just.edu.bd</div>
              <div className="text-cyan-200 text-sm">Response within 24 hours</div>
            </div>

            <div className="flex flex-col items-center">
              <MapPin size={32} className="mb-3" />
              <div className="font-semibold text-lg mb-1">Visit Us</div>
              <div className="text-cyan-100">Hall Administration Office</div>
              <div className="text-cyan-200 text-sm">Mon-Fri: 9AM-5PM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
