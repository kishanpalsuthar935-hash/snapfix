import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Video, MapPin, Download, ExternalLink, Copy, Check, User, Share2 } from 'lucide-react';

export const BookingLinkTool: React.FC = () => {
  // Inputs load blank by default
  const [eventTitle, setEventTitle] = useState('');
  const [hostName, setHostName] = useState('');
  const [hostEmail, setHostEmail] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [locationType, setLocationType] = useState<'meet' | 'zoom' | 'phone' | 'inperson'>('meet');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [copied, setCopied] = useState(false);
  const [icsDownloaded, setIcsDownloaded] = useState(false);

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = () => {
    if (!eventTitle || !date || !time) return '#';
    const startIso = `${date.replace(/-/g, '')}T${time.replace(/:/g, '')}00`;
    // Add duration in minutes
    const [h, m] = time.split(':').map(Number);
    const endMinutes = h * 60 + m + duration;
    const endH = String(Math.floor(endMinutes / 60) % 24).padStart(2, '0');
    const endM = String(endMinutes % 60).padStart(2, '0');
    const endIso = `${date.replace(/-/g, '')}T${endH}${endM}00`;

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: eventTitle,
      details: `${description}\n\nHost: ${hostName} (${hostEmail})\nPowered by Vunix Booking`,
      location: locationType === 'meet' ? 'Google Meet' : locationType === 'zoom' ? 'Zoom' : 'Phone Call',
      dates: `${startIso}/${endIso}`,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Generate .ics file for Apple Calendar / Outlook
  const downloadIcs = () => {
    if (!eventTitle || !date || !time) return;
    const startIso = `${date.replace(/-/g, '')}T${time.replace(/:/g, '')}00`;
    const [h, m] = time.split(':').map(Number);
    const endMinutes = h * 60 + m + duration;
    const endH = String(Math.floor(endMinutes / 60) % 24).padStart(2, '0');
    const endM = String(endMinutes % 60).padStart(2, '0');
    const endIso = `${date.replace(/-/g, '')}T${endH}${endM}00`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Vunix//Booking Suite//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@vunix.app`,
      `DTSTAMP:${startIso}Z`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      `SUMMARY:${eventTitle}`,
      `DESCRIPTION:${description} - Host: ${hostName}`,
      `LOCATION:${locationType.toUpperCase()}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${eventTitle.toLowerCase().replace(/\s+/g, '-')}.ics`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    setIcsDownloaded(true);
    setTimeout(() => setIcsDownloaded(false), 2000);
  };

  const bookingSlug = eventTitle.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const shareableUrl = `https://vunix.meet/${bookingSlug || 'session'}`;

  const copyBookingLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Configuration Form */}
      <div className="lg:col-span-7 space-y-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Meeting & Session Details
          </h3>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Meeting / Event Title</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="e.g. 1-on-1 Growth Consultation"
              className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 text-sm focus:ring-2 focus:ring-[#451A03] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Host Name</label>
              <input
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Host Email</label>
              <input
                type="email"
                value={hostEmail}
                onChange={(e) => setHostEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Session Duration</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      duration === mins ? 'bg-[#451A03] text-white' : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Meeting Platform</label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-[#451A03]"
              >
                <option value="meet">Google Meet (Auto Link)</option>
                <option value="zoom">Zoom Video</option>
                <option value="phone">Direct Phone Call</option>
                <option value="inperson">In-Person Meeting</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Default Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Start Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Agenda / Instructions</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What would you like to accomplish during our session?"
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Shareable Booking Card Preview */}
      <div className="lg:col-span-5 space-y-4">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#EDE9FE] border border-[#DDD6FE] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#451A03]">
              Client Booking Invitation
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#451A03] text-white">
              {duration} Minutes
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EDE9FE] flex items-center justify-center font-bold text-[#451A03]">
                {hostName ? hostName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs text-neutral-500">{hostName || 'Host Name'}</p>
                <h4 className="text-sm font-bold text-neutral-900">{eventTitle || 'Event Title'}</h4>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#451A03]" /> {duration} min consultation
              </p>
              <p className="flex items-center gap-2">
                <Video className="w-3.5 h-3.5 text-[#451A03]" />
                {locationType === 'meet' ? 'Google Meet Video' : locationType === 'zoom' ? 'Zoom Call' : 'Phone'}
              </p>
              {date && (
                <p className="flex items-center gap-2 font-semibold text-neutral-900">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#451A03]" /> {date} at {time || 'TBD'}
                </p>
              )}
            </div>

            {description && (
              <p className="text-xs text-neutral-500 pt-2 border-t border-neutral-100 italic">
                &ldquo;{description}&rdquo;
              </p>
            )}
          </div>

          {/* Action links */}
          <div className="space-y-2">
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-3 px-4 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition flex items-center justify-center gap-2 shadow-sm ${
                !eventTitle || !date || !time ? 'opacity-40 pointer-events-none' : ''
              }`}
            >
              <ExternalLink className="w-4 h-4" /> Add to Google Calendar
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={downloadIcs}
                disabled={!eventTitle || !date || !time}
                className="py-2.5 px-3 rounded-full bg-white text-neutral-800 border border-neutral-300 text-xs font-semibold hover:bg-neutral-50 disabled:opacity-40 transition flex items-center justify-center gap-1.5"
              >
                {icsDownloaded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5" />}
                {icsDownloaded ? 'Downloaded' : 'Apple / Outlook (.ics)'}
              </button>
              <button
                onClick={copyBookingLink}
                className="py-2.5 px-3 rounded-full bg-white text-neutral-800 border border-neutral-300 text-xs font-semibold hover:bg-neutral-50 transition flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Booking Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
