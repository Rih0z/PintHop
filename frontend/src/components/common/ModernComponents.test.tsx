/**
 * Comprehensive tests for ModernComponents
 * Target: 100% coverage
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import '@testing-library/jest-dom';
import {
  ModernButton,
  ModernCard,
  ModernBottomSheet,
  ModernTabs,
  ModernHealthIndicator,
  ModernSkeleton,
  ModernListItem,
  ModernFAB,
} from './ModernComponents';

describe('ModernButton', () => {
  it('renders with children', () => {
    render(<ModernButton>Click me</ModernButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<ModernButton variant="primary">Primary</ModernButton>);
    expect(screen.getByRole('button')).toHaveClass('bg-gradient-to-r', 'from-amber-500', 'to-amber-600');
    
    rerender(<ModernButton variant="secondary">Secondary</ModernButton>);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-100', 'text-gray-900');
    
    rerender(<ModernButton variant="ghost">Ghost</ModernButton>);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent');
    
    rerender(<ModernButton variant="danger">Danger</ModernButton>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-500');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<ModernButton size="sm">Small</ModernButton>);
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-sm');
    
    rerender(<ModernButton size="md">Medium</ModernButton>);
    expect(screen.getByRole('button')).toHaveClass('px-5', 'py-2.5', 'text-base');
    
    rerender(<ModernButton size="lg">Large</ModernButton>);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('renders fullWidth correctly', () => {
    render(<ModernButton fullWidth>Full Width</ModernButton>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('shows loading state', () => {
    render(<ModernButton loading>Loading</ModernButton>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<ModernButton disabled>Disabled</ModernButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<ModernButton onClick={handleClick}>Click me</ModernButton>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('supports different button types', () => {
    const { rerender } = render(<ModernButton type="submit">Submit</ModernButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    
    rerender(<ModernButton type="reset">Reset</ModernButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
  });

  it('renders with icon', () => {
    const icon = <span data-testid="test-icon">🔥</span>;
    render(<ModernButton icon={icon}>With Icon</ModernButton>);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ModernButton className="custom-class">Custom</ModernButton>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});

describe('ModernCard', () => {
  it('renders children', () => {
    render(<ModernCard>Card content</ModernCard>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies padding variants', () => {
    const { rerender } = render(<ModernCard padding="none">Content</ModernCard>);
    let card = screen.getByTestId('modern-card');
    expect(card).not.toHaveClass('p-4', 'p-6', 'p-8');
    
    rerender(<ModernCard padding="sm">Content</ModernCard>);
    card = screen.getByTestId('modern-card');
    expect(card).toHaveClass('p-4');
    
    rerender(<ModernCard padding="md">Content</ModernCard>);
    card = screen.getByTestId('modern-card');
    expect(card).toHaveClass('p-6');
    
    rerender(<ModernCard padding="lg">Content</ModernCard>);
    card = screen.getByTestId('modern-card');
    expect(card).toHaveClass('p-8');
  });

  it('applies elevated style', () => {
    render(<ModernCard elevated>Elevated</ModernCard>);
    const card = screen.getByTestId('modern-card');
    expect(card).toHaveClass('shadow-lg');
  });

  it('applies interactive style', () => {
    render(<ModernCard interactive>Interactive</ModernCard>);
    const card = screen.getByTestId('modern-card');
    expect(card).toHaveClass('cursor-pointer');
  });

  it('applies glass effect', () => {
    render(<ModernCard glass>Glass</ModernCard>);
    const card = screen.getByTestId('modern-card');
    expect(card).toHaveClass('bg-white/80', 'backdrop-blur-lg');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<ModernCard onClick={handleClick}>Clickable</ModernCard>);
    
    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('ModernBottomSheet', () => {
  it('renders when open', () => {
    const onClose = jest.fn();
    render(
      <ModernBottomSheet isOpen onClose={onClose}>
        <div>Sheet content</div>
      </ModernBottomSheet>
    );
    
    expect(screen.getByText('Sheet content')).toBeInTheDocument();
  });

  it('applies closed state styling when closed', () => {
    const onClose = jest.fn();
    render(
      <ModernBottomSheet isOpen={false} onClose={onClose}>
        <div>Sheet content</div>
      </ModernBottomSheet>
    );
    
    // Should still be in DOM but with pointer-events-none
    expect(screen.getByText('Sheet content')).toBeInTheDocument();
    const container = screen.getByTestId('bottom-sheet-container');
    expect(container).toHaveClass('pointer-events-none');
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = jest.fn();
    render(
      <ModernBottomSheet isOpen onClose={onClose}>
        <div>Sheet content</div>
      </ModernBottomSheet>
    );
    
    const backdrop = screen.getByTestId('bottom-sheet-backdrop');
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(
      <ModernBottomSheet isOpen onClose={onClose}>
        <div>Sheet content</div>
      </ModernBottomSheet>
    );
    
    const closeButton = screen.getByTestId('bottom-sheet-close');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('ModernTabs', () => {
  const tabs = [
    { id: 'tab1', label: 'Tab 1', icon: '🏠' },
    { id: 'tab2', label: 'Tab 2', icon: '⭐' },
    { id: 'tab3', label: 'Tab 3', icon: '👤' },
  ];

  it('renders all tabs', () => {
    const onChange = jest.fn();
    render(<ModernTabs tabs={tabs} activeTab="tab1" onChange={onChange} />);
    
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('highlights active tab', () => {
    const onChange = jest.fn();
    render(<ModernTabs tabs={tabs} activeTab="tab2" onChange={onChange} />);
    
    const activeTab = screen.getByText('Tab 2').closest('button');
    expect(activeTab).toHaveClass('bg-white', 'text-gray-900');
  });

  it('calls onChange when tab is clicked', () => {
    const onChange = jest.fn();
    render(<ModernTabs tabs={tabs} activeTab="tab1" onChange={onChange} />);
    
    fireEvent.click(screen.getByText('Tab 2'));
    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('renders pills variant', () => {
    const onChange = jest.fn();
    render(<ModernTabs tabs={tabs} activeTab="tab1" onChange={onChange} variant="pills" />);
    
    const container = screen.getByRole('tablist');
    expect(container).toHaveClass('bg-gray-100');
  });

  it('renders icons when provided', () => {
    const onChange = jest.fn();
    render(<ModernTabs tabs={tabs} activeTab="tab1" onChange={onChange} />);
    
    expect(screen.getByText('🏠')).toBeInTheDocument();
    expect(screen.getByText('⭐')).toBeInTheDocument();
    expect(screen.getByText('👤')).toBeInTheDocument();
  });
});

describe('ModernHealthIndicator', () => {
  it('renders with all props', () => {
    const icon = <span data-testid="health-icon">💚</span>;
    render(
      <ModernHealthIndicator
        label="Test Health"
        value={75}
        unit="%"
        status="low"
        icon={icon}
      />
    );
    
    expect(screen.getByText('Test Health')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
    expect(screen.getByTestId('health-icon')).toBeInTheDocument();
  });

  it('applies status colors correctly', () => {
    const { rerender } = render(
      <ModernHealthIndicator label="Health" value={50} unit="%" status="low" />
    );
    let indicator = screen.getByText('50');
    expect(indicator).toHaveStyle('color: #66BB6A');
    
    rerender(<ModernHealthIndicator label="Health" value={50} unit="%" status="moderate" />);
    indicator = screen.getByText('50');
    expect(indicator).toHaveStyle('color: #FFB300');
    
    rerender(<ModernHealthIndicator label="Health" value={50} unit="%" status="high" />);
    indicator = screen.getByText('50');
    expect(indicator).toHaveStyle('color: #FF7043');
  });
});

describe('ModernSkeleton', () => {
  it('renders circular variant', () => {
    render(<ModernSkeleton variant="circular" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('rounded-full');
  });

  it('renders rectangular variant', () => {
    render(<ModernSkeleton variant="rectangular" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('rounded-lg');
  });

  it('applies custom width and height', () => {
    render(<ModernSkeleton width={200} height={100} />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveStyle({ width: '200px', height: '100px' });
  });

  it('uses animation by default', () => {
    render(<ModernSkeleton />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('can disable animation', () => {
    render(<ModernSkeleton animation={false} />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).not.toHaveClass('animate-pulse');
  });
});

describe('ModernListItem', () => {
  it('renders with title and subtitle', () => {
    render(<ModernListItem title="Item Title" subtitle="Item Subtitle" />);
    
    expect(screen.getByText('Item Title')).toBeInTheDocument();
    expect(screen.getByText('Item Subtitle')).toBeInTheDocument();
  });

  it('renders leading icon', () => {
    const leadingIcon = <span data-testid="leading-icon">🔥</span>;
    render(<ModernListItem title="With Icon" leadingIcon={leadingIcon} />);
    
    expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
  });

  it('renders trailing content', () => {
    const trailingContent = <span data-testid="trailing">→</span>;
    render(<ModernListItem title="With Trailing" trailingContent={trailingContent} />);
    
    expect(screen.getByTestId('trailing')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<ModernListItem title="Clickable" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies cursor pointer when clickable', () => {
    const handleClick = jest.fn();
    render(<ModernListItem title="Clickable" onClick={handleClick} />);
    
    const listItem = screen.getByTestId('modern-list-item');
    expect(listItem).toHaveClass('cursor-pointer');
  });
});

describe('ModernFAB', () => {
  it('renders with icon', () => {
    const icon = <span data-testid="fab-icon">+</span>;
    render(<ModernFAB icon={icon} />);
    
    expect(screen.getByTestId('fab-icon')).toBeInTheDocument();
  });

  it('applies position classes', () => {
    const icon = <span>+</span>;
    const { rerender } = render(<ModernFAB icon={icon} position="bottom-right" />);
    let fab = screen.getByRole('button');
    expect(fab).toHaveClass('bottom-6', 'right-6');
    
    rerender(<ModernFAB icon={icon} position="bottom-center" />);
    fab = screen.getByRole('button');
    expect(fab).toHaveClass('bottom-6', 'left-1/2', '-translate-x-1/2');
    
    rerender(<ModernFAB icon={icon} position="bottom-left" />);
    fab = screen.getByRole('button');
    expect(fab).toHaveClass('bottom-6', 'left-6');
  });

  it('renders extended with label', () => {
    const icon = <span>+</span>;
    render(<ModernFAB icon={icon} extended label="Add Item" />);
    
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    const icon = <span>+</span>;
    render(<ModernFAB icon={icon} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});