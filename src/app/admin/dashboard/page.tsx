"use client";

import React, { useState, useEffect, useMemo, ReactElement, useCallback} from 'react';
import { supabase } from '@/utils/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
    Search as SearchIcon,
    ChevronDown as ChevronDownIcon,
    User as UserIcon,
    FileText as FileTextIcon,
    Mail as MailIcon,
    CheckCircle as CheckCircleIcon,
    XCircle as XCircleIcon,
    AlertTriangle as AlertTriangleIcon,
    ThumbsUp as ThumbsUpIcon,
    ThumbsDown as ThumbsDownIcon,
    CircleHelp as CircleHelpIcon,
    LogOut as LogOutIcon,
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ApplicationsReviewDashboard from '../tenant-evaluations/page'; // Adjust path as needed

// --- TypeScript Interfaces ---
interface Prospect {
    name: string | null;
    phone: string | null;
    email: string | null;
}

interface Property {
    id: string;
    property_id: string;
    property_name: string | null;
}

interface Unit {
    id: string;
    unit_name: string | null;
}

interface ApplicationData {
    id: string;
    showing_date: string;
    showing_time: string | null;
    recommendation: 'approve' | 'maybe' | 'hell-no' | null;
    agent_name: string | null;
    positive_observations: string[] | null;
    concerning_signs: string[] | null;
    red_flags: string[] | null;
    assessment_scores: number[] | null;
    additional_notes: string | null;
    maintenance_issues: string | null;
    created_at: string;
    voice_note_url: string | null;
    housing_notes: string | null;
    kids_pets_notes: string | null;
    employment_details: string | null;
    local_connections_notes: string | null;
    prospect: Prospect | null;
    property: Property | null;
    unit: Unit | null;
}

interface FilterState {
    recommendation: string;
    propertyId: string;
    agentName: string;
    search: string;
}

interface Applicant {
    id: number;
    name: string;
    phone: string;
    email: string;
    interestedProperty: string;
    unitType: string;
    budgetRange: string;
    stage: string;
    lastContact: string;
    agent: string;
    priority: string;
    source: string;
    moveInDate: string;
    nextAction: string;
    daysInStage: number;
    notes: string;
    communicationPreference: string;
    lastResponse: string;
    showingScheduled: string | null;
    applicationComplete: boolean;
}

interface Note {
    id: number;
    content: string;
    applicant_id: number;
    agent_name: string;
    created_at: string;
}

// --- Icon Components ---
const Icon = ({ name, className = "h-6 w-6" }: { name: string, className?: string }): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
        activity: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
        userPlus: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="17" y1="11" x2="23" y2="11"></line></svg>,
        building: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><line x1="8" y1="20" x2="8" y2="4"></line><line x1="16" y1="20" x2="16" y2="4"></line><line x1="12" y1="20" x2="12" y2="4"></line></svg>,
        calendar: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
        fileText: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
        settings: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-4.44a2 2 0 0 0-2 2v.77a2 2 0 0 1-1.42 1.9l-2.02.81a2 2 0 0 0-1.2 2.61l1.18 3.65a2 2 0 0 1 .1 1.71l-.63 2.54a2 2 0 0 0 .9 2.4l3.05 1.78a2 2 0 0 1 1.42 0l3.05-1.78a2 2 0 0 0 .9-2.4l-.63-2.54a2 2 0 0 1 .1-1.71l1.18-3.65a2 2 0 0 0-1.2-2.61l-2.02-.81A2 2 0 0 1 14.22 4.77V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
        plus: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
        search: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
        eye: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
        messageSquare: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
        phone: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
        clipboardCheck: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="m9 14 2 2 4-4"></path></svg>,
        user: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
        clock: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
        bell: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
        target: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
        flame: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>,
        thermometer: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>,
        snowflake: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path></svg>,
        arrowRight: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>,
        externalLink: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>,
        checkCircle: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
        x: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
        mail: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
        tenantEvaluations: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><path d="M6 21v-2a4 4 0 0 1 4-4h4"></path></svg>,
    };
    return icons[name] || null;
};

// --- Initial Data ---
const initialApplicants: Applicant[] = [
   
];

// --- Main Application Component ---
const App = () => {
    const [activeModule, setActiveModule] = useState<string>('pipeline');
    const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
    const [selectedStage, setSelectedStage] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const router = useRouter();
    const [loadingApplicants, setLoadingApplicants] = useState(false);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

    const stages = [
        { id: 'lead', name: 'New Leads', color: 'bg-blue-500', icon: 'userPlus' },
        { id: 'contacted', name: 'Contacted', color: 'bg-yellow-500', icon: 'phone' },
        { id: 'showing', name: 'Showing', color: 'bg-purple-500', icon: 'eye' },
        { id: 'application', name: 'Applied', color: 'bg-green-500', icon: 'clipboardCheck' },
        { id: 'approved', name: 'Approved', color: 'bg-emerald-600', icon: 'checkCircle' }
    ];

    const modules = [
        { id: 'pipeline', name: 'Pipeline', icon: 'activity' },
        { id: 'properties', name: 'Available Units', icon: 'building' },
        { id: 'showings', name: 'Showings', icon: 'calendar' },
        { id: 'applications', name: 'Applications', icon: 'clipboardCheck' },
        { id: 'tenantEvaluations', name: 'Tenant Evaluations', icon: 'tenantEvaluations' },
        { id: 'messages', name: 'Messages', icon: 'messageSquare' },
        { id: 'reports', name: 'Reports', icon: 'target' },
        { id: 'settings', name: 'Settings', icon: 'settings' }
    ];

    useEffect(() => {
        setLoadingApplicants(true);
        const fetchApplicants = async () => {
            const { data, error } = await supabase
                .from('applicants')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Error fetching applicants:', error);
            } else {
                setApplicants(data || initialApplicants);
            }
            setLoadingApplicants(false);
        };
        fetchApplicants();
    }, []);

    useEffect(() => {
        if (!selectedApplicant) return;
        setLoadingNotes(true);
        const fetchNotes = async () => {
            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .eq('applicant_id', selectedApplicant.id)
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Error fetching notes:', error);
                setNotes([]);
            } else {
                setNotes(data || []);
            }
            setLoadingNotes(false);
        };
        fetchNotes();
    }, [selectedApplicant]);

    const handleAddApplicant = async (newApplicantData: any) => {
        const newApplicant = {
            ...newApplicantData,
            stage: 'lead',
            daysInStage: 0,
            lastContact: new Date().toISOString().split('T')[0],
            lastResponse: 'N/A',
            showingScheduled: null,
            applicationComplete: false,
            source: newApplicantData.source || 'Manual',
            nextAction: newApplicantData.nextAction || 'Initial contact',
            communicationPreference: newApplicantData.communicationPreference || 'email',
            notes: newApplicantData.notes || '',
            unitType: newApplicantData.unitType || 'N/A'
        };

        const { data, error } = await supabase
            .from('applicants')
            .insert([newApplicant])
            .select();
        if (error) {
            console.error('Error adding applicant:', error);
        } else if (data && data[0]) {
            setApplicants([data[0], ...applicants]);
            setIsAddModalOpen(false);
        }
    };

    const showToast = (message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => setToast({ message: '', visible: false }), 2500);
    };

    const handleMoveApplicant = async (applicantId: number, currentStage: string) => {
        const currentStageIndex = stages.findIndex(s => s.id === currentStage);
        if (currentStageIndex < stages.length - 1) {
            const nextStage = stages[currentStageIndex + 1].id;
            const { error } = await supabase
                .from('applicants')
                .update({ stage: nextStage, daysInStage: 0 })
                .eq('id', applicantId);
            if (error) {
                console.error('Error updating stage:', error);
                showToast('Failed to move applicant. Please try again.');
            } else {
                setApplicants(applicants.map(app =>
                    app.id === applicantId ? { ...app, stage: nextStage, daysInStage: 0 } : app
                ));
                const stageName = stages.find(s => s.id === nextStage)?.name || nextStage;
                showToast(`Moved to ${stageName} successfully!`);
            }
        }
    };

    const handleAddNote = async () => {
        if (!selectedApplicant || !newNote.trim()) return;
        const { data, error } = await supabase
            .from('notes')
            .insert([{
                content: newNote,
                applicant_id: selectedApplicant.id,
                agent_name: 'System', // Replace with actual agent name from auth context if available
                created_at: new Date().toISOString()
            }])
            .select();
        if (error) {
            console.error('Error adding note:', error);
        } else if (data && data[0]) {
            setNotes([data[0], ...notes]);
            setNewNote('');
        }
    };

    const handleCardClick = useCallback((applicant: Applicant) => {
        setSelectedApplicant(applicant);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedApplicant(null);
        setNewNote('');
        setNotes([]);
    }, []);

    const closeAddModal = useCallback(() => {
        setIsAddModalOpen(false);
    }, []);

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'hot': return <Icon name="flame" className="h-4 w-4 text-red-500" />;
            case 'warm': return <Icon name="thermometer" className="h-4 w-4 text-yellow-500" />;
            case 'cold': return <Icon name="snowflake" className="h-4 w-4 text-blue-400" />;
            default: return null;
        }
    };

    const getUrgencyColor = (daysInStage: number, stage: string) => {
        if (stage === 'lead' && daysInStage > 1) return 'text-red-600';
        if (stage === 'contacted' && daysInStage > 3) return 'text-red-600';
        if (stage === 'showing' && daysInStage > 7) return 'text-red-600';
        if (daysInStage > 2) return 'text-orange-600';
        return 'text-gray-600';
    };

    const getStageColorClass = (stageId: string) => stages.find(s => s.id === stageId)?.color || 'bg-gray-400';
    const getStageBorderColor = (stageId: string) => (getStageColorClass(stageId) || 'bg-gray-400').replace('bg-', '#');

    const PipelineView = () => {
        if (loadingApplicants) {
            return (
                <div className="flex justify-center items-center py-20">
                    <svg className="animate-spin h-8 w-8 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <span className="text-gray-600 text-lg">Loading applicants...</span>
                </div>
            );
        }
        const filteredApplicants = selectedStage === 'all'
            ? applicants
            : applicants.filter(app => app.stage === selectedStage);

        const stageCounts = stages.reduce((acc: Record<string, number>, stage) => {
            acc[stage.id] = applicants.filter(app => app.stage === stage.id).length;
            return acc;
        }, {} as Record<string, number>);

        return (
            <div className="space-y-6">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Applicant Pipeline</h3>
                    <div className="flex items-center justify-between">
                        {stages.map((stage, index) => {
                            const isSelected = selectedStage === stage.id;
                            return (
                                <React.Fragment key={stage.id}>
                                    <div
                                        className={`text-center cursor-pointer p-2 rounded-lg transition-all ${isSelected ? 'bg-blue-100' : ''}`}
                                        onClick={() => setSelectedStage(isSelected ? 'all' : stage.id)}
                                    >
                                        <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center text-white ${getStageColorClass(stage.id)}`}>
                                            <Icon name={stage.icon as string} className="h-6 w-6" />
                                        </div>
                                        <div className="mt-2 text-sm font-semibold">{stage.name}</div>
                                        <div className="text-2xl font-bold text-gray-800">{stageCounts[stage.id] || 0}</div>
                                    </div>
                                    {index < stages.length - 1 && (
                                        <Icon name="arrowRight" className="h-6 w-6 text-gray-300 mx-1 flex-shrink-0" />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <Icon name="search" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search applicants..."
                                className="pl-10 pr-4 py-2 border rounded-lg w-64 bg-white"
                            />
                        </div>
                        <select className="px-3 py-2 border rounded-lg bg-white">
                            <option>All Agents</option>
                        </select>
                        <select className="px-3 py-2 border rounded-lg bg-white">
                            <option>All Properties</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Icon name="plus" className="h-4 w-4" />
                        <span>Add Applicant</span>
                    </button>
                </div>

                <div className="space-y-3">
                    {filteredApplicants.length > 0 ? filteredApplicants.map(applicant => (
                        <ApplicantCard
                            key={applicant.id}
                            applicant={applicant}
                            onMove={handleMoveApplicant}
                        />
                    )) : <p className="text-center text-gray-500 py-8">No applicants in this stage.</p>}
                </div>
            </div>
        );
    };

    const ApplicantCard = ({ applicant, onMove }: { applicant: Applicant & { id: number }, onMove: (id: number, stage: string) => void }) => {
        const handleMove = (e: React.MouseEvent) => {
            e.stopPropagation();
            onMove(applicant.id, applicant.stage);
        };

        return (
            <div
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 cursor-pointer"
                style={{ borderColor: getStageBorderColor(applicant.stage) }}
                onClick={() => handleCardClick(applicant)}
            >
                <div className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-lg">{applicant.name}</h3>
                                {getPriorityIcon(applicant.priority)}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStageColorClass(applicant.stage)}`}>
                                    {stages.find(s => s.id === applicant.stage)?.name}
                                </span>
                                <span className={`text-xs ${getUrgencyColor(applicant.daysInStage, applicant.stage)}`}>
                                    {applicant.daysInStage} days in stage
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-3 text-sm">
                                <div><strong className="font-medium text-gray-600">Property:</strong> {applicant.interestedProperty} ({applicant.unitType})</div>
                                <div><strong className="font-medium text-gray-600">Budget:</strong> {applicant.budgetRange}</div>
                                <div><strong className="font-medium text-gray-600">Move-in:</strong> {applicant.moveInDate}</div>
                                <div><strong className="font-medium text-gray-600">Agent:</strong> {applicant.agent}</div>
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center space-x-1.5">
                                    <Icon name="clock" className="h-4 w-4" />
                                    <span>Last response: {applicant.lastResponse}</span>
                                </div>
                                {applicant.showingScheduled && (
                                    <div className="flex items-center space-x-1.5 text-green-600">
                                        <Icon name="calendar" className="h-4 w-4" />
                                        <span>Showing: {applicant.showingScheduled}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2 ml-4">
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-700">Next Action</div>
                                <div className="text-sm text-blue-600 font-semibold">{applicant.nextAction}</div>
                            </div>
                            <div className="flex items-center space-x-1 pt-2">
                                <button
                                    className="p-2 text-gray-400 cursor-not-allowed relative group"
                                    title="Comms Disabled"
                                    disabled
                                >
                                    <Icon name="phone" className="h-4 w-4" />
                                    <span className="absolute bottom-full mb-2 hidden group-hover:block w-max bg-gray-700 text-white text-xs rounded py-1 px-2">
                                        Future
                                    </span>
                                </button>
                                <button
                                    className="p-2 text-gray-400 cursor-not-allowed relative group"
                                    title="Comms Disabled"
                                    disabled
                                >
                                    <Icon name="mail" className="h-4 w-4" />
                                    <span className="absolute bottom-full mb-2 hidden group-hover:block w-max bg-gray-700 text-white text-xs rounded py-1 px-2">
                                        Future
                                    </span>
                                </button>
                                <button
                                    className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full"
                                    title="View Details"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCardClick(applicant);
                                    }}
                                >
                                    <Icon name="externalLink" className="h-4 w-4" />
                                </button>
                            </div>
                            {applicant.stage !== 'approved' && (
                                <button
                                    onClick={handleMove}
                                    className="w-full px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Move to {stages[stages.findIndex(s => s.id === applicant.stage) + 1]?.name}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const Modal = ({ children, isOpen, onClose }: { children: React.ReactNode, isOpen: boolean, onClose: () => void }) => {
        useEffect(() => {
            const handleEscape = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    onClose();
                }
            };
            if (isOpen) {
                document.addEventListener('keydown', handleEscape);
            }
            return () => {
                document.removeEventListener('keydown', handleEscape);
            };
        }, [isOpen, onClose]);

        if (!isOpen) return null;

        return (
            <div
            className="fixed inset-0 bg-gray bg-opacity-20 backdrop-blur-sm z-50 flex justify-center items-center px-4 sm:px-6"
                onClick={onClose}
                role="dialog"
                aria-modal="true"
            >
                <div
                    className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative"
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        aria-label="Close modal"
                    >
                        <Icon name="x" className="h-6 w-6" />
                    </button>
                    {children}
                </div>
            </div>
        );
    };

    const ApplicantDetailModal = ({ applicant, isOpen, onClose }: { applicant: Applicant | null, isOpen: boolean, onClose: () => void }) => {
        const [tab, setTab] = useState<'details' | 'notes'>('details');
        if (!isOpen || !applicant) return null;
        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{applicant.name}</h2>
                        <p className="text-sm text-gray-500">Applicant Details and Notes</p>
                    </div>
                    <div className="flex space-x-2 border-b border-gray-200">
                        <button
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === 'details' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'text-gray-600 hover:bg-gray-100'}`}
                            onClick={() => setTab('details')}
                        >
                            Details
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === 'notes' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'text-gray-600 hover:bg-gray-100'}`}
                            onClick={() => setTab('notes')}
                        >
                            Notes
                        </button>
                    </div>
                    {tab === 'details' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div><strong className="text-gray-600">Name:</strong> {applicant.name}</div>
                                <div><strong className="text-gray-600">Email:</strong> {applicant.email}</div>
                                <div><strong className="text-gray-600">Phone:</strong> {applicant.phone}</div>
                                <div><strong className="text-gray-600">Property:</strong> {applicant.interestedProperty} ({applicant.unitType})</div>
                            </div>
                            <div className="space-y-2">
                                <div><strong className="text-gray-600">Budget:</strong> {applicant.budgetRange}</div>
                                <div><strong className="text-gray-600">Move-in Date:</strong> {applicant.moveInDate}</div>
                                <div><strong className="text-gray-600">Agent:</strong> {applicant.agent}</div>
                                <div><strong className="text-gray-600">Priority:</strong> {applicant.priority}</div>
                                <div><strong className="text-gray-600">Stage:</strong> {stages.find(s => s.id === applicant.stage)?.name}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex flex-col space-y-2">
                                <textarea
                                    value={newNote}
                                    onChange={e => setNewNote(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                                    placeholder="Add a note..."
                                    rows={4}
                                    aria-label="Add a note"
                                />
                                <button
                                    onClick={handleAddNote}
                                    className="self-end px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                                    disabled={!newNote.trim()}
                                >
                                    Add Note
                                </button>
                            </div>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {loadingNotes ? (
                                    <div className="flex justify-center items-center py-8">
                                        <svg className="animate-spin h-6 w-6 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                        </svg>
                                        <span className="text-gray-600">Loading notes...</span>
                                    </div>
                                ) : notes.length === 0 ? (
                                    <p className="text-gray-400 italic text-center">No notes yet.</p>
                                ) : (
                                    notes.map(note => (
                                        <div
                                            key={note.id}
                                            className="p-3 border rounded-lg bg-gray-50"
                                        >
                                            <p className="text-sm text-gray-700">{note.content}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                By {note.agent_name} on {new Date(note.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        );
    };

    const AddApplicantModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void }) => {
        const [formState, setFormState] = useState({
          name: '',
          email: '',
          phone: '',
          interestedProperty: '',
          budgetRange: '',
          moveInDate: '',
          agent: '',
          priority: 'warm',
          unitType: '',
          source: '',
          nextAction: '',
          communicationPreference: '',
          notes: ''
        });
        const [errors, setErrors] = useState<{ [key: string]: string }>({});
        const [properties, setProperties] = useState<{ id: string; property_name: string; property_id: string }[]>([]);
        const [units, setUnits] = useState<{ id: string; unit_name: string }[]>([]);
        const [loadingProperties, setLoadingProperties] = useState(false);
        const [loadingUnits, setLoadingUnits] = useState(false);
      
        // Fetch properties on mount
        useEffect(() => {
          const fetchProperties = async () => {
            setLoadingProperties(true);
            const { data, error } = await supabase
              .from('properties')
              .select('id, property_name, property_id')
              .order('property_name');
            if (error) {
              console.error('Error fetching properties:', error);
            } else if (data) {
              setProperties(data);
            }
            setLoadingProperties(false);
          };
          fetchProperties();
        }, []);
      
        // Fetch units when interestedProperty changes
        useEffect(() => {
          if (!formState.interestedProperty) {
            setUnits([]);
            setFormState(prev => ({ ...prev, unitType: '' }));
            return;
          }
          const fetchUnits = async () => {
            setLoadingUnits(true);
            const { data, error } = await supabase
              .from('units')
              .select('id, unit_name')
              .eq('property_id', formState.interestedProperty)
              .eq('status', 'Available')
              .order('unit_name');
            if (error) {
              console.error('Error fetching units:', error);
            } else if (data) {
              setUnits(data);
            }
            setLoadingUnits(false);
          };
          fetchUnits();
        }, [formState.interestedProperty]);
      
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
          const { name, value } = e.target;
          setFormState(prev => ({ ...prev, [name]: value }));
          if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
          }
          // Reset unitType when property changes
          if (name === 'interestedProperty') {
            setFormState(prev => ({ ...prev, unitType: '' }));
          }
        };
      
        const validateForm = () => {
          const newErrors: { [key: string]: string } = {};
          if (!formState.name.trim()) newErrors.name = 'Name is required';
          if (formState.email && !/\S+@\S+\.\S+/.test(formState.email)) newErrors.email = 'Invalid email format';
          if (formState.phone && !/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(formState.phone)) newErrors.phone = 'Invalid phone format';
          if (!formState.interestedProperty) newErrors.interestedProperty = 'Property is required';
          if (!formState.unitType) newErrors.unitType = 'Unit is required';
          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
        };
      
        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (validateForm()) {
            // Map property_id and unit_id to their names for submission
            const selectedProperty = properties.find(p => p.property_id === formState.interestedProperty);
            const selectedUnit = units.find(u => u.id === formState.unitType);
            onSave({
              ...formState,
              interestedProperty: selectedProperty?.property_name || formState.interestedProperty,
              unitType: selectedUnit?.unit_name || formState.unitType
            });
          }
        };
      
        return (
          <Modal isOpen={isOpen} onClose={onClose}>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add New Applicant</h2>
                <p className="text-sm text-gray-500">Fill in the details to add a new applicant to the pipeline.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                      required
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && <p id="name-error" className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && <p id="email-error" className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                    {errors.phone && <p id="phone-error" className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interested Property <span className="text-red-500">*</span></label>
                    <select
                      name="interestedProperty"
                      value={formState.interestedProperty}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.interestedProperty ? 'border-red-500' : ''}`}
                      required
                      aria-invalid={!!errors.interestedProperty}
                      aria-describedby={errors.interestedProperty ? 'interestedProperty-error' : undefined}
                    >
                      <option value="">{loadingProperties ? 'Loading...' : 'Select Property'}</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.property_id}>{p.property_name}</option>
                      ))}
                    </select>
                    {errors.interestedProperty && <p id="interestedProperty-error" className="text-red-500 text-xs mt-1">{errors.interestedProperty}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type <span className="text-red-500">*</span></label>
                    <select
                      name="unitType"
                      value={formState.unitType}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.unitType ? 'border-red-500' : ''}`}
                      disabled={!formState.interestedProperty}
                      required
                      aria-invalid={!!errors.unitType}
                      aria-describedby={errors.unitType ? 'unitType-error' : undefined}
                    >
                      <option value="">{loadingUnits ? 'Loading...' : 'Select Unit'}</option>
                      {units.map(u => (
                        <option key={u.id} value={u.id}>{u.unit_name}</option>
                      ))}
                    </select>
                    {errors.unitType && <p id="unitType-error" className="text-red-500 text-xs mt-1">{errors.unitType}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
                    <input
                      type="text"
                      name="budgetRange"
                      value={formState.budgetRange}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="$1000-$1200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Move-in Date</label>
                    <input
                      type="date"
                      name="moveInDate"
                      value={formState.moveInDate}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
                    <input
                      type="text"
                      name="agent"
                      value={formState.agent}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      value={formState.priority}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="hot">Hot</option>
                      <option value="warm">Warm</option>
                      <option value="cold">Cold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                    <input
                      type="text"
                      name="source"
                      value={formState.source}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Action</label>
                    <input
                      type="text"
                      name="nextAction"
                      value={formState.nextAction}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Communication Preference</label>
                    <select
                      name="communicationPreference"
                      value={formState.communicationPreference}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select preference</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="text">Text</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={formState.notes}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                    rows={4}
                    placeholder="Additional notes..."
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Applicant
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        );
      };

    const Toast = ({ message, visible }: { message: string; visible: boolean }) => (
        <div
            className={`fixed top-6 right-6 z-50 transition-all duration-300 ${
                visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
        >
            <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg font-medium">
                {message}
            </div>
        </div>
    );

    const renderActiveModule = () => {
        switch (activeModule) {
            case 'pipeline':
                return <PipelineView />;
            case 'tenantEvaluations':
                return <ApplicationsReviewDashboard />;
            default:
                return (
                    <div className="text-center p-10 bg-white rounded-lg shadow-sm">
                        <Icon
                            name={modules.find(m => m.id === activeModule)?.icon as string}
                            className="h-12 w-12 mx-auto text-gray-300"
                        />
                        <h2 className="mt-2 text-xl font-bold text-gray-700">
                            {modules.find(m => m.id === activeModule)?.name}
                        </h2>
                        <p className="mt-1 text-gray-500">This module is for demonstration purposes.</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Toast message={toast.message} visible={toast.visible} />
            <ApplicantDetailModal applicant={selectedApplicant} isOpen={isModalOpen} onClose={closeModal} />
            <AddApplicantModal isOpen={isAddModalOpen} onClose={closeAddModal} onSave={handleAddApplicant} />
            <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-3">
                        <div className="flex items-center space-x-4">
                            <Icon name="activity" className="h-8 w-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Leasing Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Icon name="bell" className="h-6 w-6 text-gray-600" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div
                                className="w-9 h-9 bg-gray-300 rounded-full bg-cover"
                                style={{ backgroundImage: 'url(https://placehold.co/100x100/E2E8F0/4A5568?text=U)' }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className="w-64 bg-white shadow-sm h-[calc(100vh-65px)] sticky top-[65px]">
                    <div className="p-4">
                        <nav className="space-y-1">
                            {modules.map(module => (
                                <button
                                    key={module.id}
                                    onClick={() => setActiveModule(module.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${activeModule === module.id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Icon name={module.icon as string} className="h-5 w-5" />
                                        <span>{module.name}</span>
                                    </div>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
                <main className="flex-1 p-8 overflow-y-auto">{renderActiveModule()}</main>
            </div>
        </div>
    );
};

export default App;