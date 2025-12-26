
import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  TrainFront, 
  Briefcase, 
  MapPin, 
  Mic,
  Lightbulb,
  Rocket,
  Palette,
  Search,
  Calendar
} from 'lucide-react';

export const COLORS = {
  somaiyaRed: '#B22222',
  googleBlue: '#4285F4',
  googleGreen: '#34A853',
  googleYellow: '#FBBC04',
};

export const NAVIGATION = [
  { section: 'Campus Life', items: [
    { name: 'Command Center', icon: <LayoutDashboard className="w-5 h-5" />, path: '/' },
    { name: 'Academic Strategist', icon: <BookOpen className="w-5 h-5" />, path: '/academics' },
    { name: 'Transit Scout', icon: <TrainFront className="w-5 h-5" />, path: '/transit' },
    { name: 'Career Launchpad', icon: <Briefcase className="w-5 h-5" />, path: '/career' },
    { name: 'Campus Maps', icon: <MapPin className="w-5 h-5" />, path: '/maps' },
    { name: 'AI Voice Mentor', icon: <Mic className="w-5 h-5" />, path: '/mentor' },
  ]},
  { section: 'TechSprint Hub', items: [
    { name: 'Idea Generator', icon: <Lightbulb className="w-5 h-5" />, path: '/ideas' },
    { name: 'Project Canvas', icon: <Rocket className="w-5 h-5" />, path: '/canvas' },
    { name: 'Branding Studio', icon: <Palette className="w-5 h-5" />, path: '/branding' },
    { name: 'Tech Scout', icon: <Search className="w-5 h-5" />, path: '/scout' },
  ]}
];

export const SOMAIYA_TEMPLATES = [
  "Semester 4 - Data Structures & Algorithms (KJSSE Syllabus)",
  "Semester 4 - Mathematics IV (Complex Variables & Probability)",
  "Semester 6 - AI & Machine Learning Electives",
  "KT Prep - Computer Organization & Architecture"
];

export const PLACED_COMPANIES = [
  { name: "JP Morgan Chase & Co.", ctc: "19.75 LPA", domain: "FinTech", role: "SDE / Analyst" },
  { name: "Barclays", ctc: "13.50 LPA", domain: "Banking", role: "Technology Analyst" },
  { name: "Edelweiss – Global Markets", ctc: "16.00 LPA", domain: "Finance", role: "Market Analyst" },
  { name: "IDFC Bank", ctc: "13.80 LPA", domain: "Banking", role: "Management Trainee" },
  { name: "Oracle", ctc: "9.82 LPA", domain: "Cloud/Software", role: "Member Tech Staff" },
  { name: "Cimpress", ctc: "12.60 LPA", domain: "Tech/Product", role: "Software Engineer" },
  { name: "ACI Worldwide", ctc: "12.50 LPA", domain: "Payments", role: "Associate Developer" },
  { name: "Rapid7", ctc: "11.00 LPA", domain: "Cybersecurity", role: "Software Engineer" },
  { name: "GreyLabs AI", ctc: "14.00 LPA", domain: "AI/ML", role: "AI Researcher" },
  { name: "Deloitte India", ctc: "7.60 LPA", domain: "Consulting", role: "Advisory Analyst" },
  { name: "EY", ctc: "6.48 LPA", domain: "Consulting", role: "Technology Consultant" },
  { name: "KPMG", ctc: "5.50 LPA", domain: "Consulting", role: "Risk Analyst" },
  { name: "LogisticsNow", ctc: "7.50 LPA", domain: "Supply Chain", role: "Software Intern" },
  { name: "StoneX", ctc: "10.00 LPA", domain: "Finance", role: "Global Tech Ops" },
];

export const EVENTS = [
  { date: '18 DEC', title: 'Registration', description: 'Kickstart your journey', isCompleted: true },
  { date: '21 DEC', title: 'Team Formation', description: 'Find your squad', isCompleted: true },
  { date: '27 DEC', title: 'Submission', description: 'Upload your innovation', isCompleted: false },
  { date: '06 JAN', title: 'Evaluations', description: 'Initial vetting process', isCompleted: false },
  { date: '14 JAN', title: 'Finals', description: 'The grand announcement', isCompleted: false },
];
