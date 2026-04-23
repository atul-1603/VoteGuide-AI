import { render, screen } from '@testing-library/react';
import { HeroSection } from './HeroSection';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('HeroSection', () => {
  it('renders correctly with title and description', () => {
    render(<HeroSection />);
    
    expect(screen.getByText(/Know Your/i)).toBeInTheDocument();
    expect(screen.getByText(/Vote\./i)).toBeInTheDocument();
    expect(screen.getByText(/Your intelligent guide/i)).toBeInTheDocument();
  });

  it('contains links to chat and timeline', () => {
    render(<HeroSection />);
    
    const chatLink = screen.getByRole('link', { name: /Chat with AI/i });
    const timelineLink = screen.getByRole('link', { name: /View Timeline/i });
    
    expect(chatLink).toHaveAttribute('href', '/chat');
    expect(timelineLink).toHaveAttribute('href', '/timeline');
  });
});
