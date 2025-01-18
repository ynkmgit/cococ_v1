import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RoundCounter from '../RoundCounter';

/**
 * RoundCounterコンポーネントのテストスイート
 * 
 * ラウンドカウンターの表示と操作に関するテストを実施
 * 以下の機能を検証：
 * - ラウンド数の表示
 * - プラス/マイナスボタンの操作
 * - ボタンの状態管理
 */
describe('RoundCounter', () => {
  const mockOnRoundChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ラウンド数が正しく表示されること', async () => {
    // テスト内容：
    // - 現在のラウンド数が2桁表示で正しく表示されること
    await act(async () => {
      render(<RoundCounter round={5} onRoundChange={mockOnRoundChange} />);
    });
    const roundDisplay = screen.getByRole('status');
    expect(roundDisplay).toHaveTextContent('05');
  });

  it('プラスボタンでラウンドが増加すること', async () => {
    // テスト内容：
    // - プラスボタンクリックでラウンド数が1増えること
    // - コールバック関数が正しく呼び出されること
    await act(async () => {
      render(<RoundCounter round={5} onRoundChange={mockOnRoundChange} />);
    });
    const plusButton = screen.getByLabelText('ラウンドを増やす');

    fireEvent.click(plusButton);
    expect(mockOnRoundChange).toHaveBeenCalledWith(6);
  });

  it('マイナスボタンでラウンドが減少すること', async () => {
    // テスト内容：
    // - マイナスボタンクリックでラウンド数が1減ること
    // - コールバック関数が正しく呼び出されること
    await act(async () => {
      render(<RoundCounter round={5} onRoundChange={mockOnRoundChange} />);
    });
    const minusButton = screen.getByLabelText('ラウンドを減らす');

    fireEvent.click(minusButton);
    expect(mockOnRoundChange).toHaveBeenCalledWith(4);
  });

  it('ラウンド1の時にマイナスボタンが無効化されること', async () => {
    // テスト内容：
    // - ラウンド1の時、マイナスボタンが無効化されること
    // - 無効化状態でクリックしてもコールバックが呼ばれないこと
    await act(async () => {
      render(<RoundCounter round={1} onRoundChange={mockOnRoundChange} />);
    });
    const minusButton = screen.getByLabelText('ラウンドを減らす');

    expect(minusButton).toBeDisabled();
    fireEvent.click(minusButton);
    expect(mockOnRoundChange).not.toHaveBeenCalled();
  });

  it('ラウンド数が2桁の場合も正しく表示されること', async () => {
    // テスト内容：
    // - 2桁のラウンド数が正しく表示されること
    // - 先頭に0が付かないこと
    await act(async () => {
      render(<RoundCounter round={12} onRoundChange={mockOnRoundChange} />);
    });
    const roundDisplay = screen.getByRole('status');
    expect(roundDisplay).toHaveTextContent('12');
  });

  it('ボタンのスタイルが正しく適用されていること', async () => {
    // テスト内容：
    // - ボタンに正しいCSSクラスが適用されていること
    await act(async () => {
      render(<RoundCounter round={5} onRoundChange={mockOnRoundChange} />);
    });
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveClass('btn', 'btn-primary');
    });
  });
});
