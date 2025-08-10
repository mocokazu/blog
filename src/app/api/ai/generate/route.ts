import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 共通プロンプト（出力は厳密な JSON）
const buildSystemPrompt = () => `You are an assistant that generates Japanese blog articles for a personal blog.
Output MUST be a single-line JSON object with the following keys:
title (string),
content (string: Markdown),
seoTitle (string),
seoDescription (string),
seoKeywords (string[]),
outline (string[]).
No extra commentary. No code fences. No trailing commas. Example:
{"title":"...","content":"...","seoTitle":"...","seoDescription":"...","seoKeywords":["...","..."],"outline":["...","..."]}`;

type PromptOpts = { persona?: string; audience?: string; tone?: string; keywords?: string[] };
const buildUserPrompt = (prompt: string, opts: PromptOpts = {}) => `以下の要件で、日本語のブログ記事を生成してください。
- 体裁: 明確な見出し、要点の箇条書き、必要に応じたコード例
- トーン: ${opts.tone || '読みやすく、実務的で親しみやすい'}
- ペルソナ: ${opts.persona || 'オーナーの一人称「私」。挑戦的×実務的。AIを最大活用し、最小労力で成果を出す視点。読者に行動を促す締め。'}
- 想定読者: ${opts.audience || 'テック志向の個人開発者・個人事業主'}
- 文字数: 800-1500字
- SEO: 指定キーワードを自然に盛り込む（過剰最適化は避ける）
- 返答は JSON（title, content, seoTitle, seoDescription, seoKeywords, outline）
${opts.keywords && opts.keywords.length ? `- 指定キーワード: ${opts.keywords.join(', ')}` : ''}

執筆テーマ:
${prompt}`;

function safeExtractJson(text: string) {
  // 最初に現れる {...} を抽出して JSON.parse
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) {
    const sliced = text.slice(start, end + 1);
    try {
      return JSON.parse(sliced);
    } catch (e) {
      // noop
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const prompt: string | undefined = body?.prompt;
    // 既定は Gemini。明示的に "openai" が指定された場合のみ OpenAI を使用。
    const provider: 'openai' | 'gemini' = (body?.provider === 'openai' ? 'openai' : 'gemini');
    const persona: string | undefined = body?.persona;
    const audience: string | undefined = body?.audience;
    const tone: string | undefined = body?.tone;
    const kw: string[] | undefined = Array.isArray(body?.keywords) ? body.keywords : undefined;
    // Gemini モデルの指定（許可リスト内のみ受け付け）
    const requestedModel: string | undefined = typeof body?.model === 'string' ? body.model : undefined;
    const allowedGeminiModels = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];
    const geminiModel = requestedModel && allowedGeminiModels.includes(requestedModel)
      ? requestedModel
      : (process.env.GEMINI_MODEL || 'gemini-2.5-flash');

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(prompt, { persona, audience, tone, keywords: kw });

    let jsonText: string | undefined;

    if (provider === 'openai') {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.warn('OPENAI_API_KEY is not set. Falling back to Gemini.');
        const gKey = process.env.GEMINI_API_KEY;
        if (!gKey) {
          return NextResponse.json({ error: 'No AI provider keys are set' }, { status: 500 });
        }
        const genAI = new GoogleGenerativeAI(gKey);
        const modelName = geminiModel;
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
          jsonText = result.response.text();
        } catch (err) {
          console.warn(`Gemini model "${modelName}" failed, falling back to gemini-1.5-flash`, err);
          const fallback = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
          const result = await fallback.generateContent(`${systemPrompt}\n\n${userPrompt}`);
          jsonText = result.response.text();
        }
      } else {
        const openai = new OpenAI({ apiKey });
        try {
          const resp = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
          });
          jsonText = resp.choices?.[0]?.message?.content ?? '';
        } catch (err) {
          console.warn('OpenAI request failed, falling back to Gemini.', err);
          const gKey = process.env.GEMINI_API_KEY;
          if (!gKey) {
            return NextResponse.json({ error: 'OpenAI failed and GEMINI_API_KEY is not set' }, { status: 500 });
          }
          const genAI = new GoogleGenerativeAI(gKey);
          const modelName = geminiModel;
          try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
            jsonText = result.response.text();
          } catch (err2) {
            console.warn(`Gemini model "${modelName}" failed, falling back to gemini-1.5-flash`, err2);
            const fallback = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await fallback.generateContent(`${systemPrompt}\n\n${userPrompt}`);
            jsonText = result.response.text();
          }
        }
      }
    } else {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const modelName = geminiModel;
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
        jsonText = result.response.text();
      } catch (err) {
        console.warn(`Gemini model "${modelName}" failed, falling back to gemini-1.5-flash`, err);
        const fallback = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await fallback.generateContent(`${systemPrompt}\n\n${userPrompt}`);
        jsonText = result.response.text();
      }
    }

    const data = safeExtractJson(jsonText || '') || {};
    const title = typeof data.title === 'string' && data.title.trim() ? data.title.trim() : '無題の記事';
    const content = typeof data.content === 'string' && data.content.trim() ? data.content.trim() : '生成に失敗しました。もう一度お試しください。';
    const seoTitle = typeof data.seoTitle === 'string' && data.seoTitle.trim() ? data.seoTitle.trim() : title;
    const seoDescription = typeof data.seoDescription === 'string' ? data.seoDescription.trim() : '';
    const seoKeywords = Array.isArray(data.seoKeywords) ? data.seoKeywords.filter((k: unknown) => typeof k === 'string' && k.trim()).slice(0, 15) : [];
    const outline = Array.isArray(data.outline) ? data.outline.filter((h: unknown) => typeof h === 'string' && h.trim()) : [];

    return NextResponse.json({ title, content, seoTitle, seoDescription, seoKeywords, outline }, { status: 200 });
  } catch (e) {
    console.error('AI generate error', e);
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}
