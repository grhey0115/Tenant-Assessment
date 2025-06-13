"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { DynamicSection } from "./DynamicSection";
import { sectionsConfig } from "./sectionsConfig";
import { VoiceNote } from "./VoiceNote";
import { ReviewSection } from "./ReviewSection";
import { RecommendationSection } from "./RecommendationSection";
import { NotificationModal } from "./NotificationModal";

export default function PublicFormPage() {
  // State for basic info
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [property, setProperty] = useState("");
  const [unit, setUnit] = useState("");
  const [agent, setAgent] = useState("");
  const [prospectName, setProspectName] = useState("");
  const [prospectPhone, setProspectPhone] = useState("");
  const [prospectEmail, setProspectEmail] = useState("");

  // Dropdown data
  const [properties, setProperties] = useState<{ id: string; property_name: string }[]>([]);
  const [units, setUnits] = useState<{ id: string; unit_number: string }[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);

  // Dynamic section state
  const [sectionValues, setSectionValues] = useState<Record<string, any>>({});
  const [voiceNoteBlob, setVoiceNoteBlob] = useState<Blob | null>(null);

  // Review state
  const [showReview, setShowReview] = useState(false);
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Recommendation state
  const [recommendation, setRecommendation] = useState("");

  // Notification Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"info" | "success" | "error">("info");

  // Find property/unit names for review
  const propertyName = properties.find(p => p.id === property)?.property_name;
  const unitNumber = units.find(u => u.id === unit)?.unit_number;

  // Set default date/time on mount
  useEffect(() => {
    const now = new Date();
    setDate(now.toISOString().split("T")[0]);
    setTime(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`);
  }, []);

  // Fetch properties on mount
  useEffect(() => {
    setLoadingProperties(true);
    supabase
      .from("properties")
      .select("id, property_name")
      .order("property_name")
      .then(({ data, error }) => {
        if (!error && data) setProperties(data);
        setLoadingProperties(false);
      });
  }, []);

  // Fetch units when property changes
  useEffect(() => {
    if (!property) { setUnits([]); return; }
    setLoadingUnits(true);
    supabase
      .from("units")
      .select("id, unit_number")
      .eq("property_id", property)
      .eq("status", "available")
      .order("unit_number")
      .then(({ data, error }) => {
        if (!error && data) setUnits(data);
        setLoadingUnits(false);
      });
  }, [property]);

  // Handler for dynamic section changes
  const handleSectionChange = (name: string, value: any) => {
    setSectionValues(prev => ({ ...prev, [name]: value }));
  };

  // Handle submit (shows review)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowReview(true);
  };

  // Handle edit from review
  const handleEdit = () => setShowReview(false);

  // Helper to show modal
  const showNotificationModal = (title: string, message: string, type: "info" | "success" | "error" = "info") => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  // Handle actual submission to Supabase
  const handleConfirmSubmit = async () => {
    setSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);
    let uploadedVoiceUrl = null;
    try {
      // 1. Upload voice note if present
      if (voiceNoteBlob) {
        showNotificationModal("Uploading...", "Voice note is being uploaded.", "info");
        const fileName = `voice-notes/${Date.now()}-${Math.random().toString(36).slice(2)}.webm`;
        const { data, error } = await supabase.storage.from("tenant-notes").upload(fileName, voiceNoteBlob, {
          cacheControl: "3600",
          upsert: false,
        });
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("tenant-notes").getPublicUrl(fileName);
        uploadedVoiceUrl = urlData.publicUrl;
        setVoiceNoteUrl(uploadedVoiceUrl);
        showNotificationModal("Upload Complete", "Voice note uploaded!", "success");
      }
      // 2. Insert form data into tenant_assessments
      const { error: insertError } = await supabase.from("tenant_assessments").insert({
        date,
        time,
        property_id: property,
        unit_id: unit,
        agent,
        prospect_name: prospectName,
        prospect_phone: prospectPhone,
        prospect_email: prospectEmail,
        ...sectionValues,
        voice_note_url: uploadedVoiceUrl,
        recommendation,
        created_at: new Date().toISOString(),
      });
      if (insertError) throw insertError;
      setSubmitSuccess("Assessment submitted successfully!");
      showNotificationModal("Assessment Submitted", "Your assessment has been successfully submitted!", "success");

      // Reset form
      setDate("");
      setTime("");
      setProperty("");
      setUnit("");
      setAgent("");
      setProspectName("");
      setProspectPhone("");
      setProspectEmail("");
      setSectionValues({});
      setVoiceNoteBlob(null);
      setVoiceNoteUrl(null);
      setShowReview(false);
      setRecommendation("");
    } catch (err: any) {
      setSubmitError(err.message || "Submission failed");
      showNotificationModal("Submission Error", `Could not submit: ${err.message}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 antialiased py-8">
      <div className="container mx-auto max-w-4xl p-4 md:p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
        <header className="mb-8 p-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-xl shadow-lg transform -translate-y-4">
            <h1 className="text-4xl font-extrabold text-center tracking-tight">Tenant Assessment</h1>
            <p className="text-center text-blue-200 mt-2 text-lg">Hartford Market - Quick Assessment Guide</p>
        </header>

        {submitSuccess && <div className="bg-green-100 text-green-800 p-4 rounded mb-4 border border-green-200">{submitSuccess}</div>}
        {submitError && <div className="bg-red-100 text-red-800 p-4 rounded mb-4 border border-red-200">{submitError}</div>}

        {!showReview && (
          <form className="space-y-10">
            <section className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-700 mb-6 border-b pb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.02M10.5 19.5h3m-6.75-9.75h9.75M18 5.25H6a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 006 19.5h12a2.25 2.25 0 002.25-2.25V7.5A2.25 2.25 0 0018 5.25z" /></svg>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1 required-ast">Date</label>
                  <input type="date" id="date" name="date" required className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900 bg-slate-50" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-slate-700 mb-1 required-ast">Time</label>
                  <input type="time" id="time" name="time" required className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900 bg-slate-50" value={time} onChange={e => setTime(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="property" className="block text-sm font-medium text-slate-700 mb-1 required-ast">Property</label>
                  <select id="property" name="property" required className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900 bg-slate-50" value={property} onChange={e => setProperty(e.target.value)}>
                    <option value="">{loadingProperties ? "Loading..." : "Select Property"}</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>{p.property_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-slate-700 mb-1 required-ast">Unit</label>
                  <select id="unit" name="unit" required className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900 bg-slate-50" value={unit} onChange={e => setUnit(e.target.value)} disabled={!property}>
                    <option value="">{loadingUnits ? "Loading..." : "Select Unit"}</option>
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>{u.unit_number}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="agent" className="block text-sm font-medium text-slate-700 mb-1 required-ast">Agent Name</label>
                  <input type="text" id="agent" name="agent" placeholder="Your Name" required className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900 bg-slate-50" value={agent} onChange={e => setAgent(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="prospectName" className="block text-sm font-medium text-slate-700 mb-1 required-ast">Prospect Name</label>
                  <input type="text" id="prospectName" name="prospectName" placeholder="Prospect's Full Name" required className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900 bg-slate-50" value={prospectName} onChange={e => setProspectName(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="prospectPhone" className="block text-sm font-medium text-slate-700 mb-1 required-ast">Phone Number</label>
                  <input type="tel" id="prospectPhone" name="prospectPhone" placeholder="(555) 123-4567" required className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900 bg-slate-50" value={prospectPhone} onChange={e => setProspectPhone(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="prospectEmail" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input type="email" id="prospectEmail" name="prospectEmail" placeholder="email@example.com" className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900 bg-slate-50" value={prospectEmail} onChange={e => setProspectEmail(e.target.value)} />
                </div>
              </div>
            </section>
            {/* Dynamic Sections */}
            {sectionsConfig.map(section => (
              <DynamicSection
                key={section.id}
                config={section}
                values={sectionValues}
                onChange={handleSectionChange}
              />
            ))}
            <VoiceNote onAudioReady={setVoiceNoteBlob} />

            {/* Recommendation Section */}
            <RecommendationSection value={recommendation} onChange={setRecommendation} />

            <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3">
              <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-sm font-medium rounded-lg shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150" onClick={handleSubmit}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                Review
              </button>
              {/* Save Draft Button - Placeholder for now, can be implemented with Supabase Draft functionality */}
              {/* <button type="button" id="saveDraftBtn" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                Save Draft
              </button> */}
              <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Submit Assessment
              </button>
            </div>
          </form>
        )}

        {showReview && (
          <ReviewSection
            basicInfo={{
              date,
              time,
              property,
              unit,
              agent,
              prospectName,
              prospectPhone,
              prospectEmail,
              propertyName,
              unitNumber,
            }}
            sectionValues={sectionValues}
            voiceNoteUrl={voiceNoteUrl}
            onEdit={handleEdit}
            onConfirm={handleConfirmSubmit}
            submitting={submitting}
            recommendation={recommendation}
          />
        )}

        <NotificationModal
          title={modalTitle}
          message={modalMessage}
          type={modalType}
          onClose={() => setModalVisible(false)}
          isVisible={modalVisible}
        />
      </div>
    </div>
  );
}
