"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
} from 'lucide-react';

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

// --- UI Components ---
const RecommendationBadge = ({ recommendation }: { recommendation: string | null }) => {
    const baseClasses = "font-semibold text-xs px-2.5 py-1 rounded-full border";
    const iconCls = "h-3 w-3 mr-1.5";
    switch (recommendation) {
        case 'approve':
            return <span className={`${baseClasses} bg-green-100 text-green-800 border-green-300 flex items-center`}><ThumbsUpIcon className={iconCls} />APPROVE</span>;
        case 'maybe':
            return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center`}><CircleHelpIcon className={iconCls} />MAYBE</span>;
        case 'hell-no':
            return <span className={`${baseClasses} bg-red-100 text-red-800 border-red-300 flex items-center`}><ThumbsDownIcon className={iconCls} />HELL NO</span>;
        default:
            return <span className="font-semibold text-xs px-2.5 py-1 rounded-full border bg-gray-100 text-gray-800">N/A</span>;
    }
};

const DetailSection = ({ title, icon, children }: { title: string, icon: React.ReactElement<{ className?: string }>, children: React.ReactNode }) => (
    <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center mb-3">
            {React.cloneElement(icon, { className: `h-4 w-4 mr-2 ${icon.props.className || ''}` })}
            <span>{title}</span>
        </h3>
        <div className="bg-gray-50/70 p-4 rounded-lg border">{children}</div>
    </div>
);

const DetailItem = ({ label, value }: { label: string, value: string | null | undefined }) => (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100 last:border-b-0">
        <dt className="text-sm font-medium text-gray-600">{label}</dt>
        <dd className="col-span-2 text-sm text-gray-800">{value || <span className="text-gray-400 italic">Not provided</span>}</dd>
    </div>
);

const DetailList = ({ items, icon }: { items: string[] | null, icon: React.ReactElement<{ className?: string }> }) => {
    if (!items || items.length === 0) return <p className="text-sm text-gray-400 italic">None</p>;
    return (
        <ul className="space-y-2">
            {items.map((item, index) => {
                const currentIconProps = icon.props as { className?: string };
                const newClassName = `flex-shrink-0 mt-0.5 ${currentIconProps.className || ''}`;

                const newProps = {
                    ...currentIconProps,
                    className: newClassName
                };

                return (
                    <li key={index} className="flex items-start text-sm text-gray-800">
                        {React.cloneElement(icon, newProps)}
                        <span className="ml-2">{item}</span>
                    </li>
                );
            })}
        </ul>
    );
};

const DropdownFilter = ({ label, value, options, onSelect, displayKey = 'name', valueKey = 'id' }: {
    label: string;
    value: string;
    options: { [key: string]: any }[];
    onSelect: (value: string) => void;
    displayKey?: string;
    valueKey?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Defensive check for options
    if (!Array.isArray(options)) {
        console.error(`DropdownFilter (${label}): Invalid options array`, options);
        return <div className="text-red-600 text-sm">Error: Invalid {label} options</div>;
    }

    // Log options for debugging
    console.log(`DropdownFilter (${label}): Options`, options);

    // Filter out invalid options and ensure valueKey exists
    const validOptions = options.filter(
        (o) => o && typeof o === 'object' && o[valueKey] !== null && o[valueKey] !== undefined
    );

    const selectedOption = validOptions.find((o) => o[valueKey] === value);
    const displayValue = value === 'all'
        ? `All ${label}s`
        : selectedOption?.[displayKey] || selectedOption?.[valueKey] || `All ${label}s`;

    // Log selected option and display value
    console.log(`DropdownFilter (${label}): Selected value`, value, 'Display value', displayValue, 'Selected option', selectedOption);

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto justify-between pr-2" disabled={validOptions.length === 0}>
                    {label}: {validOptions.length === 0 ? 'No Properties Available' : displayValue} <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => onSelect('all')}>All {label}s</DropdownMenuItem>
                {validOptions.length > 0 ? (
                    validOptions.map((option) => (
                        <DropdownMenuItem
                            key={option[valueKey] || `option-${Math.random()}`}
                            onClick={() => onSelect(option[valueKey])}
                        >
                            {option[displayKey] || option[valueKey] || 'Unnamed Property'}
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem disabled>No {label}s available</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

// --- Main Component ---
const ApplicationsReviewDashboard = () => {
    const [applications, setApplications] = useState<ApplicationData[]>([]);
    const [filters, setFilters] = useState<FilterState>({ recommendation: 'all', propertyId: 'all', agentName: 'all', search: '' });
    const [metaData, setMetaData] = useState<{ properties: Property[], agents: string[] }>({ properties: [], agents: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState<ApplicationData | null>(null);

    useEffect(() => {
        const fetchApplicationData = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data: applicationsData, error: fetchError } = await supabase
                    .from('tenant_assessments')
                    .select(`
                        id,
                        showing_date,
                        showing_time,
                        recommendation,
                        agent_name,
                        positive_observations,
                        concerning_signs,
                        red_flags,
                        assessment_scores,
                        additional_notes,
                        maintenance_issues,
                        created_at,
                        voice_note_url,
                        housing_notes,
                        kids_pets_notes,
                        employment_details,
                        local_connections_notes,
                        prospects (name, phone, email),
                        properties!tenant_assessments_property_id_fkey (id, property_name, property_id),
                        units (id, unit_name)
                    `);

                if (fetchError) {
                    console.error('Supabase fetch error:', fetchError);
                    throw new Error(`Failed to fetch applications: ${fetchError.message}`);
                }

                if (!applicationsData) {
                    throw new Error('No application data returned from Supabase');
                }

                // Log raw Supabase response
                console.log('Raw Supabase response:', applicationsData);

                const fetchedApplications: ApplicationData[] = applicationsData.map((app: any) => ({
                    id: app.id,
                    showing_date: app.showing_date,
                    showing_time: app.showing_time,
                    recommendation: app.recommendation,
                    agent_name: app.agent_name,
                    positive_observations: app.positive_observations,
                    concerning_signs: app.concerning_signs,
                    red_flags: app.red_flags,
                    assessment_scores: app.assessment_scores,
                    additional_notes: app.additional_notes,
                    maintenance_issues: app.maintenance_issues,
                    created_at: app.created_at,
                    voice_note_url: app.voice_note_url,
                    housing_notes: app.housing_notes,
                    kids_pets_notes: app.kids_pets_notes,
                    employment_details: app.employment_details,
                    local_connections_notes: app.local_connections_notes,
                    prospect: app.prospects, // Mapping prospects object
                    property: app.properties, // Mapping properties object
                    unit: app.units, // Mapping units object
                }));
                setApplications(fetchedApplications);

                // Log processed applications with focus on properties
                console.log('Processed applications:', fetchedApplications.map(app => ({
                    id: app.id,
                    property: app.property,
                })));

                const uniqueProperties: Property[] = [];
                const uniqueAgents: string[] = [];
                const propertyIds = new Set<string>();
                const agentNames = new Set<string>();
                const unmatchedProperties: string[] = [];

                fetchedApplications.forEach((app) => {
                    // Handle properties with required property_id
                    if (
                        app.property &&
                        app.property.id &&
                        app.property.property_id &&
                        !propertyIds.has(app.property.property_id)
                    ) {
                        uniqueProperties.push(app.property as Property);
                        propertyIds.add(app.property.property_id);
                    } else {
                        console.warn(`Application ${app.id} has invalid or missing property data:`, {
                            property: app.property,
                        });
                        unmatchedProperties.push(app.id);
                    }
                    // Handle agent names
                    if (app.agent_name && !agentNames.has(app.agent_name)) {
                        uniqueAgents.push(app.agent_name);
                        agentNames.add(app.agent_name);
                    }
                });

                // Log unmatched properties
                if (unmatchedProperties.length > 0) {
                    console.warn('Applications with missing or invalid property data:', unmatchedProperties);
                }

                // Sort properties, handling null/undefined property_name
                uniqueProperties.sort((a, b) =>
                    (a.property_name || a.property_id || '').localeCompare(b.property_name || b.property_id || '')
                );
                uniqueAgents.sort();

                // Log unique properties and agents
                console.log('Unique properties:', uniqueProperties);
                console.log('Unique agents:', uniqueAgents);

                setMetaData({ properties: uniqueProperties, agents: uniqueAgents });
            } catch (err: any) {
                console.error('Error fetching application data:', err);
                setError(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchApplicationData();
    }, []);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleViewDetails = (app: ApplicationData) => {
        setSelectedApp(app);
        setIsModalOpen(true);
    };

    const filteredApplications = useMemo(() => {
        return applications.filter((app) => {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch = filters.search === '' ||
                (app.prospect?.name?.toLowerCase().includes(searchLower)) ||
                (app.prospect?.phone?.includes(searchLower));
            const matchesRecommendation = filters.recommendation === 'all' || app.recommendation === filters.recommendation;
            const matchesProperty = filters.propertyId === 'all' || app.property?.property_id === filters.propertyId;
            const matchesAgent = filters.agentName === 'all' || app.agent_name === filters.agentName;
            return matchesSearch && matchesRecommendation && matchesProperty && matchesAgent;
        });
    }, [applications, filters]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><p>Loading applications...</p></div>;
    }

    if (error) {
        return (
            <div className="m-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <h2 className="font-bold">Dashboard Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50/50 min-h-screen p-4 sm:p-6 lg:p-8">
            <main className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Applications Review</h1>
                    <p className="mt-1 text-md text-gray-600">Review, filter, and search all submitted tenant assessments.</p>
                </header>
                {metaData.properties.length === 0 && (
                    <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
                        <h2 className="font-bold">Warning</h2>
                        <p>No properties found. Please ensure properties are added in the database.</p>
                    </div>
                )}
                <Card className="mb-6">
                    <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by prospect name or phone..."
                                className="pl-9"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 sm:gap-4 flex-wrap">
                            <DropdownFilter
                                label="Status"
                                value={filters.recommendation}
                                options={[{ id: 'approve', name: 'Approve' }, { id: 'maybe', name: 'Maybe' }, { id: 'hell-no', name: 'Hell No' }]}
                                onSelect={(v) => handleFilterChange('recommendation', v)}
                            />
                            <DropdownFilter
                                label="Property"
                                value={filters.propertyId}
                                options={metaData.properties}
                                onSelect={(v) => handleFilterChange('propertyId', v)}
                                displayKey="property_name"
                                valueKey="property_id"
                            />
                            <DropdownFilter
                                label="Agent"
                                value={filters.agentName}
                                options={metaData.agents.map((a) => ({ id: a, name: a }))}
                                onSelect={(v) => handleFilterChange('agentName', v)}
                            />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>All Applications</CardTitle>
                        <CardDescription>Found {filteredApplications.length} of {applications.length} total applications.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Prospect</TableHead>
                                    <TableHead className="hidden md:table-cell">Property</TableHead>
                                    <TableHead className="hidden lg:table-cell">Submitted</TableHead>
                                    <TableHead className="hidden sm:table-cell">Agent</TableHead>
                                    <TableHead>Recommendation</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredApplications.length > 0 ? (
                                    filteredApplications.map((app) => (
                                        <TableRow key={app.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span>{app.prospect?.name || 'Unknown'}</span>
                                                    <span className="text-xs text-gray-500 md:hidden">{app.property?.property_name || app.property?.property_id || 'No Property'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {app.property?.property_name || app.property?.property_id || 'No Property'} - Unit {app.unit?.unit_name || 'N/A'}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">{new Date(app.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="hidden sm:table-cell">{app.agent_name || 'N/A'}</TableCell>
                                            <TableCell><RecommendationBadge recommendation={app.recommendation} /></TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleViewDetails(app)}>
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">No applications match the current filters.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
            {isModalOpen && selectedApp && (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="absolute top-4 right-4">
                            {/* <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>X</Button> */}
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-2xl">{selectedApp.prospect?.name || 'Application Details'}</DialogTitle>
                            <DialogDescription>
                                Assessment for {selectedApp.property?.property_name || selectedApp.property?.property_id || 'No Property'} - Unit {selectedApp.unit?.unit_name || 'N/A'} submitted on {new Date(selectedApp.created_at).toLocaleString()}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid md:grid-cols-2 gap-8 mt-4">
                            <div>
                                <DetailSection title="Applicant & Showing Info" icon={<UserIcon />}>
                                    <dl>
                                        <DetailItem label="Prospect" value={selectedApp.prospect?.name} />
                                        <DetailItem label="Phone" value={selectedApp.prospect?.phone} />
                                        <DetailItem label="Email" value={selectedApp.prospect?.email} />
                                        <DetailItem label="Agent" value={selectedApp.agent_name} />
                                        <DetailItem label="Showing Date" value={selectedApp.showing_date} />
                                    </dl>
                                </DetailSection>
                                <DetailSection title="Final Recommendation" icon={<FileTextIcon />}>
                                    <RecommendationBadge recommendation={selectedApp.recommendation} />
                                </DetailSection>
                                {selectedApp.voice_note_url && (
                                    <DetailSection title="Voice Note" icon={<MailIcon />}>
                                        <audio controls src={selectedApp.voice_note_url} className="w-full">Your browser does not support the audio element.</audio>
                                    </DetailSection>
                                )}
                            </div>
                            <div>
                                <DetailSection title="Positive Observations" icon={<CheckCircleIcon className="text-green-600" />}>
                                    <DetailList items={selectedApp.positive_observations} icon={<CheckCircleIcon className="text-green-500" />} />
                                </DetailSection>
                                <DetailSection title="Concerning Signs" icon={<XCircleIcon className="text-amber-600" />}>
                                    <DetailList items={selectedApp.concerning_signs} icon={<XCircleIcon className="text-amber-500" />} />
                                </DetailSection>
                                <DetailSection title="Red Flags" icon={<AlertTriangleIcon className="text-red-600" />}>
                                    <DetailList items={selectedApp.red_flags} icon={<AlertTriangleIcon className="text-red-500" />} />
                                </DetailSection>
                            </div>
                        </div>
                        <div>
                            <DetailSection title="Agent Notes" icon={<FileTextIcon />}>
                                <p className="text-sm"><strong>Housing:</strong> {selectedApp.housing_notes || "N/A"}</p>
                                <p className="text-sm mt-2"><strong>Kids/Pets:</strong> {selectedApp.kids_pets_notes || "N/A"}</p>
                                <p className="text-sm mt-2"><strong>Employment/Payment:</strong> {selectedApp.employment_details || "N/A"}</p>
                                <p className="text-sm mt-2"><strong>Local Connections:</strong> {selectedApp.local_connections_notes || "N/A"}</p>
                                <p className="text-sm mt-2"><strong>Additional:</strong> {selectedApp.additional_notes || "N/A"}</p>
                                <p className="text-sm mt-2"><strong>Maintenance for Unit:</strong> {selectedApp.maintenance_issues || "N/A"}</p>
                            </DetailSection>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default ApplicationsReviewDashboard;