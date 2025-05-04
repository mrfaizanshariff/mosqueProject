import { LucideCrop as LucideProps } from 'lucide-react'
import { Info } from 'lucide-react';

interface MosqueIconProps extends React.ComponentProps<typeof Info>  {
  name?: string;
  className?: string
}
export const Mosque = ({ ...props }: MosqueIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 22V14a2 2 0 0 1 2-2h3.4a2 2 0 0 1 1.8 1.1l.4.9H18" />
    <path d="M8 22V5c0-2 1-3 3-3s3 1 3 3v17" />
    <path d="M19 22v-8.3a2 2 0 0 1 .6-1.4l.4-.3a2 2 0 0 1 2 0l.4.3a2 2 0 0 1 .6 1.4V22" />
    <path d="M7 22h15" />
    <path d="M22 19h-4" />
    <path d="M15 5v1" />
    <path d="M15 7.5v.5" />
    <path d="M15 10v.5" />
    <path d="M15 12.5v.5" />
    <path d="M15 15v2" />
  </svg>
)