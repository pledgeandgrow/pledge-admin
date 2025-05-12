'use client';

import { Badge } from '@/components/ui/badge';
import { NetworkContact } from '@/types/network';

interface ContactDetailsProps {
  contact: NetworkContact;
}

export function ContactDetails({ contact }: ContactDetailsProps) {
  return (
    <div className="grid gap-4">
      <div>
        <h3 className="font-semibold mb-2">{contact.title}</h3>
        <p className="text-muted-foreground">{contact.organization}</p>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Expertise</h4>
        <div className="flex flex-wrap gap-2">
          {contact.expertise.map((exp, index) => (
            <Badge key={index} variant="secondary">{exp}</Badge>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Categories</h4>
        <div className="flex flex-wrap gap-2">
          {contact.category.map((cat, index) => (
            <Badge key={index}>{cat}</Badge>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Bio</h4>
        <p className="text-sm">{contact.bio}</p>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Contact Information</h4>
        <div className="grid gap-2">
          {contact.contact.email && (
            <div className="flex items-center gap-2">
              <span className="text-sm">{contact.contact.email}</span>
            </div>
          )}
          {contact.contact.phone && (
            <div className="flex items-center gap-2">
              <span className="text-sm">{contact.contact.phone}</span>
            </div>
          )}
          {contact.contact.linkedin && (
            <div className="flex items-center gap-2">
              <a
                href={contact.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                LinkedIn Profile
              </a>
            </div>
          )}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Languages</h4>
        <div className="grid gap-1">
          {contact.languages.map((lang, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span>{lang.language}</span>
              <Badge variant="outline">{lang.level}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
