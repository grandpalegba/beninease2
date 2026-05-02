import { useVisionsStore } from '@/store/visions';
import { act } from 'react-dom/test-utils';

describe('Visions store captureCells', () => {
  it('should add new cells and update totalFunded', () => {
    const { result } = renderHook(() => useVisionsStore());
    // initial totalFunded is 80
    expect(result.current.totalFunded).toBe(80);
    act(() => {
      result.current.captureCells([
        {
          x: 5,
          y: 5,
          ownerName: 'Tester',
          mediaUrl: '',
          mediaType: 'photo',
          whatsappLink: '',
          description: 'Test cell',
          price: 8,
          captureCount: 1,
          history: []
        }
      ]);
    });
    expect(result.current.totalFunded).toBe(88);
    expect(result.current.cells['5-5']).toBeDefined();
  });
});
