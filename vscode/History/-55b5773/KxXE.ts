import logger from './logger';

export async function translateToEnglish(text: string): Promise<string> {
  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=bn&tl=en&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0][0][0];
    }
    return text;
  } catch (error) {
    logger.error({ error }, 'Translation error');
    return text;
  }
}
