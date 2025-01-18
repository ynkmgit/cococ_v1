import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CharacterList from '../CharacterList';

/**
 * CharacterListコンポーネントのテストスイート
 * 
 * キャラクター一覧の表示に関するテストを実施
 * 以下の機能を検証：
 * - キャラクターが存在しない場合の表示
 * - キャラクター一覧の表示
 * 
 * テストデータ：
 * - mockOnUpdateCharacter: キャラクター更新用モック関数
 * - mockOnRemoveCharacter: キャラクター削除用モック関数
 * 
 * テストの前提条件：
 * - 各テストケース実行前にモック関数がリセットされる
 */
describe('CharacterList', () => {
  const mockOnUpdateCharacter = jest.fn();
  const mockOnRemoveCharacter = jest.fn();

  it('キャラクターが存在しない場合、メッセージが表示されること', async () => {
    // テスト内容：
    // - キャラクターリストが空の場合、適切なメッセージが表示されること
    // - キャラクターカードが表示されないこと
    // テスト内容：
    // - キャラクターリストが空の場合、適切なメッセージが表示されること
    // テスト内容：
    // - キャラクターリストが空の場合、適切なメッセージが表示されること
    await act(async () => {
      render(
        <CharacterList
          characters={[]}
          onUpdateCharacter={mockOnUpdateCharacter}
          onRemoveCharacter={mockOnRemoveCharacter}
        />
      );
    });

    expect(screen.getByText('キャラクターが登録されていません')).toBeInTheDocument();
  });

  it('キャラクター一覧が正しく表示されること', async () => {
    // テスト内容：
    // - キャラクターリストが正しく表示されること
    // - 各キャラクターの名前とHPが表示されること
    // - キャラクターカードが正しい数表示されること
    // テスト内容：
    // - キャラクターリストが正しく表示されること
    // - 各キャラクターの名前とHPが表示されること
    // テスト内容：
    // - キャラクターリストが正しく表示されること
    // - 各キャラクターの名前とHPが表示されること
    const mockCharacters = [
      { id: '1', name: 'キャラクター1', currentHP: 100, maxHP: 100 },
      { id: '2', name: 'キャラクター2', currentHP: 50, maxHP: 100 },
    ];

    await act(async () => {
      render(
        <CharacterList
          characters={mockCharacters}
          onUpdateCharacter={mockOnUpdateCharacter}
          onRemoveCharacter={mockOnRemoveCharacter}
        />
      );
    });

    expect(screen.getByText('キャラクター1')).toBeInTheDocument();
    expect(screen.getByText('キャラクター2')).toBeInTheDocument();
    expect(screen.getByText('100 / 100')).toBeInTheDocument();
    expect(screen.getByText('50 / 100')).toBeInTheDocument();
  });
});
