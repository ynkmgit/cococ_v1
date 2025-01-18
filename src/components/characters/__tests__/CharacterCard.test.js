import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CharacterCard from '../CharacterCard';

describe('CharacterCard', () => {
  const mockCharacter = {
    id: '1',
    name: 'テストキャラクター',
    currentHP: 80,
    maxHP: 100,
    dex: 50,
    useGun: true,
    effectiveDex: 100,
    status: 'active'
  };

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('キャラクター情報が正しく表示されること', () => {
    const { container } = render(
      <CharacterCard
        character={mockCharacter}
        onUpdate={mockOnUpdate}
        onRemove={mockOnDelete}
      />
    );

    expect(screen.getByText(mockCharacter.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockCharacter.currentHP.toString())).toBeInTheDocument();
    expect(screen.getByText(`${mockCharacter.currentHP} / ${mockCharacter.maxHP}`)).toBeInTheDocument();

    // 参加状態ボタンの確認
    expect(screen.getByText('離脱')).toBeInTheDocument();

    // 火器使用ボタンの確認
    expect(screen.getByText('有')).toBeInTheDocument();
  });

  it('火器使用の切り替えが正しく動作すること', () => {
    render(
      <CharacterCard
        character={mockCharacter}
        onUpdate={mockOnUpdate}
        onRemove={mockOnDelete}
      />
    );

    const gunToggleButton = screen.getByText('有');
    fireEvent.click(gunToggleButton);

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockCharacter,
      useGun: false
    });
  });

  it('現在HPの更新が正しく動作すること', () => {
    render(
      <CharacterCard
        character={mockCharacter}
        onUpdate={mockOnUpdate}
        onRemove={mockOnDelete}
      />
    );

    const currentHPInput = screen.getByLabelText('現在HP');
    fireEvent.change(currentHPInput, { target: { value: '90' } });

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockCharacter,
      currentHP: 90
    });
  });

  it('HPバーが正しい幅で表示されること', () => {
    const { container } = render(
      <CharacterCard
        character={mockCharacter}
        onUpdate={mockOnUpdate}
        onRemove={mockOnDelete}
      />
    );

    const hpBarFill = container.querySelector('.hp-bar-fill');
    expect(hpBarFill).toHaveStyle({ width: '80%' });
  });

  it('編集モードに切り替わること', () => {
    render(
      <CharacterCard
        character={mockCharacter}
        onUpdate={mockOnUpdate}
        onRemove={mockOnDelete}
      />
    );

    const editButton = screen.getByLabelText('キャラクターを編集');
    fireEvent.click(editButton);

    expect(screen.getByText('キャンセル')).toBeInTheDocument();
  });

  it('削除ボタンが正しく動作すること', () => {
    render(
      <CharacterCard
        character={mockCharacter}
        onUpdate={mockOnUpdate}
        onRemove={mockOnDelete}
      />
    );

    const deleteButton = screen.getByLabelText('キャラクターを削除');
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(mockCharacter.id);
  });

  it('参加状態の切り替えが正しく動作すること', () => {
    render(
      <CharacterCard
        character={mockCharacter}
        onUpdate={mockOnUpdate}
        onRemove={mockOnDelete}
      />
    );

    const toggleButton = screen.getByText('離脱');
    fireEvent.click(toggleButton);

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockCharacter,
      status: 'inactive'
    });
  });

  describe('非参加状態のキャラクター表示', () => {
    const inactiveCharacter = {
      ...mockCharacter,
      status: 'inactive'
    };

    it('非参加状態の表示が正しく行われること', () => {
      const { container } = render(
        <CharacterCard
          character={inactiveCharacter}
          onUpdate={mockOnUpdate}
          onRemove={mockOnDelete}
        />
      );

      expect(container.firstChild).toHaveClass('opacity-50');
      expect(screen.getByText('参加')).toBeInTheDocument();
    });

    it('参加状態への切り替えが正しく動作すること', () => {
      render(
        <CharacterCard
          character={inactiveCharacter}
          onUpdate={mockOnUpdate}
          onRemove={mockOnDelete}
        />
      );

      const toggleButton = screen.getByText('参加');
      fireEvent.click(toggleButton);

      expect(mockOnUpdate).toHaveBeenCalledWith({
        ...inactiveCharacter,
        status: 'active'
      });
    });
  });

  describe('火器使用無しの状態', () => {
    const noGunCharacter = {
      ...mockCharacter,
      useGun: false
    };

    it('火器使用無しの表示が正しく行われること', () => {
      render(
        <CharacterCard
          character={noGunCharacter}
          onUpdate={mockOnUpdate}
          onRemove={mockOnDelete}
        />
      );

      expect(screen.getByText('無')).toBeInTheDocument();
    });

    it('火器使用の有効化が正しく動作すること', () => {
      render(
        <CharacterCard
          character={noGunCharacter}
          onUpdate={mockOnUpdate}
          onRemove={mockOnDelete}
        />
      );

      const gunToggleButton = screen.getByText('無');
      fireEvent.click(gunToggleButton);

      expect(mockOnUpdate).toHaveBeenCalledWith({
        ...noGunCharacter,
        useGun: true
      });
    });
  });
});
