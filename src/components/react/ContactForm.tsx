import { useState, useEffect } from 'react';
import { Mail, Send, Loader2, Calendar, MapPin, Music, Globe, Users } from 'lucide-react';

interface ContactFormProps {
    initialReason?: string;
    initialSubject?: string;
    initialMessage?: string;
    initialContext?: {
        festivalName?: string;
        ref?: string;
        artist?: string;
    };
    lang?: 'en' | 'de';
}

export default function ContactForm({
    initialReason = '',
    initialSubject = '',
    initialMessage = '',
    initialContext = {},
    lang = 'en'
}: ContactFormProps) {
    const [reason, setReason] = useState(initialReason);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: initialSubject,
        message: initialMessage,
        // Festival specific fields
        festivalName: initialContext.festivalName || '',
        festivalDate: '',
        festivalLocation: '',
        festivalGenre: '',
        festivalWebsite: '',
        festivalCapacity: '',
        // General fields
        ref: initialContext.ref || '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Translations
    const t = {
        en: {
            name: 'Name',
            namePlaceholder: 'Your name',
            email: 'Email',
            emailPlaceholder: 'your@email.com',
            topic: 'Topic',
            selectTopic: 'Select a topic',
            message: 'Message',
            messagePlaceholder: 'Your message...',
            send: 'Send Message',
            sending: 'Sending...',
            sent: 'Message Sent!',
            sentDesc: "Thanks for reaching out. We'll get back to you within 24-48 hours.",
            sendAnother: 'Send another message',
            festivalDetails: 'Festival Details',
            festivalName: 'Festival Name',
            date: 'Date(s)',
            location: 'Location',
            genre: 'Primary Genre(s)',
            website: 'Website',
            capacity: 'Expected Capacity',
            submitFestival: 'Submit Festival',
            topics: {
                general: 'General Inquiry',
                partnership: 'Partnership',
                booking: 'Artist Booking',
                submit_festival: 'Submit / List a Festival',
                support: 'Support',
                press: 'Press',
                other: 'Other'
            }
        },
        de: {
            name: 'Name',
            namePlaceholder: 'Dein Name',
            email: 'E-Mail',
            emailPlaceholder: 'deine@email.com',
            topic: 'Thema',
            selectTopic: 'Thema wählen',
            message: 'Nachricht',
            messagePlaceholder: 'Deine Nachricht...',
            send: 'Nachricht senden',
            sending: 'Sende...',
            sent: 'Nachricht gesendet!',
            sentDesc: 'Danke für deine Nachricht. Wir melden uns innerhalb von 24-48 Stunden.',
            sendAnother: 'Weitere Nachricht senden',
            festivalDetails: 'Festival Details',
            festivalName: 'Festival Name',
            date: 'Datum',
            location: 'Ort',
            genre: 'Genre(s)',
            website: 'Webseite',
            capacity: 'Erwartete Kapazität',
            submitFestival: 'Festival einreichen',
            topics: {
                general: 'Allgemeine Anfrage',
                partnership: 'Partnerschaft',
                booking: 'Künstler-Buchung',
                submit_festival: 'Festival einreichen / listen',
                support: 'Support',
                press: 'Presse',
                other: 'Sonstiges'
            }
        }
    };

    const strings = t[lang];

    // Update reason if prop changes (e.g. navigation)
    useEffect(() => {
        if (initialReason) setReason(initialReason);
    }, [initialReason]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: reason,
                    message: formData.message,
                    festivalName: formData.festivalName,
                    festivalDate: formData.festivalDate,
                    // Pass other fields as needed
                }),
            });

            if (response.ok) {
                setSuccess(true);
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-12 animate-fade-in">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                    <Send className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{strings.sent}</h3>
                <p className="text-gray-400 mb-8">
                    {strings.sentDesc}
                </p>
                <button
                    onClick={() => {
                        setSuccess(false);
                        setFormData(prev => ({ ...prev, message: '' }));
                    }}
                    className="btn-secondary"
                >
                    {strings.sendAnother}
                </button>
            </div>
        );
    }

    const isFestivalSubmission = reason === 'festival' || reason === 'submit_festival';

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        {strings.name}
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#262626] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:border-[#ff0700] outline-none transition-colors"
                        placeholder={strings.namePlaceholder}
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        {strings.email}
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#262626] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:border-[#ff0700] outline-none transition-colors"
                        placeholder={strings.emailPlaceholder}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">
                    {strings.topic}
                </label>
                <select
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-3 bg-[#262626] border border-[#404040] rounded-lg text-white focus:border-[#ff0700] outline-none cursor-pointer"
                >
                    <option value="">{strings.selectTopic}</option>
                    <option value="general">{strings.topics.general}</option>
                    <option value="partnership">{strings.topics.partnership}</option>
                    <option value="booking">{strings.topics.booking}</option>
                    <option value="submit_festival">{strings.topics.submit_festival}</option>
                    <option value="support">{strings.topics.support}</option>
                    <option value="press">{strings.topics.press}</option>
                    <option value="other">{strings.topics.other}</option>
                </select>
            </div>

            {/* Dynamic Festival Fields */}
            {isFestivalSubmission && (
                <div className="p-6 bg-[#1a1a1a] border border-[#333] rounded-xl space-y-6 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#ff0700]" />
                        {strings.festivalDetails}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="festivalName" className="block text-sm font-medium text-gray-300 mb-2">
                                {strings.festivalName}
                            </label>
                            <input
                                type="text"
                                id="festivalName"
                                name="festivalName"
                                value={formData.festivalName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#262626] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:border-[#ff0700] outline-none transition-colors"
                                placeholder="Name of the event"
                            />
                        </div>
                        <div>
                            <label htmlFor="festivalDate" className="block text-sm font-medium text-gray-300 mb-2">
                                {strings.date}
                            </label>
                            <input
                                type="text"
                                id="festivalDate"
                                name="festivalDate"
                                value={formData.festivalDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#262626] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:border-[#ff0700] outline-none transition-colors"
                                placeholder="e.g. July 24-26, 2026"
                            />
                        </div>
                        <div>
                            <label htmlFor="festivalLocation" className="block text-sm font-medium text-gray-300 mb-2">
                                {strings.location}
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    id="festivalLocation"
                                    name="festivalLocation"
                                    value={formData.festivalLocation}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-[#262626] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:border-[#ff0700] outline-none transition-colors"
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="festivalGenre" className="block text-sm font-medium text-gray-300 mb-2">
                                {strings.genre}
                            </label>
                            <div className="relative">
                                <Music className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    id="festivalGenre"
                                    name="festivalGenre"
                                    value={formData.festivalGenre}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-[#262626] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:border-[#ff0700] outline-none transition-colors"
                                    placeholder="e.g. Techno, House"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="festivalWebsite" className="block text-sm font-medium text-gray-300 mb-2">
                                {strings.website}
                            </label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                                <input
                                    type="url"
                                    id="festivalWebsite"
                                    name="festivalWebsite"
                                    value={formData.festivalWebsite}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-[#262626] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:border-[#ff0700] outline-none transition-colors"
                                    placeholder="https://"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="festivalCapacity" className="block text-sm font-medium text-gray-300 mb-2">
                                {strings.capacity}
                            </label>
                            <div className="relative">
                                <Users className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    id="festivalCapacity"
                                    name="festivalCapacity"
                                    value={formData.festivalCapacity}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-[#262626] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:border-[#ff0700] outline-none transition-colors"
                                    placeholder="e.g. 5,000 - 10,000"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    {strings.message}
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required={!isFestivalSubmission} // Optional if just listing festival
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#262626] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:border-[#ff0700] outline-none transition-colors resize-none"
                    placeholder={strings.messagePlaceholder}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full md:w-auto flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {strings.sending}
                    </>
                ) : (
                    <>
                        {isFestivalSubmission ? strings.submitFestival : strings.send}
                        <Send className="w-4 h-4" />
                    </>
                )}
            </button>
        </form>
    );
}
