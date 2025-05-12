'use client';

import React, { useState } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { useInvestorStore, Investor } from '@/lib/investors-state';
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

export default function InvestorsPage() {
  const { investors, addInvestor, updateInvestor, removeInvestor } = useInvestorStore();
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Investor>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvestors = investors.filter(investor => {
    const searchLower = searchQuery.toLowerCase();
    return (
      investor.name.toLowerCase().includes(searchLower) ||
      investor.type.toLowerCase().includes(searchLower) ||
      investor.profile.focus.some(f => f.toLowerCase().includes(searchLower)) ||
      investor.profile.stage.some(s => s.toLowerCase().includes(searchLower))
    );
  });

  const getStatusColor = (status: Investor['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Prospective':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Past':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleAddInvestor = () => {
    if (editForm.name && editForm.type && editForm.contact?.email) {
      const newInvestor: Investor = {
        id: Date.now().toString(),
        name: editForm.name,
        type: editForm.type as Investor['type'],
        status: editForm.status || 'Prospective',
        contact: editForm.contact || {
          name: '',
          position: '',
          email: '',
          phone: ''
        },
        location: editForm.location || '',
        website: editForm.website || '',
        portfolio: editForm.portfolio || [],
        investments: editForm.investments || [],
        profile: editForm.profile || {
          focus: [],
          stage: [],
          geography: [],
          ticketSize: {
            min: 0,
            max: 0,
            currency: 'EUR'
          }
        },
        interests: editForm.interests || [],
        expertise: editForm.expertise || [],
        notes: editForm.notes || '',
        lastContact: editForm.lastContact || new Date().toISOString().slice(0, 10),
        nextFollowUp: editForm.nextFollowUp || '',
        documents: editForm.documents || [],
        events: editForm.events || []
      };
      addInvestor(newInvestor);
      setIsAdding(false);
      setEditForm({});
    }
  };

  const handleUpdateInvestor = () => {
    if (selectedInvestor && editForm) {
      updateInvestor(selectedInvestor.id, editForm);
      setIsEditing(false);
      setSelectedInvestor(null);
      setEditForm({});
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Investors</h2>
              <p className="text-muted-foreground">
                Manage investors and track investment relationships
              </p>
            </div>
            <Button 
              onClick={() => {
                setIsAdding(true);
                setEditForm({});
              }}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Add Investor
            </Button>
          </div>

          <div className="mb-6">
            <Input
              placeholder="Search investors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead>Investor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Focus</TableHead>
                  <TableHead>Ticket Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvestors.map((investor) => (
                  <TableRow key={investor.id} className="border-gray-200 dark:border-gray-700">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{investor.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{investor.location}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground">
                        {investor.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {investor.profile.focus.slice(0, 2).map((focus, index) => (
                          <Badge key={index} variant="outline" className="border-gray-200 dark:border-gray-700">
                            {focus}
                          </Badge>
                        ))}
                        {investor.profile.focus.length > 2 && (
                          <Badge variant="outline" className="border-gray-200 dark:border-gray-700">
                            +{investor.profile.focus.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(investor.profile.ticketSize.min, investor.profile.ticketSize.currency)} - 
                      {formatCurrency(investor.profile.ticketSize.max, investor.profile.ticketSize.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(investor.status)}>
                        {investor.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {investor.lastContact}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedInvestor(investor)}
                        title="View Profile"
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        👀
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedInvestor(investor);
                          setEditForm(investor);
                          setIsEditing(true);
                        }}
                        title="Edit Investor"
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('Are you sure you want to remove this investor?')) {
                            removeInvestor(investor.id);
                          }
                        }}
                        title="Delete Investor"
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
          <Dialog open={selectedInvestor !== null && !isEditing} onOpenChange={(open) => !open && setSelectedInvestor(null)}>
            <DialogContent className="max-w-2xl bg-white dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">Investor Profile</DialogTitle>
              </DialogHeader>
              {selectedInvestor && (
                <div className="grid gap-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Contact Information</h3>
                    <div className="grid gap-2">
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Contact Person</Label>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {selectedInvestor.contact.name} - {selectedInvestor.contact.position}
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Email</Label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedInvestor.contact.email}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Phone</Label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedInvestor.contact.phone}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Website</Label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedInvestor.website}</p>
                      </div>
                    </div>
                  </div>

                  {/* Investment Profile */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Investment Profile</h3>
                    <div className="grid gap-4">
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Focus Areas</Label>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {selectedInvestor.profile.focus.map((focus, index) => (
                            <Badge key={index} variant="secondary" className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                              {focus}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Investment Stages</Label>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {selectedInvestor.profile.stage.map((stage, index) => (
                            <Badge key={index} variant="outline" className="border-gray-200 dark:border-gray-700">
                              {stage}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Geography</Label>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {selectedInvestor.profile.geography.map((geo, index) => (
                            <Badge key={index} variant="outline" className="border-gray-200 dark:border-gray-700">
                              {geo}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Portfolio Companies</h3>
                    <div className="space-y-2">
                      {selectedInvestor.portfolio.map((company, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-white">{company.companyName}</p>
                          <p className="text-gray-600 dark:text-gray-300">
                            {company.industry} • {company.stage}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Past Investments */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Past Investments</h3>
                    <div className="space-y-2">
                      {selectedInvestor.investments.map((investment, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(investment.amount, investment.currency)} • {investment.type}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">
                            Date: {investment.date} • Equity: {investment.equity}% • 
                            Valuation: {formatCurrency(investment.valuation, investment.currency)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Events & Follow-ups */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Events & Follow-ups</h3>
                    <div className="space-y-2">
                      {selectedInvestor.events.map((event, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {event.title} - {event.date}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">
                            Type: {event.type} • {event.notes}
                          </p>
                        </div>
                      ))}
                      {selectedInvestor.nextFollowUp && (
                        <div className="mt-2">
                          <Label className="text-gray-600 dark:text-gray-300">Next Follow-up</Label>
                          <p className="text-sm text-gray-900 dark:text-white">{selectedInvestor.nextFollowUp}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedInvestor.notes && (
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Notes</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedInvestor.notes}</p>
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
                  {isAdding ? 'Add Investor' : 'Edit Investor'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-gray-600 dark:text-gray-300">Investor Name</Label>
                  <Input
                    id="name"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type" className="text-gray-600 dark:text-gray-300">Investor Type</Label>
                  <Input
                    id="type"
                    value={editForm.type || ''}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value as Investor['type'] })}
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
                  onClick={isAdding ? handleAddInvestor : handleUpdateInvestor}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {isAdding ? 'Add Investor' : 'Update Investor'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
