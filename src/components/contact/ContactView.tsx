'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BaseContact, ContactType, InvestorContact, getFullName, getContactStatusBadgeColor } from '@/types/contact';
import { Edit, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ContactViewProps {
  isOpen: boolean;
  contact: BaseContact | null;
  contactType: ContactType;
  onClose: () => void;
  onEdit: () => void;
}

export function ContactView({ isOpen, contact, contactType, onClose, onEdit }: ContactViewProps) {
  if (!contact) return null;

  // Format date for display
  const formatDate = (dateString?: string | number) => {
    if (!dateString) return 'N/A';
    try {
      // Ensure we're working with a valid date input
      if (typeof dateString === 'string' || typeof dateString === 'number') {
        return new Date(dateString).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
      return 'Invalid Date';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return typeof dateString === 'string' ? dateString : 'Invalid Date';
    }
  };

  // Common contact information section
  const renderContactInfo = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Contact Information</h3>
      
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        <div>
          <Label className="text-gray-600 dark:text-gray-300">Name</Label>
          <p className="text-gray-900 dark:text-white">{getFullName(contact)}</p>
        </div>
        
        <div>
          <Label className="text-gray-600 dark:text-gray-300">Status</Label>
          <div>
            <Badge className={getContactStatusBadgeColor(contact.status)}>
              {contact.status}
            </Badge>
          </div>
        </div>
        
        <div>
          <Label className="text-gray-600 dark:text-gray-300">Email</Label>
          <p className="text-gray-900 dark:text-white flex items-center">
            {contact.email || 'N/A'}
            {contact.email && (
              <a 
                href={`mailto:${contact.email}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 text-blue-500 hover:text-blue-700"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </p>
        </div>
        
        <div>
          <Label className="text-gray-600 dark:text-gray-300">Phone</Label>
          <p className="text-gray-900 dark:text-white flex items-center">
            {contact.phone || 'N/A'}
            {contact.phone && (
              <a 
                href={`tel:${contact.phone}`}
                className="ml-1 text-blue-500 hover:text-blue-700"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </p>
        </div>
        
        {/* Access position from metadata or specific contact types */}
        {((contact as any).position || contact.metadata?.position) && (
          <div>
            <Label className="text-gray-600 dark:text-gray-300">Position</Label>
            <p className="text-gray-900 dark:text-white">
              {(contact as any).position || 
               (typeof contact.metadata?.position === 'string' ? contact.metadata.position : 'N/A')}
            </p>
          </div>
        )}
        
        {/* Access company from metadata or specific contact types */}
        {((contact as any).company || contact.metadata?.company) && (
          <div>
            <Label className="text-gray-600 dark:text-gray-300">Company</Label>
            <p className="text-gray-900 dark:text-white">
              {(contact as any).company || 
               (typeof contact.metadata?.company === 'string' ? contact.metadata.company : 'N/A')}
            </p>
          </div>
        )}
        
        {contact.created_at && (
          <div>
            <Label className="text-gray-600 dark:text-gray-300">Created</Label>
            <p className="text-gray-900 dark:text-white">{formatDate(contact.created_at)}</p>
          </div>
        )}
        
        {contact.updated_at && (
          <div>
            <Label className="text-gray-600 dark:text-gray-300">Last Updated</Label>
            <p className="text-gray-900 dark:text-white">{formatDate(contact.updated_at)}</p>
          </div>
        )}
      </div>
    </div>
  );

  // Render type-specific content
  const renderTypeSpecificContent = () => {
    switch (contactType) {
      case 'member':
        return renderMemberContent();
      case 'freelance':
        return renderFreelanceContent();
      case 'partner':
        return renderPartnerContent();
      case 'board-member':
        return renderBoardMemberContent();
      case 'external':
        return renderExternalContent();
      case 'network':
        return renderNetworkContent();
      case 'investor':
        return renderInvestorContent();
      default:
        return null;
    }
  };

  // Investor contact specific content
  const renderInvestorContent = () => {
    if (contact.type !== 'investor') return null;
    
    const investorContact = contact as InvestorContact;
    
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Investment Details</h3>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <Label className="text-gray-600 dark:text-gray-300">Investment Stage</Label>
              <p className="text-gray-900 dark:text-white capitalize">
                {investorContact.investment_stage?.replace('-', ' ') || 'N/A'}
              </p>
            </div>
            
            <div>
              <Label className="text-gray-600 dark:text-gray-300">Investment Status</Label>
              <div>
                {investorContact.investment_status ? (
                  <Badge className={getContactStatusBadgeColor(investorContact.investment_status)}>
                    {investorContact.investment_status.replace('-', ' ')}
                  </Badge>
                ) : 'N/A'}
              </div>
            </div>
            
            <div>
              <Label className="text-gray-600 dark:text-gray-300">Check Size Range</Label>
              <p className="text-gray-900 dark:text-white">
                {investorContact.minimum_check_size || investorContact.maximum_check_size ? (
                  <>
                    {investorContact.minimum_check_size ? `$${investorContact.minimum_check_size.toLocaleString()}` : 'Any'} 
                    {' - '} 
                    {investorContact.maximum_check_size ? `$${investorContact.maximum_check_size.toLocaleString()}` : 'Any'}
                  </>
                ) : 'N/A'}
              </p>
            </div>
            
            <div>
              <Label className="text-gray-600 dark:text-gray-300">Last Contact Date</Label>
              <p className="text-gray-900 dark:text-white">
                {formatDate(investorContact.last_contact_date)}
              </p>
            </div>
          </div>
        </div>
        
        {investorContact.investment_focus && investorContact.investment_focus.length > 0 && (
          <div className="space-y-2">
            <Label className="text-gray-600 dark:text-gray-300">Investment Focus</Label>
            <div className="flex flex-wrap gap-2">
              {investorContact.investment_focus.map((focus, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {focus}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {investorContact.preferred_industries && investorContact.preferred_industries.length > 0 && (
          <div className="space-y-2">
            <Label className="text-gray-600 dark:text-gray-300">Preferred Industries</Label>
            <div className="flex flex-wrap gap-2">
              {investorContact.preferred_industries && investorContact.preferred_industries.map((industry, index) => (
                <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                  {industry}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {investorContact.portfolio_companies && investorContact.portfolio_companies.length > 0 && (
          <div className="space-y-2">
            <Label className="text-gray-600 dark:text-gray-300">Portfolio Companies</Label>
            <div className="flex flex-wrap gap-2">
              {investorContact.portfolio_companies && investorContact.portfolio_companies.map((company, index) => (
                <Badge key={index} variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                  {company}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Member specific content
  const renderMemberContent = () => {
    if (contact.type !== 'member') return null;
    
    return (
      <>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Department Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-600 dark:text-gray-300">Position</Label>
              <p className="text-gray-900 dark:text-white">
                {(contact as any).position || 
                 (typeof contact.metadata?.position === 'string' ? contact.metadata.position : 'N/A')}
              </p>
            </div>
            <div>
              <Label className="text-gray-600 dark:text-gray-300">Department</Label>
              <p className="text-gray-900 dark:text-white">
                {contact.metadata?.department && typeof contact.metadata.department === 'string'
                  ? contact.metadata.department 
                  : 'N/A'}
              </p>
            </div>
          </div>
          
          <div>
            <Label className="text-gray-600 dark:text-gray-300">Join Date</Label>
            <p className="text-gray-900 dark:text-white">
              {contact.metadata?.join_date && 
               (typeof contact.metadata.join_date === 'string' || typeof contact.metadata.join_date === 'number') 
                ? formatDate(contact.metadata.join_date) 
                : 'N/A'}
            </p>
          </div>
        </div>

        {contact.metadata?.job_description && typeof contact.metadata.job_description === 'object' && contact.metadata.job_description !== null && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Job Description</h3>
            
            {/* Use an IIFE with proper type handling */}
            {(() => {
              // First ensure job_description is an object
              if (typeof contact.metadata.job_description !== 'object' || 
                  contact.metadata.job_description === null) {
                return null;
              }
              
              // Safely access properties with type checking
              const jobDesc = contact.metadata.job_description as Record<string, unknown>;
              const summary = jobDesc.summary;
              const roles = jobDesc.roles;
              const missions = jobDesc.missions;
              
              return (
                <>
                  {typeof summary === 'string' && summary.trim() !== '' && (
                    <div>
                      <Label className="text-gray-600 dark:text-gray-300">Summary</Label>
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                        {summary}
                      </p>
                    </div>
                  )}
                  
                  {Array.isArray(roles) && roles.length > 0 && (
                    <div>
                      <Label className="text-gray-600 dark:text-gray-300">Roles</Label>
                      <ul className="list-disc list-inside text-gray-900 dark:text-white mt-1 space-y-1">
                        {roles.map((role, index) => (
                          <li key={index}>{typeof role === 'string' ? role : String(role)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {Array.isArray(missions) && missions.length > 0 && (
                    <div>
                      <Label className="text-gray-600 dark:text-gray-300">Missions</Label>
                      <ul className="list-disc list-inside text-gray-900 dark:text-white mt-1 space-y-1">
                        {missions.map((mission, index) => (
                          <li key={index}>{typeof mission === 'string' ? mission : String(mission)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {contact.metadata?.responsibilities && Array.isArray(contact.metadata.responsibilities) && contact.metadata.responsibilities.length > 0 && (
          <div className="space-y-2">
            <Label className="text-gray-600 dark:text-gray-300">Responsibilities</Label>
            <ul className="list-disc list-inside text-gray-900 dark:text-white space-y-1">
              {contact.metadata.responsibilities.map((resp: unknown, index: number) => (
                <li key={index}>{typeof resp === 'string' ? resp : String(resp)}</li>
              ))}
            </ul>
          </div>
        )}

        {contact.metadata?.languages && Array.isArray(contact.metadata.languages) && contact.metadata.languages.length > 0 && (
          <div className="space-y-2">
            <Label className="text-gray-600 dark:text-gray-300">Languages</Label>
            <div className="flex flex-wrap gap-2">
              {contact.metadata.languages.map((lang: any, index: number) => {
                // Ensure lang is an object with language and level properties
                if (typeof lang === 'object' && lang !== null && 'language' in lang && 'level' in lang) {
                  return (
                    <Badge key={index} variant="secondary" className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                      {String(lang.language)} ({String(lang.level)})
                    </Badge>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {contact.metadata?.education && Array.isArray(contact.metadata.education) && contact.metadata.education.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Education</h3>
            <div className="space-y-3">
              {contact.metadata.education.map((edu: any, index: number) => {
                // Ensure edu is an object with required properties
                if (typeof edu === 'object' && edu !== null && 
                    'degree' in edu && 'year' in edu && 'institution' in edu) {
                  return (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-900 dark:text-white">{String(edu.degree)}</p>
                        <p className="text-gray-600 dark:text-gray-300">{String(edu.year)}</p>
                      </div>
                      <p className="text-gray-700 dark:text-gray-400">{String(edu.institution)}</p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}
      </>
    );
  };

  // Freelance specific content
  const renderFreelanceContent = () => {
    if (contact.type !== 'freelance') return null;
    
    return (
      <>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Freelance Information</h3>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <Label className="text-gray-600 dark:text-gray-300">Availability</Label>
              <p className="text-gray-900 dark:text-white">
                {contact.metadata?.availability && typeof contact.metadata.availability === 'string' 
                  ? contact.metadata.availability 
                  : 'N/A'}
              </p>
            </div>
            
            <div>
              <Label className="text-gray-600 dark:text-gray-300">Hourly Rate</Label>
              <p className="text-gray-900 dark:text-white">
                {contact.metadata?.hourly_rate && 
                 (typeof contact.metadata.hourly_rate === 'string' || typeof contact.metadata.hourly_rate === 'number')
                  ? `${contact.metadata.hourly_rate} €/h` 
                  : 'N/A'}
              </p>
            </div>
            
            <div>
              <Label className="text-gray-600 dark:text-gray-300">Daily Rate</Label>
              <p className="text-gray-900 dark:text-white">
                {contact.metadata?.daily_rate && 
                 (typeof contact.metadata.daily_rate === 'string' || typeof contact.metadata.daily_rate === 'number')
                  ? `${contact.metadata.daily_rate} €/day` 
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {contact.metadata?.skills && Array.isArray(contact.metadata.skills) && contact.metadata.skills.length > 0 && (
          <div className="space-y-2">
            <Label className="text-gray-600 dark:text-gray-300">Skills</Label>
            <div className="flex flex-wrap gap-2">
              {contact.metadata.skills.map((skill: unknown, index: number) => (
                <Badge key={index} variant="secondary" className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                  {typeof skill === 'string' ? skill : String(skill)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {contact.metadata?.experience && Array.isArray(contact.metadata.experience) && contact.metadata.experience.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Experience</h3>
            <div className="space-y-4">
              {contact.metadata.experience.map((exp: any, index: number) => {
                // Ensure exp is an object with required properties
                if (typeof exp === 'object' && exp !== null && 
                    'role' in exp && 'duration' in exp && 'company' in exp && 'description' in exp) {
                  return (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex justify-between mb-1">
                        <p className="font-medium text-gray-900 dark:text-white">{String(exp.role)}</p>
                        <p className="text-gray-600 dark:text-gray-300">{String(exp.duration)}</p>
                      </div>
                      <p className="text-gray-700 dark:text-gray-400 mb-2">{String(exp.company)}</p>
                      <p className="text-gray-700 dark:text-gray-400 text-sm">{String(exp.description)}</p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}
      </>
    );
  };

  // Partner specific content
  const renderPartnerContent = () => {
    if (contact.type !== 'partner') return null;
    
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Partnership Details</h3>
        
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <Label className="text-gray-600 dark:text-gray-300">Partnership Type</Label>
            <p className="text-gray-900 dark:text-white">
              {contact.metadata?.partnership_type && typeof contact.metadata.partnership_type === 'string' 
                ? contact.metadata.partnership_type 
                : 'N/A'}
            </p>
          </div>
          
          <div>
            <Label className="text-gray-600 dark:text-gray-300">Partnership Since</Label>
            <p className="text-gray-900 dark:text-white">
              {contact.metadata?.since && 
               (typeof contact.metadata.since === 'string' || typeof contact.metadata.since === 'number') 
                ? formatDate(String(contact.metadata.since)) 
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Board member specific content
  const renderBoardMemberContent = () => {
    if (contact.type !== 'board-member') return null;
    
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Board Member Details</h3>
        
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <Label className="text-gray-600 dark:text-gray-300">Joined Board</Label>
            <p className="text-gray-900 dark:text-white">
              {contact.metadata?.joined_at && 
               (typeof contact.metadata.joined_at === 'string' || typeof contact.metadata.joined_at === 'number') 
                ? formatDate(String(contact.metadata.joined_at)) 
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // External contact specific content
  const renderExternalContent = () => {
    if (contact.type !== 'external') return null;
    
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">External Contact Details</h3>
        
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {/* Add any external-specific fields here */}
        </div>
      </div>
    );
  };

  // Network contact specific content
  const renderNetworkContent = () => {
    if (contact.type !== 'network') return null;
    
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Network Contact Details</h3>
        
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <Label className="text-gray-600 dark:text-gray-300">Connection Strength</Label>
            <p className="text-gray-900 dark:text-white">
              {contact.metadata?.connection_strength && 
               typeof contact.metadata.connection_strength === 'number' 
                ? '⭐'.repeat(Number(contact.metadata.connection_strength)) 
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Notes section
  const renderNotes = () => {
    if (!contact.metadata?.notes) return null;
    
    return (
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Notes</h3>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {typeof contact.metadata.notes === 'string' ? contact.metadata.notes : ''}
        </p>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            {getFullName(contact)} - {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)} Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 max-h-[70vh] overflow-y-auto space-y-6 pr-2">
          {renderContactInfo()}
          
          {(renderTypeSpecificContent() || renderNotes()) && (
            <Separator className="my-2" />
          )}
          
          {renderTypeSpecificContent()}
          
          {renderNotes() && (
            <Separator className="my-2" />
          )}
          
          {renderNotes()}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={onEdit}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
