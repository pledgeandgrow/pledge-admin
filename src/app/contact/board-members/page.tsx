'use client';

import React, { useState } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBoardMemberStore, BoardMember } from '@/lib/board-members-state';

export default function BoardMembersPage() {
  const { boardMembers, addBoardMember, updateBoardMember, removeBoardMember } = useBoardMemberStore();
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [editForm, setEditForm] = useState<Partial<BoardMember>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const departments = Array.from(new Set(boardMembers.map(member => member.department)));
  const locations = Array.from(new Set(boardMembers.map(member => member.location)));

  const filteredMembers = boardMembers.filter(member => {
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    const matchesLocation = locationFilter === 'all' || member.location === locationFilter;
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesLocation && matchesSearch;
  });

  const handleAddMember = () => {
    if (!editForm.name || !editForm.position || !editForm.email) return;

    const newMember: BoardMember = {
      id: Date.now().toString(),
      name: editForm.name,
      position: editForm.position,
      email: editForm.email,
      phone: editForm.phone || '',
      location: editForm.location || '',
      department: editForm.department || '',
      status: 'Active',
      responsibilities: [],
      languages: [],
      education: [],
      jobDescription: {
        summary: `En tant que ${editForm.position}, contribuer au développement et à la croissance de l'entreprise.`,
        roles: [],
        missions: []
      }
    };

    addBoardMember(newMember);
    setIsAdding(false);
    setEditForm({});
  };

  const handleUpdateMember = () => {
    if (!selectedMember || !editForm) return;
    updateBoardMember(selectedMember.id, editForm);
    setSelectedMember(null);
    setIsEditing(false);
    setEditForm({});
  };

  const handleRemoveMember = (id: string) => {
    if (confirm('Are you sure you want to remove this board member?')) {
      removeBoardMember(id);
      setSelectedMember(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Board Members</h2>
              <p className="text-muted-foreground">
                Manage board members and their roles
              </p>
            </div>
            <Button 
              onClick={() => {
                setIsAdding(true);
                setEditForm({});
              }}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Add Board Member
            </Button>
          </div>

          <div className="mb-6">
            <Input
              placeholder="Search board members..."
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
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id} className="border-gray-200 dark:border-gray-700">
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground">
                        {member.position}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-gray-200 dark:border-gray-700">
                        {member.department}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {member.location}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedMember(member)}
                        title="View Profile"
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        👀
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedMember(member);
                          setEditForm(member);
                          setIsEditing(true);
                        }}
                        title="Edit Member"
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('Are you sure you want to remove this member?')) {
                            removeBoardMember(member.id);
                          }
                        }}
                        title="Delete Member"
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
          <Dialog open={selectedMember !== null && !isEditing} onOpenChange={(open) => !open && setSelectedMember(null)}>
            <DialogContent className="max-w-2xl bg-white dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">Board Member Profile</DialogTitle>
              </DialogHeader>
              {selectedMember && (
                <div className="grid gap-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Contact Information</h3>
                    <div className="grid gap-2">
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Email</Label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedMember.email}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Phone</Label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedMember.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Fiche de Poste */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Fiche de Poste</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Description du Poste</Label>
                        <p className="text-sm mt-1 text-gray-900 dark:text-white">
                          {selectedMember.jobDescription?.summary}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Rôles</Label>
                        <ul className="list-disc list-inside text-sm mt-1 space-y-1 text-gray-900 dark:text-white">
                          {selectedMember.jobDescription?.roles.map((role, index) => (
                            <li key={index}>{role}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <Label className="text-gray-600 dark:text-gray-300">Missions</Label>
                        <ul className="list-disc list-inside text-sm mt-1 space-y-1 text-gray-900 dark:text-white">
                          {selectedMember.jobDescription?.missions.map((mission, index) => (
                            <li key={index}>{mission}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Languages</h3>
                    <div className="flex gap-2">
                      {selectedMember.languages.map((lang, index) => (
                        <Badge key={index} variant="secondary" className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                          {lang.language} ({lang.level})
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Education</h3>
                    <div className="space-y-2">
                      {selectedMember.education.map((edu, index) => (
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
                  {isAdding ? 'Add Board Member' : 'Edit Board Member'}
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
                  <Label htmlFor="department" className="text-gray-600 dark:text-gray-300">Department</Label>
                  <Input
                    id="department"
                    value={editForm.department || ''}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location" className="text-gray-600 dark:text-gray-300">Location</Label>
                  <Input
                    id="location"
                    value={editForm.location || ''}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
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
                  onClick={isAdding ? handleAddMember : handleUpdateMember}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {isAdding ? 'Add Board Member' : 'Update Board Member'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
