'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BaseContact, ContactType, InvestorContact } from '@/types/contact';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ContactFormProps {
  isOpen: boolean;
  isEditing: boolean;
  contact: BaseContact | null;
  contactType: ContactType;
  onClose: () => void;
  onSubmit: (contact: Partial<BaseContact>) => Promise<void>;
}

export function ContactForm({ 
  isOpen, 
  isEditing, 
  contact, 
  contactType, 
  onClose, 
  onSubmit 
}: ContactFormProps) {
  // Define a more flexible type that allows for any structure
  type ContactFormData = {
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    type?: ContactType;
    status?: string;
    notes?: string;
    company?: string;
    position?: string;
    tags?: string[];
    created_at?: string;
    updated_at?: string;
    metadata: Record<string, any>;
    // Investor-specific fields
    investment_stage?: string;
    investment_status?: string;
    investment_focus?: string[];
    portfolio_companies?: string[];
    preferred_industries?: string[];
    minimum_check_size?: number;
    maximum_check_size?: number;
    last_contact_date?: string;
    // Allow any other fields
    [key: string]: any;
  };

  const [formData, setFormData] = useState<ContactFormData>({
    type: contactType,
    status: 'active',
    metadata: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    type?: 'success' | 'error';
    message?: string;
  }>({ show: false });

  // Reset form when contact changes
  useEffect(() => {
    if (contact) {
      // Convert the contact to ContactFormData format
      const formattedContact: ContactFormData = {
        ...contact,
        metadata: contact.metadata || {}
      };
      setFormData(formattedContact);
    } else {
      // Initialize empty arrays for investor-specific fields when creating a new investor contact
      if (contactType === 'investor') {
        setFormData(prev => ({
          ...prev,
          investment_focus: [],
          portfolio_companies: [],
          preferred_industries: []
        }));
      }
    }
  }, [contact, contactType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (metadata)
      const [parent, child] = name.split('.');
      setFormData((prev: ContactFormData) => {
        const parentObj = prev[parent as keyof typeof prev] as Record<string, any> || {};
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: value
          }
        };
      });
    } else {
      setFormData((prev: ContactFormData) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name.includes('.')) {
      // Handle nested properties (metadata)
      const [parent, child] = name.split('.');
      setFormData((prev: ContactFormData) => {
        const parentObj = prev[parent as keyof typeof prev] as Record<string, any> || {};
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: value
          }
        };
      });
    } else {
      setFormData((prev: ContactFormData) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayItemChange = (
    metadataKey: string, 
    arrayKey: string, 
    index: number, 
    field: string, 
    value: string
  ) => {
    setFormData((prev: ContactFormData) => {
      const metadata = { ...prev.metadata };
      if (!metadata[metadataKey]) {
        metadata[metadataKey] = {};
      }
      
      const keyData = metadata[metadataKey] as Record<string, any>;
      if (!keyData[arrayKey]) {
        keyData[arrayKey] = [];
      }
      
      const items = [...(keyData[arrayKey] as any[])];
      
      if (!items[index]) {
        items[index] = {};
      }
      
      items[index] = { ...items[index], [field]: value };
      
      return {
        ...prev,
        metadata: {
          ...metadata,
          [metadataKey]: {
            ...keyData,
            [arrayKey]: items
          }
        }
      };
    });
  };

  const addArrayItem = (metadataKey: string, arrayKey: string) => {
    setFormData(prev => {
      // Handle investor-specific array fields which are not in metadata
      if (arrayKey === 'investment_focus' || arrayKey === 'portfolio_companies' || arrayKey === 'preferred_industries') {
        const investorData = prev as Partial<InvestorContact>;
        const currentArray = [...(investorData[arrayKey as keyof typeof investorData] as string[] || [])];
        currentArray.push('');
        
        return {
          ...prev,
          [arrayKey]: currentArray
        };
      }
      
      // Handle regular metadata arrays
      const metadata = { ...prev.metadata };
      if (!metadata[metadataKey]) {
        metadata[metadataKey] = {};
      }
      
      const keyData = metadata[metadataKey] as Record<string, any>;
      const items = keyData[arrayKey] ? [...keyData[arrayKey]] : [];
      
      // Add empty item based on array type
      if (arrayKey === 'roles' || arrayKey === 'missions') {
        items.push('');
      } else if (arrayKey === 'languages') {
        items.push({ language: '', level: 'beginner' });
      } else if (arrayKey === 'education') {
        items.push({ degree: '', institution: '', year: '' });
      } else if (arrayKey === 'skills') {
        items.push('');
      } else if (arrayKey === 'experience') {
        items.push({ company: '', role: '', duration: '', description: '' });
      } else {
        items.push({});
      }
      
      return {
        ...prev,
        metadata: {
          ...metadata,
          [metadataKey]: {
            ...keyData,
            [arrayKey]: items
          }
        }
      };
    });
  };

  const removeArrayItem = (metadataKey: string, arrayKey: string, index: number) => {
    setFormData((prev: ContactFormData) => {
      // Handle investor-specific array fields which are not in metadata
      if (arrayKey === 'investment_focus' || arrayKey === 'portfolio_companies' || arrayKey === 'preferred_industries') {
        const investorData = prev as ContactFormData;
        const currentArray = [...(investorData[arrayKey] as string[] || [])];
        currentArray.splice(index, 1);
        
        return {
          ...prev,
          [arrayKey]: currentArray
        };
      }
      
      // Handle regular metadata arrays
      const metadata = { ...prev.metadata };
      if (!metadata[metadataKey]) return prev;
      
      const keyData = metadata[metadataKey] as Record<string, any>;
      if (!keyData[arrayKey]) return prev;
      
      const items = [...keyData[arrayKey]];
      items.splice(index, 1);
      
      return {
        ...prev,
        metadata: {
          ...metadata,
          [metadataKey]: {
            ...keyData,
            [arrayKey]: items
          }
        }
      };
    });
  };

  const handleStringArrayItemChange = (arrayKey: string, index: number, value: string) => {
    setFormData((prev: ContactFormData) => {
      // Handle investor-specific array fields which are not in metadata
      if (arrayKey === 'investment_focus' || arrayKey === 'portfolio_companies' || arrayKey === 'preferred_industries') {
        const investorData = prev as ContactFormData;
        const currentArray = [...(investorData[arrayKey] as string[] || [])];
        currentArray[index] = value;
        
        return {
          ...prev,
          [arrayKey]: currentArray
        };
      }
      
      // Handle regular metadata arrays
      const metadata = { ...prev.metadata };
      
      if (arrayKey === 'roles' || arrayKey === 'missions') {
        if (!metadata.job_description) {
          metadata.job_description = {};
        }
        const jobDesc = { ...metadata.job_description } as Record<string, any>;
        const items = [...(jobDesc[arrayKey] || [])];  
        items[index] = value;
        
        return {
          ...prev,
          metadata: {
            ...metadata,
            job_description: {
              ...jobDesc,
              [arrayKey]: items
            }
          }
        };
      } else if (arrayKey === 'skills') {
        const skills = [...(metadata.skills || [])];
        skills[index] = value;
        
        return {
          ...prev,
          metadata: {
            ...metadata,
            skills
          }
        };
      }
      
      return prev;
    });
  };

  // Validate form data before submission
  const validateForm = () => {
    // Check required fields
    if (!formData.first_name?.trim()) {
      return { valid: false, message: 'First name is required' };
    }
    if (!formData.last_name?.trim()) {
      return { valid: false, message: 'Last name is required' };
    }
    if (!formData.status) {
      return { valid: false, message: 'Status is required' };
    }
    
    // Type-specific validation
    if (contactType === 'member' && !formData.position?.trim()) {
      return { valid: false, message: 'Position is required for members' };
    }
    
    return { valid: true };
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Validate form data
    const validation = validateForm();
    if (!validation.valid) {
      setAlert({
        show: true,
        type: 'error',
        message: validation.message || 'Please fill in all required fields'
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Prepare data for submission
      const dataToSubmit: Partial<BaseContact> = {};
      
      // Copy standard fields
      const standardFields = [
        'id', 'first_name', 'last_name', 'email', 'phone', 
        'company', 'position', 'notes', 'status', 'tags'
      ];
      
      standardFields.forEach(field => {
        if (formData[field as keyof ContactFormData] !== undefined) {
          (dataToSubmit as any)[field] = formData[field as keyof ContactFormData];
        }
      });
      
      // Ensure type is set correctly and explicitly
      dataToSubmit.type = contactType as ContactType;
      
      // Copy metadata
      dataToSubmit.metadata = { ...formData.metadata };
      
      // Handle member contact specific fields
      if (contactType === 'member') {
        // Handle join date - store in metadata.join_date
        if (formData.joined_at) {
          dataToSubmit.metadata.join_date = formData.joined_at;
        }
        
        // Ensure required metadata fields exist
        if (!dataToSubmit.metadata.department) dataToSubmit.metadata.department = '';
        
        // Initialize arrays if they don't exist
        if (!dataToSubmit.metadata.responsibilities) dataToSubmit.metadata.responsibilities = [];
        
        // Handle job description
        if (!dataToSubmit.metadata.job_description) {
          dataToSubmit.metadata.job_description = {
            summary: '',
            roles: [],
            missions: []
          };
        } else {
          // Ensure all job_description fields exist
          // Use type assertion to ensure TypeScript knows the structure
          const jobDesc = dataToSubmit.metadata.job_description as {
            summary?: string;
            roles?: unknown[];
            missions?: unknown[];
          };
          if (!jobDesc.summary) jobDesc.summary = '';
          if (!jobDesc.roles) jobDesc.roles = [];
          if (!jobDesc.missions) jobDesc.missions = [];
        }
        
        // Ensure languages and education are arrays
        if (!dataToSubmit.metadata.languages) dataToSubmit.metadata.languages = [];
        if (!dataToSubmit.metadata.education) dataToSubmit.metadata.education = [];
      }
      
      // Handle investor-specific fields
      if (contactType === 'investor') {
        const investorFields = [
          'investment_stage', 'investment_status', 'investment_focus',
          'portfolio_companies', 'preferred_industries', 'minimum_check_size',
          'maximum_check_size', 'last_contact_date'
        ];
        
        investorFields.forEach(field => {
          if (formData[field as keyof ContactFormData] !== undefined) {
            (dataToSubmit as any)[field] = formData[field as keyof ContactFormData];
          }
        });
        
        // Ensure investor-specific arrays are properly initialized
        if (!(dataToSubmit as any).investment_focus) (dataToSubmit as any).investment_focus = [];
        if (!(dataToSubmit as any).portfolio_companies) (dataToSubmit as any).portfolio_companies = [];
        if (!(dataToSubmit as any).preferred_industries) (dataToSubmit as any).preferred_industries = [];
      }
      
      console.log('Submitting contact data:', JSON.stringify(dataToSubmit, null, 2));
      await onSubmit(dataToSubmit);
      
      setAlert({
        show: true,
        type: 'success',
        message: `${isEditing ? 'Updated' : 'Added'} ${contactType} successfully!`
      });
      setTimeout(() => {
        setAlert({ show: false });
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error submitting form:', error);
      setAlert({
        show: true,
        type: 'error',
        message: `Failed to ${isEditing ? 'update' : 'add'} ${contactType}. ${error instanceof Error ? error.message : 'Please try again.'}`
      });
      setTimeout(() => setAlert({ show: false }), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Render form fields based on contact type
  const renderFormFields = () => {
    // Common fields for all contact types
    const commonFields = (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First Name*</Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name*</Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name || ''}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Status*</Label>
            <Select
              value={formData.status || 'active'}
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </>
    );

    // Type-specific fields
    switch (contactType) {
      case 'member':
        return (
          <>
            {commonFields}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Position*</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="metadata.department">Department</Label>
                <Input
                  id="metadata.department"
                  name="metadata.department"
                  value={formData.metadata?.department || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="metadata.join_date">Join Date</Label>
              <Input
                id="metadata.join_date"
                name="metadata.join_date"
                type="date"
                value={formData.metadata?.join_date ? new Date(formData.metadata.join_date).toISOString().split('T')[0] : (formData as any).joined_at ? new Date((formData as any).joined_at).toISOString().split('T')[0] : ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Responsibilities</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addArrayItem('', 'responsibilities')}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {formData.metadata?.responsibilities?.map((responsibility: string, index: number) => (
                <div key={index} className="flex items-center mb-2">
                  <Input
                    value={responsibility}
                    onChange={(e) => handleStringArrayItemChange('responsibilities', index, e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeArrayItem('', 'responsibilities', index)}
                    className="ml-2"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <Label>Job Description</Label>
              <div className="mt-2 space-y-4 border rounded-md p-4">
                <div>
                  <Label htmlFor="metadata.job_description.summary">Summary</Label>
                  <Textarea
                    id="metadata.job_description.summary"
                    name="metadata.job_description.summary"
                    value={formData.metadata?.job_description?.summary || ''}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Roles</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => addArrayItem('job_description', 'roles')}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  {formData.metadata?.job_description?.roles?.map((role: string, index: number) => (
                    <div key={index} className="flex items-center mb-2">
                      <Input
                        value={role}
                        onChange={(e) => handleArrayItemChange('', 'job_description.roles', index, '', e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeArrayItem('job_description', 'roles', index)}
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Missions</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => addArrayItem('job_description', 'missions')}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  {formData.metadata?.job_description?.missions?.map((mission: string, index: number) => (
                    <div key={index} className="flex items-center mb-2">
                      <Input
                        value={mission}
                        onChange={(e) => handleArrayItemChange('', 'job_description.missions', index, '', e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeArrayItem('job_description', 'missions', index)}
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Languages</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addArrayItem('', 'languages')}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {formData.metadata?.languages?.map((lang: {language: string, level: string}, index: number) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    placeholder="Language"
                    value={lang.language}
                    onChange={(e) => handleArrayItemChange('', 'languages', index, 'language', e.target.value)}
                    className="flex-1"
                  />
                  <Select
                    value={lang.level}
                    onValueChange={(value) => handleArrayItemChange('', 'languages', index, 'level', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="fluent">Fluent</SelectItem>
                      <SelectItem value="native">Native</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeArrayItem('', 'languages', index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Education</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addArrayItem('', 'education')}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {formData.metadata?.education?.map((edu: {degree: string, institution: string, year: string}, index: number) => (
                <div key={index} className="border rounded-md p-3 mb-3">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Input
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => handleArrayItemChange('', 'education', index, 'degree', e.target.value)}
                    />
                    <Input
                      placeholder="Year"
                      value={edu.year}
                      onChange={(e) => handleArrayItemChange('', 'education', index, 'year', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => handleArrayItemChange('', 'education', index, 'institution', e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeArrayItem('', 'education', index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      
      case 'freelance':
        return (
          <>
            {commonFields}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Expertise*</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="metadata.availability">Availability</Label>
                <Select
                  value={formData.metadata?.availability || ''}
                  onValueChange={(value) => handleSelectChange('metadata.availability', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="metadata.hourly_rate">Hourly Rate (€)</Label>
                <Input
                  id="metadata.hourly_rate"
                  name="metadata.hourly_rate"
                  type="number"
                  value={formData.metadata?.hourly_rate || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="metadata.daily_rate">Daily Rate (€)</Label>
                <Input
                  id="metadata.daily_rate"
                  name="metadata.daily_rate"
                  type="number"
                  value={formData.metadata?.daily_rate || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Skills</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addArrayItem('', 'skills')}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {formData.metadata?.skills?.map((skill: string, index: number) => (
                <div key={index} className="flex items-center mb-2">
                  <Input
                    value={skill}
                    onChange={(e) => handleStringArrayItemChange('skills', index, e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeArrayItem('', 'skills', index)}
                    className="ml-2"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Experience</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addArrayItem('', 'experience')}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {formData.metadata?.experience?.map((exp: {company: string, role: string, duration: string, description: string}, index: number) => (
                <div key={index} className="border rounded-md p-3 mb-3">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => handleArrayItemChange('', 'experience', index, 'company', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input
                        value={exp.role}
                        onChange={(e) => handleArrayItemChange('', 'experience', index, 'role', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <Label>Duration</Label>
                    <Input
                      value={exp.duration}
                      onChange={(e) => handleArrayItemChange('', 'experience', index, 'duration', e.target.value)}
                      placeholder="e.g. Jan 2020 - Dec 2021"
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label>Description</Label>
                    <div className="flex items-start">
                      <Textarea
                        value={exp.description}
                        onChange={(e) => handleArrayItemChange('', 'experience', index, 'description', e.target.value)}
                        className="flex-1"
                        rows={2}
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeArrayItem('', 'experience', index)}
                        className="ml-2 mt-1"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      
      case 'partner':
        return (
          <>
            {commonFields}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company*</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="metadata.partnership_type">Partnership Type</Label>
                <Select
                  value={formData.metadata?.partnership_type || ''}
                  onValueChange={(value) => handleSelectChange('metadata.partnership_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strategic">Strategic</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="distribution">Distribution</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="metadata.since">Partnership Since</Label>
                <Input
                  id="metadata.since"
                  name="metadata.since"
                  type="date"
                  value={formData.metadata?.since || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        );
      
      case 'board-member':
        return (
          <>
            {commonFields}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Position*</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Company*</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="joined_at">Joined Board Date</Label>
              <Input
                id="joined_at"
                name="joined_at"
                type="date"
                value={(formData as any).joined_at ? new Date((formData as any).joined_at).toISOString().split('T')[0] : ''}
                onChange={handleChange}
              />
            </div>
          </>
        );
      
      case 'investor':
        return (
          <>
            {commonFields}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="investment_stage">Investment Stage</Label>
                <Select
                  value={formData.investment_stage || ''}
                  onValueChange={(value) => handleSelectChange('investment_stage', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select investment stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seed">Seed</SelectItem>
                    <SelectItem value="series-a">Series A</SelectItem>
                    <SelectItem value="series-b">Series B</SelectItem>
                    <SelectItem value="series-c">Series C</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                    <SelectItem value="private-equity">Private Equity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="investment_status">Investment Status</Label>
                <Select
                  value={formData.investment_status || ''}
                  onValueChange={(value) => handleSelectChange('investment_status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="following">Following</SelectItem>
                    <SelectItem value="not-interested">Not Interested</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minimum_check_size">Minimum Check Size ($)</Label>
                <Input
                  id="minimum_check_size"
                  name="minimum_check_size"
                  type="number"
                  value={formData.minimum_check_size || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="maximum_check_size">Maximum Check Size ($)</Label>
                <Input
                  id="maximum_check_size"
                  name="maximum_check_size"
                  type="number"
                  value={formData.maximum_check_size || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="last_contact_date">Last Contact Date</Label>
              <Input
                id="last_contact_date"
                name="last_contact_date"
                type="date"
                value={formData.last_contact_date ? new Date(formData.last_contact_date).toISOString().split('T')[0] : ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Investment Focus</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addArrayItem('', 'investment_focus')}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {formData.investment_focus?.map((focus: string, index: number) => (
                <div key={index} className="flex items-center mb-2">
                  <Input
                    value={focus}
                    onChange={(e) => handleStringArrayItemChange('investment_focus', index, e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeArrayItem('', 'investment_focus', index)}
                    className="ml-2"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Portfolio Companies</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addArrayItem('', 'portfolio_companies')}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {formData.portfolio_companies?.map((company: string, index: number) => (
                <div key={index} className="flex items-center mb-2">
                  <Input
                    value={company}
                    onChange={(e) => handleStringArrayItemChange('portfolio_companies', index, e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeArrayItem('', 'portfolio_companies', index)}
                    className="ml-2"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Preferred Industries</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addArrayItem('', 'preferred_industries')}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {formData.preferred_industries?.map((industry: string, index: number) => (
                <div key={index} className="flex items-center mb-2">
                  <Input
                    value={industry}
                    onChange={(e) => handleStringArrayItemChange('preferred_industries', index, e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeArrayItem('', 'preferred_industries', index)}
                    className="ml-2"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </>
        );
      
      default:
        return commonFields;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            {isEditing ? `Edit ${contactType}` : `Add new ${contactType}`}
          </DialogTitle>
        </DialogHeader>
        
        {alert.show && (
          <Alert variant={alert.type === 'error' ? 'destructive' : 'default'} className={alert.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}>
            {alert.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
          {renderFormFields()}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-white"
            disabled={isLoading}
          >
            {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update' : 'Add'} {contactType}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
