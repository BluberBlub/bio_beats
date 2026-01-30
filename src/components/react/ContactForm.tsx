import { useState, useEffect } from 'react';
import { Mail, Send, Loader2, Calendar, MapPin, Music, Globe, Users } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

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
        // Booking specific fields
        eventDate: '',
        eventVenue: '',
        eventType: '',
        budgetRange: '',
        artistRequested: initialContext.artist || '',
        // General fields
        ref: initialContext.ref || '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { t: allTranslations } = useTranslation(lang);
    const strings = allTranslations.contact;

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
                    // Booking fields
                    eventDate: formData.eventDate,
                    eventVenue: formData.eventVenue,
                    budgetRange: formData.budgetRange,
                    artistRequested: formData.artistRequested,
                }),
            });

            if (response.ok) {
                setSuccess(true);
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            // In a real app, set an error state here
            alert('Error submitting form. Please check your internet connection.');
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
    const isBookingInquiry = reason === 'booking';

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-bio-gray-300 mb-2">
                        {strings.name}
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white placeholder-bio-gray-500 focus:border-bio-accent outline-none transition-colors"
                        placeholder={strings.yourName}
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-bio-gray-300 mb-2">
                        {strings.email}
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white placeholder-bio-gray-500 focus:border-bio-accent outline-none transition-colors"
                        placeholder={strings.yourEmail}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="reason" className="block text-sm font-medium text-bio-gray-300 mb-2">
                    {strings.subject}
                </label>
                <select
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white focus:border-bio-accent outline-none cursor-pointer"
                >
                    <option value="">{strings.selectTopic}</option>
                    <option value="general">{strings.generalInquiry}</option>
                    <option value="partnership">{strings.partnership}</option>
                    <option value="booking">{strings.booking}</option>
                    <option value="submit_festival">{strings.submitFestival}</option>
                    <option value="support">{strings.support}</option>
                    <option value="press">{strings.press}</option>
                    <option value="other">{strings.other}</option>
                </select>
            </div>

            {/* Dynamic Booking Fields */}
            {isBookingInquiry && (
                <div className="p-6 bg-bio-gray-900 border border-bio-gray-800 rounded-xl space-y-6 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-semibold text-bio-white flex items-center gap-2">
                        <Music className="w-5 h-5 text-bio-accent" />
                        {strings.bookingDetails}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="artistRequested" className="block text-sm font-medium text-bio-gray-300 mb-2">
                                {strings.artistRequested}
                            </label>
                            <input
                                type="text"
                                id="artistRequested"
                                name="artistRequested"
                                value={formData.artistRequested}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white placeholder-bio-gray-500 focus:border-bio-accent outline-none transition-colors"
                                placeholder={strings.artistPlaceholder}
                            />
                        </div>
                        <div>
                            <label htmlFor="eventDate" className="block text-sm font-medium text-bio-gray-300 mb-2">
                                {strings.eventDate}
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-bio-gray-500" />
                                <input
                                    type="text"
                                    id="eventDate"
                                    name="eventDate"
                                    value={formData.eventDate}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white placeholder-bio-gray-500 focus:border-bio-accent outline-none transition-colors"
                                    placeholder="e.g. Oct 31, 2026"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="eventVenue" className="block text-sm font-medium text-bio-gray-300 mb-2">
                                {strings.eventVenue}
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-bio-gray-500" />
                                <input
                                    type="text"
                                    id="eventVenue"
                                    name="eventVenue"
                                    value={formData.eventVenue}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white placeholder-bio-gray-500 focus:border-bio-accent outline-none transition-colors"
                                    placeholder="Club name or City"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="budgetRange" className="block text-sm font-medium text-bio-gray-300 mb-2">
                                {strings.budgetRange}
                            </label>
                            <select
                                id="budgetRange"
                                name="budgetRange"
                                value={formData.budgetRange}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white focus:border-bio-accent outline-none cursor-pointer"
                            >
                                <option value="">{strings.budgetSelect}</option>
                                <option value="<1k">&lt; €1.000</option>
                                <option value="1k-5k">€1.000 - €5.000</option>
                                <option value="5k-10k">€5.000 - €10.000</option>
                                <option value="10k+">€10.000+</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}


            {isFestivalSubmission && (
                <div className="p-6 bg-bio-gray-900 border border-bio-gray-800 rounded-xl space-y-6 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-semibold text-bio-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-bio-accent" />
                        {strings.festivalDetails}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="festivalName" className="block text-sm font-medium text-bio-gray-300 mb-2">
                                {strings.festivalName}
                            </label>
                            <input
                                type="text"
                                id="festivalName"
                                name="festivalName"
                                value={formData.festivalName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white placeholder-bio-gray-500 focus:border-bio-accent outline-none transition-colors"
                                placeholder="Name of the event"
                            />
                        </div>
                        <div>
                            <label htmlFor="festivalDate" className="block text-sm font-medium text-bio-gray-300 mb-2">
                                {strings.festivalDate}
                            </label>
                            <input
                                type="text"
                                id="festivalDate"
                                name="festivalDate"
                                value={formData.festivalDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white placeholder-bio-gray-500 focus:border-bio-accent outline-none transition-colors"
                                placeholder="e.g. July 24-26, 2026"
                            />
                        </div>
                        <div>
                            <label htmlFor="festivalLocation" className="block text-sm font-medium text-bio-gray-300 mb-2">
                                {strings.festivalLocation}
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-bio-gray-500" />
                                <input
                                    type="text"
                                    id="festivalLocation"
                                    name="festivalLocation"
                                    value={formData.festivalLocation}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white placeholder-bio-gray-500 focus:border-bio-accent outline-none transition-colors"
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="festivalGenre" className="block text-sm font-medium text-bio-gray-300 mb-2">
                                {strings.festivalGenre}
                            </label>
                            <div className="relative">
                                <Music className="absolute left-3 top-3.5 w-5 h-5 text-bio-gray-500" />
                                <input
                                    type="text"
                                    id="festivalGenre"
                                    name="festivalGenre"
                                    value={formData.festivalGenre}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white placeholder-bio-gray-500 focus:border-bio-accent outline-none transition-colors"
                                    placeholder="e.g. Techno, House"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="festivalWebsite" className="block text-sm font-medium text-bio-gray-300 mb-2">
                                {strings.festivalWebsite}
                            </label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3.5 w-5 h-5 text-bio-gray-500" />
                                <input
                                    type="url"
                                    id="festivalWebsite"
                                    name="festivalWebsite"
                                    value={formData.festivalWebsite}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white placeholder-bio-gray-500 focus:border-bio-accent outline-none transition-colors"
                                    placeholder="https://"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="festivalCapacity" className="block text-sm font-medium text-bio-gray-300 mb-2">
                                {strings.festivalCapacity}
                            </label>
                            <div className="relative">
                                <Users className="absolute left-3 top-3.5 w-5 h-5 text-bio-gray-500" />
                                <input
                                    type="text"
                                    id="festivalCapacity"
                                    name="festivalCapacity"
                                    value={formData.festivalCapacity}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white placeholder-bio-gray-500 focus:border-bio-accent outline-none transition-colors"
                                    placeholder="e.g. 5,000 - 10,000"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-bio-gray-300 mb-2">
                    {strings.message}
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required={!isFestivalSubmission} // Optional if just listing festival
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white placeholder-bio-gray-500 focus:border-bio-accent outline-none transition-colors resize-none"
                    placeholder={strings.yourMessage}
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
