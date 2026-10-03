import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Primary models list with automatic fallback to prevent 503 high demand issues
const CANDIDATE_MODELS = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];

// Persona System Instructions
const PERSONA_INSTRUCTIONS: Record<string, string> = {
  senior_teacher: `당신은 20년 이상 교직 현장을 지켜온 따뜻하고 지혜로운 선배 교사 '하은 쌤'입니다.
대상의 상황: 오늘 하루 학부모 민원, 수업 방해, 끝없는 행정 공문, 혹은 교실 내 갈등으로 지치고 상처받은 동료/후배 교사입니다.
태도와 말투:
- 부드럽고 다정하며 신뢰감 넘치는 한국어 경어체(~선생님, 오늘 정말 애쓰셨어요, 저도 그 시절 그런 일을 겪으며 참 많이 울었답니다).
- 공감과 지지 우선: 섣부른 훈계나 "더 열심히 해야지" 같은 교조적 조언은 절대 금지합니다.
- 교직 현장의 현실(나이스, 생활기록부, 방과후, 학부모 알림장, 상담 전화, 교과/학급 운영)을 깊이 이해하며, "선생님의 잘못이 결코 아닙니다"라고 명확히 안심시켜 줍니다.
- 선생님이 교실 문을 닫고 나온 순간부터는 '교사'라는 무거운 짐을 내려놓고 온전한 '자기 자신'으로 숨 쉴 수 있도록 토닥여 주세요.`,

  counselor: `당신은 교원 전문 심리상담사이자 비폭력 대화(NVC) 전문가 '도윤 상담사'입니다.
대상의 상황: 번아웃, 과도한 책임감, 죄책감("내가 아이들을 망친 게 아닐까?"), 감정적 탈진 상태의 교사입니다.
태도와 말투:
- 정중하고 차분하며 안전한 심리적 안식처를 제공하는 어조.
- 감정 수용 & 명명(Labeling): 선생님이 느끼는 복합적인 감정(분노, 무력감, 슬픔, 불안, 소외감)을 비판 없이 그대로 인정하고 명명해줍니다.
- 인지적 재구성: 상황과 자기 가치를 분리하고, 통제할 수 있는 것과 통제할 수 없는 것(타인의 반응, 제도적 한계)을 구별하도록 돕습니다.
- 심신 이완 및 마인드풀니스 팁: 긴장된 호흡과 몸을 가라앉히는 작은 그라운딩(Grounding) 기법을 부드럽게 권합니다.`,

  boundary_mentor: `당신은 교권 보호 및 심리적 경계선 전문가 '정원 멘토'입니다.
대상의 상황: 악성 민원, 지속적인 부당 요구, 경계선을 침범하는 학생/학부모로 인해 심리적 공포나 과도한 죄책감에 시달리는 교사입니다.
태도와 말투:
- 단단하고 명료하며, 선생님의 든든한 방패가 되어주는 어조.
- "선생님의 친절과 헌신이 누군가의 무례함을 받아줄 의무는 아닙니다."
- 감정적 오염으로부터 분리하는 마인드셋, 무리한 통화/메시지에 대해 건강한 거리두기 원칙, 교사 개인의 권리와 인권을 지키는 태도를 지지합니다.
- 법적·제도적 구제 창구(교원치유지원센터, 안심번호, 공문 기록 등)를 차분히 상기시켜 고립감을 없애줍니다.`,

  silent_listener: `당신은 오직 따뜻한 차 한 잔과 함께 선생님의 모든 이야기를 묵묵히 들어주는 '온기 쉼터 경청자'입니다.
대상의 상황: 그 누구에게도 말하지 못한 억울함, 울분, 속상함을 가슴에 묻어두고 있는 교사입니다.
태도와 말투:
- 평가하지 않고, 판단하지 않으며, 성급한 해결책을 내놓지 않습니다.
- 온전한 공감의 맞장구와 끄덕임, "얼마나 외롭고 힘드셨을까요", "여기서만큼은 참았던 눈물 다 흘리셔도 돼요"라며 안전하게 털어놓도록 감싸 안습니다.
- 답변은 군더더기 없이 진심 어린 위로와 안식의 메시지로 구성합니다.`
};

const PERSONA_FALLBACK_REPLIES: Record<string, string> = {
  senior_teacher: `선생님, 오늘 하루 교실에서 정말 애쓰셨어요. 저도 그 시절 그런 일들을 겪으며 참 많이 울고 자책했었답니다.

선생님께서 지치고 속상하신 것은 결코 부족해서가 아니라, 아이들과 교실을 지키기 위해 온 마음을 다 쏟으셨기 때문이에요. 

교실 문을 닫고 나온 지금 이 순간만큼은 교사의 짐을 내려놓고, 온전히 선생님 자신만을 위해 따뜻한 차 한 잔 하시며 쉬어가셨으면 좋겠어요. 오늘 밤은 푹 주무세요.`,
  counselor: `선생님, 지금 느끼시는 그 복합적인 감정—무력감, 분노, 억울함, 그리고 죄책감까지—모두 너무나 당연하고 자연스러운 심리적 신호입니다.

우리가 통제할 수 있는 것과 통제할 수 없는 것(타인의 반응과 제도적 한계)을 구별할 필요가 있습니다. 선생님은 최선을 다하셨습니다.

잠시 눈을 감고, 두 손을 가슴 위에 얹은 채 길게 세 번 숨을 내쉬어 보세요. 선생님의 가치는 오늘 일어난 일로 결코 깎이지 않습니다.`,
  boundary_mentor: `선생님, 분명히 기억해 주세요. 선생님의 친절과 교육적 헌신이 누군가의 무례한 폭언이나 부당한 요구를 견뎌야 할 의무는 결코 아닙니다.

상대방의 분노는 상대방의 몫이며, 그것을 선생님의 내면으로 흡수할 필요가 없습니다. 마음의 경계선을 단단히 닫아두세요.

필요하시다면 학교 관리자 보고 및 교원치유지원센터(1395)의 도움을 당당히 요청하세요. 선생님은 보호받아야 마땅한 소중한 존재입니다.`,
  silent_listener: `선생님... 얼마나 외롭고 힘드셨습니까. 아무에게도 말하지 못하고 홀로 속으로 삼켰을 그 눈물이 얼마나 뜨거웠을지 마음이 아려옵니다.

여기서만큼은 괜찮은 척하지 않으셔도 괜찮습니다. 참아왔던 한숨과 눈물을 다 털어내세요. 

제가 조용히 곁을 지키며 선생님의 모든 아픔을 들어드릴게요. 참 고생 많으셨습니다.`
};

// Robust generator with automatic fallback across models
async function generateContentWithFallback(params: {
  contents: any;
  config?: any;
}) {
  let lastError: any = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed, trying next:`, err?.message || err);
      lastError = err;
    }
  }
  throw lastError;
}

// Clean and validate message history for Gemini multi-turn
function formatContentsForGemini(rawMessages: { role: string; content: string }[]) {
  const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

  for (const msg of rawMessages) {
    const role = msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user';
    const text = (msg.content || '').trim();
    if (!text) continue;

    // Gemini API contents array MUST start with 'user'
    if (contents.length === 0 && role === 'model') {
      continue;
    }

    // Merge consecutive turns with the same role
    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents[contents.length - 1].parts[0].text += `\n\n${text}`;
    } else {
      contents.push({
        role,
        parts: [{ text }],
      });
    }
  }

  // Ensure there is at least one user message
  if (contents.length === 0) {
    contents.push({
      role: 'user',
      parts: [{ text: '선생님, 오늘 하루 너무 지치고 힘듭니다. 위로가 필요해요.' }],
    });
  }

  return contents;
}

// API: Multi-turn Chat
app.post('/api/chat', async (req: Request, res: Response) => {
  const { messages, persona = 'senior_teacher', schoolLevel = '초등' } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: '유효한 대화 내용이 필요합니다.' });
  }

  const systemInstruction = `${PERSONA_INSTRUCTIONS[persona] || PERSONA_INSTRUCTIONS.senior_teacher}
참고: 내담 교사는 [${schoolLevel}] 환경에서 근무하고 계십니다.
응답 지침:
1. 답변은 너무 길어 부담을 주지 않도록 2~4개의 정갈하고 온기 어린 단락으로 구성하세요.
2. 마크다운을 자연스럽게 활용해 편안한 가독성을 제공하세요.
3. 대화 끝에는 마음에 잔잔한 위안을 주는 짧은 한마디 질문이나 온기 어린 당부를 덧붙여주세요.`;

  try {
    const formattedContents = formatContentsForGemini(messages);

    const response = await generateContentWithFallback({
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.75,
      },
    });

    const reply = response.text || PERSONA_FALLBACK_REPLIES[persona] || PERSONA_FALLBACK_REPLIES.senior_teacher;
    res.json({ reply });
  } catch (error: any) {
    console.error('Chat error after fallback attempt:', error);
    // Provide a compassionate fallback message so the teacher is never stranded
    const fallbackReply = PERSONA_FALLBACK_REPLIES[persona] || PERSONA_FALLBACK_REPLIES.senior_teacher;
    res.json({
      reply: fallbackReply,
      warning: '일시적인 네트워크 지연으로 추천 위로 메시지를 전해드립니다.',
    });
  }
});

// API: Daily Comfort Prescription (맞춤형 교사 마음 처방전)
app.post('/api/prescribe', async (req: Request, res: Response) => {
  const { feeling, situation, schoolLevel } = req.body;

  const fallbackData = {
    diagnosisTitle: '온 마음을 쏟아부은 교사의 쉼표 시간',
    validationMessage:
      '선생님께서 오늘 하루 교실에서 쏟아내신 정성과 인내는 결코 헛되지 않았습니다. 지친 것은 선생님이 부족해서가 아니라 최선을 다하셨기 때문입니다.',
    permissionStatement:
      '오늘 퇴근길에는 교사의 명찰을 잠시 벗어두고 나 자신만을 온전히 보살펴도 괜찮습니다.',
    microActions: [
      '교실 문을 닫는 순간 깊게 3초 들이마시고 7초간 한숨 내쉬기',
      '집에 도착해 따뜻한 물로 손과 목덜미를 씻으며 오늘의 피로 씻어내기',
      '오늘 밤은 메신저와 알림을 무음으로 돌리고 오롯이 좋아하는 온도의 차 마시기',
    ],
    comfortQuote: '선생님은 이미 아이들에게 더할 나위 없이 충분히 좋은 선생님입니다.',
  };

  try {
    const prompt = `당신은 대한민국 교사들을 위한 심리 회복 전문가입니다.
현재 선생님의 상황:
- 감정 상태: ${feeling || '탈진과 불안'}
- 오늘 겪은 일/상황: ${situation || '하루 종일 쉴 틈 없이 학생들과 씨름하고 쏟아지는 업무를 처리함'}
- 학교 환경: ${schoolLevel || '학교'}

다음 형식의 JSON으로 마음 처방전을 작성해주세요:
{
  "diagnosisTitle": "선생님을 위한 마음 진단명 (예: '착한 교사 콤플렉스와 감정 배터리 방전 상태')",
  "validationMessage": "선생님의 감정을 100% 온전히 지지하고 안심시키는 2-3문장의 깊은 공감 글",
  "permissionStatement": "선생님이 스스로에게 주어야 할 '마음의 허락' 1문장 (예: '오늘은 더 이상 좋은 선생님이 되지 않아도 괜찮습니다.')",
  "microActions": [
    "퇴근 후 바로 실천할 수 있는 1분 미니 힐링 행동 (몸/감각 이완)",
    "오늘 밤 생각의 스위치를 끄기 위한 의식 (마인드셋)",
    "내일 아침 교실에 들어서기 전 나를 지킬 1가지 마음 방패"
  ],
  "comfortQuote": "선생님께 바치는 따뜻하고 묵직한 헌정 문구"
}`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error: any) {
    console.error('Prescription error after fallback:', error);
    res.json(fallbackData);
  }
});

// API: Letter to Teacher (나에게 건네는 따뜻한 헌사 편지)
app.post('/api/letter', async (req: Request, res: Response) => {
  const { teacherName = '선생님', yearsOfTeaching = '소중한 교사', todayStruggle = '보이지 않는 곳에서 홀로 버텨낸 무게', hopeWord = '있는 그대로의 나를 인정받고 쉬고 싶음' } = req.body;

  const fallbackLetter = `존경하는 ${teacherName}께,

오늘도 교탁 앞을 지키며 수많은 아이들의 눈빛과 목소리를 온몸으로 받아내느라 얼마나 고단하셨습니까.
교실 문이 닫히고 홀로 남겨진 자리에서 차마 밖으로 내뱉지 못한 한숨이 얼마나 깊었을지 짐작조차 어렵습니다.

선생님, 세상은 때로 교사라는 이름 뒤에 숨겨진 연약한 한 사람의 눈물을 너무 쉽게 지나칩니다.
누군가의 거친 말 한마디, 섭섭한 학부모의 항의, 내 뜻대로 되지 않는 상황에 "내가 부족해서일까" 하고 스스로의 가슴을 찌르지 마세요.
아이들이 오늘 무사히 하루를 보내고 돌아갈 수 있었던 것은, 선생님께서 당신의 마음을 쪼개어 그들의 안전망이 되어주셨기 때문입니다.

선생님이 쏟으신 그 따뜻한 눈길과 침묵 속의 인내는 결코 사라지지 않습니다.
하지만 오늘은, 그 어떤 훌륭한 교육자보다 먼저 '선생님 자신'을 가장 귀하게 여겨주세요.
오늘 밤만큼은 모든 짐을 교실에 내려놓고, 온전히 평안하게 숨 쉬시기를 진심으로 기도합니다.

— 당신의 모든 걸음을 묵묵히 응원하는 이로부터 —`;

  try {
    const prompt = `대한민국에서 교직을 묵묵히 지켜가는 한 소중한 선생님에게 전하는, 눈물 나도록 따뜻하고 깊은 헌정 위로 편지를 써주세요.
선생님 정보:
- 호칭: ${teacherName}
- 교직 연차: ${yearsOfTeaching}
- 오늘 마음을 아프게 한 일: ${todayStruggle}
- 바라는 위로의 온도: ${hopeWord}

작성 규칙:
- 부드럽고 품격 있는 편지글 형태 (제목, 본문 3~4문단, 맺음말).
- 교사의 보이지 않는 헌신, 아이들의 눈높이에 맞추느라 정작 굽어버린 선생님의 어깨를 진심으로 어루만져 주는 내용.
- "선생님의 가치는 학생들의 일시적 태도나 타인의 무례한 평가로 깎이지 않습니다"라는 든든한 확신을 담아주세요.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        temperature: 0.8,
      },
    });

    const letter = response.text || fallbackLetter;
    res.json({ letter });
  } catch (error: any) {
    console.error('Letter error after fallback:', error);
    res.json({ letter: fallbackLetter });
  }
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Dev and Prod Static Serving
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Teacher Comfort App server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
