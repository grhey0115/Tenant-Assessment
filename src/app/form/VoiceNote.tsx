import { useRef, useState } from "react";

export interface VoiceNoteProps {
  onAudioReady?: (audioBlob: Blob) => void;
}

export function VoiceNote({ onAudioReady }: VoiceNoteProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Media Devices API not supported.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        if (onAudioReady) onAudioReady(blob);
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      setError("Could not start recording: " + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-md border border-slate-100 mt-8">
      <h2 className="text-2xl font-bold text-slate-700 mb-6 border-b pb-3 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 1.5a6 6 0 01-6-6V6.75m6 7.5v3m-3.75-3.75h7.5M12 10.5a3 3 0 11-6 0v-1.5a3 3 0 116 0v1.5a3 3 0 01-3 3z" /></svg>
        Voice Note <span className="text-slate-500 font-normal">(Optional)</span>
      </h2>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-sm text-green-700 mb-4">Record a quick voice note related to this assessment:</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {!isRecording && (
            <button type="button" onClick={startRecording} className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75V21M7.5 14.25H16.5M12 6A3 3 0 009 9v6a3 3 0 006 0V9a3 3 0 00-3-3z" /></svg>
              Start Recording
            </button>
          )}
          {isRecording && (
            <button type="button" onClick={stopRecording} className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75V21M7.5 14.25H16.5M12 6A3 3 0 009 9v6a3 3 0 006 0V9a3 3 0 00-3-3z" /></svg>
              Stop Recording
            </button>
          )}
        </div>
        {isRecording && <p className="text-sm text-red-600 font-semibold mt-3 animate-pulse">🔴 Recording...</p>}
        {audioUrl && !isRecording && (
          <div className="mt-4 p-3 bg-slate-100 rounded-lg border border-slate-200">
            <audio controls src={audioUrl} className="w-full" />
          </div>
        )}
        {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
      </div>
    </section>
  );
}
