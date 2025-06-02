/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BeerRatingForm } from './BeerRatingForm';

// Mock the API call
const mockOnSubmit = jest.fn();

const mockBeer = {
  _id: '1',
  name: 'Test IPA',
  style: 'IPA',
  abv: 6.5,
  ibu: 60,
  brewery: {
    _id: 'brewery1',
    name: 'Test Brewery'
  }
};

describe('BeerRatingForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders rating form with all fields', () => {
    render(<BeerRatingForm beer={mockBeer} onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Rate Test IPA')).toBeInTheDocument();
    expect(screen.getByLabelText(/overall rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your thoughts/i)).toBeInTheDocument();
    expect(screen.getByText('Flavor Profile')).toBeInTheDocument();
    expect(screen.getByLabelText(/hoppy/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/malty/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bitter/i)).toBeInTheDocument();
  });

  it('handles star rating selection', () => {
    render(<BeerRatingForm beer={mockBeer} onSubmit={mockOnSubmit} />);

    const fourthStar = screen.getAllByRole('button')[3]; // 4th star (0-indexed)
    fireEvent.click(fourthStar);

    expect(fourthStar).toHaveClass('text-beer-400'); // Should be filled
  });

  it('handles comment input', () => {
    render(<BeerRatingForm beer={mockBeer} onSubmit={mockOnSubmit} />);

    const commentInput = screen.getByLabelText(/your thoughts/i);
    fireEvent.change(commentInput, { target: { value: 'Great hoppy beer!' } });

    expect(commentInput).toHaveValue('Great hoppy beer!');
  });

  it('handles flavor profile sliders', () => {
    render(<BeerRatingForm beer={mockBeer} onSubmit={mockOnSubmit} />);

    const hoppySlider = screen.getByLabelText(/hoppy/i);
    fireEvent.change(hoppySlider, { target: { value: '8' } });

    expect(hoppySlider).toHaveValue('8');
  });

  it('submits form with complete data', async () => {
    render(<BeerRatingForm beer={mockBeer} onSubmit={mockOnSubmit} />);

    // Rate 4 stars
    const fourthStar = screen.getAllByRole('button')[3];
    fireEvent.click(fourthStar);

    // Add comment
    const commentInput = screen.getByLabelText(/your thoughts/i);
    fireEvent.change(commentInput, { target: { value: 'Excellent IPA!' } });

    // Set flavor profile
    const hoppySlider = screen.getByLabelText(/hoppy/i);
    fireEvent.change(hoppySlider, { target: { value: '9' } });

    const bitterSlider = screen.getByLabelText(/bitter/i);
    fireEvent.change(bitterSlider, { target: { value: '8' } });

    // Check recommendation
    const recommendCheckbox = screen.getByLabelText(/would you recommend/i);
    fireEvent.click(recommendCheckbox);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit rating/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        rating: 4,
        comment: 'Excellent IPA!',
        flavorProfile: {
          hoppy: 9,
          malty: 5, // default value
          bitter: 8,
          sweet: 5,
          sour: 5,
          roasted: 5,
          fruity: 5,
          smoky: 5
        },
        wouldRecommend: true,
        wouldOrderAgain: false // default value
      });
    });
  });

  it('validates required rating field', async () => {
    render(<BeerRatingForm beer={mockBeer} onSubmit={mockOnSubmit} />);

    // Submit without rating
    const submitButton = screen.getByRole('button', { name: /submit rating/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please provide a rating/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('displays existing experience when editing', () => {
    const existingExperience = {
      rating: 4.5,
      comment: 'Great beer!',
      flavorProfile: {
        hoppy: 8,
        malty: 3,
        bitter: 7,
        sweet: 2,
        sour: 1,
        roasted: 1,
        fruity: 6,
        smoky: 1
      },
      wouldRecommend: true,
      wouldOrderAgain: true
    };

    render(
      <BeerRatingForm 
        beer={mockBeer} 
        onSubmit={mockOnSubmit}
        existingExperience={existingExperience}
      />
    );

    expect(screen.getByDisplayValue('Great beer!')).toBeInTheDocument();
    expect(screen.getByLabelText(/hoppy/i)).toHaveValue('8');
    expect(screen.getByLabelText(/would you recommend/i)).toBeChecked();
    expect(screen.getByLabelText(/would you order again/i)).toBeChecked();
  });

  it('handles form cancellation', () => {
    const mockOnCancel = jest.fn();
    render(
      <BeerRatingForm 
        beer={mockBeer} 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('displays character count for comment', () => {
    render(<BeerRatingForm beer={mockBeer} onSubmit={mockOnSubmit} />);

    const commentInput = screen.getByLabelText(/your thoughts/i);
    fireEvent.change(commentInput, { target: { value: 'Great beer!' } });

    expect(screen.getByText('11 / 500')).toBeInTheDocument();
  });

  it('prevents comment over character limit', () => {
    render(<BeerRatingForm beer={mockBeer} onSubmit={mockOnSubmit} />);

    const commentInput = screen.getByLabelText(/your thoughts/i);
    const longComment = 'a'.repeat(501); // Exceeds 500 character limit
    
    fireEvent.change(commentInput, { target: { value: longComment } });

    expect(commentInput.value).toHaveLength(500); // Should be truncated
  });

  it('shows flavor profile visualization', () => {
    render(<BeerRatingForm beer={mockBeer} onSubmit={mockOnSubmit} />);

    // Set some flavor values
    fireEvent.change(screen.getByLabelText(/hoppy/i), { target: { value: '9' } });
    fireEvent.change(screen.getByLabelText(/bitter/i), { target: { value: '8' } });

    // Should show radar chart or similar visualization
    expect(screen.getByTestId('flavor-profile-chart')).toBeInTheDocument();
  });
});