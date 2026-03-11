import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NameSetupModal } from './NameSetupModal';

describe('NameSetupModal', () => {
  it('shows name input when no name saved', () => {
    render(<NameSetupModal onSave={() => {}} />);
    expect(screen.getByPlaceholderText(/你的名字/i)).toBeInTheDocument();
  });

  it('saves name and calls onSave when confirmed', async () => {
    const onSave = vi.fn();
    render(<NameSetupModal onSave={onSave} />);
    await userEvent.type(screen.getByPlaceholderText(/你的名字/i), 'Ashi');
    await userEvent.click(screen.getByRole('button', { name: /確認/i }));
    expect(onSave).toHaveBeenCalledWith('Ashi');
  });

  it('does not call onSave when name is empty', async () => {
    const onSave = vi.fn();
    render(<NameSetupModal onSave={onSave} />);
    await userEvent.click(screen.getByRole('button', { name: /確認/i }));
    expect(onSave).not.toHaveBeenCalled();
  });

  it('saves name on enter key', async () => {
    const onSave = vi.fn();
    render(<NameSetupModal onSave={onSave} />);
    await userEvent.type(screen.getByPlaceholderText(/你的名字/i), 'Ashi{Enter}');
    expect(onSave).toHaveBeenCalledWith('Ashi');
  });
});
