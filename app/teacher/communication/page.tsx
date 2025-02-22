'use client'
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Chatbot from './chatbot/chatbot';

const dummyClasses = [
  { id: 1, name: 'Mathematics 101', section: 'A', subject: 'Mathematics', courseCode: 'MATH101' },
  { id: 2, name: 'Introduction to Physics', section: 'B', subject: 'Physics', courseCode: 'PHYS101' },
  { id: 3, name: 'English Literature', section: 'C', subject: 'English', courseCode: 'ENGL201' },
  { id: 4, name: 'World History', section: 'A', subject: 'History', courseCode: 'HIST102' },
  { id: 5, name: 'Computer Science Fundamentals', section: 'B', subject: 'Computer Science', courseCode: 'CS101' },
  { id: 6, name: 'Biology Basics', section: 'C', subject: 'Biology', courseCode: 'BIO101' },
  { id: 7, name: 'Chemistry Lab', section: 'A', subject: 'Chemistry', courseCode: 'CHEM201' },
  { id: 8, name: 'Art History', section: 'B', subject: 'Art', courseCode: 'ART301' },
];

export default function CommunicationPage() {
  const [selectedClass, setSelectedClass] = useState(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Communication Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dummyClasses.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>{classItem.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Section:</strong> {classItem.section}</p>
              <p><strong>Subject:</strong> {classItem.subject}</p>
              <p><strong>Course Code:</strong> {classItem.courseCode}</p>
              <Button 
                className="mt-4 w-full"
                onClick={() => setSelectedClass(classItem)}
              >
                Open Chat
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedClass && (
        <Chatbot 
          isOpen={!!selectedClass} 
          onClose={() => setSelectedClass(null)} 
          className={selectedClass.name}
        />
      )}
    </div>
  );
}
