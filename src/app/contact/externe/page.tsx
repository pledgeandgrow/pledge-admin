'use client';

import React, { useState } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { useExternalStore, External } from '@/lib/externals-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function ExternalsPage() {
  const { externals, addExternal, updateExternal, removeExternal } = useExternalStore();
  const [selectedExternal, setSelectedExternal] = useState<External | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<External>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExternals = externals.filter(external => {
    const searchLower = searchQuery.toLowerCase();
    return (
      external.name.toLowerCase().includes(searchLower) ||
      external.type.toLowerCase().includes(searchLower) ||
      external.expertise.some(e => e.toLowerCase().includes(searchLower)) ||
      external.services.some(s => s.toLowerCase().includes(searchLower))
    );
  });

  const getStatusColor = (status: External['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Available':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Unavailable':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Past':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddExternal = () => {
    if (editForm.name && editForm.type && editForm.contact?.email) {
      const newExternal: External = {
        id: Date.now().toString(),
        name: editForm.name,
        type: editForm.type as External['type'],
        status: editForm.status || 'Available',
        contact: editForm.contact || {
          name: '',
          position: '',
          email: '',
          phone: ''
        },
        company: editForm.company || {
          name: '',
          website: '',
          location: '',
          size: '',
          founded: ''
        },
        expertise: editForm.expertise || [],
        services: editForm.services || [],
        projects: editForm.projects || [],
        contracts: editForm.contracts || [],
        performance: editForm.performance || {
          rating: 0,
          reviews: [],
          strengths: [],
          areas_for_improvement: []
        },
        financials: editForm.financials || {
          rateRange: {
            min: 0,
            max: 0,
            currency: 'EUR'
          },
          totalBilled: 0,
          outstandingAmount: 0,
          currency: 'EUR'
        },
        compliance: editForm.compliance || {
          insurance: [],
          certifications: [],
          documents: []
        },
        notes: editForm.notes || '',
        lastContact: editForm.lastContact || new Date().toISOString().slice(0, 10),
        nextFollowUp: editForm.nextFollowUp
      };
      addExternal(newExternal);
      setIsAdding(false);
      setEditForm({});
    }
  };

  const handleUpdateExternal = () => {
    if (selectedExternal && editForm) {
      updateExternal(selectedExternal.id, editForm);
      setIsEditing(false);
      setSelectedExternal(null);
      setEditForm({});
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">External Partners</h2>
              <p className="text-muted-foreground">
                Manage external contractors, agencies, and service providers
              </p>
            </div>
            <Button 
              onClick={() => {
                setIsAdding(true);
                setEditForm({});
              }}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Add External Partner
            </Button>
          </div>

          <div className="mb-6">
            <Input
              placeholder="Search externals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Expertise</TableHead>
                  <TableHead>Rate Range</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExternals.map((external) => (
                  <TableRow key={external.id} className="border-gray-200 dark:border-gray-700">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{external.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{external.company.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground">
                        {external.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {external.expertise.slice(0, 2).map((exp, index) => (
                          <Badge key={index} variant="outline" className="border-gray-200 dark:border-gray-700">
                            {exp}
                          </Badge>
                        ))}
                        {external.expertise.length > 2 && (
                          <Badge variant="outline" className="border-gray-200 dark:border-gray-700">
                            +{external.expertise.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(external.financials.rateRange.min, external.financials.currency)} - 
                      {formatCurrency(external.financials.rateRange.max, external.financials.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(external.status)}>
                        {external.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {external.lastContact}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedExternal(external)}
                        title="View Profile"
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        👀
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedExternal(external);
                          setEditForm(external);
                          setIsEditing(true);
                        }}
                        title="Edit External"
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('Are you sure you want to remove this external partner?')) {
                            removeExternal(external.id);
                          }
                        }}
                        title="Delete External"
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        🗑️
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* View Dialog */}
          <Dialog open={selectedExternal !== null && !isEditing} onOpenChange={(open) => !open && setSelectedExternal(null)}>
            <DialogContent className="max-w-2xl bg-white dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">External Partner Profile</DialogTitle>
              </DialogHeader>
              {selectedExternal && (
                <div className="grid gap-6">
                  {/* Company Information */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Company Information</h3>
                    <div className="grid gap-2">
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Company Name</Label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedExternal.company.name}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Website</Label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedExternal.company.website}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Location</Label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedExternal.company.location}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Company Size</Label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedExternal.company.size}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Contact Information</h3>
                    <div className="grid gap-2">
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Contact Person</Label>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {selectedExternal.contact.name} - {selectedExternal.contact.position}
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Email</Label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedExternal.contact.email}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Phone</Label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedExternal.contact.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Expertise & Services */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Expertise & Services</h3>
                    <div className="grid gap-4">
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Areas of Expertise</Label>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {selectedExternal.expertise.map((exp, index) => (
                            <Badge key={index} variant="secondary" className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                              {exp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Services Offered</Label>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {selectedExternal.services.map((service, index) => (
                            <Badge key={index} variant="outline" className="border-gray-200 dark:border-gray-700">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Projects */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Projects</h3>
                    <div className="space-y-2">
                      {selectedExternal.projects.map((project, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {project.name} - {project.status}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">
                            Budget: {formatCurrency(project.budget.amount, project.budget.currency)} • 
                            Duration: {project.startDate} - {project.endDate || 'Ongoing'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Performance</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Overall Rating</Label>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {selectedExternal.performance.rating} / 5
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Strengths</Label>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {selectedExternal.performance.strengths.map((strength, index) => (
                            <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Areas for Improvement</Label>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {selectedExternal.performance.areas_for_improvement.map((area, index) => (
                            <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compliance */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Compliance & Documentation</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Insurance</Label>
                        <div className="space-y-2">
                          {selectedExternal.compliance.insurance.map((ins, index) => (
                            <div key={index} className="text-sm">
                              <p className="font-medium text-gray-900 dark:text-white">{ins.type}</p>
                              <p className="text-gray-600 dark:text-gray-300">
                                Provider: {ins.provider} • Coverage: {formatCurrency(ins.coverage, 'EUR')} •
                                Expires: {ins.expiryDate}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Certifications</Label>
                        <div className="space-y-2">
                          {selectedExternal.compliance.certifications.map((cert, index) => (
                            <div key={index} className="text-sm">
                              <p className="font-medium text-gray-900 dark:text-white">{cert.name}</p>
                              <p className="text-gray-600 dark:text-gray-300">
                                Issuer: {cert.issuer} • Date: {cert.date} •
                                {cert.expiryDate ? ` Expires: ${cert.expiryDate}` : ' No expiration'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedExternal.notes && (
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Notes</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedExternal.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Add/Edit Dialog */}
          <Dialog open={isAdding || isEditing} onOpenChange={(open) => {
            if (!open) {
              setIsAdding(false);
              setIsEditing(false);
              setEditForm({});
            }
          }}>
            <DialogContent className="bg-white dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">
                  {isAdding ? 'Add External Partner' : 'Edit External Partner'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-gray-600 dark:text-gray-300">Name</Label>
                  <Input
                    id="name"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type" className="text-gray-600 dark:text-gray-300">Type</Label>
                  <Input
                    id="type"
                    value={editForm.type || ''}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value as External['type'] })}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company-name" className="text-gray-600 dark:text-gray-300">Company Name</Label>
                  <Input
                    id="company-name"
                    value={editForm.company?.name || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      company: { ...editForm.company, name: e.target.value }
                    })}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact-email" className="text-gray-600 dark:text-gray-300">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={editForm.contact?.email || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      contact: { ...editForm.contact, email: e.target.value }
                    })}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAdding(false);
                    setIsEditing(false);
                    setEditForm({});
                  }}
                  className="border-gray-300 dark:border-gray-700"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={isAdding ? handleAddExternal : handleUpdateExternal}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {isAdding ? 'Add External Partner' : 'Update External Partner'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
