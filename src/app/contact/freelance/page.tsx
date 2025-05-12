'use client';

import React, { useState } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { useFreelancerStore, Freelancer } from '@/lib/freelancers-state';
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

export default function FreelancersPage() {
  const { freelancers, addFreelancer, updateFreelancer, removeFreelancer } = useFreelancerStore();
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Freelancer>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFreelancers = freelancers.filter(freelancer => {
    const searchLower = searchQuery.toLowerCase();
    return (
      freelancer.name.toLowerCase().includes(searchLower) ||
      freelancer.position.toLowerCase().includes(searchLower) ||
      freelancer.department.toLowerCase().includes(searchLower) ||
      freelancer.location.toLowerCase().includes(searchLower) ||
      freelancer.skills.some(skill => skill.toLowerCase().includes(searchLower))
    );
  });

  const handleAddFreelancer = () => {
    if (editForm.name && editForm.position && editForm.email) {
      const newFreelancer: Freelancer = {
        id: Date.now().toString(),
        name: editForm.name,
        position: editForm.position,
        email: editForm.email,
        phone: editForm.phone || '',
        department: editForm.department || '',
        location: editForm.location || '',
        rate: editForm.rate || '',
        availability: editForm.availability || '',
        skills: editForm.skills || [],
        languages: editForm.languages || [],
        experience: editForm.experience || [],
        education: editForm.education || [],
      };
      addFreelancer(newFreelancer);
      setIsAdding(false);
      setEditForm({});
    }
  };

  const handleUpdateFreelancer = () => {
    if (selectedFreelancer && editForm) {
      updateFreelancer(selectedFreelancer.id, editForm);
      setIsEditing(false);
      setSelectedFreelancer(null);
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
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Freelancers</h2>
              <p className="text-muted-foreground">
                Manage freelancers and their assignments
              </p>
            </div>
            <Button 
              onClick={() => {
                setIsAdding(true);
                setEditForm({});
              }}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Add Freelancer
            </Button>
          </div>

          <div className="mb-6">
            <Input
              placeholder="Search freelancers..."
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
                  <TableHead>Position</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFreelancers.map((freelancer) => (
                  <TableRow key={freelancer.id} className="border-gray-200 dark:border-gray-700">
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {freelancer.name}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground">
                        {freelancer.position}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {freelancer.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="border-gray-200 dark:border-gray-700">
                            {skill}
                          </Badge>
                        ))}
                        {freelancer.skills.length > 3 && (
                          <Badge variant="outline" className="border-gray-200 dark:border-gray-700">
                            +{freelancer.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {freelancer.rate}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {freelancer.availability}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedFreelancer(freelancer)}
                        title="View Profile"
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        👀
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedFreelancer(freelancer);
                          setEditForm(freelancer);
                          setIsEditing(true);
                        }}
                        title="Edit Freelancer"
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('Are you sure you want to remove this freelancer?')) {
                            removeFreelancer(freelancer.id);
                          }
                        }}
                        title="Delete Freelancer"
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
          <Dialog open={selectedFreelancer !== null && !isEditing} onOpenChange={(open) => !open && setSelectedFreelancer(null)}>
            <DialogContent className="max-w-2xl bg-white dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">Freelancer Profile</DialogTitle>
              </DialogHeader>
              {selectedFreelancer && (
                <div className="grid gap-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Contact Information</h3>
                    <div className="grid gap-2">
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Email</Label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedFreelancer.email}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Phone</Label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedFreelancer.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Skills</h3>
                    <div className="flex gap-2 flex-wrap">
                      {selectedFreelancer.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Languages</h3>
                    <div className="flex gap-2">
                      {selectedFreelancer.languages.map((lang, index) => (
                        <Badge key={index} variant="secondary" className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                          {lang.language} ({lang.level})
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Experience</h3>
                    <div className="space-y-4">
                      {selectedFreelancer.experience.map((exp, index) => (
                        <div key={index} className="space-y-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{exp.role} at {exp.company}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{exp.duration}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Education</h3>
                    <div className="space-y-2">
                      {selectedFreelancer.education.map((edu, index) => (
                        <div key={index}>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{edu.degree}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {edu.institution}, {edu.year}
                          </p>
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
                  {isAdding ? 'Add Freelancer' : 'Edit Freelancer'}
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
                  <Label htmlFor="position" className="text-gray-600 dark:text-gray-300">Position</Label>
                  <Input
                    id="position"
                    value={editForm.position || ''}
                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-gray-600 dark:text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-gray-600 dark:text-gray-300">Phone</Label>
                  <Input
                    id="phone"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rate" className="text-gray-600 dark:text-gray-300">Rate</Label>
                  <Input
                    id="rate"
                    value={editForm.rate || ''}
                    onChange={(e) => setEditForm({ ...editForm, rate: e.target.value })}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="availability" className="text-gray-600 dark:text-gray-300">Availability</Label>
                  <Input
                    id="availability"
                    value={editForm.availability || ''}
                    onChange={(e) => setEditForm({ ...editForm, availability: e.target.value })}
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
                  onClick={isAdding ? handleAddFreelancer : handleUpdateFreelancer}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {isAdding ? 'Add Freelancer' : 'Update Freelancer'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
