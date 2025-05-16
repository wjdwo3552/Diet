// 한글 초성 매핑
const CHOSUNG = {
  'ㄱ': '가', 'ㄲ': '까', 'ㄴ': '나', 'ㄷ': '다', 'ㄸ': '따',
  'ㄹ': '라', 'ㅁ': '마', 'ㅂ': '바', 'ㅃ': '빠', 'ㅅ': '사',
  'ㅆ': '싸', 'ㅇ': '아', 'ㅈ': '자', 'ㅉ': '짜', 'ㅊ': '차',
  'ㅋ': '카', 'ㅌ': '타', 'ㅍ': '파', 'ㅎ': '하'
};

// 초성 추출 함수
export function extractChoseong(text) {
  if (!text) return '';
  
  const result = [];
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    // 한글인 경우 초성 추출
    if (/[가-힣]/.test(char)) {
      const code = char.charCodeAt(0) - 0xAC00;
      const jong = code % 28;
      const jung = ((code - jong) / 28) % 21;
      const cho = ((code - jong) / 28) / 21;
      
      // 초성 매핑
      const choIndex = Math.floor(cho);
      if (choIndex >= 0 && choIndex < 19) {
        const choKeys = Object.keys(CHOSUNG);
        result.push(choKeys[choIndex]);
      }
    } else if (CHOSUNG[char]) {
      // 이미 초성인 경우 그대로 추가
      result.push(char);
    } else {
      // 한글이 아닌 경우 그대로 추가
      result.push(char);
    }
  }
  return result.join('');
}

// 초성 매칭 검사 (개선된 버전)
export function matchesChoseong(text, query) {
  if (!query) return true;
  if (!text) return false;
  
  // 완성된 검색어로 시작하는지 확인
  if (text.startsWith(query)) return true;
  
  // 초성 매칭 확인
  const textChoseong = extractChoseong(text);
  const queryChoseong = extractChoseong(query);
  
  // 초성으로 시작하는지 확인
  if (textChoseong.startsWith(queryChoseong)) return true;
  
  // 부분 일치 확인
  if (text.includes(query)) return true;
  
  return false;
} 