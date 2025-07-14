'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BaseContact, 
  ContactType, 
  InvestorContact,
  getFullName, 
  getContactStatusBadgeColor 
} from '@/types/contact';

interface ContactTableProps {
  contacts: BaseContact[];
  contactType: ContactType;
  onView: (contact: BaseContact) => void;
  onEdit: (contact: BaseContact) => void;
  onDelete: (id: string) => void;
}

export function ContactTable({ contacts, contactType, onView, onEdit, onDelete }: ContactTableProps) {
  // Define columns based on contact type
  const getColumns = () => {
    const commonColumns = [
      { key: 'name', header: 'Name' },
      { key: 'status', header: 'Status' },
      { key: 'actions', header: 'Actions' }
    ];
    
    switch (contactType) {
      case 'member':
        return [
          ...commonColumns.slice(0, 1),
          { key: 'position', header: 'Position' },
          { key: 'department', header: 'Department' },
          { key: 'joined_at', header: 'Joined' },
          { key: 'email', header: 'Email' },
          ...commonColumns.slice(1)
        ];
      case 'freelance':
        return [
          ...commonColumns.slice(0, 1),
          { key: 'position', header: 'Expertise' },
          { key: 'skills', header: 'Skills' },
          { key: 'email', header: 'Email' },
          ...commonColumns.slice(1)
        ];
      case 'investor':
        return [
          ...commonColumns.slice(0, 1),
          { key: 'company', header: 'Company' },
          { key: 'investment_stage', header: 'Stage' },
          { key: 'check_size', header: 'Check Size' },
          { key: 'investment_status', header: 'Status' },
          { key: 'last_contact', header: 'Last Contact' },
          ...commonColumns.slice(1)
        ];
      case 'partner':
        return [
          ...commonColumns.slice(0, 1),
          { key: 'company', header: 'Company' },
          { key: 'partnership_type', header: 'Partnership Type' },
          { key: 'email', header: 'Email' },
          ...commonColumns.slice(1)
        ];
      case 'board-member':
        return [
          ...commonColumns.slice(0, 1),
          { key: 'position', header: 'Position' },
          { key: 'company', header: 'Company' },
          { key: 'joined_at', header: 'Joined' },
          ...commonColumns.slice(1)
        ];
      case 'external':
        return [
          ...commonColumns.slice(0, 1),
          { key: 'position', header: 'Position' },
          { key: 'company', header: 'Company' },
          { key: 'email', header: 'Email' },
          ...commonColumns.slice(1)
        ];
      case 'network':
        return [
          ...commonColumns.slice(0, 1),
          { key: 'position', header: 'Position' },
          { key: 'company', header: 'Company' },
          { key: 'connection', header: 'Connection' },
          ...commonColumns.slice(1)
        ];
      default:
        return commonColumns;
    }
  };

  const columns = getColumns();

  // Render cell content based on column key and contact
  const renderCell = (contact: BaseContact, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return getFullName(contact);
      case 'position':
        return (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground">
            {/* Access position from metadata if it exists, otherwise check for position property on specific contact types */}
            {(contact as any).position || contact.metadata?.position || 'N/A'}
          </Badge>
        );
      case 'department':
        return (
          <Badge variant="outline" className="border-gray-200 dark:border-gray-700">
            {typeof contact.metadata?.department === 'string' ? contact.metadata.department : 'N/A'}
          </Badge>
        );
      case 'company':
        return (
          <Badge variant="outline" className="border-gray-200 dark:border-gray-700">
            {typeof contact.metadata?.company === 'string' ? contact.metadata.company : 'N/A'}
          </Badge>
        );
      case 'email':
        return contact.email || 'N/A';
      case 'skills':
        if (contact.type === 'freelance' && 
            contact.metadata?.skills && 
            Array.isArray(contact.metadata.skills) && 
            contact.metadata.skills.length > 0) {
          const skills = contact.metadata.skills as string[];
          return (
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 3).map((skill: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{skills.length - 3} more
                </Badge>
              )}
            </div>
          );
        }
        return 'N/A';
      case 'partnership_type':
        return typeof contact.metadata?.partnership_type === 'string' ? contact.metadata.partnership_type : 'N/A';
      case 'joined_at':
        // For member contacts, use metadata.join_date
        if (contact.type === 'member' && contact.metadata?.join_date) {
          const joinDate = contact.metadata.join_date;
          if (typeof joinDate === 'string' || typeof joinDate === 'number') {
            return new Date(joinDate).toLocaleDateString();
          }
        }
        // For board members and waitlist contacts, use joined_at
        else if ((contact.type === 'board-member' || contact.type === 'waitlist') && (contact as any).joined_at) {
          const joinedAt = (contact as any).joined_at;
          if (typeof joinedAt === 'string' || typeof joinedAt === 'number') {
            return new Date(joinedAt).toLocaleDateString();
          }
        }
        return 'N/A';
      case 'connection':
        if (contact.type === 'network' && contact.metadata?.connection_strength) {
          const strength = contact.metadata.connection_strength;
          if (typeof strength === 'number') {
            return '⭐'.repeat(strength);
          }
        }
        return 'N/A';
      case 'investment_stage':
        if (contact.type === 'investor') {
          const stage = (contact as InvestorContact).investment_stage;
          return stage ? (
            <Badge variant="outline" className="capitalize border-gray-200 dark:border-gray-700">
              {stage.replace('-', ' ')}
            </Badge>
          ) : 'N/A';
        }
        return 'N/A';
      case 'check_size':
        if (contact.type === 'investor') {
          const min = (contact as InvestorContact).minimum_check_size;
          const max = (contact as InvestorContact).maximum_check_size;
          if (min && max) {
            return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
          } else if (min) {
            return `$${min.toLocaleString()}+`;
          } else if (max) {
            return `Up to $${max.toLocaleString()}`;
          }
        }
        return 'N/A';
      case 'investment_status':
        if (contact.type === 'investor') {
          const status = (contact as InvestorContact).investment_status;
          if (status) {
            let badgeClass = '';
            switch (status) {
              case 'active':
                badgeClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
                break;
              case 'inactive':
                badgeClass = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
                break;
              case 'following':
                badgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
                break;
              case 'not-interested':
                badgeClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
                break;
            }
            return (
              <Badge className={badgeClass}>
                {status.replace('-', ' ')}
              </Badge>
            );
          }
        }
        return 'N/A';
      case 'last_contact':
        if (contact.type === 'investor' && (contact as InvestorContact).last_contact_date) {
          return new Date((contact as InvestorContact).last_contact_date!).toLocaleDateString();
        }
        return 'N/A';
      case 'status':
        return (
          <Badge className={getContactStatusBadgeColor(contact.status)}>
            {contact.status}
          </Badge>
        );
      case 'actions':
        return (
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(contact)}
              title="View Details"
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(contact)}
              title="Edit Contact"
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(contact.id)}
              title="Delete Contact"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      default:
        return 'N/A';
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500">
        <p>No {contactType}s found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-200 dark:border-gray-700">
            {columns.map((column) => (
              <TableHead key={column.key}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id} className="border-gray-200 dark:border-gray-700">
              {columns.map((column) => (
                <TableCell key={`${contact.id}-${column.key}`} className={column.key === 'actions' ? 'text-right' : ''}>
                  {renderCell(contact, column.key)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
