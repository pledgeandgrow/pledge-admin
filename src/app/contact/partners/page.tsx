'use client';

import React, { useState } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { usePartnerStore, Partner } from '@/lib/partners-state';
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

export default function PartnersPage() {
  const { partners, addPartner, updatePartner, removePartner } = usePartnerStore();
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Partner>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPartners = partners.filter(partner => {
    const searchLower = searchQuery.toLowerCase();
    return (
      partner.name.toLowerCase().includes(searchLower) ||
      partner.type.toLowerCase().includes(searchLower) ||
      partner.industry.toLowerCase().includes(searchLower) ||
      partner.location.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status: Partner['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getLevelColor = (level: Partner['partnershipDetails']['level']) => {
    switch (level) {
      case 'Gold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Silver':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'Bronze':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleAddPartner = () => {
    if (editForm.name && editForm.type && editForm.contact?.email) {
      const newPartner: Partner = {
        id: Date.now().toString(),
        name: editForm.name,
        type: editForm.type,
        status: editForm.status || 'Pending',
        startDate: editForm.startDate || new Date().toISOString().slice(0, 7),
        contact: editForm.contact || {
          name: '',
          position: '',
          email: '',
          phone: ''
        },
        location: editForm.location || '',
        industry: editForm.industry || '',
        advantagesFromUs: editForm.advantagesFromUs || [],
        advantagesToUs: editForm.advantagesToUs || [],
        partnershipDetails: editForm.partnershipDetails || {
          level: 'Bronze',
          revenue: { amount: 0, currency: 'EUR' },
          projectsCompleted: 0,
          activeProjects: 0
        },
        agreements: editForm.agreements || [],
        technologies: editForm.technologies || [],
        certifications: editForm.certifications || [],
        upcomingMilestones: editForm.upcomingMilestones || []
      };
      addPartner(newPartner);
      setIsAdding(false);
      setEditForm({});
    }
  };

  const handleUpdatePartner = () => {
    if (selectedPartner && editForm) {
      updatePartner(selectedPartner.id, editForm);
      setIsEditing(false);
      setSelectedPartner(null);
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
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Partners</h2>
              <p className="text-muted-foreground">
                Manage partnerships and track mutual benefits
              </p>
            </div>
            <Button 
              onClick={() => {
                setIsAdding(true);
                setEditForm({});
              }}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Add Partner
            </Button>
          </div>

          <div className="mb-6">
            <Input
              placeholder="Search partners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead>Partner</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner) => (
                  <TableRow key={partner.id} className="border-gray-200 dark:border-gray-700">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{partner.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{partner.industry}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground">
                        {partner.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getLevelColor(partner.partnershipDetails.level)}>
                        {partner.partnershipDetails.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(partner.status)}>
                        {partner.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {partner.startDate} - {partner.endDate || 'Present'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedPartner(partner)}
                        title="View Profile"
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        👀
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedPartner(partner);
                          setEditForm(partner);
                          setIsEditing(true);
                        }}
                        title="Edit Partner"
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('Are you sure you want to remove this partner?')) {
                            removePartner(partner.id);
                          }
                        }}
                        title="Delete Partner"
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
          <Dialog open={selectedPartner !== null && !isEditing} onOpenChange={(open) => !open && setSelectedPartner(null)}>
            <DialogContent className="max-w-2xl bg-white dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">Partner Profile</DialogTitle>
              </DialogHeader>
              {selectedPartner && (
                <div className="grid gap-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Contact Information</h3>
                    <div className="grid gap-2">
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Contact Person</Label>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {selectedPartner.contact.name} - {selectedPartner.contact.position}
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Email</Label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedPartner.contact.email}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Phone</Label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedPartner.contact.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Partnership Benefits */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Partnership Benefits</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Advantages We Provide</Label>
                        <ul className="mt-1 space-y-1">
                          {selectedPartner.advantagesFromUs.map((advantage, index) => (
                            <li key={index} className="text-sm text-gray-900 dark:text-white">
                              • {advantage}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Advantages We Receive</Label>
                        <ul className="mt-1 space-y-1">
                          {selectedPartner.advantagesToUs.map((advantage, index) => (
                            <li key={index} className="text-sm text-gray-900 dark:text-white">
                              • {advantage}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Partnership Details */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Partnership Details</h3>
                    <div className="grid gap-2">
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Revenue</Label>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: selectedPartner.partnershipDetails.revenue.currency
                          }).format(selectedPartner.partnershipDetails.revenue.amount)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Projects</Label>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {selectedPartner.partnershipDetails.projectsCompleted} completed, 
                          {selectedPartner.partnershipDetails.activeProjects} active
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Agreements */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Agreements</h3>
                    <div className="space-y-2">
                      {selectedPartner.agreements.map((agreement, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-white">{agreement.type}</p>
                          <p className="text-gray-600 dark:text-gray-300">
                            Status: {agreement.status} | Signed: {agreement.signedDate} | Expires: {agreement.expiryDate}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies & Certifications */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Technologies & Certifications</h3>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Technologies</Label>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {selectedPartner.technologies.map((tech, index) => (
                            <Badge key={index} variant="secondary" className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Certifications</Label>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {selectedPartner.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="border-gray-200 dark:border-gray-700">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Milestones */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Upcoming Milestones</h3>
                    <div className="space-y-2">
                      {selectedPartner.upcomingMilestones.map((milestone, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-white">{milestone.title} - {milestone.date}</p>
                          <p className="text-gray-600 dark:text-gray-300">{milestone.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
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
                  {isAdding ? 'Add Partner' : 'Edit Partner'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-gray-600 dark:text-gray-300">Partner Name</Label>
                  <Input
                    id="name"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type" className="text-gray-600 dark:text-gray-300">Partnership Type</Label>
                  <Input
                    id="type"
                    value={editForm.type || ''}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="industry" className="text-gray-600 dark:text-gray-300">Industry</Label>
                  <Input
                    id="industry"
                    value={editForm.industry || ''}
                    onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact-name" className="text-gray-600 dark:text-gray-300">Contact Name</Label>
                  <Input
                    id="contact-name"
                    value={editForm.contact?.name || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      contact: { ...editForm.contact, name: e.target.value }
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
                  onClick={isAdding ? handleAddPartner : handleUpdatePartner}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {isAdding ? 'Add Partner' : 'Update Partner'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
