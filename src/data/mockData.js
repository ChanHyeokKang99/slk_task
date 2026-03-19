// 현재 로그인된 조직 관리자 (목 세션)
export const currentOrg = {
  id: 1,
  name: "테크스타트 주식회사",
  plan: "Enterprise",
  adminName: "김민준",
  adminEmail: "minjun@techstart.io",
  memberCount: 42,
  monthlyUsage: 15420,
  pendingMessages: 23,
  messageProvider: "cloudmessage", // 현재 연동된 업체
  apiConfigured: true,
};

// 저장된 API 키 (마스킹 전 원본 — 실제론 서버에서 마스킹 처리)
export const savedKeys = {
  apiKey: "cm_live_a1b2c3d4e5f6g7h8",
  secretKey: "sk_9z8y7x6w5v4u3t2s1r0q",
  senderNumber: "02-1234-5678",
};

// 업체별 설정 스펙
export const providerConfig = {
  cloudmessage: {
    name: "클라우드메시지",
    icon: "☁️",
    color: "#3B82F6",
    description: "SMS · LMS · MMS 지원",
    docsUrl: "https://docs.cloudmessage.io",
    fields: [
      {
        key: "apiKey",
        label: "API Key",
        placeholder: "cm_live_xxxxxxxxxxxxxxxx",
        prefix: "cm_live_",
        required: true,
        secret: true,
        hint: "클라우드메시지 콘솔 → 설정 → API Key에서 복사하세요.",
      },
      {
        key: "secretKey",
        label: "Secret Key",
        placeholder: "sk_xxxxxxxxxxxxxxxxxxxxxxxx",
        required: true,
        secret: true,
        minLength: 16,
        hint: "클라우드메시지 콘솔 → 설정 → Secret Key에서 복사하세요.",
      },
      {
        key: "senderNumber",
        label: "발신번호",
        placeholder: "02-0000-0000",
        required: true,
        secret: false,
        hint: "클라우드메시지에 사전 등록된 발신번호만 사용할 수 있습니다.",
        pattern: /^[\d\-+\s()]+$/,
        patternMsg: "숫자와 하이픈(-)만 입력 가능합니다.",
      },
    ],
  },
  sendtalk: {
    name: "센드톡",
    icon: "💬",
    color: "#F59E0B",
    description: "카카오 알림톡 · SMS 지원",
    docsUrl: "https://docs.sendtalk.io",
    fields: [
      {
        key: "apiKey",
        label: "API Key",
        placeholder: "st_xxxxxxxxxxxxxxxx",
        prefix: "st_",
        required: true,
        secret: true,
        hint: "센드톡 콘솔 → API 관리에서 복사하세요.",
      },
      {
        key: "channelId",
        label: "카카오 채널 ID",
        placeholder: "@my-channel",
        required: true,
        secret: false,
        hint: "카카오 비즈니스 채널의 고유 ID입니다. '@'으로 시작합니다.",
        prefix: "@",
      },
    ],
  },
};

// 발송 현황 목데이터
export const recentSendLogs = [
  { id: 1, type: "SMS", recipient: "010-****-1234", status: "success", time: "14:32" },
  { id: 2, type: "LMS", recipient: "010-****-5678", status: "success", time: "14:28" },
  { id: 3, type: "SMS", recipient: "010-****-9012", status: "fail", time: "14:15" },
  { id: 4, type: "SMS", recipient: "010-****-3456", status: "pending", time: "13:55" },
  { id: 5, type: "MMS", recipient: "010-****-7890", status: "success", time: "13:40" },
];
