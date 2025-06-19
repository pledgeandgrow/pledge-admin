'use client';

// Theme will be used in future updates
// import { useTheme } from 'next-themes';
import { format } from 'date-fns';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useNetworkStore, NetworkContact } from '@/lib/network-state';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// Commented out unused imports to fix build errors
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { ContactDetails } from '@/components/contact/ContactDetails';
import React, { useState } from 'react';

export default function NetworkPage() {
  // Removed unused theme variable
  // const { theme } = useTheme();
  const { contacts, addContact, updateContact, removeContact } = useNetworkStore();
  const [selectedContact, setSelectedContact] = useState<NetworkContact | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<NetworkContact>>({});
  const [searchQuery, setSearchQuery] = useState('');
  // Removed unused activeTab state
  // const [activeTab, setActiveTab] = useState('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchLower) ||
      contact.title.toLowerCase().includes(searchLower) ||
      contact.company.toLowerCase().includes(searchLower) ||
      contact.expertise.some(e => e.toLowerCase().includes(searchLower)) ||
      contact.tags.some(t => t.toLowerCase().includes(searchLower));

    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && contact.status === filterStatus;
  });

  const getStatusColor = (status: NetworkContact['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Potential':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleSave = (isNew: boolean) => {
    if (isNew) {
      addContact({
        ...editForm,
        id: crypto.randomUUID(),
        interactions: [],
        opportunities: [],
      } as NetworkContact);
    } else if (selectedContact) {
      updateContact(selectedContact.id, editForm);
    }
    setIsAdding(false);
    setIsEditing(false);
    setSelectedContact(null);
    setEditForm({});
  };

  const deleteContact = (id: string) => {
    removeContact(id);
    setSelectedContact(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Network</h2>
              <p className="text-muted-foreground">
                Manage your professional network and track relationships
              </p>
            </div>
            <Button 
              onClick={() => {
                setIsAdding(true);
                setEditForm({});
              }}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Add Contact
            </Button>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="flex-1 max-w-sm">
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Potential">Potential</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Expertise</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id} className="border-gray-200 dark:border-gray-700">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{contact.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{contact.title}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground">
                        {contact.company}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {contact.expertise.slice(0, 2).map((exp, index) => (
                          <Badge key={index} variant="outline" className="border-gray-200 dark:border-gray-700">
                            {exp}
                          </Badge>
                        ))}
                        {contact.expertise.length > 2 && (
                          <Badge variant="outline" className="border-gray-200 dark:border-gray-700">
                            +{contact.expertise.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("font-medium", getStatusColor(contact.status))}>
                        {contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {format(new Date(contact.lastContact), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedContact(contact)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedContact(contact);
                              setIsEditing(true);
                              setEditForm(contact);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteContact(contact.id)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredContacts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-gray-500 dark:text-gray-400">
                      No contacts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* View/Edit Dialog */}
      <Dialog 
        open={selectedContact !== null} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedContact(null);
            setIsEditing(false);
            setEditForm({});
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isEditing ? 'Edit Contact' : selectedContact?.name}
            </DialogTitle>
            {!isEditing && (
              <DialogDescription>
                View and manage contact details
              </DialogDescription>
            )}
          </DialogHeader>

          {selectedContact && !isEditing && (
            <div className="grid gap-6 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {selectedContact.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedContact.title} at {selectedContact.company}
                  </p>
                </div>
                <Badge className={cn("font-medium", getStatusColor(selectedContact.status))}>
                  {selectedContact.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Contact Information</h4>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Email: </span>
                        <a href={`mailto:${selectedContact.email}`} className="text-primary hover:underline">
                          {selectedContact.email}
                        </a>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Phone: </span>
                        <a href={`tel:${selectedContact.phone}`} className="text-primary hover:underline">
                          {selectedContact.phone}
                        </a>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Location: </span>
                        {selectedContact.location}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Expertise</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedContact.expertise.map((exp, index) => (
                        <Badge key={index} variant="outline">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Interests</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedContact.interests.map((interest, index) => (
                        <Badge key={index} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Important Dates</h4>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Last Contact: </span>
                        {selectedContact.lastContact ? format(new Date(selectedContact.lastContact), 'MMMM d, yyyy') : 'Not set'}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Next Follow-up: </span>
                        {selectedContact.nextFollowUp ? format(new Date(selectedContact.nextFollowUp), 'MMMM d, yyyy') : 'Not scheduled'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Notes</h4>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedContact.notes}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedContact && isEditing && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={editForm.company || ''}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={editForm.status} 
                    onValueChange={(value) => setEditForm({ ...editForm, status: value as NetworkContact['status'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Potential">Potential</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editForm.location || ''}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expertise">Expertise (comma-separated)</Label>
                <Input
                  id="expertise"
                  value={editForm.expertise?.join(', ') || ''}
                  onChange={(e) => setEditForm({ ...editForm, expertise: e.target.value.split(',').map(item => item.trim()) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Interests (comma-separated)</Label>
                <Input
                  id="interests"
                  value={editForm.interests?.join(', ') || ''}
                  onChange={(e) => setEditForm({ ...editForm, interests: e.target.value.split(',').map(item => item.trim()) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editForm.notes || ''}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastContact">Last Contact</Label>
                  <Input
                    id="lastContact"
                    type="date"
                    value={editForm.lastContact?.split('T')[0] || ''}
                    onChange={(e) => setEditForm({ ...editForm, lastContact: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextFollowUp">Next Follow-up</Label>
                  <Input
                    id="nextFollowUp"
                    type="date"
                    value={editForm.nextFollowUp?.split('T')[0] || ''}
                    onChange={(e) => setEditForm({ ...editForm, nextFollowUp: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {isEditing ? (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({});
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={() => handleSave(false)}>
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedContact(null);
                  }}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(true);
                    // Ensure selectedContact is not null before setting form state
                    if (selectedContact) {
                      setEditForm(selectedContact);
                    }
                  }}
                >
                  Edit Contact
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Contact Dialog */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add New Contact</DialogTitle>
            <DialogDescription>
              Add a new contact to your network
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Name</Label>
                <Input
                  id="new-name"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-title">Title</Label>
                <Input
                  id="new-title"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="CEO"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-company">Company</Label>
                <Input
                  id="new-company"
                  value={editForm.company || ''}
                  onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                  placeholder="Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-status">Status</Label>
                <Select 
                  value={editForm.status} 
                  onValueChange={(value) => setEditForm({ ...editForm, status: value as NetworkContact['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Potential">Potential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-phone">Phone</Label>
                <Input
                  id="new-phone"
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-location">Location</Label>
              <Input
                id="new-location"
                value={editForm.location || ''}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                placeholder="City, Country"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-expertise">Expertise (comma-separated)</Label>
              <Input
                id="new-expertise"
                value={editForm.expertise?.join(', ') || ''}
                onChange={(e) => setEditForm({ ...editForm, expertise: e.target.value.split(',').map(item => item.trim()) })}
                placeholder="AI, Machine Learning, Cloud Computing"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-interests">Interests (comma-separated)</Label>
              <Input
                id="new-interests"
                value={editForm.interests?.join(', ') || ''}
                onChange={(e) => setEditForm({ ...editForm, interests: e.target.value.split(',').map(item => item.trim()) })}
                placeholder="Technology, Startups, Innovation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-notes">Notes</Label>
              <Textarea
                id="new-notes"
                value={editForm.notes || ''}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="Add any relevant notes about the contact..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setEditForm({});
                }}
              >
                Cancel
              </Button>
              <Button onClick={() => handleSave(true)}>
                Add Contact
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
