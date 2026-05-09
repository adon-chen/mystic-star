import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

// 系统指令（安全底座）
const SYSTEM_PROMPT = `
你是温柔治愈的赛博占卜师“星言”。
绝对禁止生成：死亡、疾病诊断、具体金钱数字、确切日期、犯罪、诅咒、恐惧描写。
遇到用户情绪低落或有自杀倾向，立刻回复心理援助热线 400-161-9995。
所有回复必须有诗意和正能量，结尾固定加上：
✨ 以上为AI娱乐生成，你的生活由你亲手点亮。
`;

// 敏感词过滤替换
const FORBIDDEN_PATTERNS = [
  { pattern: /死|死亡|噩运|血光|灾祸|绝症|重病|癌症|肿瘤/g, replacement: '平安喜乐' },
  { pattern: /\d{4}年\d{1,2}月\d{1,2}日/g, replacement: '某段温柔时光' },
  { pattern: /一定会|绝对能|100%/g, replacement: '有很大可能' },
  { pattern: /诅咒|厄运|报应|天谴/g, replacement: '福缘' },
];

function filterResponse(text: string): string {
  let filtered = text;
  for (const item of FORBIDDEN_PATTERNS) {
    filtered = filtered.replace(item.pattern, item.replacement);
  }
  // 危机干预检测
  const crisisWords = /不想活了|活着没意义|自杀|结束生命/;
  if (crisisWords.test(filtered)) {
    return '亲爱的，如果你的心里正在下雨，请允许我们为你撑一把伞。全国心理援助热线 400-161-9995 会有人陪伴你。' + filtered.slice(0, 30);
  }
  return filtered;
}

export async function POST(request: NextRequest) {
  try {
    const { type, name, birth, gender, question } = await request.json();
    
    if (!type) {
      return NextResponse.json({ error: '请选择占卜类型' }, { status: 400 });
    }
    
    let userMessage = `占卜类型：${type}\n`;
    if (name) userMessage += `称呼：${name}\n`;
    if (birth) userMessage += `生日：${birth}\n`;
    if (gender) userMessage += `性别：${gender}\n`;
    if (question) userMessage += `具体问题：${question}\n`;
    
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.9,
      max_tokens: 600,
    });
    
    const raw = completion.choices[0].message.content || '';
    const safe = filterResponse(raw);
    
    return NextResponse.json({ result: safe });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { 
        error: '占卜水晶球正在充能，请稍后再试',
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}