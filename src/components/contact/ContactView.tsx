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
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return dateString;
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
        
        {contact.position && (
          <div>
            <Label className="text-gray-600 dark:text-gray-300">Position</Label>
            <p className="text-gray-900 dark:text-white">{contact.position}</p>
          </div>
        )}
        
        {contact.company && (
          <div>
            <Label className="text-gray-600 dark:text-gray-300">Company</Label>
            <p className="text-gray-900 dark:text-white">{contact.company}</p>
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
                <Badge key={index} variant="outline" className="border-gray-200 dark:border-gray-700">
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
              <p className="text-gray-900 dark:text-white">{contact.position || 'N/A'}</p>
            </div>
            <div>
              <Label className="text-gray-600 dark:text-gray-300">Department</Label>
              <p className="text-gray-900 dark:text-white">{contact.metadata?.department || 'N/A'}</p>
            </div>
          </div>
          
          <div>
            <Label className="text-gray-600 dark:text-gray-300">Join Date</Label>
            <p className="text-gray-900 dark:text-white">
              {contact.metadata?.join_date 
                ? new Date(contact.metadata.join_date).toLocaleDateString() 
                : 'N/A'}
            </p>
          </div>
        </div>

        {contact.metadata?.job_description && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Job Description</h3>
            
            {contact.metadata.job_description.summary && (
              <div>
                <Label className="text-gray-600 dark:text-gray-300">Summary</Label>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {contact.metadata.job_description.summary}
                </p>
              </div>
            )}
            
            {contact.metadata?.job_description?.roles?.length > 0 && (
              <div>
                <Label className="text-gray-600 dark:text-gray-300">Roles</Label>
                <ul className="list-disc list-inside text-gray-900 dark:text-white mt-1 space-y-1">
                  {contact.metadata?.job_description?.roles?.map((role: string, index: number) => (
                    <li key={index}>{role}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {contact.metadata?.job_description?.missions?.length > 0 && (
              <div>
                <Label className="text-gray-600 dark:text-gray-300">Missions</Label>
                <ul className="list-disc list-inside text-gray-900 dark:text-white mt-1 space-y-1">
                  {contact.metadata?.job_description?.missions?.map((mission: string, index: number) => (
                    <li key={index}>{mission}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {contact.metadata?.responsibilities?.length > 0 && (
          <div className="space-y-2">
            <Label className="text-gray-600 dark:text-gray-300">Responsibilities</Label>
            <ul className="list-disc list-inside text-gray-900 dark:text-white space-y-1">
              {contact.metadata?.responsibilities?.map((resp: string, index: number) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </div>
        )}

        {contact.metadata?.languages?.length > 0 && (
          <div className="space-y-2">
            <Label className="text-gray-600 dark:text-gray-300">Languages</Label>
            <div className="flex flex-wrap gap-2">
              {contact.metadata?.languages?.map((lang: {language: string, level: string}, index: number) => (
                <Badge key={index} variant="secondary" className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                  {lang.language} ({lang.level})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {contact.metadata?.education?.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Education</h3>
            <div className="space-y-3">
              {contact.metadata?.education?.map((edu: {degree: string, year: string, institution: string}, index: number) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-900 dark:text-white">{edu.degree}</p>
                    <p className="text-gray-600 dark:text-gray-300">{edu.year}</p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-400">{edu.institution}</p>
                </div>
              ))}
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
              <p className="text-gray-900 dark:text-white">{contact.metadata?.availability || 'N/A'}</p>
            </div>
            
            <div>
              <Label className="text-gray-600 dark:text-gray-300">Hourly Rate</Label>
              <p className="text-gray-900 dark:text-white">
                {contact.metadata?.hourly_rate ? `€${contact.metadata.hourly_rate}` : 'N/A'}
              </p>
            </div>
            
            <div>
              <Label className="text-gray-600 dark:text-gray-300">Daily Rate</Label>
              <p className="text-gray-900 dark:text-white">
                {contact.metadata?.daily_rate ? `€${contact.metadata.daily_rate}` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {contact.metadata?.skills?.length > 0 && (
          <div className="space-y-2">
            <Label className="text-gray-600 dark:text-gray-300">Skills</Label>
            <div className="flex flex-wrap gap-2">
              {contact.metadata?.skills?.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {contact.metadata?.experience?.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Experience</h3>
            <div className="space-y-4">
              {contact.metadata?.experience?.map((exp: {role: string, duration: string, company: string, description: string}, index: number) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="flex justify-between mb-1">
                    <p className="font-medium text-gray-900 dark:text-white">{exp.role}</p>
                    <p className="text-gray-600 dark:text-gray-300">{exp.duration}</p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-400 mb-2">{exp.company}</p>
                  <p className="text-gray-700 dark:text-gray-400 text-sm">{exp.description}</p>
                </div>
              ))}
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
            <p className="text-gray-900 dark:text-white">{contact.metadata?.partnership_type || 'N/A'}</p>
          </div>
          
          <div>
            <Label className="text-gray-600 dark:text-gray-300">Partnership Since</Label>
            <p className="text-gray-900 dark:text-white">{formatDate(contact.metadata?.since)}</p>
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
            <p className="text-gray-900 dark:text-white">{formatDate((contact as any).joined_at)}</p>
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
              {contact.metadata?.connection_strength 
                ? '⭐'.repeat(contact.metadata.connection_strength) 
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Notes section
  const renderNotes = () => {
    if (!contact.notes) return null;
    
    return (
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Notes</h3>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{contact.notes}</p>
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
