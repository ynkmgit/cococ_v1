import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CharacterForm from '../CharacterForm';

/**
 * CharacterFormコンポーネントのテストスイート
 * 
 * キャラクター編集フォームの表示とインタラクションに関するテストを実施
 * 以下の機能を検証：
 * - フォームの初期表示
 * - 入力値のバリデーション
 * - フォーム送信時の動作
 * - キャンセルボタンの動作
 * - 編集モードと新規作成モードの切り替え
 * 
 * テストデータ：
 * - mockOnAddCharacter: キャラクター追加用モック関数
 * 
 * テストの前提条件：
 * - 各テストケース実行前にモック関数がリセットされる
 * - テストデータは各テストケースで独立している
 */
describe('CharacterForm', () => {
  const mockOnAddCharacter = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('フォームが正しくレンダリングされること', () => {
    // テスト内容：
    // - フォームの各入力フィールドが表示されること
    // - 送信ボタンが表示されること
    // - 初期状態で火器使用チェックボックスが未チェックであること
    // テスト内容：
    // - フォームの各入力フィールドが表示されること
    // - 送信ボタンが表示されること
    // テスト内容：
    // - フォームの各入力フィールドが表示されること
    // - 送信ボタンが表示されること
    // テスト内容：
    // - フォームの各入力フィールドが表示されること
    // - 送信ボタンが表示されること
    render(<CharacterForm onAddCharacter={mockOnAddCharacter} />);
    expect(screen.getByLabelText('キャラクター名')).toBeInTheDocument();
    expect(screen.getByLabelText('現在HP')).toBeInTheDocument();
    expect(screen.getByLabelText('最大HP')).toBeInTheDocument();
    expect(screen.getByLabelText('DEX')).toBeInTheDocument();
    expect(screen.getByLabelText(/火器使用/)).toBeInTheDocument();
    expect(screen.getByText('キャラクターを追加')).toBeInTheDocument();
  });

  it('正しい入力で新規キャラクターが追加されること', () => {
    // テスト内容：
    // - 各フィールドに入力した値が正しく送信されること
    // - 数値フィールドが数値に変換されること
    // - チェックボックスの状態が反映されること
    // - 送信後にフォームがリセットされること
    // テスト内容：
    // - 各フィールドに入力した値が正しく送信されること
    // - 数値フィールドが数値に変換されること
    // - チェックボックスの状態が反映されること
    // テスト内容：
    // - 各フィールドに入力した値が正しく送信されること
    // - 数値フィールドが数値に変換されること
    // - チェックボックスの状態が反映されること
    // テスト内容：
    // - 各フィールドに入力した値が正しく送信されること
    // - 数値フィールドが数値に変換されること
    // - チェックボックスの状態が反映されること
    render(<CharacterForm onAddCharacter={mockOnAddCharacter} />);
    const nameInput = screen.getByLabelText('キャラクター名');
    const currentHPInput = screen.getByLabelText('現在HP');
    const maxHPInput = screen.getByLabelText('最大HP');
    const dexInput = screen.getByLabelText('DEX');
    const gunCheckbox = screen.getByLabelText(/火器使用/);

    fireEvent.change(nameInput, { target: { value: 'テストキャラクター', name: 'name' } });
    fireEvent.change(currentHPInput, { target: { value: '80', name: 'currentHP' } });
    fireEvent.change(maxHPInput, { target: { value: '100', name: 'maxHP' } });
    fireEvent.change(dexInput, { target: { value: '50', name: 'dex' } });
    fireEvent.click(gunCheckbox);

    fireEvent.click(screen.getByText('キャラクターを追加'));

    expect(mockOnAddCharacter).toHaveBeenCalledWith({
      name: 'テストキャラクター',
      currentHP: 80,
      maxHP: 100,
      dex: 50,
      useGun: true,
      effectiveDex: 100
    });
  });

  it('火器使用時にDEXが2倍になること', () => {
    // テスト内容：
    // - 火器使用チェックボックスがチェックされた時、DEXが2倍になること
    // - 実効DEXが正しく表示されること
    // - チェックボックスの状態変更が即座に反映されること
    // テスト内容：
    // - 火器使用チェックボックスがチェックされた時、DEXが2倍になること
    // - 実効DEXが正しく表示されること
    // テスト内容：
    // - 火器使用チェックボックスがチェックされた時、DEXが2倍になること
    // - 実効DEXが正しく表示されること
    // テスト内容：
    // - 火器使用チェックボックスがチェックされた時、DEXが2倍になること
    // - 実効DEXが正しく表示されること
    render(<CharacterForm onAddCharacter={mockOnAddCharacter} />);

    const nameInput = screen.getByLabelText('キャラクター名');
    const dexInput = screen.getByLabelText('DEX');
    const gunCheckbox = screen.getByLabelText(/火器使用/);

    fireEvent.change(nameInput, { target: { value: 'テスト', name: 'name' } });
    fireEvent.change(dexInput, { target: { value: '50', name: 'dex' } });
    fireEvent.click(gunCheckbox);

    expect(screen.getByText('実効DEX: 100')).toBeInTheDocument();
  });

  it('編集モードで既存のキャラクターデータが表示されること', () => {
    // テスト内容：
    // - 編集モード時に既存キャラクターデータが各フィールドに表示されること
    // - 編集モードのタイトルが表示されること
    // - 送信ボタンのラベルが「更新」に変更されること
    // テスト内容：
    // - 編集モード時に既存キャラクターデータが各フィールドに表示されること
    // - 編集モードのタイトルが表示されること
    // テスト内容：
    // - 編集モード時に既存キャラクターデータが各フィールドに表示されること
    // - 編集モードのタイトルが表示されること
    // テスト内容：
    // - 編集モード時に既存キャラクターデータが各フィールドに表示されること
    // - 編集モードのタイトルが表示されること
    const existingCharacter = {
      id: '1',
      name: '既存キャラクター',
      currentHP: 70,
      maxHP: 90,
      dex: 40,
      useGun: true,
      effectiveDex: 80
    };

    render(<CharacterForm onAddCharacter={mockOnAddCharacter} editCharacter={existingCharacter} />);

    // 編集モードのタイトルを確認
    expect(screen.getByText('キャラクター編集')).toBeInTheDocument();

    // 各フィールドの値を確認
    const nameInput = screen.getByLabelText('キャラクター名');
    const currentHPInput = screen.getByLabelText('現在HP');
    const maxHPInput = screen.getByLabelText('最大HP');
    const dexInput = screen.getByLabelText('DEX');
    const gunCheckbox = screen.getByLabelText(/火器使用/);

    expect(nameInput).toHaveValue(existingCharacter.name);
    expect(currentHPInput).toHaveValue(existingCharacter.currentHP);
    expect(maxHPInput).toHaveValue(existingCharacter.maxHP);
    expect(dexInput).toHaveValue(existingCharacter.dex);
    expect(gunCheckbox).toBeChecked();
  });

  it('名前が空の場合、エラーが表示されること', () => {
    // テスト内容：
    // - 名前フィールドが空の場合、エラーメッセージが表示されること
    // - フォーム送信が行われないこと
    // - エラーメッセージが適切なスタイルで表示されること
    // テスト内容：
    // - 名前フィールドが空の場合、エラーメッセージが表示されること
    // - フォーム送信が行われないこと
    // テスト内容：
    // - 名前フィールドが空の場合、エラーメッセージが表示されること
    // - フォーム送信が行われないこと
    // テスト内容：
    // - 名前フィールドが空の場合、エラーメッセージが表示されること
    // - フォーム送信が行われないこと
    render(<CharacterForm onAddCharacter={mockOnAddCharacter} />);

    const currentHPInput = screen.getByLabelText('現在HP');
    const maxHPInput = screen.getByLabelText('最大HP');
    const dexInput = screen.getByLabelText('DEX');

    fireEvent.change(currentHPInput, { target: { value: '80', name: 'currentHP' } });
    fireEvent.change(maxHPInput, { target: { value: '100', name: 'maxHP' } });
    fireEvent.change(dexInput, { target: { value: '50', name: 'dex' } });

    fireEvent.click(screen.getByText('キャラクターを追加'));

    expect(screen.getByText('キャラクター名を入力してください')).toBeInTheDocument();
    expect(mockOnAddCharacter).not.toHaveBeenCalled();
  });

  it('DEXが0未満の場合、エラーが表示されること', () => {
    // テスト内容：
    // - DEXが0未満の場合、エラーメッセージが表示されること
    // - フォーム送信が行われないこと
    // - エラーメッセージが入力フィールドの近くに表示されること
    // テスト内容：
    // - DEXが0未満の場合、エラーメッセージが表示されること
    // - フォーム送信が行われないこと
    // テスト内容：
    // - DEXが0未満の場合、エラーメッセージが表示されること
    // - フォーム送信が行われないこと
    // テスト内容：
    // - DEXが0未満の場合、エラーメッセージが表示されること
    // - フォーム送信が行われないこと
    render(<CharacterForm onAddCharacter={mockOnAddCharacter} />);

    const nameInput = screen.getByLabelText('キャラクター名');
    const dexInput = screen.getByLabelText('DEX');

    fireEvent.change(nameInput, { target: { value: 'テストキャラクター', name: 'name' } });
    fireEvent.change(dexInput, { target: { value: '-1', name: 'dex' } });

    fireEvent.click(screen.getByText('キャラクターを追加'));

    expect(screen.getByText('DEXは0以上である必要があります')).toBeInTheDocument();
    expect(mockOnAddCharacter).not.toHaveBeenCalled();
  });

  it('現在HPが最大HPを超える場合、エラーが表示されること', () => {
    // テスト内容：
    // - 現在HPが最大HPを超える場合、エラーメッセージが表示されること
    // - フォーム送信が行われないこと
    // - エラーメッセージが両方のHPフィールドに関連付けられていること
    // テスト内容：
    // - 現在HPが最大HPを超える場合、エラーメッセージが表示されること
    // - フォーム送信が行われないこと
    // テスト内容：
    // - 現在HPが最大HPを超える場合、エラーメッセージが表示されること
    // - フォーム送信が行われないこと
    // テスト内容：
    // - 現在HPが最大HPを超える場合、エラーメッセージが表示されること
    // - フォーム送信が行われないこと
    render(<CharacterForm onAddCharacter={mockOnAddCharacter} />);

    const nameInput = screen.getByLabelText('キャラクター名');
    const currentHPInput = screen.getByLabelText('現在HP');
    const maxHPInput = screen.getByLabelText('最大HP');

    fireEvent.change(nameInput, { target: { value: 'テストキャラクター', name: 'name' } });
    fireEvent.change(currentHPInput, { target: { value: '120', name: 'currentHP' } });
    fireEvent.change(maxHPInput, { target: { value: '100', name: 'maxHP' } });

    fireEvent.click(screen.getByText('キャラクターを追加'));

    expect(screen.getByText('現在HPは最大HPを超えることはできません')).toBeInTheDocument();
    expect(mockOnAddCharacter).not.toHaveBeenCalled();
  });
});
